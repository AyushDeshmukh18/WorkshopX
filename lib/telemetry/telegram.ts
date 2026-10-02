import 'server-only';

// Error alert deduplication tracker (signature -> lastSentTimestamp)
const alertDeduplicationMap = new Map<string, number>();

export async function sendTelegramMessage(text: string, parseMode: 'Markdown' | 'HTML' = 'Markdown'): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    console.log(`[Telegram Sandbox] Notification logged (no token configured):\n${text}`);
    return true; // Sandbox pass
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[Telegram API] Failed to send message:', err);
      return false;
    }

    return true;
  } catch (err: unknown) {
    console.error('[Telegram API] Network error:', err);
    return false;
  }
}

/**
 * Sends a deduplicated alert to Telegram (max 1 per 15 minutes per unique error signature).
 */
export async function sendTelegramAlert(
  title: string,
  errorDetails: string,
  signature: string
): Promise<boolean> {
  const now = Date.now();
  const lastSent = alertDeduplicationMap.get(signature);

  // 15-minute deduplication window (900,000 ms)
  if (lastSent && now - lastSent < 900000) {
    console.log(`[Telegram Alert] Suppressed duplicate alert for signature: ${signature}`);
    return false;
  }

  alertDeduplicationMap.set(signature, now);

  const message = `🚨 *FIRSTBUILD ENGINE ALERT*\n\n*Incident:* ${title}\n*Details:* \`${errorDetails.substring(0, 500)}\`\n*Timestamp:* \`${new Date().toISOString()}\``;
  return sendTelegramMessage(message);
}
