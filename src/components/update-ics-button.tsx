"use client";

import { CalendarEvent, buildWeeklyReminderIcs } from "@/utils/ics";
import { useTranslation } from "@/utils/i18n";
import { showToast } from "@/utils/toast";
import { JSX } from "react";

const UpdateIcsButton = ({ events }: { events: CalendarEvent[] }): JSX.Element => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (events.length === 0) return;
    const blob = new Blob([buildWeeklyReminderIcs(events)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kokunime-update.ics";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(`${events.length} ${t("update.ics_toast")}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={events.length === 0}
      title={t("update.ics_title")}
      className="rounded-sm border-2 border-border bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink-muted shadow-[2px_2px_0_0_var(--border)] transition-all hover:-translate-y-0.5 hover:text-ink active:translate-y-0 active:shadow-none cursor-pointer disabled:opacity-50"
    >
      📅 {t("update.ics_button")}
    </button>
  );
};

export default UpdateIcsButton;
