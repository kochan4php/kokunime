export interface WebhookPayload {
  title: string;
  description: string;
  url?: string;
  color?: number;
  fields?: { name: string; value: string; inline?: boolean }[];
}

export async function dispatchDiscordWebhook(webhookUrl: string, payload: WebhookPayload): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
    return false;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: payload.title,
            description: payload.description,
            url: payload.url,
            color: payload.color ?? 0x10b981, // Emerald green
            fields: payload.fields ?? [],
            footer: { text: "Kokunime Webhook Notification System" },
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
