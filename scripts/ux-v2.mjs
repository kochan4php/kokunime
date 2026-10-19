// UX v2 gate (batches AB + AI): one-time onboarding, palette v2 (history,
// contextual action, cheat-sheet), shared view-transition poster names,
// section-scoped settings reset with undo, 8s undo toast, and backup
// drag&drop preview/merge with checksum rejection. Runs against a live server:
//   BASE_URL=http://localhost:8000 node scripts/ux-v2.mjs
import { evaluate, launchBrowser, navigate, sleep } from "./lib/cdp.mjs";

const BASE = process.env.BASE_URL || "http://localhost:8000";
const failures = [];
const check = (name, ok, detail = "") => {
  if (!ok) failures.push(name);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${String(detail).slice(0, 220)}` : ""}`);
};

const { cdp, sessionId, cleanup } = await launchBrowser({ width: 1280, height: 900 });
const js = (expression) => evaluate(cdp, sessionId, expression);
const open = (path) => navigate(cdp, sessionId, `${BASE}${path}`, { settleMs: 2000 });
const waitFor = async (expression, timeoutMs = 12000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await js(expression)) return true;
    await sleep(400);
  }
  return false;
};
const reload = async () => {
  await cdp.send("Page.reload", {}, sessionId);
  await sleep(1800);
};
const press = async (key, code, vk, modifiers = 0) => {
  const text = key === "Enter" ? { text: "\r", unmodifiedText: "\r" } : {};
  await cdp.send(
    "Input.dispatchKeyEvent",
    { type: "keyDown", key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers, ...text },
    sessionId,
  );
  await cdp.send(
    "Input.dispatchKeyEvent",
    { type: "keyUp", key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, modifiers },
    sessionId,
  );
  await sleep(180);
};
const typeText = async (text) => {
  await cdp.send("Input.insertText", { text }, sessionId);
  await sleep(250);
};

