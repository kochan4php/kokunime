"use client";

import Reveal from "@/components/reveal";
import { AnimeDetail } from "@/interfaces";
import ReadingFocusMode from "./reading-focus-mode";
import { JSX, useEffect, useState } from "react";

const Synopsis = ({ anime }: { anime: AnimeDetail }): JSX.Element => {
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [copied, setCopied] = useState(false);

  const fontClass = {
    sm: "text-[13px] leading-relaxed",
    base: "text-[15px] leading-loose",
    lg: "text-[17px] leading-loose",
  }[fontSize];

  const synopsis = anime.synopsis || "Tidak ada sinopsis.";
  const isLong = synopsis.length > 280;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleTTS = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(synopsis);
    utterance.lang = "id-ID";
    utterance.rate = ttsSpeed;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const copySynopsis = async () => {
    try {
      await navigator.clipboard.writeText(synopsis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Reveal>
      <div className="card-shell">
        <div className="card-core p-7 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip">Sinopsis</span>
              <button
                type="button"
                onClick={toggleTTS}
                title={isPlaying ? "Hentikan audio sinopsis" : "Dengarkan sinopsis (Text-to-Speech)"}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                  isPlaying
                    ? "border-accent bg-accent text-(--accent-ink) animate-pulse"
                    : "border-border bg-surface text-ink-muted hover:border-accent hover:text-ink"
                }`}
              >
                <span>{isPlaying ? "⏹ Hentikan" : "🔊 Dengarkan"}</span>
              </button>

              {/* Speed selector */}
              <div className="flex items-center rounded-full border border-border bg-surface p-0.5 font-mono text-[10px]">
                {[0.75, 1.0, 1.25, 1.5].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => {
                      setTtsSpeed(speed);
                      if (isPlaying) {
                        window.speechSynthesis.cancel();
                        setIsPlaying(false);
                      }
                    }}
                    title={`Kecepatan suara ${speed}x`}
                    className={`rounded-full px-1.5 py-0.2 transition-colors cursor-pointer ${
                      ttsSpeed === speed ? "bg-accent font-bold text-(--accent-ink)" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Font size zoomer */}
              <div className="flex items-center rounded-full border border-border bg-surface p-0.5 font-mono text-[10px]">
                <button
                  type="button"
                  onClick={() => setFontSize(fontSize === "lg" ? "base" : "sm")}
                  title="Perkecil ukuran font sinopsis"
                  className={`rounded-full px-1.5 py-0.2 transition-colors cursor-pointer ${
                    fontSize === "sm" ? "bg-accent/20 font-bold text-accent" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => setFontSize(fontSize === "sm" ? "base" : "lg")}
                  title="Perbesar ukuran font sinopsis"
                  className={`rounded-full px-1.5 py-0.2 transition-colors cursor-pointer ${
                    fontSize === "lg" ? "bg-accent/20 font-bold text-accent" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  A+
                </button>
              </div>

              <button
                type="button"
                onClick={copySynopsis}
                title="Salin teks sinopsis"
                className="rounded-full border border-border bg-surface px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink-muted transition-all hover:border-accent hover:text-ink cursor-pointer"
              >
                {copied ? "✓ Tersalin" : "📋 Salin"}
              </button>

              <ReadingFocusMode synopsis={synopsis} title={anime.title ?? "Anime"} />
            </div>

            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((prev) => !prev)}
                className="font-mono text-xs font-semibold text-accent hover:underline cursor-pointer"
              >
                {expanded ? "Ringkas ↑" : "Baca Selengkapnya ↓"}
              </button>
            )}
          </div>
          <p
            className={`mt-5 text-ink-muted transition-all duration-300 ${fontClass} ${
              isLong && !expanded ? "line-clamp-4" : ""
            }`}
          >
            {synopsis}
          </p>
        </div>
      </div>
    </Reveal>
  );
};

export default Synopsis;
