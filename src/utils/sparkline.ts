// Chronological sparkline for nullable daily percentages. Days without a
// probe break the line (a new M segment) instead of drawing a segment that was
// never measured. X spans 0..100 viewBox units so the SVG can stretch.
interface SparklineOptions {
  height?: number;
  /** Value shown at the bottom edge; the top edge is always 100 (%). */
  floor?: number;
}

export const buildSparklinePath = (values: (number | null)[], options: SparklineOptions = {}): string => {
  const { height = 28, floor = 98 } = options;
  const span = 100 - floor;
  const step = values.length > 1 ? 100 / (values.length - 1) : 0;
  let path = "";
  let pen = false;

  values.forEach((value, index) => {
    if (value === null) {
      pen = false;
      return;
    }
    const x = (index * step).toFixed(2);
    const y = (height - ((Math.min(100, Math.max(floor, value)) - floor) / span) * height).toFixed(2);
    path += `${pen ? "L" : "M"}${x} ${y} `;
    pen = true;
  });

  return path.trim();
};
