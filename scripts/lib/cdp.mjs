// Minimal Chrome DevTools Protocol client for the local smoke gates
// (visual-smoke.mjs, perf-budget.mjs). No dependencies: Node's global
// WebSocket (Node >= 22), the DevTools HTTP endpoint and native fetch.
import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const CANDIDATES = {
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  ],
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ],
  linux: ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge"],
};

// Returns the browser executable path, or null when none is installed.
export function findBrowser() {
  const fromEnv = process.env.BROWSER_PATH || process.env.CHROME_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) return fromEnv;
  for (const candidate of CANDIDATES[process.platform] ?? []) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

// Launches headless Chrome and connects to its page-level websocket. The
// browser chooses a free debugging port (DevToolsActivePort file).
export async function launchBrowser({ width = 1440, height = 900, mobile = false } = {}) {
  const executable = findBrowser();
  if (!executable) return null;
  if (typeof WebSocket === "undefined") {
    throw new Error("Node has no global WebSocket — Node >= 22 required for the CDP scripts.");
  }

  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "koku-cdp-"));
  const proc = spawn(
    executable,
    [
      "--headless",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-extensions",
      "--disable-background-networking",
      "--remote-debugging-port=0",
      `--user-data-dir=${profileDir}`,
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  const portFile = path.join(profileDir, "DevToolsActivePort");
  const deadline = Date.now() + 20_000;
  let port = null;
  while (Date.now() < deadline) {
    if (fs.existsSync(portFile)) {
      const raw = fs.readFileSync(portFile, "utf8").split("\n")[0].trim();
      if (raw) {
        port = Number(raw);
        break;
      }
    }
    if (proc.exitCode !== null) break;
    await sleep(100);
  }
  if (!port) {
    proc.kill();
    throw new Error("Browser did not expose a debugging port within 20s.");
  }

  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const cdp = await CdpClient.connect(version.webSocketDebuggerUrl);
  const cleanup = () => {
    try {
      proc.kill();
    } catch {}
    try {
      fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 3 });
    } catch {}
  };
  cdp.onClose(cleanup);

  const { sessionId } = await cdp
    .send("Target.createTarget", { url: "about:blank" })
    .then(async (target) => cdp.send("Target.attachToTarget", { targetId: target.targetId, flatten: true }));

  await cdp.send("Page.enable", {}, sessionId);
  await cdp.send("Runtime.enable", {}, sessionId);
  await cdp.send("Log.enable", {}, sessionId);
  await cdp.send("Network.enable", {}, sessionId);
  await cdp.send("Page.setLifecycleEventsEnabled", { enabled: true }, sessionId);
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile }, sessionId);

  return { cdp, sessionId, cleanup, proc };
}

export class CdpClient {
  static async connect(url) {
    const client = new CdpClient(url);
    await client.ready;
    return client;
  }

  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.closed = false;
    this.ws = new WebSocket(url);
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", (event) => reject(new Error(String(event?.message ?? "ws error"))));
    });
    this.ws.addEventListener("message", (event) => {
      let message;
      try {
        message = JSON.parse(String(event.data));
      } catch {
        return;
      }
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) reject(new Error(`${message.error.message} (${message.error.code})`));
        else resolve(message.result ?? {});
        return;
      }
      if (message.method) {
        const key = `${message.sessionId ?? ""}:${message.method}`;
        for (const listener of this.listeners.get(key) ?? []) listener(message.params ?? {});
        for (const listener of this.listeners.get(`*:${message.method}`) ?? [])
          listener(message.params ?? {}, message.sessionId);
      }
    });
    this.ws.addEventListener("close", () => {
      this.closed = true;
      for (const listener of this.listeners.get("*:__close") ?? []) listener();
    });
  }

  onClose(listener) {
    const list = this.listeners.get("*:__close") ?? [];
    list.push(listener);
    this.listeners.set("*:__close", list);
  }

  on(sessionId, method, listener) {
    const key = `${sessionId ?? ""}:${method}`;
    const list = this.listeners.get(key) ?? [];
    list.push(listener);
    this.listeners.set(key, list);
    return () => {
      const current = this.listeners.get(key) ?? [];
      this.listeners.set(
        key,
        current.filter((entry) => entry !== listener),
      );
    };
  }

  send(method, params, sessionId) {
    const id = this.nextId++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP timeout: ${method}`));
        }
      }, 30_000);
    });
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Navigates and waits for the load event plus lifecycle "networkIdle"
// (fallback: plain load + settle). Returns once the page is quiet.
export async function navigate(cdp, sessionId, url, { settleMs = 600, timeoutMs = 25_000 } = {}) {
  let loaded = false;
  let idle = false;
  const offLoad = cdp.on(sessionId, "Page.loadEventFired", () => {
    loaded = true;
  });
  const offIdle = cdp.on(sessionId, "Page.lifecycleEvent", (params) => {
    if (params.name === "networkIdle") idle = true;
  });

  try {
    await cdp.send("Page.navigate", { url }, sessionId);
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline && !(loaded && idle)) await sleep(100);
    // Even with idle seen quickly, give fonts/hydration a moment to settle.
    await sleep(settleMs);
  } finally {
    offLoad();
    offIdle();
  }
  return { loaded, idle };
}

export async function evaluate(cdp, sessionId, expression, { awaitPromise = false } = {}) {
  const result = await cdp.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise }, sessionId);
  if (result.exceptionDetails) {
    throw new Error(`Evaluation failed: ${result.exceptionDetails.text}`);
  }
  return result.result?.value;
}

export async function screenshot(cdp, sessionId, filePath) {
  const shot = await cdp.send("Page.captureScreenshot", { format: "png" }, sessionId);
  fs.writeFileSync(filePath, Buffer.from(shot.data, "base64"));
}

// Runs axe-core (installed devDependency) inside the page and returns
// serious/critical violations only.
export async function runAxe(cdp, sessionId) {
  const axePath = path.join(process.cwd(), "node_modules", "axe-core", "axe.min.js");
  if (!fs.existsSync(axePath)) return null;
  const source = fs.readFileSync(axePath, "utf8");
  await evaluate(cdp, sessionId, `(() => { ${source}; return true; })()`);
  const result = await evaluate(
    cdp,
    sessionId,
    `axe.run(document, { resultTypes: ["violations"] }).then((r) =>
       r.violations
         .filter((v) => v.impact === "serious" || v.impact === "critical")
         .map((v) => ({
           id: v.id,
           impact: v.impact,
           nodes: v.nodes.length,
           help: v.help,
           samples: v.nodes.slice(0, 3).map((n) => (n.html || "").slice(0, 200)),
         }))
     )`,
    { awaitPromise: true },
  );
  return result ?? [];
}
