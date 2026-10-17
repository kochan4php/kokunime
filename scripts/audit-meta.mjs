// Crawls the sitemap of a running instance and audits <title> + meta
// description lengths and canonical presence.
// Usage: node scripts/audit-meta.mjs [--strict] [baseUrl] [limit]
// Exit codes: 0 ok, 1 problems (with --strict), 2 instance unreachable.
const args = process.argv.slice(2);
const strict = args.includes("--strict");
const baseArg = args.find((arg) => arg.startsWith("http"));
const limitArg = args.find((arg) => /^\d+$/.test(arg));
const base = (baseArg ?? process.env.SITE_URL ?? "http://localhost:8000").replace(/\/$/, "");
const limit = Number(limitArg ?? process.env.LIMIT ?? 40);

const TITLE_MIN = 15;
const TITLE_MAX = 65;
const DESC_MIN = 50;
const DESC_MAX = 165;

const problems = [];
const warnings = [];
const seenTitles = new Map();
const seenDescriptions = new Map();

async function collectSitemapUrls() {
  let res;
  try {
    res = await fetch(`${base}/sitemap.xml`);
  } catch (error) {
    console.error(`Cannot reach ${base}/sitemap.xml — is the server running? (${error.message})`);
    process.exit(2);
  }
  if (!res.ok) {
    console.error(`Sitemap HTTP ${res.status}`);
    process.exit(2);
  }
  let xml = await res.text();
  let locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
  if (/<sitemapindex/i.test(xml)) {
    const chunks = locs;
    locs = [];
    for (const chunk of chunks) {
      const chunkRes = await fetch(chunk);
      if (!chunkRes.ok) {
        warnings.push(`chunk ${chunk}: HTTP ${chunkRes.status}`);
        continue;
      }
      xml = await chunkRes.text();
      locs.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&")));
    }
  }
  return locs.filter((url) => !/\.(png|jpg|jpeg|webp|svg|xml)$/i.test(url));
}

const urls = (await collectSitemapUrls()).slice(0, limit);
console.log(`Auditing ${urls.length} URLs from ${base} ...\n`);

for (const url of urls) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "kokunime-audit-meta/1.0" } });
    if (!res.ok) {
      problems.push(`${url}: HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    const title = /<title[^>]*>([^<]*)<\/title>/i.exec(html)?.[1]?.trim() ?? "";
    const desc =
      /<meta name="description" content="([^"]*)"/i.exec(html)?.[1]?.trim() ??
      /<meta content="([^"]*)" name="description"/i.exec(html)?.[1]?.trim() ??
      "";
    const canonical = /<link rel="canonical" href="([^"]*)"/i.exec(html)?.[1] ?? "";
    const short = url.replace(base, "") || "/";

    if (!title) problems.push(`${short}: <title> missing`);
    else {
      if (title.length < TITLE_MIN || title.length > TITLE_MAX)
        warnings.push(`${short}: title ${title.length} chars — "${title}"`);
      const prev = seenTitles.get(title);
      if (prev) problems.push(`${short}: duplicate title with ${prev}`);
      else seenTitles.set(title, short);
    }

    if (!desc) problems.push(`${short}: meta description missing`);
    else {
      if (desc.length < DESC_MIN || desc.length > DESC_MAX) warnings.push(`${short}: description ${desc.length} chars`);
      const prev = seenDescriptions.get(desc);
      if (prev) problems.push(`${short}: duplicate description with ${prev}`);
      else seenDescriptions.set(desc, short);
    }

    if (!canonical) warnings.push(`${short}: canonical missing`);
    console.log(`  ✓ ${short} — title ${title.length}, desc ${desc.length}`);
  } catch (error) {
    problems.push(`${url}: fetch failed (${error.message})`);
  }
}

console.log(`\nProblems: ${problems.length}, warnings: ${warnings.length}`);
for (const problem of problems) console.log(`  PROBLEM ${problem}`);
for (const warning of warnings) console.log(`  warning ${warning}`);

process.exitCode = strict && problems.length > 0 ? 1 : 0;
