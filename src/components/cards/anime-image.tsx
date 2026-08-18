"use client";

import { JSX, useState } from "react";
import Image, { ImageProps } from "next/image";
import isGif from "@/utils/is-gif";

interface AnimeImageProps extends ImageProps {
  containerClassName?: string;
}

const AnimeImage = ({
  containerClassName = "",
  src,
  alt,
  className = "",
  onLoad,
  onError,
  priority,
  loading,
  ...props
}: AnimeImageProps): JSX.Element => {
  const [loaded, setLoaded] = useState(!!priority || loading === "eager");
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center bg-surface-muted p-4 text-center ${containerClassName}`}>
        <div className="flex flex-col items-center text-ink-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 opacity-40"
            aria-hidden="true"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span className="mt-2 line-clamp-1 font-mono text-[10px] opacity-60">Kokunime</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden bg-surface-muted ${containerClassName}`}>
      <Image
        src={src}
        alt={alt ?? ""}
        priority={priority}
        loading={loading}
        unoptimized={isGif(typeof src === "string" ? src : undefined)}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
          setHasError(true);
          setLoaded(true);
          onError?.(e);
        }}
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        {...props}
      />
      <div
        className={`skeleton absolute inset-0 transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
      />
    </div>
  );
};

export default AnimeImage;
