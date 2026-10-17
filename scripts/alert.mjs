// Optional ops alert: posts to ALERT_WEBHOOK_URL (falls back to the Discord /
// error webhook envs) and stays a graceful no-op when none is configured, so
// CI jobs can call it unconditionally.
const url = process.env.ALERT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL || process.env.ERROR_WEBHOOK_URL;
const message = process.argv.slice(2).join(" ").trim() || "(no message)";
const source = process.env.ALERT_SOURCE || process.env.GITHUB_JOB || "ops";

if (!url) {
  console.log(`::notice::alert webhook not configured — skipped: ${message}`);
  process.exit(0);
}

try {
  // `content` suits Discord, `text` suits Slack-style endpoints.
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content: `🚨 [${source}] ${message}`, text: `🚨 [${source}] ${message}` }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  console.log(`✓ alert sent (${source})`);
} catch (error) {
  console.error(`✗ alert delivery failed: ${error.message}`);
  process.exit(1);
}
