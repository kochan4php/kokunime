// Every localStorage/sessionStorage key this app owns, in one place so renames
// and "reset all data" cannot drift apart.
export const STORAGE_KEYS = {
  accent: "kokunime_accent",
  bookmarks: "kokunime_bookmarks",
  font: "kokunime_font",
  lang: "kokunime_lang",
  nightShift: "kokunime_night_shift",
  userSettings: "kokunime_user_settings",
  watchHistory: "kokunime_watch_history",
  recentSearches: "kokunime_recent_searches",
  settingsChanged: "kokunime_settings_changed",
  releaseUnread: "kokunime_release_unread",
  releaseSeen: "kokunime_release_seen",
  pwaDismissed: "kokunime_pwa_dismissed",
  progress: "kokunime_progress",
  history: "kokunime_history",
  adminToken: "kokunime_admin_token",
} as const;
