export async function registerBackgroundSync(tag = "sync-anime-bookmarks"): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if ("sync" in registration) {
      await (registration as any).sync.register(tag);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
