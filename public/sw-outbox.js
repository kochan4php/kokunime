// Offline action outbox, imported by sw.js via importScripts. Classic worker
// script (no modules): the IIFE keeps these names out of the shared worker
// scope and exposes only { enqueueRequest, flushOutbox } on self.
//
// track-view pings that failed offline queue here and replay via the
// "kokunime-flush-queue" sync tag (fallback: an explicit flush message from
// the page when it comes back online).
(() => {
  const OUTBOX_DB = "kokunime-outbox";
  const OUTBOX_STORE = "requests";

  const openOutbox = () =>
    new Promise((resolve, reject) => {
      const request = indexedDB.open(OUTBOX_DB, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(OUTBOX_STORE)) {
          request.result.createObjectStore(OUTBOX_STORE, { autoIncrement: true });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

  const enqueueRequest = async (item) => {
    const db = await openOutbox();
    try {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(OUTBOX_STORE, "readwrite");
        tx.objectStore(OUTBOX_STORE).add(item);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } finally {
      db.close();
    }
  };

  const flushOutbox = async () => {
    const db = await openOutbox();
    try {
      const items = await new Promise((resolve, reject) => {
        const store = db.transaction(OUTBOX_STORE, "readonly").objectStore(OUTBOX_STORE);
        const values = store.getAll();
        const keys = store.getAllKeys();
        values.transaction.oncomplete = () =>
          resolve(values.result.map((value, index) => ({ key: keys.result[index], value })));
        values.transaction.onerror = () => reject(values.transaction.error);
      });

      let flushed = 0;
      for (const item of items) {
        try {
          const response = await fetch(item.value.url, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(item.value.body),
          });
          if (!response.ok) continue;
        } catch {
          break; // Still offline — keep the rest for the next sync.
        }
        await new Promise((resolve) => {
          const tx = db.transaction(OUTBOX_STORE, "readwrite");
          tx.objectStore(OUTBOX_STORE).delete(item.key);
          tx.oncomplete = resolve;
          tx.onerror = resolve;
        });
        flushed++;
      }
      return flushed;
    } finally {
      db.close();
    }
  };

  self.kokunimeOutbox = { enqueueRequest, flushOutbox };
})();
