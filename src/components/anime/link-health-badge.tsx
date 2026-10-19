import { LinkHealthRecord, LinkHealthState } from "@/interfaces";
import { JSX } from "react";

const META: Record<LinkHealthState, { label: string; className: string }> = {
  ok: { label: "Aktif", className: "bg-nb-lime text-nb-ink" },
  dead: { label: "Mati", className: "bg-nb-red text-nb-ink" },
  blocked: { label: "Dibatasi", className: "bg-nb-yellow text-nb-ink" },
  timeout: { label: "Timeout", className: "bg-nb-orange text-nb-ink" },
  error: { label: "Gagal", className: "bg-surface-muted text-ink-muted" },
  unverifiable: { label: "Manual", className: "bg-surface-muted text-ink-muted" },
};

// Date-only on purpose: the server and browser must render the same string,
// and the exact clock time is only useful in the admin log.
const checkedOn = (record: LinkHealthRecord): string => record.checkedAt.slice(0, 10);

const LinkHealthBadge = ({ record }: { record?: LinkHealthRecord | undefined }): JSX.Element | null => {
  if (!record) return null;
  const meta = META[record.state];
  const title = `Status tautan: ${meta.label} · dicek ${checkedOn(record)}`;
  return (
    <span
      title={title}
      aria-label={title}
      className={`inline-flex shrink-0 items-center rounded-sm border-2 border-border px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide ${meta.className}`}
    >
      {meta.label}
    </span>
  );
};

export default LinkHealthBadge;
