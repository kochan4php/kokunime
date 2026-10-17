// Nightly cache integrity validation against a live deployment.
// Usage: BASE=https://site node scripts/validate-cache.mjs
// Exit codes: 0 all checks pass, 1 problems found, 2 BASE missing/unreachable.
const base = (process.env.BASE ?? process.env.SITE_URL ?? "").replace(/\/$/, "");
if (!base) {
  console.error("BASE (or SITE_URL) is required, e.g. BASE=https://kokunime.example");
  process.exit(2);
}

const problems = [];
const notes = [];

const get = async (path) => {
  try {
    return await fetch(`${base}${path}`, {
      headers: { accept: "*/*" },
      signal: AbortSignal.timeout(20_000),
    });
  } catch (error) {
    problems.push(`${path}: fetch failed (${error.message})`);
    return null;
  }
};

// 1) Liveness + status snapshot must answer 200.
for (const path of ["/api/live", "/api/status"]) {
  const res = await get(path);
  if (!res) continue;
  if (res.status !== 200) problems.push(`${path}: HTTP ${res.status}`);
  else notes.push(`${path}: ${res.status}`);
}

// 2) Cache tiers: list APIs must report a tier, and never "fallback" (stale
//    cache = upstream/cache wiring is broken even though we serve 200).
for (const path of ["/api/genres", "/api/seasons"]) {
  const res = await get(path);
  if (!res) continue;
  const tier = res.headers.get("x-cache-tier");
  if (res.status !== 200) problems.push(`${path}: HTTP ${res.status}`);
  else if (!tier) problems.push(`${path}: missing X-Cache-Tier header`);
  else if (tier === "fallback") problems.push(`${path}: served from fallback tier (cache unhealthy)`);
  else notes.push(`${path}: tier=${tier}`);
}

// 3) HTML pages must render.
for (const path of ["/", "/update"]) {
  const res = await get(path);
  if (!res) continue;
  const body = res.headers.get("content-type") ?? "";
  if (res.status !== 200) problems.push(`${path}: HTTP ${res.status}`);
  else if (!body.includes("text/html")) problems.push(`${path}: content-type ${body || "missing"}`);
  else notes.push(`${path}: html ok`);
}

// 4) Deep check: first anime detail from the sitemap chain.
const sitemapRes = await get("/sitemap.xml");
if (sitemapRes?.ok) {
  try {
    let xml = await sitemapRes.text();
    if (/<sitemapindex/i.test(xml)) {
      const chunk = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)][0]?.[1];
      if (!chunk) problems.push("sitemap index lists no chunks");
      else {
        const chunkRes = await get(chunk.replace(base, ""));
        xml = chunkRes?.ok ? await chunkRes.text() : "";
      }
    }
    const animeUrl = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
      .map((match) => match[1])
      .find((url) => url.includes("/anime/"));
    if (!animeUrl) {
      problems.push("sitemap: no anime URLs found");
    } else {
      const slug = animeUrl.split("/anime/")[1].replace(/\/$/, "");
      const apiRes = await get(`/api/anime/${slug}`);
      if (!apiRes) {
        // fetch failure already recorded
      } else if (apiRes.status !== 200) {
        problems.push(`/api/anime/${slug}: HTTP ${apiRes.status}`);
      } else if (apiRes.headers.get("x-cache-tier") === "fallback") {
        problems.push(`/api/anime/${slug}: served from fallback tier`);
      } else {
        notes.push(`/api/anime/${slug}: tier=${apiRes.headers.get("x-cache-tier") ?? "n/a"}`);
      }
    }
  } catch (error) {
    problems.push(`sitemap parse failed: ${error.message}`);
  }
}

console.log(`Cache integrity @ ${base}`);
for (const note of notes) console.log(`  ok  ${note}`);
for (const problem of problems) console.log(`  !!  ${problem}`);
console.log(`\n${problems.length === 0 ? "✓ all checks passed" : `✗ ${problems.length} problem(s)`}`);

process.exitCode = problems.length > 0 ? 1 : 0;
