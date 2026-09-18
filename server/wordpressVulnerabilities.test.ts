import assert from "node:assert/strict";
import test from "node:test";
import {
  clearWordPressVulnerabilityCache,
  compareVersions,
  lookupWordPressVulnerabilities,
  normalizeWordPressVulnerabilities,
  VulnerabilityProviderError,
} from "./wordpressVulnerabilities";
import { hasActivePremiumTier } from "./premiumAccess";

test("only active and trialing premium tiers receive premium access", () => {
  assert.equal(hasActivePremiumTier("premium", "active"), true);
  assert.equal(hasActivePremiumTier("premium", "trialing"), true);
  assert.equal(hasActivePremiumTier("premium", "past_due"), false);
  assert.equal(hasActivePremiumTier("premium", "cancelled"), false);
  assert.equal(hasActivePremiumTier("free", "active"), false);
});

test("compares WordPress versions semantically", () => {
  assert.equal(compareVersions("6.4.9", "6.5"), -1);
  assert.equal(compareVersions("6.5.1", "6.5"), 1);
  assert.equal(compareVersions("6.5.0", "6.5"), 0);
});

test("normalizes only vulnerabilities that apply to the detected version", () => {
  const result = normalizeWordPressVulnerabilities("6.4.2", {
    "6.4.2": {
      vulnerabilities: [
        { id: 1, title: "Applies", fixed_in: "6.4.3", references: { cve: ["CVE-2024-1"], url: ["https://example.com/1", "javascript:alert(1)"] } },
        { id: 2, title: "Already fixed", fixed_in: "6.4.2" },
        { id: 3, title: "Not introduced", introduced_in: "6.5" },
      ],
    },
  });
  assert.equal(result.vulnerabilities.length, 1);
  assert.equal(result.vulnerabilities[0].cve, "CVE-2024-1");
  assert.equal(result.vulnerabilities[0].fixedIn, "6.4.3");
  assert.deepEqual(result.vulnerabilities[0].references, ["https://example.com/1"]);
});

test("keeps unfixed vulnerabilities without inventing upgrade guidance", () => {
  const result = normalizeWordPressVulnerabilities("6.5.0", {
    "6.5.0": { vulnerabilities: [{ id: 9, title: "No provider fix" }] },
  });
  assert.equal(result.vulnerabilities[0].fixedIn, null);
  assert.equal(result.vulnerabilities[0].recommendedUpgrade, null);
});

test("caches successful provider responses by version", async () => {
  clearWordPressVulnerabilityCache();
  process.env.WPSCAN_API_TOKEN = "test-token";
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    return new Response(JSON.stringify({ "6.4.2": { vulnerabilities: [] } }), { status: 200 });
  };
  await lookupWordPressVulnerabilities("6.4.2", { fetchImpl: fetchImpl as typeof fetch, now: 1 });
  await lookupWordPressVulnerabilities("6.4.2", { fetchImpl: fetchImpl as typeof fetch, now: 2 });
  assert.equal(calls, 1);
});

test("does not cache provider failures", async () => {
  clearWordPressVulnerabilityCache();
  process.env.WPSCAN_API_TOKEN = "test-token";
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    return new Response("", { status: 429 });
  };
  await assert.rejects(
    lookupWordPressVulnerabilities("6.4.3", { fetchImpl: fetchImpl as typeof fetch }),
    VulnerabilityProviderError,
  );
  await assert.rejects(
    lookupWordPressVulnerabilities("6.4.3", { fetchImpl: fetchImpl as typeof fetch }),
    VulnerabilityProviderError,
  );
  assert.equal(calls, 2);
});

test("deduplicates concurrent provider requests for the same version", async () => {
  clearWordPressVulnerabilityCache();
  process.env.WPSCAN_API_TOKEN = "test-token";
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    await new Promise((resolve) => setTimeout(resolve, 10));
    return new Response(JSON.stringify({ "6.5.1": { vulnerabilities: [] } }), { status: 200 });
  };
  await Promise.all([
    lookupWordPressVulnerabilities("6.5.1", { fetchImpl: fetchImpl as typeof fetch }),
    lookupWordPressVulnerabilities("6.5.1", { fetchImpl: fetchImpl as typeof fetch }),
  ]);
  assert.equal(calls, 1);
});

test("stops unique misses before exhausting the daily provider quota", async () => {
  clearWordPressVulnerabilityCache();
  process.env.WPSCAN_API_TOKEN = "test-token";
  let calls = 0;
  const fetchImpl = async () => {
    calls++;
    return new Response("", { status: 404 });
  };
  for (let index = 0; index < 20; index++) {
    await assert.rejects(
      lookupWordPressVulnerabilities(`5.${index}.0`, { fetchImpl: fetchImpl as typeof fetch, now: 1 }),
      VulnerabilityProviderError,
    );
  }
  await assert.rejects(
    lookupWordPressVulnerabilities("7.0.0", { fetchImpl: fetchImpl as typeof fetch, now: 1 }),
    (error: unknown) => error instanceof VulnerabilityProviderError && error.status === 429,
  );
  assert.equal(calls, 20);
});