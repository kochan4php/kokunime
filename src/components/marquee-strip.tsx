import { JSX } from "react";

interface MarqueeStripProps {
  items: string[];
  className?: string;
}

// Full-bleed scrolling tape. Decorative by design: the first group carries the
// text, the duplicate is aria-hidden so screen readers hear the list once.
const MarqueeStrip = ({ items, className = "" }: MarqueeStripProps): JSX.Element => (
  <div className={`nb-marquee ${className}`.trim()} data-print-hide>
    <div className="nb-marquee-track">
      <div className="nb-marquee-group">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="nb-marquee-group" aria-hidden="true">
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  </div>
);

export default MarqueeStrip;
