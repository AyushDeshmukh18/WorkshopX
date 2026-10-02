import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { withAlert } from '@/lib/telemetry/with-alert';
import { sendEmail } from '@/lib/email/email-provider';
import {
  renderReminder24hEmail,
  renderReminder2hEmail,
  renderReminder15mEmail,
  renderWelcomeEmail,
  renderMilestoneEmail,
} from '@/lib/email/templates';
import { sendTelegramAlert } from '@/lib/telemetry/telegram';

export interface OutboxNotification {
  id: string;
  registration_id: string;
  kind:
    | 'otp'
    | 'welcome'
    | 'blueprint'
    | 'reminder_24h'
    | 'reminder_2h'
    | 'reminder_15m'
    | 'milestone'
    | 'post_event'
    | 'certificate';
  channel: 'email';
  run_at: string;
  status: 'pending' | 'processing' | 'sent' | 'failed' | 'skipped';
  attempts: number;
  recipient_email?: string;
  full_name?: string;
  join_token?: string;
  seat_number?: number;
  referral_code?: string;
}

// In-memory outbox queue for serverless state / test drills
export const inMemoryOutbox: OutboxNotification[] = [];

function authenticateCron(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'default-cron-secret-firstbuild';

  if (!authHeader) return false;

  const providedToken = authHeader.replace(/^Bearer\s+/i, '').trim();
  const tokenBuffer = Buffer.from(providedToken);
  const secretBuffer = Buffer.from(cronSecret);

  if (tokenBuffer.length !== secretBuffer.length) {
    return false;
  }

  return timingSafeEqual(tokenBuffer, secretBuffer);
}

async function handleTick(req: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  // Validate CRON_SECRET with constant-time comparison
  if (!authenticateCron(req)) {
    return NextResponse.json({ error: 'Unauthorized: Invalid CRON_SECRET.' }, { status: 401 });
  }

  let sentCount = 0;
  let failedCount = 0;
  let quotaTripped = false;
  const now = new Date();

  // 1. Process Claimed Notifications (Bounded to ~7.5s)
  const pendingItems = inMemoryOutbox.filter(
    (item) => item.status === 'pending' && new Date(item.run_at) <= now
  );

  for (const item of pendingItems) {
    // Timebox safeguard (stop before 7500ms to stay within Vercel limits)
    if (Date.now() - startTime > 7500) {
      break;
    }

    item.status = 'processing';
    item.attempts += 1;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    let emailContent: { subject: string; html: string; text: string } | null = null;

    if (item.kind === 'welcome') {
      emailContent = renderWelcomeEmail(
        item.full_name || 'Student',
        item.seat_number || 1,
        item.referral_code || 'CODE',
        'Your Chosen AI Project',
        { appUrl }
      );
    } else if (item.kind === 'reminder_24h') {
      emailContent = renderReminder24hEmail(item.full_name || 'Student', item.join_token || 'tok', { appUrl });
    } else if (item.kind === 'reminder_2h') {
      emailContent = renderReminder2hEmail(item.full_name || 'Student', { appUrl });
    } else if (item.kind === 'reminder_15m') {
      emailContent = renderReminder15mEmail(item.full_name || 'Student', item.join_token || 'tok', { appUrl });
    } else if (item.kind === 'milestone') {
      emailContent = renderMilestoneEmail(item.full_name || 'Student', 'refs_3', { appUrl });
    }

    if (emailContent && item.recipient_email) {
      const result = await sendEmail({
        to: item.recipient_email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
      });

      if (result.success) {
        item.status = 'sent';
        sentCount += 1;
      } else {
        // Check if daily quota was tripped
        if (result.error && result.error.includes('quota')) {
          item.status = 'pending'; // Leave pending, never mark failed for quota
          item.attempts -= 1;
          quotaTripped = true;
          await sendTelegramAlert(
            'Daily Email Quota Exhausted',
            'Outbox dispatches held in pending state until midnight reset.',
            'quota_exhausted'
          );
          break; // Stop dispatching further emails today
        } else {
          failedCount += 1;
          if (item.attempts >= 5) {
            item.status = 'failed';
            await sendTelegramAlert(
              `Outbox Delivery Failed for ${item.id}`,
              `Max attempts (5) reached. Error: ${result.error}`,
              `outbox_failure_${item.id}`
            );
          } else {
            item.status = 'pending'; // Re-queue for next retry
          }
        }
      }
    } else {
      item.status = 'sent'; // Blueprint or non-email outbox record processed
    }
  }

  const durationMs = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    claimed: pendingItems.length,
    sent: sentCount,
    failed: failedCount,
    quota_tripped: quotaTripped,
    duration_ms: durationMs,
    keep_alive: true,
  });
}

export const POST = withAlert('cron-tick', handleTick);
