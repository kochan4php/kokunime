import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kokunime",
    short_name: "Kokunime",
    description: "Download anime batch dan episode dengan subtitle Indonesia.",
    lang: "id",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    launch_handler: { client_mode: "navigate-existing" },
    orientation: "any",
    background_color: "#fdf5eb",
    theme_color: "#fdf5eb",
    categories: ["entertainment", "video"],
    prefer_related_applications: false,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    share_target: {
      action: "/share",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
    shortcuts: [
      {
        name: "Anime Tersimpan",
        short_name: "Tersimpan",
        description: "Buka daftar anime yang Anda bookmark",
        url: "/bookmarks",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Update Terbaru",
        short_name: "Update",
        description: "Lihat rilis terbaru hari ini",
        url: "/update",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Katalog Genre",
        short_name: "Genre",
        description: "Jelajahi anime berdasarkan genre",
        url: "/genres",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
