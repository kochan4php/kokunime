import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const makeRequest = (path = "/anime/foo"): NextRequest => new NextRequest(new URL(`https://kokunime.example${path}`));

describe("security header matrix", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("serves the report-only CSP directives + a correlation id by default", () => {
    const res = middleware(makeRequest());
    const csp = res.headers.get("content-security-policy-report-only") ?? "";
    for (const directive of [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "require-trusted-types-for 'script'",
      "trusted-types default",
      "report-uri /api/report-error",
    ]) {
      expect(csp, directive).toContain(directive);
    }
    expect(res.headers.get("x-request-id")).toBeTruthy();
    expect(res.headers.get("content-security-policy")).toBeNull();
  });

  it("switches to enforcing (Trusted Types included) with CSP_ENFORCE=1", () => {
    vi.stubEnv("CSP_ENFORCE", "1");
    const res = middleware(makeRequest());
    expect(res.headers.get("content-security-policy")).toContain("require-trusted-types-for 'script'");
    expect(res.headers.get("content-security-policy-report-only")).toBeNull();
  });

  it("rejects malformed A–Z segments instead of streaming a soft 404", () => {
    const res = middleware(makeRequest("/indeks/AB"));
    expect(res.status).toBe(404);
    expect(middleware(makeRequest("/indeks/A")).status).toBe(200);
    expect(middleware(makeRequest("/indeks/lain")).status).toBe(200);
  });

  it("does not redirect percent-encoded Unicode detail slugs", () => {
    const res = middleware(makeRequest("/anime/futari-wa-precure-splash%e2%98%86star-batch-subtitle-indonesia"));
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("static config carries the transport/clickjacking header set", () => {
    const config = readFileSync("next.config.mjs", "utf8");
    for (const header of [
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Strict-Transport-Security",
      "X-Frame-Options",
      "Permissions-Policy",
    ]) {
      expect(config, header).toContain(header);
    }
  });
});
