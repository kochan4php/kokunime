"use client";

import { JSX, useRef, useState } from "react";

interface Html5VideoPlayerProps {
  src: string;
  poster?: string;
  title: string;
}

export const Html5VideoPlayer = ({ src, poster, title }: Html5VideoPlayerProps): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-black shadow-xl">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        className="w-full aspect-video object-contain"
      />
      <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2 text-xs font-mono text-ink-muted">
        <span className="font-semibold text-ink truncate max-w-[200px]">{title}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px]">Kecepatan:</span>
          {[0.75, 1, 1.25, 1.5, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => changeSpeed(s)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold cursor-pointer transition-colors ${
                playbackSpeed === s ? "bg-accent text-(--accent-ink)" : "bg-surface-muted hover:text-ink"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
