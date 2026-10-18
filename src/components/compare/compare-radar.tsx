"use client";

import { AnimeDetail } from "@/interfaces";
import { extractYear } from "@/utils/similar";
import { JSX } from "react";

interface CompareMetric {
  key: string;
  label: string;
  a: number;
  b: number;
  display: (value: number) => string;
  /** true when a lower value is better (none today, kept for clarity). */
  lowerIsBetter?: boolean;
}

const parseFirstNumber = (value?: string | null): number => {
  const match = value?.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

// Five locally computable metrics — no extra requests. Values are the raw
// numbers; the radar normalizes per axis by the pair's max.
export const buildCompareMetrics = (animeA: AnimeDetail, animeB: AnimeDetail): CompareMetric[] => [
  {
    key: "score",
    label: "Skor",
    a: Number(animeA.score ?? 0),
    b: Number(animeB.score ?? 0),
    display: (value) => (value > 0 ? value.toFixed(1) : "—"),
  },
  {
    key: "episodes",
    label: "Episode",
    a: parseFirstNumber(animeA.total_episode),
    b: parseFirstNumber(animeB.total_episode),
    display: (value) => (value > 0 ? String(value) : "—"),
  },
  {
    key: "duration",
    label: "Durasi",
    a: parseFirstNumber(animeA.duration),
    b: parseFirstNumber(animeB.duration),
    display: (value) => (value > 0 ? `${value} m` : "—"),
  },
  {
    key: "genres",
    label: "Genre",
    a: animeA.genre?.length ?? 0,
    b: animeB.genre?.length ?? 0,
    display: (value) => (value > 0 ? String(value) : "—"),
  },
  {
    key: "year",
    label: "Tahun",
    a: extractYear(animeA.release_on) ?? 0,
    b: extractYear(animeB.release_on) ?? 0,
    display: (value) => (value > 0 ? String(value) : "—"),
  },
];

const RADIUS = 100;
const AXES = 5;

const axisPoint = (index: number, radius: number): [number, number] => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AXES;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
};

const polygonPoints = (values: number[]): string =>
  values.map((value, index) => axisPoint(index, value * RADIUS).join(",")).join(" ");

interface CompareRadarProps {
  animeA: AnimeDetail;
  animeB: AnimeDetail;
}

// Radar chart of the five local metrics plus a per-metric winner list.
const CompareRadar = ({ animeA, animeB }: CompareRadarProps): JSX.Element => {
  const metrics = buildCompareMetrics(animeA, animeB);

  const fractions = (side: "a" | "b"): number[] =>
    metrics.map((metric) => {
      const max = Math.max(metric.a, metric.b);
      return max > 0 ? metric[side] / max : 0.5;
    });

  const pointsA = polygonPoints(fractions("a"));
  const pointsB = polygonPoints(fractions("b"));

  const winners = metrics.map((metric) => ({
    metric,
    winner: metric.a === metric.b ? "tie" : metric.a > metric.b ? "a" : ("b" as const),
  }));

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6">
        <h3 className="font-display text-sm font-bold text-ink sm:text-base">🕸️ Peta Kekuatan (5 Metrik)</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Tiap sumbu dinormalkan terhadap yang tertinggi di antara kedua judul — bentuk yang lebih lebar berarti unggul
          di sumbu itu.
        </p>

        <div className="mt-4 flex flex-col items-center gap-6 md:flex-row md:justify-around">
          <svg
            viewBox="-135 -125 270 260"
            className="h-64 w-64 shrink-0"
            role="img"
            aria-label={`Radar perbandingan: ${metrics
              .map((metric) => `${metric.label} ${metric.display(metric.a)} lawan ${metric.display(metric.b)}`)
              .join("; ")}`}
          >
            {/* Grid rings */}
            {[0.25, 0.5, 0.75, 1].map((fraction) => (
              <polygon
                key={fraction}
                points={polygonPoints(metrics.map(() => fraction))}
                fill="none"
                stroke="var(--border)"
                strokeWidth="1"
                opacity="0.25"
              />
            ))}
            {/* Spokes */}
            {metrics.map((metric, index) => {
              const [x, y] = axisPoint(index, RADIUS);
              return (
                <line
                  key={metric.key}
                  x1="0"
                  y1="0"
                  x2={x}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                  opacity="0.25"
                />
              );
            })}

            <polygon points={pointsA} fill="#ff6b6b" fillOpacity="0.35" stroke="#ff6b6b" strokeWidth="2.5" />
            <polygon points={pointsB} fill="#23a094" fillOpacity="0.35" stroke="#23a094" strokeWidth="2.5" />

            {/* Axis labels */}
            {metrics.map((metric, index) => {
              const [x, y] = axisPoint(index, RADIUS + 26);
              return (
                <text
                  key={metric.key}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-ink-muted font-mono text-[11px] font-bold"
                >
                  {metric.label}
                </text>
              );
            })}
          </svg>

          <ul className="w-full max-w-xs space-y-2">
            <li className="flex items-center gap-2 font-mono text-[11px] font-bold">
              <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm border border-border bg-[#ff6b6b]" />
              🔴 {animeA.title}
            </li>
            <li className="flex items-center gap-2 font-mono text-[11px] font-bold">
              <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm border border-border bg-[#23a094]" />
              🔵 {animeB.title}
            </li>
            <li aria-hidden="true" className="my-2 h-0.5 bg-border" />
            {winners.map(({ metric, winner }) => (
              <li key={metric.key} className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="text-ink-muted">{metric.label}</span>
                <span className="font-bold text-ink">
                  {winner === "tie" ? (
                    <span className="text-ink-muted">seri —</span>
                  ) : (
                    <>
                      {winner === "a" ? "🔴" : "🔵"} {metric.display(winner === "a" ? metric.a : metric.b)}
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompareRadar;
