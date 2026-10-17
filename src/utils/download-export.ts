import { DownloadOption } from "@/interfaces";

export const collectLinks = (group: DownloadOption): string[] => {
  const urls: string[] = [];
  group.link_download.forEach((res) => {
    res.link.forEach((target) => {
      if (target.url) urls.push(target.url);
    });
  });
  return urls;
};

export const safeFilename = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Heuristic on the resolution labels: any "NN GB" >= 10 flags the batch.
export const isLargeBatch = (group: DownloadOption): boolean => {
  const text = `${group.title} ${group.link_download.map((r) => r.resolusi).join(" ")}`;
  const gbMatch = text.match(/(\d+(?:\.\d+)?)\s*gb/i);
  const gbValue = gbMatch?.[1];
  if (gbValue && parseFloat(gbValue) >= 10) return true;
  return false;
};

export const buildDetailedText = (group: DownloadOption, animeTitle?: string | undefined): string => {
  const lines: string[] = [
    `# ${animeTitle ?? "Anime"} - ${group.title}`,
    `# Sumber: Kokunime (https://kokunime.netlify.app)`,
    "",
  ];
  group.link_download.forEach((res) => {
    if (res.resolusi) lines.push(`[${res.resolusi}]`);
    res.link.forEach((target) => {
      if (target.url) lines.push(`${target.platform}: ${target.url}`);
    });
    lines.push("");
  });
  return lines.join("\n").trim();
};

export const buildAria2 = (links: string[]): string =>
  links.map((url) => `${url}\n  dir=downloads\n  max-connection-per-server=4`).join("\n");

export const buildMarkdown = (group: DownloadOption, animeTitle?: string | undefined): string => {
  const lines: string[] = [`### ${animeTitle ?? "Anime"} - ${group.title}`, ""];
  group.link_download.forEach((res) => {
    if (res.resolusi) lines.push(`**${res.resolusi}**`);
    const links = res.link.map((target) => `[${target.platform}](${target.url})`).join(" | ");
    if (links) lines.push(links);
    lines.push("");
  });
  return lines.join("\n").trim();
};

export const buildIdmEf2 = (links: string[]): string => links.map((url) => `<\n${url}\n>`).join("\n");

export const buildCurlSh = (links: string[], group: DownloadOption, animeTitle?: string | undefined): string =>
  `#!/usr/bin/env bash\n# Download script for ${animeTitle ?? "Anime"} - ${group.title}\nmkdir -p downloads && cd downloads\n\n` +
  links.map((url) => `curl -L -O -C - "${url}"`).join("\n");

// Standard JDownloader DLC text container.
export const buildDlc = (links: string[], animeTitle?: string | undefined): string => {
  const dlcHeader = `<dlc>\n  <header>\n    <generator>\n      <app>Kokunime</app>\n      <version>1.0</version>\n      <url>https://kokunime.netlify.app</url>\n    </generator>\n  </header>\n  <content>\n    <package name="${animeTitle ?? "Kokunime Batch"}">\n`;
  const dlcFooter = `    </package>\n  </content>\n</dlc>`;
  const dlcLinks = links.map((url) => `      <file>\n        <url>${url}</url>\n      </file>`).join("\n");
  return `${dlcHeader}${dlcLinks}\n${dlcFooter}`;
};

export const triggerDownload = (content: string, filename: string, mime: string): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
