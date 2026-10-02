/**
 * Helper script to register Telegram webhook with secret token verification.
 * Run with: npx ts-node scripts/set-telegram-webhook.ts
 */

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;

async function setWebhook() {
  if (!botToken || !appUrl || !secretToken) {
    console.error('Error: TELEGRAM_BOT_TOKEN, NEXT_PUBLIC_APP_URL, and TELEGRAM_WEBHOOK_SECRET must be set.');
    process.exit(1);
  }

  const webhookUrl = `${appUrl}/api/telegram/webhook`;
  const endpoint = `https://api.telegram.org/bot${botToken}/setWebhook`;

  console.log(`Setting Telegram Webhook to: ${webhookUrl}`);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: secretToken,
      drop_pending_updates: true,
      allowed_updates: ['message'],
    }),
  });

  const data = await res.json();
  console.log('Telegram API Response:', data);
}

setWebhook().catch(console.error);
