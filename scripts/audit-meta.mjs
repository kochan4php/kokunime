// Crawls the sitemap of a running instance and audits <title> + meta
// description lengths, canonical presence, OG image dimensions, and the
// JSON-LD blocks each page type is expected to emit.
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
const OG_MIN = 200;

// Required fields per @type; a nested array means "one of these". Fields that
// only some emitters use (e.g. AggregateRating) stay out — missing rich data is
// not a defect, missing structure is.
const REQUIRED_FIELDS = {
  AggregateRating: ["ratingValue", ["ratingCount", "reviewCount"]],
  Answer: ["text"],
  BreadcrumbList: ["itemListElement"],
  ConsumeAction: ["target"],
  EntryPoint: ["urlTemplate"],
  FAQPage: ["mainEntity"],
  ItemList: ["itemListElement"],
  ListItem: ["position", ["name", "item"]],
  Movie: ["name"],
  Organization: ["name", "url"],
  Question: ["name", "acceptedAnswer"],
  SearchAction: ["target", "query-input"],
  TVEpisode: ["name"],
  TVSeries: ["name"],
  WatchAction: ["target"],
  WebSite: ["name", "url"],
};

// Walks every @type node (arrays and @graph included) and reports nodes whose
// required structure is missing, plus types this map does not know yet.
function checkNode(node, short, problems, warnings, path = "") {
  if (Array.isArray(node)) {
    node.forEach((entry, index) => checkNode(entry, short, problems, warnings, `${path}[${index}]`));
    return;
  }
  if (!node || typeof node !== "object") return;
  const type = node["@type"];
  if (typeof type === "string") {
    const required = REQUIRED_FIELDS[type];
    if (!required) warnings.push(`${short}: unvalidated @type ${type}${path}`);
    else {
      for (const field of required) {
        const alternatives = Array.isArray(field) ? field : [field];
        if (!alternatives.some((name) => node[name] !== undefined && node[name] !== null)) {
          problems.push(`${short}: ${type}${path} missing ${alternatives.join("/")}`);
        }
      }
    }
  }
  for (const [key, value] of Object.entries(node)) {
    if (key === "@type") continue;
    checkNode(value, short, problems, warnings, `${path}.${key}`);
  }
}

function checkJsonLd(html, short, problems, warnings) {
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const [index, match] of blocks.entries()) {
    try {
      checkNode(JSON.parse(match[1]), short, problems, warnings, `#${index + 1}`);
    } catch (error) {
      problems.push(`${short}: JSON-LD block ${index + 1} does not parse (${error.message.slice(0, 60)})`);
    }
  }
  return blocks.length;
}

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
      // Chunk URLs are absolute (production origin) too — fetch them from the
      // instance under audit, not from production.
      const chunkRes = await fetch(chunk.replace(/^https?:\/\/[^/]+/, base));
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

const urls = (await collectSitemapUrls())
  // The sitemap lists absolute production URLs even on staging/localhost —
  // crawl the instance that was pointed at, using the same URL list.
  .map((url) => url.replace(/^https?:\/\/[^/]+/, base))
  .filter((url, index, all) => all.indexOf(url) === index)
  .slice(0, limit);
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

    if (!canonical) problems.push(`${short}: canonical missing`);

    // OG images without dimensions force the crawler to download them first;
    // pages that rely on a dynamic opengraph-image route ship 1200×630.
    const ogImage = /<meta property="og:image" content="([^"]*)"/i.exec(html)?.[1] ?? "";
    const ogWidth = Number(/<meta property="og:image:width" content="(\d+)"/i.exec(html)?.[1] ?? 0);
    const ogHeight = Number(/<meta property="og:image:height" content="(\d+)"/i.exec(html)?.[1] ?? 0);
    if (ogImage && (!ogWidth || !ogHeight)) warnings.push(`${short}: og:image without width/height`);
    else if (ogWidth && ogHeight && (ogWidth < OG_MIN || ogHeight < OG_MIN))
      warnings.push(`${short}: og:image only ${ogWidth}×${ogHeight}`);

    const jsonLdBlocks = checkJsonLd(html, short, problems, warnings);
    console.log(`  ✓ ${short} — title ${title.length}, desc ${desc.length}, json-ld ${jsonLdBlocks}`);
  } catch (error) {
    problems.push(`${url}: fetch failed (${error.message})`);
  }
}

console.log(`\nProblems: ${problems.length}, warnings: ${warnings.length}`);
for (const problem of problems) console.log(`  PROBLEM ${problem}`);
for (const warning of warnings) console.log(`  warning ${warning}`);

process.exitCode = strict && problems.length > 0 ? 1 : 0;
