import { JSX } from "react";

export interface MiniBarDatum {
  label: string;
  value: number;
}

interface MiniBarChartProps {
  data: MiniBarDatum[];
  ariaLabel: string;
  height?: number;
  barClassName?: string;
}

// Dependency-free SVG-free bar chart: styled divs + a visually hidden list so
// screen readers get the numbers without a chart library.
const MiniBarChart = ({
  data,
  ariaLabel,
  height = 128,
  barClassName = "bg-nb-cyan",
}: MiniBarChartProps): JSX.Element => {
  const max = Math.max(1, ...data.map((datum) => datum.value));

  return (
    <div role="img" aria-label={ariaLabel}>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((datum) => (
          <div
            key={datum.label}
            className="flex h-full flex-1 flex-col justify-end"
            title={`${datum.label}: ${datum.value}`}
          >
            {datum.value > 0 && (
              <span className="mb-0.5 text-center font-mono text-[9px] font-bold text-ink-muted">{datum.value}</span>
            )}
            <div
              className={`w-full rounded-t-sm border-2 border-b-0 border-border ${barClassName}`}
              style={{ height: `${Math.max(2, (datum.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex gap-1">
        {data.map((datum) => (
          <span key={datum.label} className="flex-1 text-center font-mono text-[9px] text-ink-muted">
            {datum.label}
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {data.map((datum) => (
          <li key={datum.label}>
            {datum.label}: {datum.value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MiniBarChart;
