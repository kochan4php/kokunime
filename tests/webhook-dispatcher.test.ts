import { describe, expect, it, vi } from "vitest";
import { dispatchDiscordWebhook } from "@/lib/webhook-dispatcher";

describe("Webhook Dispatcher Suite", () => {
  it("rejects invalid webhook URLs gracefully without throwing", async () => {
    const result = await dispatchDiscordWebhook("https://invalid-domain.com", {
      title: "Test",
      description: "Invalid URL test",
    });
    expect(result).toBe(false);
  });

  it("dispatches formatted discord embeds correctly", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
    } as any);

    const result = await dispatchDiscordWebhook("https://discord.com/api/webhooks/12345/abcdef", {
      title: "Rilisan Baru: Solo Leveling S2 Batch",
      description: "Batch 1080p, 720p sudah tersedia untuk diunduh.",
      url: "https://kokunime.my.id/anime/solo-leveling-s2",
    });

    expect(result).toBe(true);
    expect(fetchSpy).toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
