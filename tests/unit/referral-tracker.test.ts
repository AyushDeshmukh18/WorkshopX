import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/referral/track/route';
import { NextRequest } from 'next/server';

describe('Referral Tracking & Peer Attribution Engine', () => {
  it('returns 400 for invalid non-JSON payloads', async () => {
    const req = new NextRequest('http://localhost:3000/api/referral/track', {
      method: 'POST',
      body: 'invalid-json',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Invalid JSON request payload');
  });

  it('validates minimum query length schema', async () => {
    const req = new NextRequest('http://localhost:3000/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'a' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });

  it('resolves tracking data for a referral code with milestone calculations', async () => {
    const req = new NextRequest('http://localhost:3000/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'FB8X91K2' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.found).toBe(true);
    expect(data.referral_code).toBeTruthy();
    expect(data.referral_link).toContain('/r/');
    expect(typeof data.verified_count).toBe('number');
    expect(typeof data.pending_count).toBe('number');
    expect(typeof data.total_attributed).toBe('number');
    expect(typeof data.tier_1_unlocked).toBe('boolean');
    expect(typeof data.tier_2_unlocked).toBe('boolean');
    expect(typeof data.tier_3_unlocked).toBe('boolean');
    expect(Array.isArray(data.recent_referrals)).toBe(true);
  }, 10000);

  it('resolves tracking data by email query', async () => {
    const req = new NextRequest('http://localhost:3000/api/referral/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'student.sample@cbit.ac.in' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();

    expect(data.found).toBe(true);
    expect(data.referral_code).toBeTruthy();
    expect(data.recent_referrals.length).toBeGreaterThan(0);
  }, 10000);
});
