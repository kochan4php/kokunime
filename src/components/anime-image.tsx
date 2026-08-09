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
  ...props
}: AnimeImageProps): JSX.Element => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-surface-muted ${containerClassName}`}>
      <Image
        src={src}
        alt={alt ?? ""}
        unoptimized={isGif(typeof src === "string" ? src : undefined)}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        onError={(e) => {
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
