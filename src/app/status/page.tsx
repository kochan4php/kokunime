import MainLayout from "@/layouts/main-layout";
import SectionHeader from "@/components/section-header";
import { getErrorBudget, getUptimeRollup } from "@/lib/uptime";
import { SITE_URL } from "@/lib/site";
import { buildSparklinePath } from "@/utils/sparkline";
import { Metadata } from "next";
import { JSX } from "react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Status Layanan · Kokunime",
  description: "Status uptime publik Kokunime 14 hari terakhir dan error budget SLO 99,5%.",
  alternates: { canonical: `${SITE_URL}/status` },
  robots: { index: false },
};

const dotClass = (uptimePct: number | null): string => {
  if (uptimePct === null) return "border-2 border-border bg-surface-muted";
  if (uptimePct >= 99.5) return "bg-nb-lime";
  if (uptimePct >= 99) return "bg-nb-yellow";
  return "bg-nb-red";
};

// Public status page rendered from the daily uptime rollup (Redis counters
// bumped by the /api/status probe). ISR keeps it static for 5 minutes.
const StatusPage = async (): Promise<JSX.Element> => {
  const rollup = await getUptimeRollup(14);
  const budget = getErrorBudget(rollup);
  // Chart reads oldest → newest; the rollup list stays newest-first.
  const chronological = [...rollup].reverse();
  const values = chronological.map((day) => day.uptime_pct);
  const measured = values.filter((value): value is number => value !== null);
  const floor = measured.length > 0 ? Math.min(99, Math.floor(Math.min(...measured))) : 99;
  const rangeFormat = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
  const firstDay = chronological[0]?.date;
  const lastDay = chronological[chronological.length - 1]?.date;

  return (
    <MainLayout>
      <section className="container px-4 pt-6 pb-8 md:pt-10 md:pb-16">
        <SectionHeader
          kicker="Transparansi"
          title="📡 Status Layanan"
          titleAs="h1"
          tone="teal"
          className="mb-6"
          badge={
            <span className="rounded-sm border-2 border-border bg-nb-lime px-2.5 py-0.5 font-mono text-[10px] font-bold text-nb-ink shadow-[2px_2px_0_0_var(--border)]">
              SLO {budget.slo_pct}%
            </span>
          }
          description={
            <>
              Uptime dari probe otomatis <span className="font-mono text-xs">/api/status</span> setiap 15 menit. Target
              SLO {budget.slo_pct}% per 14 hari.
            </>
          }
        />

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="card-shell">
            <div className="card-core p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Uptime 14 hari</span>
              <span className="mt-1 block font-display text-2xl font-extrabold text-ink">
                {budget.uptime_pct === null ? "—" : `${budget.uptime_pct}%`}
              </span>
            </div>
          </div>
          <div className="card-shell">
            <div className="card-core p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">Probe tercatat</span>
              <span className="mt-1 block font-display text-2xl font-extrabold text-ink">{budget.probes}</span>
              <span className="mt-0.5 block font-mono text-[10px] text-ink-muted">{budget.failures} gagal</span>
            </div>
          </div>
          <div className="card-shell">
            <div className="card-core p-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                Error budget terpakai
              </span>
              <span className="mt-1 block font-display text-2xl font-extrabold text-ink">
                {budget.consumed_pct === null ? "—" : `${Math.round(budget.consumed_pct)}%`}
              </span>
              <span className="mt-0.5 block font-mono text-[10px] text-ink-muted">
                kuota {budget.allowed_failures} dari {budget.probes} probe
              </span>
            </div>
          </div>
        </div>

        {measured.length > 1 && (
          <figure className="card-shell mt-3">
            <figcaption className="sr-only">
              Tren uptime harian 14 hari terakhir, dari {firstDay} sampai {lastDay}.
            </figcaption>
            <div className="card-core p-4">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                <span>Tren uptime 14 hari</span>
                <span>maks 100%</span>
              </div>
              {/* Decorative: every value is already in the daily list below. */}
              <svg
                viewBox="0 0 100 28"
                preserveAspectRatio="none"
                className="mt-2 h-12 w-full text-ink"
                aria-hidden="true"
              >
                <path
                  d={buildSparklinePath(values, { floor })}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="flex items-center justify-between font-mono text-[10px] text-ink-muted">
                <span>{floor}%</span>
                <span>
                  {firstDay ? rangeFormat.format(new Date(firstDay)) : ""} –{" "}
                  {lastDay ? rangeFormat.format(new Date(lastDay)) : ""}
                </span>
              </div>
            </div>
          </figure>
        )}

        <h2 className="mt-8 font-display text-lg font-bold text-ink">Riwayat harian</h2>
        <ul className="mt-3 space-y-1.5">
          {rollup.map((day) => (
            <li
              key={day.date}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 border-border bg-surface px-3 py-2 font-mono text-xs"
            >
              <span className="text-ink-muted">{day.date}</span>
              <span className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-sm ${dotClass(day.uptime_pct)}`} aria-hidden="true" />
                <span className="font-bold text-ink">
                  {day.uptime_pct === null ? "tidak ada data" : `${day.uptime_pct}%`}
                </span>
                <span className="text-ink-muted">
                  ({day.probes} probe{day.failures > 0 ? `, ${day.failures} gagal` : ""})
                </span>
              </span>
            </li>
          ))}
        </ul>

        {budget.probes === 0 && (
          <p className="mt-4 font-mono text-[11px] text-ink-muted">
            Belum ada data probe — Redis tidak dikonfigurasi di lingkungan ini, atau probe baru dipasang.
          </p>
        )}
      </section>
    </MainLayout>
  );
};

export default StatusPage;
