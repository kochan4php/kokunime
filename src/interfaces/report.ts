export const REPORT_KINDS = ["dead_link", "missing_episode", "metadata"] as const;

export type ReportKind = (typeof REPORT_KINDS)[number];

export type ReportStatus = "open" | "resolved";

export interface ReportRecord {
  id: string;
  slug: string;
  kind: ReportKind;
  note: string;
  createdAt: string;
  status: ReportStatus;
  resolvedAt?: string | undefined;
}
