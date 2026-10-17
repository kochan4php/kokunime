import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kokunime",
    short_name: "Kokunime",
    description: "Download anime batch dan episode dengan subtitle Indonesia.",
    lang: "id",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf5eb",
    theme_color: "#fdf5eb",
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
        name: "Anime Acak",
        short_name: "Acak",
        description: "Buka anime acak",
        url: "/api/random",
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
