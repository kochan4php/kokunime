import { JSX, ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  message?: string;
  className?: string;
  children?: ReactNode;
}

// Shared empty-list state: icon plate + title + optional CTA row. Callers own
// the copy and the contextual action; this owns the visual pattern only.
const EmptyState = ({ icon, title, message, className = "", children }: EmptyStateProps): JSX.Element => (
  <div className={`card-shell ${className}`.trim()}>
    <div className="card-core flex flex-col items-center justify-center p-12 text-center md:p-20">
      {icon ? (
        <div className="-rotate-2 flex h-16 w-16 items-center justify-center rounded-sm border-2 border-border bg-nb-yellow text-nb-ink shadow-[4px_4px_0_0_var(--border)]">
          {icon}
        </div>
      ) : null}
      <h2 className="mt-6 font-display text-xl font-bold tracking-tight text-ink md:text-2xl">{title}</h2>
      {message ? <p className="mt-2 max-w-sm text-sm text-ink-muted">{message}</p> : null}
      {children ? <div className="mt-6 flex flex-wrap items-center justify-center gap-2">{children}</div> : null}
    </div>
  </div>
);

export default EmptyState;
