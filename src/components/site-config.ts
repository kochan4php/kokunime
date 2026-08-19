export interface SiteLink {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  description?: string;
}

export const siteLinks: SiteLink[] = [
  { label: "Beranda", href: "/", icon: "🏠", description: "Update anime terbaru" },
  { label: "Genre", href: "/genres", icon: "🎭", badge: "50+", description: "Kategori & tema" },
  { label: "Musim", href: "/seasons", icon: "📅", description: "Jadwal & arsip musim" },
  { label: "Bookmark", href: "/bookmarks", icon: "🔖", description: "Koleksi tersimpan" },
  { label: "Bandingkan", href: "/compare", icon: "⚖️", description: "Komparasi spek anime" },
  { label: "Pengaturan", href: "/settings", icon: "⚙️", description: "Tema, mode & preferensi" },
];
