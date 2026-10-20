import { REPORT_KINDS, type ReportKind, type ReportRecord, type ReportStatus } from "@/interfaces/report";
import { redisHGetAll, redisHSet } from "@/lib/redis";
import { isSafeSlug } from "@/utils/endpoint-slug";

const QUEUE_KEY = "reports";
const REPORT_TTL_SECONDS = 30 * 24 * 60 * 60;
const NOTE_MAX = 300;
const URL_PATTERN = /(?:[a-z][a-z0-9+.-]*:\/\/|www\.)/i;

const isReportKind = (value: unknown): value is ReportKind =>
  typeof value === "string" && (REPORT_KINDS as readonly string[]).includes(value);

export const isReportStatus = (value: unknown): value is ReportStatus => value === "open" || value === "resolved";

// Notes are deliberately link-free: this queue is for describing what is
// wrong, not for submitting arbitrary URLs (which would make it an open relay).
export const sanitizeReportNote = (value: unknown): string | null => {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const note = value.trim();
  if (note.length > NOTE_MAX || URL_PATTERN.test(note)) return null;
  return note;
};

interface ReportInput {
  slug: string;
  kind: ReportKind;
  note: string;
}

export const validateReportInput = (body: unknown): ReportInput | null => {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  const slug = typeof input.slug === "string" ? input.slug.trim() : "";
  if (!slug || !isSafeSlug(slug) || !isReportKind(input.kind)) return null;
  const note = sanitizeReportNote(input.note);
  if (note === null) return null;
  return { slug, kind: input.kind, note };
};

const parseStoredReport = (raw: string): ReportRecord | null => {
  try {
    const value = JSON.parse(raw) as Partial<ReportRecord>;
    if (
      typeof value.id !== "string" ||
      value.id.length < 8 ||
      value.id.length > 40 ||
      typeof value.slug !== "string" ||
      !isSafeSlug(value.slug) ||
      !isReportKind(value.kind) ||
      typeof value.note !== "string" ||
      value.note.length > NOTE_MAX ||
      typeof value.createdAt !== "string" ||
      !isReportStatus(value.status)
    ) {
      return null;
    }
    return {
      id: value.id,
      slug: value.slug,
      kind: value.kind,
      note: value.note,
      createdAt: value.createdAt,
      status: value.status,
      resolvedAt: typeof value.resolvedAt === "string" ? value.resolvedAt : undefined,
    };
  } catch {
    return null;
  }
};

export const listReports = async (): Promise<ReportRecord[] | null> => {
  const raw = await redisHGetAll(QUEUE_KEY);
  if (raw === null) return null;
  return Object.values(raw)
    .map(parseStoredReport)
    .filter((report): report is ReportRecord => report !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const createReport = async (input: ReportInput): Promise<ReportRecord | null> => {
  const report: ReportRecord = {
    id: crypto.randomUUID(),
    slug: input.slug,
    kind: input.kind,
    note: input.note,
    createdAt: new Date().toISOString(),
    status: "open",
  };
  const stored = await redisHSet(QUEUE_KEY, { [report.id]: JSON.stringify(report) }, REPORT_TTL_SECONDS);
  return stored ? report : null;
};

type ReportMutationResult = { ok: true; report: ReportRecord } | { ok: false; reason: "unavailable" | "missing" };

export const resolveReport = async (id: string): Promise<ReportMutationResult> => {
  const raw = await redisHGetAll(QUEUE_KEY);
  if (raw === null) return { ok: false, reason: "unavailable" };
  const current = raw[id] ? parseStoredReport(raw[id]) : null;
  if (!current) return { ok: false, reason: "missing" };

  const report: ReportRecord = {
    ...current,
    status: "resolved",
    resolvedAt: new Date().toISOString(),
  };
  const stored = await redisHSet(QUEUE_KEY, { [report.id]: JSON.stringify(report) }, REPORT_TTL_SECONDS);
  return stored ? { ok: true, report } : { ok: false, reason: "unavailable" };
};
