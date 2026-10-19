export type LinkHealthState = "ok" | "dead" | "blocked" | "timeout" | "error" | "unverifiable";

export interface LinkHealthRecord {
  state: LinkHealthState;
  status?: number | undefined;
  checkedAt: string;
  finalUrl?: string | undefined;
}

// One snapshot per anime. Keys are the exact download URLs exposed in the
// detail payload, so the UI never has to guess which record belongs to a link.
export interface LinkHealthSnapshot {
  checkedAt: string;
  total: number;
  checked: number;
  truncated: boolean;
  records: Record<string, LinkHealthRecord>;
}
