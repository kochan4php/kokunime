import fs from "fs";
import path from "path";
import { createClient } from "redis";

const backupDir = () => path.resolve(process.cwd(), "backups");
const REDIS_URL = process.env.REDIS_URL?.trim();
const MAX_KEYS = 10_000; // shortcut: whole-keyspace JSON dump; switch to RDB snapshots if the cache outgrows this

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

async function backupCache() {
  const dir = backupDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const targetFile = path.join(dir, `cache-backup-${timestamp}.json`);

  const redisPatch = await exportRedis();

  const snapshot = {
    timestamp: new Date().toISOString(),
    version: "1.1.0",
    description: "Kokunime offline snapshot and metadata backup",
    ...redisPatch,
  };

  fs.writeFileSync(targetFile, JSON.stringify(snapshot, null, 2), "utf8");
  console.log(
    `✓ Backup successfully created at: ${targetFile} (${
      redisPatch.redis === "exported" ? `${redisPatch.keys} Redis key(s)` : "Redis not configured — metadata only"
    })`,
  );
}

// Weekly drill companion: fail (exit 1) when the newest snapshot is missing,
// corrupt, or older than 7 days — i.e. when the backup job silently broke.
function verifyBackups() {
  const dir = backupDir();
  if (!fs.existsSync(dir)) {
    console.error(`✗ Backup directory not found: ${dir}`);
    return 1;
  }

  const files = fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (files.length === 0) {
    console.error(`✗ No backup files in ${dir}`);
    return 1;
  }

  const latest = files[files.length - 1];
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, latest), "utf8"));
    if (!data.timestamp || !data.version) {
      throw new Error("missing timestamp/version fields");
    }
    const ageDays = (Date.now() - Date.parse(data.timestamp)) / 86_400_000;
    console.log(`✓ Latest backup OK: ${latest} (${ageDays.toFixed(1)} days old, ${files.length} file(s) total)`);
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
  const target =
    file ||
    fs
      .readdirSync(dir)
      .filter((name) => name.endsWith(".json"))
      .sort()
      .pop();
  if (!target) {
    console.error("✗ No backup file to restore");
    return 1;
  }
  const targetPath = path.isAbsolute(target) ? target : path.join(dir, target);

  let snapshot;
  try {
    snapshot = JSON.parse(fs.readFileSync(targetPath, "utf8"));
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
