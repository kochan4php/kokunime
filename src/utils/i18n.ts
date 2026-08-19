"use client";

import { useSyncExternalStore } from "react";

export type AppLanguage = "id" | "en";

export const LANG_STORAGE_KEY = "kokunime_lang";
export const LANG_CHANGE_EVENT = "kokunime:lang_change";

export const DICTIONARY = {
  id: {
    // Navigation
    "nav.home": "Beranda",
    "nav.seasons": "Musim",
    "nav.genres": "Genre",
    "nav.bookmarks": "Tersimpan",
    "nav.compare": "Komparasi",
    "nav.api": "REST API",
    "nav.settings": "Pengaturan",
    "nav.random": "Acak",
    "nav.search_placeholder": "Cari anime, genre, atau musim...",
    "nav.search_shortcut": "Tekan / untuk cari",
    "nav.open_menu": "Menu Navigasi",
    "nav.close_menu": "Tutup Menu",
    "nav.random_anime": "Anime Acak",

    // Common Badges & Actions
    "common.ongoing": "Ongoing",
    "common.completed": "Tamat",
    "common.episode": "Episode",
    "common.score": "Skor",
    "common.detail": "Detail",
    "common.view_all": "Lihat Semua",
    "common.catalog": "Katalog",
    "common.back": "Kembali",
    "common.loading": "Memuat...",
    "common.search": "Cari",
    "common.clear": "Hapus",
    "common.share": "Bagikan",
    "common.copied": "Disalin!",
    "common.filter": "Filter",
    "common.all": "Semua",
    "common.apply": "Terapkan",
    "common.cancel": "Batal",
    "common.close": "Tutup",
    "common.save": "Simpan",
    "common.download": "Unduh",
    "common.pro": "Pro",

    // Settings Page
    "settings.hub": "Pusat Kontrol & Preferensi",
    "settings.title": "Pengaturan Aplikasi",
    "settings.subtitle": "Kustomisasi tema tampilan, bahasa aplikasi, palet warna aksen, tipografi font, preferensi katalog, dan kelola backup penyimpanan lokal Anda secara terpusat.",
    "settings.export_backup": "Ekspor Backup",
    "settings.reset_default": "Reset ke Bawaan",
    "settings.live_preview": "Live Preview Antarmuka",
    "settings.preview_desc": "Perubahan bahasa, tema, warna aksen, dan gaya font langsung diterapkan secara instan ke seluruh antarmuka aplikasi.",

    // Language Settings Section
    "settings.language_title": "Bahasa Aplikasi (Language)",
    "settings.language_desc": "Pilih bahasa tampilan untuk navigasi, menu, badge, dan kontrol antarmuka.",
    "settings.lang_id_title": "Bahasa Indonesia",
    "settings.lang_id_desc": "Tampilan, navigasi, dan label dalam Bahasa Indonesia",
    "settings.lang_en_title": "English (International)",
    "settings.lang_en_desc": "English navigation, menus, badges, and controls",

    // Theme & Appearance
    "settings.theme_title": "Tema & Warna Antarmuka",
    "settings.theme_desc": "Pilih mode tampilan gelap/terang dan palet warna aksen favorit.",
    "settings.theme_system": "Otomatis (OS)",
    "settings.theme_system_desc": "Ikuti sistem perangkat",
    "settings.theme_light": "Terang (Light)",
    "settings.theme_light_desc": "Cerah & bersih",
    "settings.theme_dark": "Gelap (Dark)",
    "settings.theme_dark_desc": "Hangat khas Kokunime",
    "settings.theme_oled": "AMOLED Black",
    "settings.theme_oled_desc": "Hitam murni (#000000)",

    "settings.accent_palette": "Palet Warna Aksen Utama",
    "settings.night_shift": "Night Shift",
    "settings.night_shift_desc": "Filter peredup mata hangat",
    "settings.glassmorphism": "Glassmorphism",
    "settings.glassmorphism_desc": "Efek kaca frosted blur",
    "settings.reduce_motion": "Hemat Animasi",
    "settings.reduce_motion_desc": "Matikan animasi dekoratif",

    // Typography
    "settings.typography_title": "Tipografi & Mode Baca",
    "settings.typography_desc": "Sesuaikan font, ukuran huruf, dan filter kenyamanan mata.",
    "settings.text_scale": "Skala Ukuran Teks",
    "settings.scale_compact": "Kompak (90%)",
    "settings.scale_normal": "Normal (100%)",
    "settings.scale_large": "Besar (110%)",
    "settings.reading_mode": "Filter Membaca Sinopsis",
    "settings.reading_none": "Normal",
    "settings.reading_sepia": "📖 Sepia Hangat",
    "settings.reading_high_contrast": "👁️ Kontras Tinggi",

    // Catalog & Content
    "settings.catalog_pref": "Preferensi Katalog & Konten",
    "settings.catalog_desc": "Atur tata letak default katalog, tampilan unduhan, dan opsi filter konten.",
    "settings.default_view": "Tampilan Katalog",
    "settings.download_layout": "Tata Letak Unduhan",
    "settings.download_layout_desc": "Format default tampilan link unduhan anime",
    "settings.layout_cards": "🗂️ Kartu",
    "settings.layout_matrix": "📊 Matriks",
    "settings.data_saver": "Mode Hemat Data",
    "settings.data_saver_desc": "Hemat kuota & batasi media",
    "settings.hide_spoilers": "Lindungi Spoiler",
    "settings.hide_spoilers_desc": "Tutup sinopsis awal",

    // Storage & Backup
    "settings.storage_title": "Penyimpanan & Backup",
    "settings.storage_desc": "Kelola data lokal di perangkat Anda.",
    "settings.total_storage": "Total Memori Terpakai",
    "settings.bookmarks": "Bookmark",
    "settings.history": "Riwayat Nonton",
    "settings.search_history": "Riwayat Cari",
    "settings.saved_settings": "Pengaturan",
    "settings.download_json": "Unduh Backup JSON",
    "settings.restore_json": "Pulihkan dari File JSON",
    "settings.data_cleaning": "Pembersihan Data",
    "settings.clear_searches": "Hapus Pencarian",
    "settings.clear_history": "Hapus Riwayat",

    // System Info
    "settings.system_info": "Informasi Sistem",
    "settings.system_desc": "Spesifikasi aplikasi & status runtime.",
    "settings.framework": "Framework",
    "settings.render_engine": "Engine Render",
    "settings.offline_app": "Aplikasi Offline",
    "settings.pwa_ready": "PWA Ready (SW Active)",

    // Compare Page
    "compare.title": "Perbandingan Anime Side-by-Side",
    "compare.subtitle": "Pilih dan bandingkan dua anime secara berdampingan untuk menganalisis perbedaan skor MyAnimeList, studio produksi, total episode, durasi tayang, genre unik, dan sinopsis secara instan.",
    "compare.select_header": "Pilih 2 Anime untuk Dibandingkan",
    "compare.anime_a": "Anime Pertama (A)",
    "compare.anime_b": "Anime Kedua (B)",
    "compare.placeholder_a": "Ketik judul anime A (contoh: Naruto, Frieren, Jujutsu...)",
    "compare.placeholder_b": "Ketik judul anime B (contoh: Bleach, Demon Slayer, Solo Leveling...)",
    "compare.quick_examples": "Contoh Cepat:",
    "compare.swap": "Tukar Posisi",
    "compare.share": "Bagikan Komparasi",
    "compare.open_detail_a": "Buka Detail Anime A →",
    "compare.open_detail_b": "Buka Detail Anime B →",
    "compare.spec_parameter": "Parameter Spesifikasi",
    "compare.score_rating": "Skor Rating",
    "compare.higher_score": "🏆 Lebih Tinggi",
    "compare.total_episodes": "Total Episode",
    "compare.more_episodes": "Ep Lebih Banyak",
    "compare.duration": "Durasi per Episode",
    "compare.studio": "Studio Animasi",
    "compare.type": "Tipe Tayang",
    "compare.release": "Musim & Tahun Rilis",
    "compare.status": "Status Tayang",
    "compare.genre_analysis": "Analisis Kategori & Genre",
    "compare.shared_genres": "Genre yang Dimiliki Keduanya",
    "compare.unique_genres_a": "Genre Unik Anime A",
    "compare.unique_genres_b": "Genre Unik Anime B",
    "compare.no_exclusive": "Tidak ada genre eksklusif",
    "compare.synopsis_a": "Sinopsis Anime A",
    "compare.synopsis_b": "Sinopsis Anime B",
    "compare.loading_msg": "Sedang Mengambil Metadata Komparasi Anime...",
    "compare.empty_prompt": "Pilih Dua Anime di Atas untuk Memulai Komparasi",

    // Bookmarks Page
    "bookmarks.title": "Koleksi & Riwayat Tersimpan",
    "bookmarks.tab_saved": "Tersimpan",
    "bookmarks.tab_history": "Riwayat Tonton",
    "bookmarks.search_collection": "Cari koleksi...",
    "bookmarks.empty_saved": "Belum ada anime yang tersimpan di bookmark.",
    "bookmarks.empty_history": "Belum ada riwayat anime yang ditonton.",
    "bookmarks.clear_all": "Hapus Semua",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.seasons": "Seasons",
    "nav.genres": "Genres",
    "nav.bookmarks": "Bookmarks",
    "nav.compare": "Compare",
    "nav.api": "REST API",
    "nav.settings": "Settings",
    "nav.random": "Random",
    "nav.search_placeholder": "Search anime, genre, or season...",
    "nav.search_shortcut": "Press / to search",
    "nav.open_menu": "Navigation Menu",
    "nav.close_menu": "Close Menu",
    "nav.random_anime": "Random Anime",

    // Common Badges & Actions
    "common.ongoing": "Ongoing",
    "common.completed": "Completed",
    "common.episode": "Episode",
    "common.score": "Score",
    "common.detail": "Details",
    "common.view_all": "View All",
    "common.catalog": "Catalog",
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.search": "Search",
    "common.clear": "Clear",
    "common.share": "Share",
    "common.copied": "Copied!",
    "common.filter": "Filter",
    "common.all": "All",
    "common.apply": "Apply",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.save": "Save",
    "common.download": "Download",
    "common.pro": "Pro",

    // Settings Page
    "settings.hub": "Control Center & Preferences",
    "settings.title": "App Settings",
    "settings.subtitle": "Customize appearance themes, app language, accent palettes, typography fonts, catalog preferences, and manage your local data backups in one place.",
    "settings.export_backup": "Export Backup",
    "settings.reset_default": "Reset to Default",
    "settings.live_preview": "Live Interface Preview",
    "settings.preview_desc": "Changes to language, theme, accent colors, and font styles are applied instantly across the entire application interface.",

    // Language Settings Section
    "settings.language_title": "App Language",
    "settings.language_desc": "Choose your preferred application display language for navigation, menus, badges, and controls.",
    "settings.lang_id_title": "Bahasa Indonesia",
    "settings.lang_id_desc": "Display, navigation, and labels in Indonesian",
    "settings.lang_en_title": "English (International)",
    "settings.lang_en_desc": "English navigation, menus, badges, and controls",

    // Theme & Appearance
    "settings.theme_title": "Theme & Appearance",
    "settings.theme_desc": "Select dark/light mode and your preferred primary accent color.",
    "settings.theme_system": "System (OS)",
    "settings.theme_system_desc": "Follow device appearance",
    "settings.theme_light": "Light Mode",
    "settings.theme_light_desc": "Bright & clean",
    "settings.theme_dark": "Dark Mode",
    "settings.theme_dark_desc": "Signature Kokunime dark",
    "settings.theme_oled": "AMOLED Black",
    "settings.theme_oled_desc": "True pitch black (#000000)",

    "settings.accent_palette": "Primary Accent Palette",
    "settings.night_shift": "Night Shift",
    "settings.night_shift_desc": "Warm eye-comfort filter",
    "settings.glassmorphism": "Glassmorphism",
    "settings.glassmorphism_desc": "Frosted glass blur effect",
    "settings.reduce_motion": "Reduce Motion",
    "settings.reduce_motion_desc": "Disable decorative animations",

    // Typography
    "settings.typography_title": "Typography & Reading Mode",
    "settings.typography_desc": "Customize font family, font size scaling, and reading comfort filters.",
    "settings.text_scale": "Text Size Scale",
    "settings.scale_compact": "Compact (90%)",
    "settings.scale_normal": "Normal (100%)",
    "settings.scale_large": "Large (110%)",
    "settings.reading_mode": "Synopsis Reading Filter",
    "settings.reading_none": "Normal",
    "settings.reading_sepia": "📖 Warm Sepia",
    "settings.reading_high_contrast": "👁️ High Contrast",

    // Catalog & Content
    "settings.catalog_pref": "Catalog & Content Preferences",
    "settings.catalog_desc": "Set default catalog layout, download view, and content filter options.",
    "settings.default_view": "Catalog View",
    "settings.download_layout": "Download Layout",
    "settings.download_layout_desc": "Default download link format for anime",
    "settings.layout_cards": "🗂️ Cards",
    "settings.layout_matrix": "📊 Matrix",
    "settings.data_saver": "Data Saver Mode",
    "settings.data_saver_desc": "Save bandwidth & limit media",
    "settings.hide_spoilers": "Hide Spoilers",
    "settings.hide_spoilers_desc": "Collapse initial synopses",

    // Storage & Backup
    "settings.storage_title": "Storage & Backup",
    "settings.storage_desc": "Manage local browser storage on your device.",
    "settings.total_storage": "Total Storage Used",
    "settings.bookmarks": "Bookmarks",
    "settings.history": "Watch History",
    "settings.search_history": "Search History",
    "settings.saved_settings": "Settings",
    "settings.download_json": "Download Backup JSON",
    "settings.restore_json": "Restore from JSON File",
    "settings.data_cleaning": "Data Management",
    "settings.clear_searches": "Clear Search History",
    "settings.clear_history": "Clear Watch History",

    // System Info
    "settings.system_info": "System Information",
    "settings.system_desc": "Application specifications & runtime status.",
    "settings.framework": "Framework",
    "settings.render_engine": "Render Engine",
    "settings.offline_app": "Offline App",
    "settings.pwa_ready": "PWA Ready (SW Active)",

    // Compare Page
    "compare.title": "Side-by-Side Anime Comparison",
    "compare.subtitle": "Select and compare two anime side-by-side to analyze differences in MyAnimeList scores, animation studios, total episodes, duration, unique genres, and synopses instantly.",
    "compare.select_header": "Select 2 Anime to Compare",
    "compare.anime_a": "First Anime (A)",
    "compare.anime_b": "Second Anime (B)",
    "compare.placeholder_a": "Type title for Anime A (e.g. Naruto, Frieren, Jujutsu...)",
    "compare.placeholder_b": "Type title for Anime B (e.g. Bleach, Demon Slayer, Solo Leveling...)",
    "compare.quick_examples": "Quick Examples:",
    "compare.swap": "Swap Positions",
    "compare.share": "Share Comparison",
    "compare.open_detail_a": "Open Anime A Details →",
    "compare.open_detail_b": "Open Anime B Details →",
    "compare.spec_parameter": "Specification Criteria",
    "compare.score_rating": "Rating Score",
    "compare.higher_score": "🏆 Higher Score",
    "compare.total_episodes": "Total Episodes",
    "compare.more_episodes": "More Episodes",
    "compare.duration": "Episode Duration",
    "compare.studio": "Animation Studio",
    "compare.type": "Broadcast Type",
    "compare.release": "Season & Release Year",
    "compare.status": "Air Status",
    "compare.genre_analysis": "Category & Genre Analysis",
    "compare.shared_genres": "Shared Genres",
    "compare.unique_genres_a": "Unique to Anime A",
    "compare.unique_genres_b": "Unique to Anime B",
    "compare.no_exclusive": "No exclusive genres",
    "compare.synopsis_a": "Anime A Synopsis",
    "compare.synopsis_b": "Anime B Synopsis",
    "compare.loading_msg": "Fetching Anime Comparison Metadata...",
    "compare.empty_prompt": "Select Two Anime Above to Start Comparison",

    // Bookmarks Page
    "bookmarks.title": "Saved Collection & Watch History",
    "bookmarks.tab_saved": "Saved",
    "bookmarks.tab_history": "Watch History",
    "bookmarks.search_collection": "Search collection...",
    "bookmarks.empty_saved": "No anime saved in bookmarks yet.",
    "bookmarks.empty_history": "No watched anime history recorded yet.",
    "bookmarks.clear_all": "Clear All",
  },
} as const;

