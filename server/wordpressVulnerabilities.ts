import type { WordPressVulnerability, WordPressVulnerabilityResult } from "@shared/schema";

const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 100;
const DAILY_PROVIDER_REQUEST_LIMIT = 20;

type CacheEntry = { expiresAt: number; value: WordPressVulnerabilityResult };
const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<WordPressVulnerabilityResult>>();
let providerBudget = { day: "", requests: 0 };

export class VulnerabilityProviderError extends Error {
  constructor(public readonly status?: number) {
    super("Vulnerability data is temporarily unavailable");
  }
}

function reserveProviderRequest(now: number) {
  const day = new Date(now).toISOString().slice(0, 10);
  if (providerBudget.day !== day) providerBudget = { day, requests: 0 };
  if (providerBudget.requests >= DAILY_PROVIDER_REQUEST_LIMIT) {
    throw new VulnerabilityProviderError(429);
  }
  providerBudget.requests++;
}

function versionParts(version: string): number[] {
  return version.replace(/[^0-9.].*$/, "").split(".").map((part) => Number.parseInt(part, 10) || 0);
}

export function compareVersions(left: string, right: string): number {
  const a = versionParts(left);
  const b = versionParts(right);
  for (let index = 0; index < Math.max(a.length, b.length); index++) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference < 0 ? -1 : 1;
  }
  return 0;
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.length > 0);
}

function safeReferenceUrls(value: unknown): string[] {
  return stringArray(value).filter((reference) => {
    try {
      const url = new URL(reference);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  });
}

function normalizeSeverity(raw: any): WordPressVulnerability["severity"] {
  const severity = String(raw?.severity ?? raw?.cvss?.severity ?? "").toLowerCase();
  if (["critical", "high", "medium", "low"].includes(severity)) {
    return severity as WordPressVulnerability["severity"];
  }
  const score = Number(raw?.cvss?.score ?? raw?.cvss_score);
  if (Number.isFinite(score)) {
    if (score >= 9) return "critical";
    if (score >= 7) return "high";
    if (score >= 4) return "medium";
    if (score > 0) return "low";
  }
  return "unknown";
}

export function normalizeWordPressVulnerabilities(
  version: string,
  payload: any,
): WordPressVulnerabilityResult {
  const record = payload?.[version] ?? payload?.wordpress ?? payload;
  const rawVulnerabilities = Array.isArray(record?.vulnerabilities) ? record.vulnerabilities : [];

  const vulnerabilities = rawVulnerabilities
    .filter((item: any) => {
      const introducedIn = item?.introduced_in ?? item?.introducedIn;
      const fixedIn = item?.fixed_in ?? item?.fixedIn;
      if (typeof introducedIn === "string" && compareVersions(version, introducedIn) < 0) return false;
      if (typeof fixedIn === "string" && compareVersions(version, fixedIn) >= 0) return false;
      return true;
    })
    .map((item: any, index: number): WordPressVulnerability => {
      const references = item?.references ?? {};
      const cves = stringArray(references.cve ?? item?.cve);
      const urls = [
        ...safeReferenceUrls(references.url),
        ...safeReferenceUrls(references.wpvulndb),
      ];
      const fixedIn = typeof item?.fixed_in === "string" ? item.fixed_in : null;
      return {
        id: String(item?.id ?? cves[0] ?? `wpscan-${index + 1}`),
        cve: cves[0] ?? null,
        severity: normalizeSeverity(item),
        description: String(item?.title ?? item?.description ?? "WordPress core vulnerability"),
        references: Array.from(new Set(urls)).slice(0, 5),
        fixedIn,
        recommendedUpgrade: fixedIn,
      };
    });

  return { version, vulnerabilities };
}

export async function lookupWordPressVulnerabilities(
  version: string,
  options: { fetchImpl?: typeof fetch; now?: number } = {},
): Promise<WordPressVulnerabilityResult> {
  const now = options.now ?? Date.now();
  const cached = cache.get(version);
  if (cached && cached.expiresAt > now) return cached.value;
  const pending = inFlight.get(version);
  if (pending) return pending;

  const token = process.env.WPSCAN_API_TOKEN;
  if (!token) throw new VulnerabilityProviderError();
  reserveProviderRequest(now);

  const request = (async () => {
    let response: Response;
    try {
      response = await (options.fetchImpl ?? fetch)(
        `https://wpscan.com/api/v3/wordpresses/${encodeURIComponent(version)}`,
        {
          headers: { Authorization: `Token token=${token}`, "User-Agent": "GetStack/1.0" },
          signal: AbortSignal.timeout(5000),
        },
      );
    } catch {
      throw new VulnerabilityProviderError();
    }

    if (!response.ok) throw new VulnerabilityProviderError(response.status);
    const result = normalizeWordPressVulnerabilities(version, await response.json());

    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) cache.delete(oldestKey);
    }
    cache.set(version, { value: result, expiresAt: now + CACHE_TTL_MS });
    return result;
  })();

  inFlight.set(version, request);
  try {
    return await request;
  } finally {
    inFlight.delete(version);
  }
}

export function clearWordPressVulnerabilityCache() {
  cache.clear();
  inFlight.clear();
  providerBudget = { day: "", requests: 0 };
}