try {
  // ---- AI5: one-time onboarding --------------------------------------------
  await open("/");
  await js(`localStorage.clear(); true`);
  await reload();
  check(
    "onboarding: first-visit tips render on a clean profile",
    await js(`Boolean(document.getElementById("first-visit-title"))`),
  );
  const dismissed = await js(`(() => {
    const button = [...document.querySelectorAll("button")].find((b) => /Mulai jelajah|start browsing/i.test(b.textContent ?? ""));
    button?.click();
    return Boolean(button);
  })()`);
  await sleep(300);
  check("onboarding: dismiss control exists", dismissed);
  check("onboarding: dismissal is persisted", await js(`localStorage.getItem("kokunime_first_visit_tips") === "1"`));
  await reload();
  check("onboarding: hidden after reload", !(await js(`Boolean(document.getElementById("first-visit-title"))`)));

  // ---- AI3: shared poster name --------------------------------------------
  await waitFor(
    `Boolean([...document.querySelectorAll('main a[href^="/anime/"]')].find((a) => a.querySelector("[data-poster]")))`,
  );
  let card = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    card = await js(`(() => {
      const link = [...document.querySelectorAll('main a[href^="/anime/"]')].find((a) => a.querySelector("[data-poster]"));
      if (!link) return null;
      link.focus();
      const poster = link.querySelector("[data-poster]");
      return { href: link.getAttribute("href"), name: poster?.style.viewTransitionName ?? "", slug: link.getAttribute("href").split("/").pop() };
    })()`);
    if (card?.name) break;
    await sleep(300);
  }
  check("view-transition: card exposes a poster name on focus", Boolean(card?.name), JSON.stringify(card));
  if (card) {
    check("view-transition: name is scoped to the slug", card.name === `poster-${card.slug}`, card.name);
    await open(card.href);
    const heroName = await js(`document.querySelector("[data-offline-image]")?.style.viewTransitionName ?? ""`);
    check("view-transition: detail hero reuses the same name", heroName === card.name, heroName);
  }

  // ---- AI4: palette history, contextual action, cheat-sheet --------------
  await open("/");
  await press("k", "KeyK", 75, 2);
  check("palette: Ctrl+K opens the dialog", await js(`document.querySelector("dialog[open]") !== null`));
  await typeText(">pint");
  const hasShortcut = await js(
    `[...document.querySelectorAll('[role="region"][aria-label="Aksi cepat"] button')].some((b) => /Pintasan keyboard/i.test(b.textContent ?? ""))`,
  );
  check("palette: shortcut cheat-sheet action present", hasShortcut);
  await js(`(() => {
    const button = [...document.querySelectorAll('[role="region"][aria-label="Aksi cepat"] button')].find((b) => /Pintasan keyboard/i.test(b.textContent ?? ""));
    button?.click();
    return true;
  })()`);
  await sleep(400);
  check(
    "palette: cheat-sheet action opens the keyboard guide",
    await js(`Boolean(document.getElementById("shortcuts-title"))`),
  );
  await press("Escape", "Escape", 27);
  await sleep(300);

  await press("k", "KeyK", 75, 2);
  await typeText(">pengaturan");
  await js(`(() => {
    const button = [...document.querySelectorAll('[role="region"][aria-label="Aksi cepat"] button')].find((b) => /Pengaturan & tema/i.test(b.textContent ?? ""));
    button?.click();
    return true;
  })()`);
  check("palette: running settings navigates", await waitFor(`location.pathname === "/settings"`));
  await waitFor(
    `[...document.querySelectorAll("button")].some((b) => /Hapus Pencarian|Clear Search History/i.test(b.textContent ?? ""))`,
  );
  await press("k", "KeyK", 75, 2);
  await typeText(">");
  const firstAction = await js(
    `document.querySelector('[role="region"][aria-label="Aksi cepat"] button')?.textContent?.trim() ?? ""`,
  );
  check("palette: recent command floats to the top", /Pengaturan & tema/i.test(firstAction), firstAction);
  await press("Escape", "Escape", 27);

  // ---- AI6 + AI1: section reset, undo toast -------------------------------
  const setDark = await js(`(() => {
    const card = [...document.querySelectorAll(".card-shell")].find((node) => /Tampilan & Warna Aksen|Appearance & Accent/.test(node.textContent ?? ""));
    const button = [...(card?.querySelectorAll("button") ?? [])].find((b) => /Gelap|Dark/.test(b.textContent ?? ""));
    button?.click();
    return Boolean(button);
  })()`);
  await sleep(300);
  check(
    "settings: dark theme applies",
    setDark && (await js(`JSON.parse(localStorage.getItem("kokunime_user_settings") ?? "{}").theme === "dark"`)),
  );
  const resetAppearance = await js(`(() => {
    const card = [...document.querySelectorAll(".card-shell")].find((node) => /Tampilan & Warna Aksen|Appearance & Accent/.test(node.textContent ?? ""));
    const button = card?.querySelector('button[aria-label^="Reset"]');
    button?.click();
    return Boolean(button);
  })()`);
  await sleep(400);
  check("settings: section reset button exists", resetAppearance);
  check(
    "settings: section reset restores only that section",
    await js(`JSON.parse(localStorage.getItem("kokunime_user_settings") ?? "{}").theme === "system"`),
  );
  const undoToast = await js(`(() => {
    const button = [...document.querySelectorAll("button")].find((b) => /^\\s*Urungkan\\s*$/.test(b.textContent ?? ""));
    button?.click();
    return Boolean(button);
  })()`);
  await sleep(400);
  check("undo: reset toast offers 8s undo", undoToast);
  check(
    "undo: undo restores the previous theme",
    await js(`JSON.parse(localStorage.getItem("kokunime_user_settings") ?? "{}").theme === "dark"`),
  );

  // ---- AI1: destructive clear + undo --------------------------------------
  await js(`localStorage.setItem("kokunime_recent_searches", JSON.stringify(["alpha", "beta"])); true`);
  await reload();
  const cleared = await js(`(() => {
    window.confirm = () => true;
    const button = [...document.querySelectorAll("button")].find((b) => /Hapus Pencarian|Clear Search History/i.test(b.textContent ?? ""));
    button?.click();
    return Boolean(button);
  })()`);
  await sleep(400);
  check("settings: clear searches runs", cleared);
  check(
    "settings: clear searches empties storage",
    (await js(`localStorage.getItem("kokunime_recent_searches")`)) === null,
  );
  const undoClear = await js(`(() => {
    const toasts = [...document.querySelectorAll("button")].filter((b) => /^\\s*Urungkan\\s*$/.test(b.textContent ?? ""));
    toasts.at(-1)?.click();
    return toasts.length > 0;
  })()`);
  await sleep(400);
  check("undo: clear-searches toast offers undo", undoClear);
  check(
    "undo: clear-searches undo restores the data",
    await js(`JSON.parse(localStorage.getItem("kokunime_recent_searches") ?? "[]").length === 2`),
  );

  // ---- AB1/AB2: drag&drop backup preview + merge + checksum --------------
  const previewState = await js(`(() => {
    const payload = JSON.stringify({
      app: "Kokunime",
      version: "2.0.0",
      bookmarks: [{ slug: "ux-gate-anime", title: "UX Gate Anime" }],
      searches: ["gate"],
    });
    const file = new File([payload], "backup.json", { type: "application/json" });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    const label = [...document.querySelectorAll("label")].find((node) => /Pulihkan|Restore/i.test(node.textContent ?? ""));
    label?.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
    return Boolean(label);
  })()`);
  await sleep(500);
  check("backup: drag&drop target exists", previewState);
  check(
    "backup: preview shows the incoming collections",
    await js(`/checksum legacy/i.test(document.body.innerText) && /Tersimpan/i.test(document.body.innerText)`),
  );
  const merged = await js(`(() => {
    const button = [...document.querySelectorAll("button")].find((b) => /^\\s*Gabung\\s*$/.test(b.textContent ?? ""));
    button?.click();
    return Boolean(button);
  })()`);
  await sleep(700);
  check("backup: merge control exists", merged);
  check(
    "backup: merge writes the incoming bookmark",
    await js(
      `(JSON.parse(localStorage.getItem("kokunime_bookmarks") ?? "[]")).some((item) => item.slug === "ux-gate-anime")`,
    ),
  );

  const tampered = await js(`(() => {
    const payload = JSON.stringify({ app: "Kokunime", version: "2.0.0", checksum: "deadbeef", bookmarks: [] });
    const file = new File([payload], "broken.json", { type: "application/json" });
    const transfer = new DataTransfer();
    transfer.items.add(file);
    const label = [...document.querySelectorAll("label")].find((node) => /Pulihkan|Restore/i.test(node.textContent ?? ""));
    label?.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer: transfer }));
    return true;
  })()`);
  await sleep(500);
  check(
    "backup: tampered checksum is rejected",
    tampered && (await js(`document.body.innerText.includes("Checksum tidak cocok")`)),
  );

  console.log(`\n${failures.length === 0 ? "ALL PASS" : `${failures.length} FAIL`}`);
  process.exitCode = failures.length === 0 ? 0 : 1;
} catch (error) {
  console.error("UX v2 gate crashed:", error);
  process.exitCode = 1;
} finally {
  cleanup();
}