export type TranslationKey = keyof typeof DICTIONARY.id;

export function getStoredLanguage(): AppLanguage {
  if (typeof window === "undefined") return "id";
  try {
    const direct = localStorage.getItem(LANG_STORAGE_KEY) as AppLanguage;
    if (direct === "en" || direct === "id") return direct;

    const userSettings = localStorage.getItem("kokunime_user_settings");
    if (userSettings) {
      const parsed = JSON.parse(userSettings);
      if (parsed.language === "en" || parsed.language === "id") return parsed.language;
    }
  } catch {}
  return "id";
}

export function setStoredLanguage(lang: AppLanguage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    // Sync with kokunime_user_settings
    try {
      const existing = JSON.parse(localStorage.getItem("kokunime_user_settings") || "{}");
      localStorage.setItem("kokunime_user_settings", JSON.stringify({ ...existing, language: lang }));
    } catch {}

    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: { language: lang } }));
    window.dispatchEvent(new Event("storage"));
  } catch {}
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(LANG_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANG_CHANGE_EVENT, callback);
  };
}

export function useTranslation() {
  const language = useSyncExternalStore(subscribe, getStoredLanguage, () => "id" as AppLanguage);

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = DICTIONARY[language] || DICTIONARY.id;
    return (dict as Record<string, string>)[key] || (DICTIONARY.id as Record<string, string>)[key] || fallback || key;
  };

  return { language, setLanguage: setStoredLanguage, t };
}
