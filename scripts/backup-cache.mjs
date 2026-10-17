import crypto from "crypto";
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { createClient } from "redis";

const backupDir = () => path.resolve(process.cwd(), "backups");
const REDIS_URL = process.env.REDIS_URL?.trim();
const MAX_KEYS = 10_000; // shortcut: whole-keyspace JSON dump; switch to RDB snapshots if the cache outgrows this
const RETENTION = 14; // newest N backups kept; older ones pruned after each run
const isDryRun = process.argv.includes("--dry-run");

const sha256 = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");

// Backup names embed an ISO timestamp, so lexical sort == chronological.
const listBackups = (dir) =>
  fs
    .readdirSync(dir)
    .filter((name) => /^cache-backup-.*\.json(\.gz)?$/.test(name))
    .sort();

async function exportRedis() {
  if (!REDIS_URL) return { redis: "skipped" };
  const client = createClient({ url: REDIS_URL });
  await client.connect();
  try {
    const keys = [];
    for await (const key of client.scanIterator({ MATCH: "kokunime:*", COUNT: 250 })) {
      keys.push(key);
      if (keys.length >= MAX_KEYS) break;
    }

    const data = {};
    for (const key of keys) {
      const type = await client.type(key);
      let value = null;
      if (type === "string") value = await client.get(key);
      else if (type === "hash") value = await client.hGetAll(key);
      else if (type === "list") value = await client.lRange(key, 0, -1);
      else if (type === "set") value = await client.sMembers(key);
      else if (type === "zset") value = await client.zRangeWithScores(key, 0, -1);
      else continue; // streams/other types are intentionally not snapshotted
      data[key] = { type, value, ttl: await client.ttl(key) };
    }
    return { redis: "exported", keys: keys.length, data };
  } finally {
    await client.quit().catch(() => {});
  }
}

// Keep only the RETENTION newest backups (plus their checksum sidecars).
function pruneOldBackups(dir) {
  const backups = listBackups(dir);
  const stale = backups.slice(0, Math.max(0, backups.length - RETENTION));
  for (const name of stale) {
    if (isDryRun) {
      console.log(`[dry-run] would delete ${name} (+ .sha256)`);
      continue;
    }
    fs.rmSync(path.join(dir, name), { force: true });
    fs.rmSync(path.join(dir, `${name}.sha256`), { force: true });
  }
  return { kept: backups.length - stale.length, removed: stale.length };
}

