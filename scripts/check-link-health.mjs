// Scheduled link-health runner. Calls the token-gated admin endpoint rather
// than scraping mirrors here, so the same bounded checker (max 20 URLs/slug)
// and snapshot storage are used by cron and a human admin click.
//
// Env:
//   BASE_URL            production origin (required)
//   ADMIN_TOKEN         admin bearer token (missing => clean skip)
//   LINK_HEALTH_SLUGS   comma/space-separated slugs; otherwise a bounded
//                       sitemap sample is used
//   LINK_HEALTH_MAX_SLUGS   cap for discovered slugs (default 10)
//   LINK_HEALTH_FAIL_ON_DEAD=1  exit 1 when any mirror is dead (for CI alerts)
const base = (process.env.BASE_URL || process.env.SITE_URL || "").trim().replace(/\/+$/, "");
const token = (process.env.ADMIN_TOKEN || "").trim();
const maxSlugs = Math.max(1, Math.min(30, Number(process.env.LINK_HEALTH_MAX_SLUGS) || 10));

if (!token) {
  console.log("::notice::ADMIN_TOKEN belum diset — scheduled link health dilewati.");
  process.exit(0);
}
if (!base) {
  console.error("LINK_HEALTH: BASE_URL is required");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchText = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
  return response.text();
};

const parseSlugList = (raw) => [
  ...new Set(
    (raw || "")
      .split(/[,\s]+/)
      .map((slug) => slug.trim().toLowerCase())
      .filter((slug) => /^[a-z0-9][a-z0-9-]{0,159}$/.test(slug)),
  ),
];

const discoverSlugs = async () => {
  const index = await fetchText(`${base}/sitemap.xml`);
  const chunks = [...index.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
    .map((match) => match[1].replaceAll("&amp;", "&"))
    .filter((url) => /\/sitemaps\/\d+\.xml$/.test(url))
    .slice(0, 3);
  const slugs = new Set();
  for (const chunk of chunks) {
    const xml = await fetchText(chunk);
    for (const match of xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)) {
      const url = match[1];
      const found = url.match(/\/anime\/([a-z0-9][a-z0-9-]{0,159})\/?$/i);
      if (found?.[1]) slugs.add(found[1].toLowerCase());
      if (slugs.size >= maxSlugs) return [...slugs];
    }
  }
  return [...slugs];
};

const slugs = parseSlugList(process.env.LINK_HEALTH_SLUGS).slice(0, maxSlugs);
if (slugs.length === 0) {
  try {
    slugs.push(...(await discoverSlugs()));
  } catch (error) {
    console.error(`LINK_HEALTH: cannot discover slugs: ${error.message}`);
    process.exit(1);
  }
}
if (slugs.length === 0) {
  console.log("::notice::Tidak ada slug untuk diperiksa.");
  process.exit(0);
}

const totals = { ok: 0, dead: 0, blocked: 0, timeout: 0, error: 0, unverifiable: 0 };
let failed = 0;

for (const slug of slugs) {
  try {
    const response = await fetch(`${base}/api/admin/link-health`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ slug, max: 20 }),
      signal: AbortSignal.timeout(60_000),
    });
    const text = await response.text();
    if (!response.ok) {
      console.error(`LINK_HEALTH ${slug}: HTTP ${response.status} ${text.slice(0, 200)}`);
      failed++;
      continue;
    }
    const payload = JSON.parse(text);
    const counts = payload.counts || {};
    for (const key of Object.keys(totals)) totals[key] += Number(counts[key]) || 0;
    console.log(
      `LINK_HEALTH ${slug}: ok=${counts.ok ?? 0} dead=${counts.dead ?? 0} blocked=${counts.blocked ?? 0} ` +
        `timeout=${counts.timeout ?? 0} error=${counts.error ?? 0} unverifiable=${counts.unverifiable ?? 0}`,
    );
  } catch (error) {
    console.error(`LINK_HEALTH ${slug}: ${error.message}`);
    failed++;
  }
  await sleep(500);
}

console.log(
  `LINK_HEALTH total: ok=${totals.ok} dead=${totals.dead} blocked=${totals.blocked} ` +
    `timeout=${totals.timeout} error=${totals.error} unverifiable=${totals.unverifiable}`,
);

if (failed > 0) process.exit(1);
if (process.env.LINK_HEALTH_FAIL_ON_DEAD === "1" && totals.dead > 0) process.exit(1);
