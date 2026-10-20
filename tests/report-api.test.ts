// @vitest-environment node
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { POST as reportPost } from "@/app/api/report/route";
import { GET as reportsGet, POST as reportsPost } from "@/app/api/admin/reports/route";

const makeReportRequest = (body: unknown, ip = "203.0.113.10"): NextRequest =>
  new NextRequest("http://localhost/api/report", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });

const adminRequest = (path: string, method = "GET", body?: unknown): NextRequest =>
  new NextRequest(`http://localhost${path}`, {
    method,
    headers: {
      authorization: "Bearer test-admin-token",
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

describe("report API without Redis", () => {
  const originalAdminToken = process.env.ADMIN_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_TOKEN = "test-admin-token";
  });

  afterEach(() => {
    process.env.ADMIN_TOKEN = originalAdminToken ?? "";
  });

  it("rejects links and malformed reports before touching the queue", async () => {
    const linked = await reportPost(
      makeReportRequest({ slug: "one-piece", kind: "dead_link", note: "https://evil.example" }),
    );
    expect(linked.status).toBe(400);

    const invalid = await reportPost(makeReportRequest({ slug: "../admin", kind: "dead_link" }));
    expect(invalid.status).toBe(400);
  });

  it("silently absorbs honeypot submissions", async () => {
    const response = await reportPost(
      makeReportRequest({
        slug: "one-piece",
        kind: "dead_link",
        website: "https://spam.example",
      }),
    );
    expect(response.status).toBe(204);
  });

  it("answers 503 instead of pretending a report was queued", async () => {
    const response = await reportPost(makeReportRequest({ slug: "one-piece", kind: "metadata", note: "judul salah" }));
    expect(response.status).toBe(503);
    const body = (await response.json()) as { title: string };
    expect(body.title).toBe("Service Unavailable");
  });

  it("marks the admin queue unavailable and cannot resolve without Redis", async () => {
    const list = await reportsGet(adminRequest("/api/admin/reports"));
    expect(list.status).toBe(200);
    expect(await list.json()).toMatchObject({ ok: true, available: false, reports: [] });

    const resolve = await reportsPost(adminRequest("/api/admin/reports", "POST", { id: "12345678" }));
    expect(resolve.status).toBe(503);
  });
});
