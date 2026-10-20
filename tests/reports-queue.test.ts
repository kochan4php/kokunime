import { beforeEach, describe, expect, it, vi } from "vitest";

const queue = vi.hoisted(() => ({ fields: new Map<string, string>(), reachable: true }));

vi.mock("@/lib/redis", () => ({
  redisHSet: vi.fn(async (_key: string, fields: Record<string, string>) => {
    if (!queue.reachable) return false;
    for (const [field, value] of Object.entries(fields)) queue.fields.set(field, value);
    return true;
  }),
  redisHGetAll: vi.fn(async () => (queue.reachable ? Object.fromEntries(queue.fields) : null)),
}));

const { createReport, listReports, resolveReport } = await import("@/lib/reports");

describe("report queue", () => {
  beforeEach(() => {
    queue.fields.clear();
    queue.reachable = true;
  });

  it("stores, lists, and resolves a report without losing its note", async () => {
    const created = await createReport({ slug: "one-piece", kind: "missing_episode", note: "episode 12" });
    expect(created).not.toBeNull();
    if (!created) return;

    const listed = await listReports();
    expect(listed).toHaveLength(1);
    expect(listed?.[0]).toMatchObject({
      id: created.id,
      slug: "one-piece",
      kind: "missing_episode",
      note: "episode 12",
      status: "open",
    });

    const resolved = await resolveReport(created.id);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.report.status).toBe("resolved");
    expect(resolved.report.resolvedAt).toBeTruthy();
  });

  it("reports an unavailable queue instead of an empty success", async () => {
    queue.reachable = false;
    await expect(createReport({ slug: "one-piece", kind: "metadata", note: "" })).resolves.toBeNull();
    await expect(listReports()).resolves.toBeNull();
    await expect(resolveReport("12345678")).resolves.toEqual({ ok: false, reason: "unavailable" });
  });
});
