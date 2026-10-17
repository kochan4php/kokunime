"use client";

import { AnimeDetail } from "@/interfaces";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface CompareSpecsTableProps {
  animeA: AnimeDetail;
  animeB: AnimeDetail;
}

// Side-by-side spec matrix; the higher score / episode count gets the accent.
const CompareSpecsTable = ({ animeA, animeB }: CompareSpecsTableProps): JSX.Element => {
  const { t } = useTranslation();

  const scoreA = parseFloat(animeA.score || "0");
  const scoreB = parseFloat(animeB.score || "0");
  const epA = parseInt(animeA.total_episode || "0", 10);
  const epB = parseInt(animeB.total_episode || "0", 10);

  return (
    <div className="card-shell overflow-hidden">
      <div className="card-core p-0 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-border bg-surface-muted font-mono text-xs uppercase tracking-wider text-ink-muted">
              <th className="p-4 w-1/4">{t("compare.spec_parameter")}</th>
              <th className="p-4 w-[37.5%] font-display text-sm font-bold text-ink">🔴 {animeA.title}</th>
              <th className="p-4 w-[37.5%] font-display text-sm font-bold text-ink">🔵 {animeB.title}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border text-xs sm:text-sm font-mono">
            {/* Rating Score */}
            <tr className="hover:bg-surface-muted">
              <td className="p-4 font-bold text-ink-muted">⭐ {t("compare.score_rating")}</td>
              <td className="p-4 font-bold">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 ${
                    scoreA > scoreB && scoreA > 0
                      ? "rounded-sm border-2 border-border bg-nb-yellow text-nb-ink font-black shadow-[2px_2px_0_0_var(--border)]"
                      : "text-ink"
                  }`}
                >
                  ⭐ {animeA.score || "N/A"} {scoreA > scoreB && t("compare.higher_score")}
                </span>
              </td>
              <td className="p-4 font-bold">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 ${
                    scoreB > scoreA && scoreB > 0
                      ? "rounded-sm border-2 border-border bg-nb-yellow text-nb-ink font-black shadow-[2px_2px_0_0_var(--border)]"
                      : "text-ink"
                  }`}
                >
                  ⭐ {animeB.score || "N/A"} {scoreB > scoreA && t("compare.higher_score")}
                </span>
              </td>
            </tr>

            {/* Total Episodes */}
            <tr className="hover:bg-surface-muted">
              <td className="p-4 font-bold text-ink-muted">🎬 {t("compare.total_episodes")}</td>
              <td className="p-4">
                {animeA.total_episode || "N/A"}{" "}
                {epA > epB && epB > 0 && (
                  <span className="rounded-sm border border-border bg-nb-lime px-1.5 font-bold text-nb-ink">
                    ({epA - epB} {t("compare.more_episodes")})
                  </span>
                )}
              </td>
              <td className="p-4">
                {animeB.total_episode || "N/A"}{" "}
                {epB > epA && epA > 0 && (
                  <span className="rounded-sm border border-border bg-nb-lime px-1.5 font-bold text-nb-ink">
                    ({epB - epA} {t("compare.more_episodes")})
                  </span>
                )}
              </td>
            </tr>

            {/* Duration */}
            <tr className="hover:bg-surface-muted">
              <td className="p-4 font-bold text-ink-muted">⏱️ {t("compare.duration")}</td>
              <td className="p-4 text-ink">{animeA.duration || "N/A"}</td>
              <td className="p-4 text-ink">{animeB.duration || "N/A"}</td>
            </tr>

            {/* Studio */}
            <tr className="hover:bg-surface-muted">
              <td className="p-4 font-bold text-ink-muted">🏢 {t("compare.studio")}</td>
              <td className="p-4 text-accent font-bold">{animeA.studio || animeA.producer || "N/A"}</td>
              <td className="p-4 text-accent font-bold">{animeB.studio || animeB.producer || "N/A"}</td>
            </tr>

            {/* Type */}
            <tr className="hover:bg-surface-muted">
              <td className="p-4 font-bold text-ink-muted">📺 {t("compare.type")}</td>
              <td className="p-4 text-ink">{animeA.type || "TV Series"}</td>
              <td className="p-4 text-ink">{animeB.type || "TV Series"}</td>
            </tr>

            {/* Release Season / Year */}
            <tr className="hover:bg-surface-muted">
              <td className="p-4 font-bold text-ink-muted">📅 {t("compare.release")}</td>
              <td className="p-4 text-ink">{animeA.season?.name || animeA.release_on || "N/A"}</td>
              <td className="p-4 text-ink">{animeB.season?.name || animeB.release_on || "N/A"}</td>
            </tr>

            {/* Status */}
            <tr className="hover:bg-surface-muted">
              <td className="p-4 font-bold text-ink-muted">📡 {t("compare.status")}</td>
              <td className="p-4 text-ink">{animeA.status || "N/A"}</td>
              <td className="p-4 text-ink">{animeB.status || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareSpecsTable;
