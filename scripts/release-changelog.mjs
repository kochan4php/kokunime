import { execSync } from "child_process";
import fs from "fs";

function generateChangelog() {
  try {
    const rawLogs = execSync('git log -n 50 --pretty=format:"%s|%h|%an|%ad" --date=short', { encoding: "utf8" });
    const lines = rawLogs.trim().split("\n").filter(Boolean);

    const categories = {
      feat: [],
      fix: [],
      perf: [],
      refactor: [],
      docs: [],
      other: [],
    };

    for (const line of lines) {
      const [msg, hash] = line.split("|");
      const cleanMsg = msg.trim();

      if (/^feat/i.test(cleanMsg)) {
        categories.feat.push(`- ${cleanMsg} (\`${hash}\`)`);
      } else if (/^fix/i.test(cleanMsg)) {
        categories.fix.push(`- ${cleanMsg} (\`${hash}\`)`);
      } else if (/^perf/i.test(cleanMsg)) {
        categories.perf.push(`- ${cleanMsg} (\`${hash}\`)`);
      } else if (/^refactor/i.test(cleanMsg)) {
        categories.refactor.push(`- ${cleanMsg} (\`${hash}\`)`);
      } else if (/^docs/i.test(cleanMsg)) {
        categories.docs.push(`- ${cleanMsg} (\`${hash}\`)`);
      } else {
        categories.other.push(`- ${cleanMsg} (\`${hash}\`)`);
      }
    }

    const today = new Date().toISOString().split("T")[0];
    let output = `# 📋 Kokunime Release Notes (${today})\n\n`;

    if (categories.feat.length) {
      output += `### 🚀 New Features\n${categories.feat.join("\n")}\n\n`;
    }
    if (categories.fix.length) {
      output += `### 🐛 Bug Fixes\n${categories.fix.join("\n")}\n\n`;
    }
    if (categories.perf.length) {
      output += `### ⚡ Performance Improvements\n${categories.perf.join("\n")}\n\n`;
    }
    if (categories.refactor.length) {
      output += `### ♻️ Code Refactoring\n${categories.refactor.join("\n")}\n\n`;
    }
    if (categories.docs.length) {
      output += `### 📚 Documentation\n${categories.docs.join("\n")}\n\n`;
    }

    fs.writeFileSync("CHANGELOG.md", output, "utf8");
    console.log("✓ Successfully generated CHANGELOG.md");
  } catch (err) {
    console.error("Failed to generate changelog:", err.message);
  }
}

generateChangelog();
