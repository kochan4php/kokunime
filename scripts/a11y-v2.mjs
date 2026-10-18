// Accessibility v2 gate (batch AE): media emulation, reflow/text resize,
// accessibility-tree audit and a real keyboard journey. Runs against a live
// server (dev or production build):
//   BASE_URL=http://localhost:8000 node scripts/a11y-v2.mjs
import { evaluate, launchBrowser, navigate, sleep } from "./lib/cdp.mjs";

const BASE = process.env.BASE_URL || "http://localhost:8000";
const failures = [];
const check = (name, ok, detail = "") => {
  if (!ok) failures.push(name);
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${String(detail).slice(0, 200)}` : ""}`);
};

const { cdp, sessionId, cleanup } = await launchBrowser({ width: 1280, height: 900 });
const js = (expression, options = {}) => evaluate(cdp, sessionId, expression, options);

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
  await sleep(150);
};

const activeElement = () =>
  js(`(() => {
    const el = document.activeElement;
    const style = el ? getComputedStyle(el) : null;
    return {
      tag: el?.tagName ?? "",
      text: (el?.textContent ?? "").trim().slice(0, 80),
      id: el?.id ?? "",
      href: el?.getAttribute?.("href") ?? "",
      label: el?.getAttribute?.("aria-label") ?? "",
      outline: style ? \`\${style.outlineStyle} \${style.outlineWidth}\` : "",
      visible: Boolean(el && el.getClientRects().length),
      hiddenAncestor: Boolean(el?.closest?.('[aria-hidden="true"]')),
    };
  })()`);

const measureOverflow = () =>
  js(`(() => {
    const clipped = (el) => {
      for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
        if (getComputedStyle(node).overflowX !== "visible") return true;
      }
      return false;
    };
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest('[aria-hidden="true"]') || el.closest("svg")) continue;
      const style = getComputedStyle(el);
      if (style.position === "fixed" || style.visibility === "hidden") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;
      if ((rect.right > innerWidth + 1 || rect.left < -1) && !clipped(el)) {
        offenders.push(\`\${el.tagName}.\${String(el.className).slice(0, 36)} [\${Math.round(rect.left)}..\${Math.round(rect.right)}]\`);
      }
    }
    return {
      viewport: innerWidth,
      scroll: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      offenders: offenders.slice(0, 6),
    };
  })()`);

const setViewport = (width, height, mobile) =>
  cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile }, sessionId);

const setMedia = (features) => cdp.send("Emulation.setEmulatedMedia", { features }, sessionId);

