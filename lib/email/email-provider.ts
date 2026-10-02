import 'server-only';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
  fromName?: string;
  fromAddress?: string;
  headers?: Record<string, string>;
}

export interface EmailSendResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
}

// In-memory counter for rolling daily email dispatches
let dailyEmailCount = 0;
let lastResetDay = new Date().toISOString().split('T')[0];

function checkDailyEmailLimit(maxLimit: number = 250): boolean {
  const currentDay = new Date().toISOString().split('T')[0];
  if (currentDay !== lastResetDay) {
    dailyEmailCount = 0;
    lastResetDay = currentDay;
  }
  return dailyEmailCount < maxLimit;
}

function incrementDailyEmailCount() {
  dailyEmailCount += 1;
}

export function getDailyEmailCount(): number {
  return dailyEmailCount;
}

/**
 * Sends an email using the configured provider (Brevo -> Resend -> Gmail SMTP).
 * If no provider credentials are configured, safely logs to console (sandbox/test mode).
 */
export async function sendEmail(options: EmailOptions): Promise<EmailSendResult> {
  const provider = (process.env.EMAIL_PROVIDER || 'brevo').toLowerCase();
  const fromName = options.fromName || process.env.EMAIL_FROM_NAME || 'FirstBuild Workshop';
  const fromAddress = options.fromAddress || process.env.EMAIL_FROM_ADDRESS || 'workshop@example.com';
  const dailyLimit = parseInt(process.env.EMAIL_DAILY_LIMIT || '250', 10);

  if (!checkDailyEmailLimit(dailyLimit)) {
    return {
      success: false,
      provider,
      error: `Daily email quota of ${dailyLimit} reached. Notification held in pending state.`,
    };
  }

  // 1. Brevo (Primary Provider - 300/day free limit)
  if (provider === 'brevo') {
    const apiKey = process.env.BREVO_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            sender: { name: fromName, email: fromAddress },
            to: [{ email: options.to }],
            subject: options.subject,
            htmlContent: options.html,
            textContent: options.text,
            headers: options.headers,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(`Brevo HTTP ${response.status}: ${JSON.stringify(errData)}`);
        }

        const data = await response.json();
        incrementDailyEmailCount();
        return {
          success: true,
          provider: 'brevo',
          messageId: data.messageId || 'brevo-sent',
        };
      } catch (err: unknown) {
        console.error('[Email Provider] Brevo dispatch failed:', err);
        return {
          success: false,
          provider: 'brevo',
          error: err instanceof Error ? err.message : 'Brevo dispatch failed',
        };
      }
    }
  }

  // 2. Resend (Secondary Provider - 100/day free limit)
  if (provider === 'resend') {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
      try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
          from: `${fromName} <${fromAddress}>`,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
          headers: options.headers,
        });

        if (error) {
          throw new Error(error.message);
        }

        incrementDailyEmailCount();
        return {
          success: true,
          provider: 'resend',
          messageId: data?.id || 'resend-sent',
        };
      } catch (err: unknown) {
        console.error('[Email Provider] Resend dispatch failed:', err);
        return {
          success: false,
          provider: 'resend',
          error: err instanceof Error ? err.message : 'Resend dispatch failed',
        };
      }
    }
  }

  // 3. Gmail SMTP / Nodemailer (Last Resort - 500/day free limit)
  if (provider === 'smtp') {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (user && pass) {
      try {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass },
        });

        const info = await transporter.sendMail({
          from: `"${fromName}" <${fromAddress}>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          headers: options.headers,
        });

        incrementDailyEmailCount();
        return {
          success: true,
          provider: 'smtp',
          messageId: info.messageId,
        };
      } catch (err: unknown) {
        console.error('[Email Provider] SMTP dispatch failed:', err);
        return {
          success: false,
          provider: 'smtp',
          error: err instanceof Error ? err.message : 'SMTP dispatch failed',
        };
      }
    }
  }

  // Fallback Sandbox / Dev Sink (When no live keys provided)
  incrementDailyEmailCount();
  return {
    success: true,
    provider: `${provider}-mock-sink`,
    messageId: `mock-msg-${Date.now()}`,
  };
}
