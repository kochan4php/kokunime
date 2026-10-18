"use client";

import { AnimeDetail } from "@/interfaces";
import { pickWinners, seriesMark } from "@/utils/compare";
import { useTranslation } from "@/utils/i18n";
import { JSX } from "react";

interface CompareSpecsTableProps {
  animes: AnimeDetail[];
}

// Side-by-side spec matrix for 2–3 titles; only a unique highest score /
// episode count per row gets the accent.
const CompareSpecsTable = ({ animes }: CompareSpecsTableProps): JSX.Element => {
  const { t } = useTranslation();

  const scores = animes.map((anime) => parseFloat(anime.score || "0"));
  const episodes = animes.map((anime) => parseInt(anime.total_episode || "0", 10));
  const scoreLeaders = pickWinners(scores);
  const episodeLeaders = pickWinners(episodes);
  const episodeRunnerUp = [...episodes].sort((a, b) => b - a)[1] ?? 0;

  return (
    <div className="card-shell overflow-hidden">
      <div className="card-core p-0 overflow-x-auto">
        <table className={`w-full border-collapse text-left ${animes.length > 2 ? "min-w-[860px]" : "min-w-[620px]"}`}>
          <caption className="sr-only">
            {t("compare.spec_parameter")}: {animes.map((anime) => anime.title).join(" vs ")}
          </caption>
          <thead>
            <tr className="border-b-2 border-border bg-surface-muted font-mono text-xs uppercase tracking-wider text-ink-muted">
              <th scope="col" className="p-4 w-1/4">
                {t("compare.spec_parameter")}
              </th>
              {animes.map((anime, index) => (
                <th key={`${anime.title}-${index}`} scope="col" className="p-4 font-display text-sm font-bold text-ink">
                  {seriesMark(index)} {anime.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-border text-xs sm:text-sm font-mono">
            {/* Rating Score */}
            <tr className="hover:bg-surface-muted">
              <th scope="row" className="p-4 text-left font-bold text-ink-muted">
                ⭐ {t("compare.score_rating")}
              </th>
              {animes.map((anime, index) => {
                const leads = scoreLeaders.length === 1 && scoreLeaders[0] === index;
                return (
                  <td key={`score-${index}`} className="p-4 font-bold">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 ${
                        leads
                          ? "rounded-sm border-2 border-border bg-nb-yellow text-nb-ink font-black shadow-[2px_2px_0_0_var(--border)]"
                          : "text-ink"
                      }`}
                    >
                      ⭐ {anime.score || "N/A"} {leads && t("compare.higher_score")}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Total Episodes */}
            <tr className="hover:bg-surface-muted">
              <th scope="row" className="p-4 text-left font-bold text-ink-muted">
                🎬 {t("compare.total_episodes")}
              </th>
              {animes.map((anime, index) => {
                const episode = episodes[index] ?? 0;
                const leads = episodeLeaders.length === 1 && episodeLeaders[0] === index;
                return (
                  <td key={`episodes-${index}`} className="p-4">
                    {anime.total_episode || "N/A"}{" "}
                    {leads && episodeRunnerUp > 0 && (
                      <span className="rounded-sm border border-border bg-nb-lime px-1.5 font-bold text-nb-ink">
                        ({episode - episodeRunnerUp} {t("compare.more_episodes")})
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Duration */}
            <tr className="hover:bg-surface-muted">
              <th scope="row" className="p-4 text-left font-bold text-ink-muted">
                ⏱️ {t("compare.duration")}
              </th>
              {animes.map((anime, index) => (
                <td key={`duration-${index}`} className="p-4 text-ink">
                  {anime.duration || "N/A"}
                </td>
              ))}
            </tr>

            {/* Studio */}
            <tr className="hover:bg-surface-muted">
              <th scope="row" className="p-4 text-left font-bold text-ink-muted">
                🏢 {t("compare.studio")}
              </th>
              {animes.map((anime, index) => (
                <td key={`studio-${index}`} className="p-4 text-accent-text font-bold">
                  {anime.studio || anime.producer || "N/A"}
                </td>
              ))}
            </tr>

            {/* Type */}
            <tr className="hover:bg-surface-muted">
              <th scope="row" className="p-4 text-left font-bold text-ink-muted">
                📺 {t("compare.type")}
              </th>
              {animes.map((anime, index) => (
                <td key={`type-${index}`} className="p-4 text-ink">
                  {anime.type || "TV Series"}
                </td>
              ))}
            </tr>

            {/* Release Season / Year */}
            <tr className="hover:bg-surface-muted">
              <th scope="row" className="p-4 text-left font-bold text-ink-muted">
                📅 {t("compare.release")}
              </th>
              {animes.map((anime, index) => (
                <td key={`release-${index}`} className="p-4 text-ink">
                  {anime.season?.name || anime.release_on || "N/A"}
                </td>
              ))}
            </tr>

            {/* Status */}
            <tr className="hover:bg-surface-muted">
              <th scope="row" className="p-4 text-left font-bold text-ink-muted">
                📡 {t("compare.status")}
              </th>
              {animes.map((anime, index) => (
                <td key={`status-${index}`} className="p-4 text-ink">
                  {anime.status || "N/A"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareSpecsTable;
