// Opaque cursor pagination for the listing APIs. The cursor only encodes the
// next page number — clients must treat it as an opaque string.

export const encodeCursor = (page: number): string => Buffer.from(`p:${page}`, "utf8").toString("base64url");

export const decodeCursor = (raw: string | null | undefined): number | null => {
  if (!raw) return null;
  try {
    const decoded = Buffer.from(raw, "base64url").toString("utf8");
    const match = decoded.match(/^p:(\d{1,6})$/);
    if (!match) return null;
    const page = Number(match[1]);
    return Number.isFinite(page) && page >= 1 ? page : null;
  } catch {
    return null;
  }
};
