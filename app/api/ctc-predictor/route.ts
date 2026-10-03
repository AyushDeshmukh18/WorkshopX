import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { CtcPredictorRequestSchema } from '@/lib/validation/ctc-predictor-schema';
import { predictPlacementCtc } from '@/lib/placement/ctc-predictor';

const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ipHash: string, limit: number = 20, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const record = ipRateLimits.get(ipHash);

  if (!record || now > record.resetAt) {
    ipRateLimits.set(ipHash, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const salt = process.env.IP_HASH_SALT || 'firstbuild-salt-fallback-value-32';
    const ipHash = createHash('sha256').update(`${rawIp}:${salt}`).digest('hex');

    const isAllowed = checkRateLimit(ipHash, 20, 3600000);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'CTC Predictor rate limit reached. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = CtcPredictorRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid parameters for CTC prediction.',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const result = await predictPlacementCtc(parseResult.data);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('[API /api/ctc-predictor] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to compute CTC tier leap prediction.' },
      { status: 500 }
    );
  }
}