async function backupCache() {
  const dir = backupDir();
  if (!fs.existsSync(dir)) {
    if (isDryRun) {
      console.log(`[dry-run] would create ${dir}`);
    } else {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const targetFile = path.join(dir, `cache-backup-${timestamp}.json.gz`);

  if (isDryRun) {
    console.log(`[dry-run] Redis: ${REDIS_URL ? "would export kokunime:* keys" : "not configured — metadata only"}`);
    console.log(`[dry-run] would write ${path.basename(targetFile)} + .sha256 sidecar`);
    if (fs.existsSync(dir)) pruneOldBackups(dir);
    return;
  }

  const redisPatch = await exportRedis();

  const snapshot = {
    timestamp: new Date().toISOString(),
    version: "1.2.0",
    description: "Kokunime offline snapshot and metadata backup",
    ...redisPatch,
  };

  const gz = zlib.gzipSync(Buffer.from(JSON.stringify(snapshot), "utf8"));
  fs.writeFileSync(targetFile, gz);
  const hash = sha256(gz);
  fs.writeFileSync(`${targetFile}.sha256`, `${hash}  ${path.basename(targetFile)}\n`);

  console.log(
    `✓ Backup created: ${targetFile} (${(gz.length / 1024).toFixed(0)} KB, sha256 ${hash.slice(0, 12)}…) — ${
      redisPatch.redis === "exported" ? `${redisPatch.keys} Redis key(s)` : "Redis not configured, metadata only"
    }`,
  );

  const pruned = pruneOldBackups(dir);
  console.log(`retention: kept ${pruned.kept}, removed ${pruned.removed} (max ${RETENTION})`);
}

// Weekly drill companion: fail (exit 1) when the newest snapshot is missing,
// corrupt, fails its checksum, or older than 7 days — i.e. when the backup
// job silently broke.
function verifyBackups() {
  const dir = backupDir();
  if (!fs.existsSync(dir)) {
    console.error(`✗ Backup directory not found: ${dir}`);
    return 1;
  }

  const files = listBackups(dir);
  if (files.length === 0) {
    console.error(`✗ No backup files in ${dir}`);
    return 1;
  }

  const latest = files[files.length - 1];
  const latestPath = path.join(dir, latest);
  try {
    let raw;
    let checksumNote = "legacy uncompressed backup (no checksum)";
    if (latest.endsWith(".gz")) {
      const gz = fs.readFileSync(latestPath);
      const sidecar = `${latestPath}.sha256`;
      if (!fs.existsSync(sidecar)) throw new Error("missing .sha256 checksum sidecar");
      const expected = fs.readFileSync(sidecar, "utf8").trim().split(/\s+/)[0];
      const actual = sha256(gz);
      if (expected !== actual) {
        throw new Error(`checksum mismatch (expected ${expected.slice(0, 12)}…, got ${actual.slice(0, 12)}…)`);
      }
      raw = zlib.gunzipSync(gz).toString("utf8");
      checksumNote = "checksum verified";
    } else {
      raw = fs.readFileSync(latestPath, "utf8");
    }

    const data = JSON.parse(raw);
    if (!data.timestamp || !data.version) {
      throw new Error("missing timestamp/version fields");
    }
    const ageDays = (Date.now() - Date.parse(data.timestamp)) / 86_400_000;
    console.log(
      `✓ Latest backup OK: ${latest} (${checksumNote}, ${ageDays.toFixed(1)} days old, ${files.length} file(s) total)`,
    );
    if (!Number.isFinite(ageDays) || ageDays > 7) {
      console.error("✗ Latest backup is older than 7 days — the backup job may be broken");
      return 1;
    }
    return 0;
  } catch (error) {
    console.error(`✗ Invalid backup ${latest}: ${error.message}`);
    return 1;
  }
}

// Restore drill: write a snapshot back into Redis (latest file unless a path
// is given). Opt-in so nobody clobbers live data by accident.
async function restoreBackup(file) {
  if (!REDIS_URL) {
    console.error("✗ REDIS_URL is required to restore");
    return 1;
  }
  const dir = backupDir();
  const target = file || listBackups(dir).pop();
  if (!target) {
    console.error("✗ No backup file to restore");
    return 1;
  }
  const targetPath = path.isAbsolute(target) ? target : path.join(dir, target);

  let snapshot;
  try {
    const contents = fs.readFileSync(targetPath);
    const raw = targetPath.endsWith(".gz") ? zlib.gunzipSync(contents).toString("utf8") : contents.toString("utf8");
    snapshot = JSON.parse(raw);
  } catch (error) {
    console.error(`✗ Cannot read ${targetPath}: ${error.message}`);
    return 1;
  }
  if (!snapshot.data || typeof snapshot.data !== "object") {
    console.error("✗ Snapshot has no Redis data section");
    return 1;
  }

  const client = createClient({ url: REDIS_URL });
  await client.connect();
  try {
    let restored = 0;
    for (const [key, entry] of Object.entries(snapshot.data)) {
      const { type, value, ttl } = entry ?? {};
      if (type === "string" && typeof value === "string") await client.set(key, value);
      else if (type === "hash" && value && typeof value === "object") {
        await client.del(key);
        if (Object.keys(value).length > 0) await client.hSet(key, value);
      } else if (type === "list" && Array.isArray(value)) {
        await client.del(key);
        if (value.length > 0) await client.rPush(key, value);
      } else if (type === "set" && Array.isArray(value)) {
        await client.del(key);
        if (value.length > 0) await client.sAdd(key, value);
      } else if (type === "zset" && Array.isArray(value)) {
        await client.del(key);
        if (value.length > 0) await client.zAdd(key, value);
      } else {
        continue;
      }
      if (typeof ttl === "number" && ttl > 0) await client.expire(key, ttl);
      restored++;
    }
    console.log(`✓ Restored ${restored} key(s) from ${targetPath}`);
    return 0;
  } finally {
    await client.quit().catch(() => {});
  }
}

const args = process.argv.slice(2);

if (args.includes("--verify")) {
  process.exitCode = verifyBackups();
} else if (args.includes("--restore")) {
  const file = args[args.indexOf("--restore") + 1];
  process.exitCode = await restoreBackup(file && !file.startsWith("--") ? file : undefined);
} else {
  backupCache().catch((error) => {
    console.error(`✗ Backup failed: ${error.message}`);
    process.exitCode = 1;
  });
}
