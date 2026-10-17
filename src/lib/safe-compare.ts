// Constant-time-ish compare for bearer tokens. Scans the full length of the
// longer input so mismatched lengths do not shortcut the loop.
export function safeCompare(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < len; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
