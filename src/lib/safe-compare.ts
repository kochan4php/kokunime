// Constant-time compare for bearer tokens. Both sides are SHA-256 hashed
// first: timingSafeEqual throws on length mismatch, and hashing keeps the
// configured token length out of the timing side channel too.
import { createHash, timingSafeEqual } from "node:crypto";

export function safeCompare(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}
