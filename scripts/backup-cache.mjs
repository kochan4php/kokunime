import fs from "fs";
import path from "path";

function backupCache() {
  const backupDir = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const targetFile = path.join(backupDir, `cache-backup-${timestamp}.json`);

  const mockData = {
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    description: "Kokunime offline snapshot and metadata backup",
  };

  fs.writeFileSync(targetFile, JSON.stringify(mockData, null, 2), "utf8");
  console.log(`✓ Backup successfully created at: ${targetFile}`);
}

backupCache();
