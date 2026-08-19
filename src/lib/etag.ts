import { NextRequest } from "next/server";

export function generateEtag(payload: string): string {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `"${Math.abs(hash).toString(36)}-${payload.length.toString(36)}"`;
}

export function checkEtagMatch(request: NextRequest, etag: string): boolean {
  const ifNoneMatch = request.headers.get("if-none-match");
  if (!ifNoneMatch) return false;
  return ifNoneMatch === etag || ifNoneMatch === `W/${etag}` || ifNoneMatch.includes(etag);
}
