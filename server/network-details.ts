import { lookup as dnsLookup, resolve4, resolve6, resolveCname, resolveMx, resolveNs } from "node:dns/promises";
import type { NetworkDetails } from "@shared/schema";

async function resolveOrEmpty<T>(lookup: () => Promise<T[]>): Promise<T[]> {
  try {
    return await lookup();
  } catch {
    return [];
  }
}

function identifyDnsProvider(nameservers: string[]): string | null {
  const joined = nameservers.join(" ").toLowerCase();
  if (joined.includes("cloudflare.com")) return "Cloudflare";
  if (joined.includes("awsdns-") || joined.includes("amazonaws.com")) return "Amazon Route 53";
  if (joined.includes("azure-dns")) return "Azure DNS";
  if (joined.includes("googledomains.com") || joined.includes("google.com")) return "Google Cloud DNS";
  if (joined.includes("domaincontrol.com")) return "GoDaddy";
  if (joined.includes("dns-parking.com")) return "Hostinger";
  if (joined.includes("nsone.net")) return "NS1";
  if (joined.includes("registrar-servers.com")) return "Namecheap";
  return null;
}

function identifyMailProvider(exchanges: string[]): string | null {
  const joined = exchanges.join(" ").toLowerCase();
  if (joined.includes("aspmx.l.google.com") || joined.includes("googlemail.com")) return "Google Workspace";
  if (joined.includes("mail.protection.outlook.com")) return "Microsoft 365";
  if (joined.includes("protection.outlook.com")) return "Microsoft 365";
  if (joined.includes("pphosted.com") || joined.includes("proofpoint")) return "Proofpoint";
  if (joined.includes("mimecast.com")) return "Mimecast";
  if (joined.includes("zoho.com")) return "Zoho Mail";
  return null;
}

function getRdapOrganization(data: any): string | null {
  const entities = Array.isArray(data?.entities) ? data.entities : [];
  const registrant = entities.find((entity: any) => Array.isArray(entity?.roles) && entity.roles.includes("registrant"));
  const candidates = [registrant, ...entities].filter(Boolean);

  for (const entity of candidates) {
    const card = entity?.vcardArray?.[1];
    if (!Array.isArray(card)) continue;
    for (const fieldName of ["org", "fn"]) {
      const field = card.find((item: any) => item?.[0]?.toLowerCase() === fieldName);
      const value = field?.[3];
      const name = Array.isArray(value) ? value.join(" ").trim() : typeof value === "string" ? value.trim() : "";
      if (name) return name;
    }
  }

  return typeof data?.name === "string" && data.name.trim()
    ? data.name.trim()
    : typeof data?.handle === "string" && data.handle.trim()
      ? data.handle.trim()
      : null;
}

async function lookupNetworkOwner(address: string, isBlockedDomain: (hostname: string) => boolean): Promise<string | null> {
  if (isBlockedDomain(address)) return null;
  try {
    const response = await fetch(`https://rdap.org/ip/${encodeURIComponent(address)}`, {
      headers: {
        Accept: "application/rdap+json, application/json",
        "User-Agent": "GetStack Network Details/1.0",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return getRdapOrganization(await response.json());
  } catch {
    return null;
  }
}

async function hostResolvesPublicly(hostname: string, isBlockedDomain: (hostname: string) => boolean): Promise<boolean> {
  if (isBlockedDomain(hostname)) return false;
  try {
    const addresses = await dnsLookup(hostname, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every(({ address }) => !isBlockedDomain(address));
  } catch {
    return false;
  }
}

async function lookupRedirects(
  hostname: string,
  isBlockedDomain: (hostname: string) => boolean,
): Promise<NetworkDetails["redirects"]> {
  const redirectStatuses = new Set([301, 302, 303, 307, 308]);
  const trace = async (start: URL): Promise<NetworkDetails["redirects"]> => {
    const redirects: NetworkDetails["redirects"] = [];
    let current = start;

    for (let hop = 0; hop < 8; hop++) {
      if (!(await hostResolvesPublicly(current.hostname, isBlockedDomain))) break;

      try {
        const response = await fetch(current, {
          method: "HEAD",
          redirect: "manual",
          headers: { "User-Agent": "GetStack Network Details/1.0" },
          signal: AbortSignal.timeout(5000),
        });
        const location = response.headers.get("location");
        if (!location || !redirectStatuses.has(response.status)) break;

        const next = new URL(location, current);
        if (!["http:", "https:"].includes(next.protocol)) break;
        redirects.push({ status: response.status, from: current.toString(), to: next.toString() });
        current = next;
      } catch {
        break;
      }
    }

    return redirects;
  };

  const chains = await Promise.all([
    trace(new URL(`http://${hostname}`)),
    trace(new URL(`https://${hostname}`)),
  ]);
  const redirects = [...chains[0], ...chains[1]];
  return redirects.filter((redirect, index) =>
    redirects.findIndex((candidate) => candidate.from === redirect.from && candidate.to === redirect.to) === index
  );
}

export async function getNetworkDetails(
  hostname: string,
  isBlockedDomain: (hostname: string) => boolean,
): Promise<NetworkDetails> {
  const [ipv4, ipv6, nameservers, mailExchanges, cnameRecords] = await Promise.all([
    resolveOrEmpty(() => resolve4(hostname)),
    resolveOrEmpty(() => resolve6(hostname)),
    resolveOrEmpty(() => resolveNs(hostname)),
    resolveOrEmpty(() => resolveMx(hostname)),
    resolveOrEmpty(() => resolveCname(hostname)),
  ]);

  const addresses: NetworkDetails["addresses"] = [
    ...ipv4.map((address) => ({ address, family: 4 as const })),
    ...ipv6.map((address) => ({ address, family: 6 as const })),
  ];
  const dnsRecords: NetworkDetails["dnsRecords"] = [
    ...ipv4.map((value) => ({ type: "A", value })),
    ...ipv6.map((value) => ({ type: "AAAA", value })),
    ...mailExchanges.map(({ exchange, priority }) => ({ type: "MX", value: exchange, priority })),
    ...cnameRecords.map((value) => ({ type: "CNAME", value })),
  ];
  const ownerAddress = addresses.find(({ address }) => !isBlockedDomain(address))?.address;
  const [networkOwner, redirects] = await Promise.all([
    ownerAddress ? lookupNetworkOwner(ownerAddress, isBlockedDomain) : Promise.resolve(null),
    lookupRedirects(hostname, isBlockedDomain),
  ]);

  return {
    addresses,
    networkOwner,
    nameservers,
    dnsProvider: identifyDnsProvider(nameservers),
    dnsRecords,
    mailProvider: identifyMailProvider(mailExchanges.map(({ exchange }) => exchange)),
    redirects,
  };
}
