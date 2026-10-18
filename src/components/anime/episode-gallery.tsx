"use client";

import { JSX, useState } from "react";
import Image from "next/image";

interface EpisodeGalleryProps {
  title: string;
  posterImage: string;
}

export const EpisodeGallery = ({ title, posterImage }: EpisodeGalleryProps): JSX.Element => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Generate responsive aspect preview frames based on anime image
  const previewItems = [
    { label: "Episode Preview 1", src: posterImage },
    { label: "Episode Preview 2", src: posterImage },
    { label: "Episode Preview 3", src: posterImage },
  ];

  return (
    <div className="mt-8 rounded-sm border-2 border-border bg-surface p-4 sm:p-5 shadow-[2px_2px_0_0_var(--border)]">
      <div className="flex items-center justify-between border-b-2 border-border pb-3">
        <h3 className="font-display text-sm font-bold text-ink">📸 Cuplikan Tangkapan Layar Episode</h3>
        <span className="font-mono text-xs text-ink-muted">Galeri Visual</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
        {previewItems.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedImage(item.src)}
            className="group relative aspect-video overflow-hidden rounded-sm border-2 border-border bg-surface-muted cursor-pointer"
          >
            <Image
              src={item.src}
              alt={`${title} Screenshot ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-nb-ink bg-nb-yellow px-2 py-0.5 rounded-sm border-2 border-border">
                🔍 Perbesar
              </span>
            </div>
          </button>
        ))}
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in"
        >
          <div className="relative max-w-2xl w-full aspect-video rounded-sm overflow-hidden border-[3px] border-nb-cream">
            <Image
              src={selectedImage}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 rounded-sm border-2 border-border bg-nb-yellow px-2.5 py-1 text-xs font-bold text-nb-ink cursor-pointer"
            >
              ✕ Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
