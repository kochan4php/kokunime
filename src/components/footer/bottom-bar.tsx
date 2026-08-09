import { JSX } from "react";

const BottomBar = (): JSX.Element => (
  <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
    <p className="font-mono text-xs text-ink-muted">&copy; {new Date().getFullYear()} Kokunime</p>
    <p className="font-mono text-xs text-ink-muted">Dibangun pakai Next.js</p>
  </div>
);

export default BottomBar;
