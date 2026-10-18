import { gunzip, gzip } from "node:zlib";
import { promisify } from "node:util";

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

// Large cached payloads (upstream HTML bodies, catalog JSON) dominate both
// Redis memory and the wire. Compress anything past a threshold and mark it,
// so old uncompressed entries keep working — no migration needed.
const COMPRESSED_PREFIX = "gz1:";
const COMPRESS_THRESHOLD_CHARS = 1024;

export const CACHE_CODEC = {
  prefix: COMPRESSED_PREFIX,
  thresholdChars: COMPRESS_THRESHOLD_CHARS,
} as const;

export const encodeCacheValue = async (value: unknown): Promise<string> => {
  const json = JSON.stringify(value) ?? "null";
  if (json.length < COMPRESS_THRESHOLD_CHARS) return json;
  const compressed = await gzipAsync(Buffer.from(json, "utf8"));
  return COMPRESSED_PREFIX + compressed.toString("base64");
};

export const decodeCacheValue = async (raw: string): Promise<unknown> => {
  if (raw.startsWith(COMPRESSED_PREFIX)) {
    const inflated = await gunzipAsync(Buffer.from(raw.slice(COMPRESSED_PREFIX.length), "base64"));
    return JSON.parse(inflated.toString("utf8")) as unknown;
  }
  return JSON.parse(raw) as unknown;
};
