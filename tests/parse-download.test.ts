import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { getDownloadLinks } from "@/services/scraper/parse-download";

const html = `
<div class="venser">
  <div class="smokeddl">
    <div class="smokettl">Batch</div>
    <div class="smokeurl">
      <strong>360p</strong>
      <a href="https://example.com/a.mp4">Mega</a>
      <a href="https://example.com/b.mp4">Mediafire</a>
    </div>
    <div class="smokeurl">
      <strong>1080p</strong>
      <a href="https://example.com/c.mp4">Google Drive</a>
    </div>
  </div>
</div>`;

describe("getDownloadLinks", () => {
  it("parses download groups, resolutions and platforms", () => {
    const download = getDownloadLinks(load(html), ".smokeddl", ".smokeurl", ".smokettl");
    expect(download).toHaveLength(1);
    expect(download[0].title).toBe("Batch");
    expect(download[0].link_download).toHaveLength(2);
    expect(download[0].link_download[0].resolusi).toBe("360p");
    expect(download[0].link_download[0].link).toHaveLength(2);
    expect(download[0].link_download[0].link[0].platform).toBe("Mega");
  });

  it("drops non-http(s) hrefs (javascript: XSS guard)", () => {
    const evil = load(
      `<div class="venser"><div class="smokeddl"><div class="smokeurl">
        <a href="https://example.com/ok.mp4">Aman</a>
        <a href="javascript:alert(1)">Jahat</a>
        <a href="/relative/path">Relatif</a>
      </div></div></div>`,
    );
    const download = getDownloadLinks(evil, ".smokeddl", ".smokeurl", ".smokettl");
    expect(download[0].link_download[0].link).toEqual([
      { platform: "Aman", url: "https://example.com/ok.mp4", is_torrent: false },
    ]);
  });

  it("surfaces the redirect link from the group title (PINDAH KE posts)", () => {
    // kusonime "moved" posts keep only a <strong>PINDAH KE <a>…</a></strong>
    // in the title — no url blocks. The link must survive, not vanish.
    const redirect = load(
      `<div class="venser"><div class="smokeddlrh"><div class="smokettlrh">
        <strong>PINDAH KE <a href="https://kusonime.com/gabriel-do-batch-sub-indo/">Gabriel DropOut BD Batch</a></strong>
      </div></div></div>`,
    );
    const download = getDownloadLinks(redirect, ".smokeddlrh", ".smokeurlrh", ".smokettlrh");
    expect(download).toHaveLength(1);
    expect(download[0].link_download[0].link).toEqual([
      {
        platform: "Gabriel DropOut BD Batch",
        url: "https://kusonime.com/gabriel-do-batch-sub-indo/",
        is_torrent: false,
      },
    ]);
  });

  it("extracts structured quality attributes and size in bytes", () => {
    const rich = load(
      `<div class="venser"><div class="smokeddl">
        <div class="smokettl">Batch Download</div>
        <div class="smokeurl">
          <strong>1080p x265 MKV (1.5 GB)</strong>
          <a href="https://example.com/dl">GDrive</a>
        </div>
        <div class="smokeurl">
          <strong>720p MP4 (350 MB)</strong>
          <a href="https://example.com/dl2">Mega</a>
        </div>
      </div></div>`,
    );
    const download = getDownloadLinks(rich, ".smokeddl", ".smokeurl", ".smokettl");
    const [res1080, res720] = download[0].link_download;

    expect(res1080.height).toBe(1080);
    expect(res1080.codec).toBe("hevc");
    expect(res1080.container).toBe("mkv");
    expect(res1080.size_bytes).toBe(1610612736); // 1.5 * 1024^3
    expect(res1080.size_formatted).toBe("1.5 GB");

    expect(res720.height).toBe(720);
    expect(res720.container).toBe("mp4");
    expect(res720.size_bytes).toBe(367001600); // 350 * 1024^2
    expect(res720.size_formatted).toBe("350 MB");
  });
});
