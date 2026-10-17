// Share-link codec for bookmarks + progress sync: JSON → gzip → base64url when
// CompressionStream exists (all evergreen browsers, Node ≥18), plain base64url
// otherwise. The "g." / "j." / legacy prefixes make decode format-agnostic.
interface SyncPayload {
  v: 1;
  b?: unknown[]; // BookmarkItem[]
  p?: unknown[]; // ProgressEntry[]
}

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (value: string): Uint8Array => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

export const encodeSyncPayload = async (payload: SyncPayload): Promise<string> => {
  const json = JSON.stringify(payload);
  if (typeof CompressionStream !== "undefined") {
    try {
      const stream = new Blob([json]).stream().pipeThrough(new CompressionStream("gzip"));
      const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
      return `g.${toBase64Url(bytes)}`;
    } catch {
      // Fall through to the plain format.
    }
  }
  return `j.${toBase64Url(new TextEncoder().encode(json))}`;
};

export const decodeSyncPayload = async (token: string): Promise<SyncPayload | null> => {
  const raw = token.trim();
  if (!raw) return null;
  try {
    const dot = raw.indexOf(".");
    const prefix = dot > 0 && dot <= 2 ? raw.slice(0, dot) : "";
    const body = prefix ? raw.slice(dot + 1) : raw;

    if (prefix === "g") {
      const bytes = fromBase64Url(body);
      const stream = new Blob([bytes as unknown as BlobPart]).stream().pipeThrough(new DecompressionStream("gzip"));
      const parsed = JSON.parse(await new Response(stream).text()) as SyncPayload;
      return parsed?.v === 1 ? parsed : null;
    }

    if (prefix === "j") {
      const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SyncPayload;
      return parsed?.v === 1 ? parsed : null;
    }

    // Legacy #sync= links: btoa(encodeURIComponent(JSON.stringify(items))).
    const legacy = JSON.parse(decodeURIComponent(atob(raw))) as unknown;
    if (Array.isArray(legacy)) return { v: 1, b: legacy };
    return null;
  } catch {
    return null;
  }
};
