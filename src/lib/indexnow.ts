import { readdirSync } from "node:fs";
import path from "node:path";
import { SITE_URL } from "@/lib/site";

const BATCH_SIZE = 500;

interface IndexNowResult {
  submitted: number;
  batches: number;
  failed: number;
  skipped?: string;
}

// Submits absolute URLs to IndexNow (Bing/Yandex/Seznam/Naver) in 500-URL
// batches. The key file lives in public/ as a 32-hex .txt. Best-effort: never
// throws — callers treat it as fire-and-forget.
export const submitToIndexNow = async (urls: string[]): Promise<IndexNowResult> => {
  const unique = [...new Set(urls)].filter((url) => url.startsWith("http"));
  if (unique.length === 0) return { submitted: 0, batches: 0, failed: 0, skipped: "no urls" };

  let keyFile: string | undefined;
  try {
    keyFile = readdirSync(path.join(process.cwd(), "public")).find((file) => /^[0-9a-f]{32}\.txt$/.test(file));
  } catch {
    keyFile = undefined;
  }
  if (!keyFile) return { submitted: 0, batches: 0, failed: 0, skipped: "key file missing" };

  const key = keyFile.replace(/\.txt$/, "");
  let failed = 0;
  let batches = 0;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const urlList = unique.slice(i, i + BATCH_SIZE);
    batches++;
    try {
      const response = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: new URL(SITE_URL).host, key, keyLocation: `${SITE_URL}/${keyFile}`, urlList }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) failed++;
    } catch {
      failed++;
    }
  }

  return { submitted: unique.length, batches, failed };
};
