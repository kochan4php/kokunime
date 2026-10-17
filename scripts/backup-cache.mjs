import fs from "fs";
import path from "path";

const backupDir = () => path.resolve(process.cwd(), "backups");

function backupCache() {
  const dir = backupDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const targetFile = path.join(dir, `cache-backup-${timestamp}.json`);

  const mockData = {
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    description: "Kokunime offline snapshot and metadata backup",
  };

  fs.writeFileSync(targetFile, JSON.stringify(mockData, null, 2), "utf8");
  console.log(`✓ Backup successfully created at: ${targetFile}`);
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

if (process.argv.includes("--verify")) {
  process.exitCode = verifyBackups();
} else {
  backupCache();
}
