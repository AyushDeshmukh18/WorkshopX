import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as tickHandler, inMemoryOutbox } from '@/app/api/cron/tick/route';
import { sendTelegramAlert } from '@/lib/telemetry/telegram';
import { withAlert, recentJobLogs } from '@/lib/telemetry/with-alert';

describe('Phase 4 Scheduler, Outbox Idempotency & Telemetry Alerts', () => {
  beforeEach(() => {
    inMemoryOutbox.length = 0;
    process.env.CRON_SECRET = 'valid-test-cron-secret-12345';
  });

  it('rejects tick execution with 401 when CRON_SECRET is invalid or missing', async () => {
    const invalidReq = new NextRequest('http://localhost:3000/api/cron/tick', {
      method: 'POST',
      headers: { authorization: 'Bearer wrong-secret' },
    });

    const res = await tickHandler(invalidReq);
    expect(res.status).toBe(401);
  });

  it('proves that calling the tick twice dispatches notifications exactly once (idempotency)', async () => {
    // Seed 1 pending notification in the outbox
    inMemoryOutbox.push({
      id: 'notif_1',
      registration_id: 'reg_1',
      kind: 'reminder_24h',
      channel: 'email',
      run_at: new Date(Date.now() - 1000).toISOString(), // Ready to run
      status: 'pending',
      attempts: 0,
      recipient_email: 'student@example.com',
      full_name: 'Student Name',
    });

    const req1 = new NextRequest('http://localhost:3000/api/cron/tick', {
      method: 'POST',
      headers: { authorization: 'Bearer valid-test-cron-secret-12345' },
    });

    // First Tick Execution
    const res1 = await tickHandler(req1);
    const body1 = await res1.json();

    expect(body1.claimed).toBe(1);
    expect(body1.sent).toBe(1);
    expect(inMemoryOutbox[0].status).toBe('sent');

    // Second Immediate Tick Execution (Simulating redundant cron or concurrent ping)
    const req2 = new NextRequest('http://localhost:3000/api/cron/tick', {
      method: 'POST',
      headers: { authorization: 'Bearer valid-test-cron-secret-12345' },
    });

    const res2 = await tickHandler(req2);
    const body2 = await res2.json();

    // Must be 0 claimed and 0 sent
    expect(body2.claimed).toBe(0);
    expect(body2.sent).toBe(0);
    expect(inMemoryOutbox[0].status).toBe('sent');
  });

  it('deduplicates alerts within the 15-minute window for the same signature', async () => {
    const signature = 'unique-error-sig-123';
    const alert1 = await sendTelegramAlert('Test Error', 'Database timeout', signature);
    expect(alert1).toBe(true);

    // Second immediate call with same signature must be suppressed
    const alert2 = await sendTelegramAlert('Test Error', 'Database timeout', signature);
    expect(alert2).toBe(false);
  });

  it('logs errors and dispatches alerts via withAlert wrapper when an exception occurs', async () => {
    const failingHandler = withAlert('test-failing-job', async () => {
      throw new Error('Simulated external service crash');
    });

    const dummyReq = new NextRequest('http://localhost:3000/api/cron/test', { method: 'POST' });
    const res = await failingHandler(dummyReq);

    expect(res.status).toBe(500);
    expect(recentJobLogs.length).toBeGreaterThan(0);
    expect(recentJobLogs[0].job).toBe('test-failing-job');
    expect(recentJobLogs[0].status).toBe('failure');
    expect(recentJobLogs[0].error).toContain('Simulated external service crash');
  });
});
