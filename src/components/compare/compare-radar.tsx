"use client";

import { AnimeDetail } from "@/interfaces";
import { buildCompareMetrics, pickWinners, seriesColor, seriesMark } from "@/utils/compare";
import { JSX } from "react";

const RADIUS = 100;
const AXES = 5;

const axisPoint = (index: number, radius: number): [number, number] => {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / AXES;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
};

const polygonPoints = (values: number[]): string =>
  values.map((value, index) => axisPoint(index, value * RADIUS).join(",")).join(" ");

interface CompareRadarProps {
  animes: AnimeDetail[];
}

// Radar chart of the five local metrics plus a per-metric winner list.
const CompareRadar = ({ animes }: CompareRadarProps): JSX.Element => {
  const metrics = buildCompareMetrics(...animes);

  const fractions = (seriesIndex: number): number[] =>
    metrics.map((metric) => {
      const max = Math.max(...metric.values);
      return max > 0 ? (metric.values[seriesIndex] ?? 0) / max : 0.5;
    });

  const winners = metrics.map((metric) => ({ metric, leaders: pickWinners(metric.values) }));

  return (
    <div className="card-shell">
      <div className="card-core p-5 sm:p-6">
        <h3 className="font-display text-sm font-bold text-ink sm:text-base">🕸️ Peta Kekuatan (5 Metrik)</h3>
        <p className="mt-1 text-xs text-ink-muted">
          Tiap sumbu dinormalkan terhadap yang tertinggi di antara judul yang dibandingkan — bentuk yang lebih lebar
          berarti unggul di sumbu itu.
        </p>

        <div className="mt-4 flex flex-col items-center gap-6 md:flex-row md:justify-around">
          <svg
            viewBox="-135 -125 270 260"
            className="h-64 w-64 shrink-0"
            role="img"
            aria-label={`Radar perbandingan: ${metrics
              .map((metric) => `${metric.label} ${metric.values.map((value) => metric.display(value)).join(" lawan ")}`)
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

            {animes.map((anime, index) => (
              <polygon
                key={`${anime.title}-${index}`}
                points={polygonPoints(fractions(index))}
                fill={seriesColor(index)}
                fillOpacity="0.35"
                stroke={seriesColor(index)}
                strokeWidth="2.5"
              />
            ))}

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
            {animes.map((anime, index) => (
              <li key={`${anime.title}-${index}`} className="flex items-center gap-2 font-mono text-[11px] font-bold">
                <span
                  aria-hidden="true"
                  className="inline-block h-3 w-3 rounded-sm border border-border"
                  style={{ backgroundColor: seriesColor(index) }}
                />
                {seriesMark(index)} {anime.title}
              </li>
            ))}
            <li aria-hidden="true" className="my-2 h-0.5 bg-border" />
            {winners.map(({ metric, leaders }) => (
              <li key={metric.key} className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="text-ink-muted">{metric.label}</span>
                <span className="font-bold text-ink">
                  {leaders.length !== 1 ? (
                    <span className="text-ink-muted">seri —</span>
                  ) : (
                    <>
                      {seriesMark(leaders[0] ?? 0)} {metric.display(metric.values[leaders[0] ?? 0] ?? 0)}
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
