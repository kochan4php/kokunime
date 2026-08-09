import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kokunime",
    short_name: "Kokunime",
    description: "Download anime batch dan episode dengan subtitle Indonesia.",
    start_url: "/",
    display: "standalone",
    background_color: "#201613",
    theme_color: "#201613",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