try {
  await cdp.send("Accessibility.enable", {}, sessionId);

  // Discover a real detail route from the home page.
  await navigate(cdp, sessionId, `${BASE}/`, { settleMs: 2000 });
  const detailHref = await js(`document.querySelector('main a[href^="/anime/"]')?.getAttribute("href") ?? null`);
  const routes = ["/", "/update", "/settings", "/aksesibilitas", "/offline", "/bookmarks"];
  if (detailHref) routes.push(detailHref.split("#")[0]);

  // ---- AE4: keyboard journey ------------------------------------------------
  await navigate(cdp, sessionId, `${BASE}/`, { settleMs: 1800 });
  await press("Tab", "Tab", 9);
  const first = await activeElement();
  check("keyboard: first Tab lands on the skip link", /Langsung ke konten/i.test(first.text), JSON.stringify(first));
  check(
    "keyboard: the skip link paints a visible focus ring",
    first.visible && first.outline !== "none 0px" && first.outline !== "none",
    first.outline,
  );

  await press("Enter", "Enter", 13);
  const afterSkip = await js(`document.activeElement?.id ?? ""`);
  check("keyboard: Enter on the skip link focuses the main landmark", afterSkip === "konten", afterSkip);

  const trail = [];
  for (let index = 0; index < 8; index++) {
    await press("Tab", "Tab", 9);
    trail.push(await activeElement());
  }
  check(
    "keyboard: Tab keeps moving through visible focus targets",
    trail.every((step) => step.visible) &&
      new Set(trail.map((step) => `${step.tag}:${step.label || step.text || step.href}`)).size >= 6,
    trail.map((step) => (step.label || step.text || step.href).slice(0, 24)).join(" → "),
  );
  check(
    "keyboard: focus never enters an aria-hidden subtree",
    trail.every((step) => !step.hiddenAncestor),
  );

  // Command palette: opens with Ctrl+K and closes with Escape.
  await press("k", "KeyK", 75, 2);
  const paletteOpen = await js(`Boolean(document.querySelector("dialog[open]"))`);
  check("keyboard: Ctrl+K opens the command palette", paletteOpen);
  await press("Escape", "Escape", 27);
  await sleep(450);
  const paletteClosed = await js(`!document.querySelector("dialog[open]")`);
  check("keyboard: Escape closes the command palette", paletteClosed);

  // Mobile menu dialog: Enter opens, Escape closes.
  await setViewport(390, 800, true);
  await navigate(cdp, sessionId, `${BASE}/`, { settleMs: 1500 });
  const menuButton = await js(`(() => {
    const button = [...document.querySelectorAll("button")].find((item) =>
      (item.getAttribute("aria-label") || "").toLowerCase().includes("menu"),
    );
    if (!button) return false;
    button.focus();
    return true;
  })()`);
  check("keyboard: mobile menu button is present at phone width", menuButton);
  if (menuButton) {
    await press("Enter", "Enter", 13);
    await sleep(350);
    const menuOpen = await js(`Boolean(document.querySelector("dialog[open]"))`);
    check("keyboard: Enter opens the mobile menu dialog", menuOpen);
    await press("Escape", "Escape", 27);
    await sleep(350);
    const menuClosed = await js(`!document.querySelector("dialog[open]")`);
    check("keyboard: Escape closes the mobile menu dialog", menuClosed);
  }

  // ---- AE1: media emulation -------------------------------------------------
  await setViewport(1280, 900, false);
  await navigate(cdp, sessionId, `${BASE}/`, { settleMs: 1500 });

  await setMedia([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const motion = await js(`(() => {
    const probe = document.createElement("div");
    probe.style.transition = "opacity 1s";
    document.body.appendChild(probe);
    const duration = getComputedStyle(probe).transitionDuration;
    probe.remove();
    return { matches: matchMedia("(prefers-reduced-motion: reduce)").matches, duration };
  })()`);
  check(
    "media: prefers-reduced-motion collapses transitions",
    motion.matches && Number.parseFloat(motion.duration) <= 0.001,
    JSON.stringify(motion),
  );

  await setMedia([{ name: "prefers-reduced-transparency", value: "reduce" }]);
  const transparency = await js(`(() => {
    const probe = document.createElement("div");
    probe.className = "backdrop-blur";
    document.body.appendChild(probe);
    const filter = getComputedStyle(probe).backdropFilter;
    probe.remove();
    return { matches: matchMedia("(prefers-reduced-transparency: reduce)").matches, filter };
  })()`);
  check(
    "media: prefers-reduced-transparency removes backdrop blur",
    transparency.matches && transparency.filter === "none",
    JSON.stringify(transparency),
  );

  await setMedia([{ name: "prefers-contrast", value: "more" }]);
  const contrast = await js(`(() => {
    const muted = document.createElement("div");
    muted.style.color = "var(--ink-muted)";
    const ink = document.createElement("div");
    ink.style.color = "var(--ink)";
    document.body.append(muted, ink);
    const result = {
      matches: matchMedia("(prefers-contrast: more)").matches,
      muted: getComputedStyle(muted).color,
      ink: getComputedStyle(ink).color,
      grain: getComputedStyle(document.body, "::before").display,
    };
    muted.remove();
    ink.remove();
    return result;
  })()`);
  check(
    "media: prefers-contrast: more raises muted copy to ink contrast",
    contrast.matches && contrast.muted === contrast.ink && contrast.grain === "none",
    JSON.stringify(contrast),
  );

  await setMedia([{ name: "forced-colors", value: "active" }]);
  await navigate(cdp, sessionId, `${BASE}/`, { settleMs: 1200 });
  await press("Tab", "Tab", 9);
  const forcedFocus = await activeElement();
  const forced = await js(`matchMedia("(forced-colors: active)").matches`);
  check(
    "media: forced-colors keeps a thick system focus ring",
    forced && forcedFocus.outline.includes("3px") && !forcedFocus.outline.startsWith("none"),
    JSON.stringify({ forced, outline: forcedFocus.outline }),
  );
  await setMedia([]);

  // ---- AE2: reflow + text spacing + 200% text -------------------------------
  await setViewport(320, 640, true);
  for (const route of routes) {
    await navigate(cdp, sessionId, `${BASE}${route}`, { settleMs: 1200 });
    const reflow = await measureOverflow();
    check(
      `reflow 320px: ${route} has no horizontal overflow`,
      reflow.scroll <= 321 && reflow.offenders.length === 0,
      JSON.stringify(reflow),
    );
  }

  await setViewport(1280, 900, false);
  for (const route of routes) {
    await navigate(cdp, sessionId, `${BASE}${route}`, { settleMs: 1200 });

    const spaced = await js(`(() => {
      const style = document.createElement("style");
      style.id = "a11y-v2-spacing";
      style.textContent = "*:not(svg):not(svg *) { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-block-end: 2em !important; }";
      document.head.appendChild(style);
      return true;
    })()`);
    const spacing = await measureOverflow();
    check(
      `text spacing 1.4.12: ${route} keeps content in view`,
      spaced && spacing.scroll <= 1281 && spacing.offenders.length === 0,
      JSON.stringify(spacing),
    );

    const resized = await js(`(() => {
      document.documentElement.style.fontSize = "32px";
      return true;
    })()`);
    const text200 = await measureOverflow();
    check(
      `text 200%: ${route} keeps content in view`,
      resized && text200.scroll <= 1281 && text200.offenders.length === 0,
      JSON.stringify(text200),
    );
  }

  // ---- AE3: accessibility tree + duplicate announcements --------------------
  await setViewport(1280, 900, false);
  for (const route of routes) {
    await navigate(cdp, sessionId, `${BASE}${route}`, { settleMs: 2200 });
    // Render below-the-fold content first: content-visibility:auto leaves
    // off-screen subtrees unnamed in the AX tree until they have been laid out.
    await js("window.scrollTo(0, document.body.scrollHeight)");
    await sleep(500);
    await js("window.scrollTo(0, 0)");
    await sleep(250);
    const tree = await cdp.send("Accessibility.getFullAXTree", {}, sessionId);
    const nodes = (tree.nodes ?? []).filter((node) => !node.ignored);
    const role = (node) => node.role?.value ?? "";
    const name = (node) => (node.name?.value ?? "").trim();
    const mains = nodes.filter((node) => role(node) === "main").length;
    const h1 = nodes.filter(
      (node) =>
        role(node) === "heading" &&
        (node.properties ?? []).some((property) => property.name === "level" && property.value?.value === 1),
    ).length;
    const nameless = nodes.filter(
      (node) => (role(node) === "button" || role(node) === "link") && name(node).length === 0,
    );
    for (const node of nameless.slice(0, 3)) {
      try {
        const described = await cdp.send("DOM.describeNode", { backendNodeId: node.backendDOMNodeId }, sessionId);
        const attributes = described.node?.attributes ?? [];
        const get = (key) => attributes[attributes.indexOf(key) + 1] ?? "";
        console.log(
          `  unnamed ${role(node)}: <${described.node?.nodeName?.toLowerCase()} href="${get("href")}" class="${String(get("class")).slice(0, 60)}">`,
        );
      } catch {
        // Node gone — nothing to describe.
      }
    }

    const live = await js(`(() => {
      const texts = [...document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')]
        .filter((element) => getComputedStyle(element).display !== "none")
        .map((element) => (element.innerText || element.textContent || "").trim())
        .filter(Boolean);
      const duplicates = texts.filter((text, index) => texts.indexOf(text) !== index);
      return { texts, duplicates, lang: document.documentElement.lang };
    })()`);

    check(`AX ${route}: one main landmark`, mains === 1, `main=${mains}`);
    check(`AX ${route}: exactly one level-1 heading`, h1 === 1, `h1=${h1}`);
    check(
      `AX ${route}: every button and link has an accessible name`,
      nameless.length === 0,
      nameless.map((node) => `${role(node)}:${name(node)}`).join(", "),
    );
    check(`AX ${route}: no duplicate live announcements`, live.duplicates.length === 0, JSON.stringify(live));
    check(`AX ${route}: document language is Indonesian`, /^id/i.test(live.lang), live.lang);
  }

  await setMedia([]);
  await setViewport(1280, 900, false);
  console.log(`\n${failures.length === 0 ? "ALL PASS" : `${failures.length} FAIL`}`);
  process.exitCode = failures.length === 0 ? 0 : 1;
} finally {
  await cleanup();
}
