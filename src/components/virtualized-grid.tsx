"use client";

import { JSX, ReactNode, useState } from "react";

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  chunkSize?: number;
  className?: string;
}

export function VirtualizedGrid<T>({
  items,
  renderItem,
  chunkSize = 12,
  className = "grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5",
}: VirtualizedGridProps<T>): JSX.Element {
  const [expandedCount, setExpandedCount] = useState(0);

  const visibleCount = chunkSize + expandedCount;
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <div>
      <div className={className}>{visibleItems.map((item, index) => renderItem(item, index))}</div>
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setExpandedCount((prev) => prev + chunkSize)}
            className="rounded-sm border-2 border-border bg-surface px-5 py-2 font-display text-xs font-bold text-ink shadow-[2px_2px_0_0_var(--border)] hover:-translate-y-0.5 hover:text-accent transition-all active:translate-y-0 active:shadow-none cursor-pointer"
          >
            Muat Lebih Banyak ({items.length - visibleCount} anime tersisa) ↓
          </button>
        </div>
      )}
    </div>
  );
}
