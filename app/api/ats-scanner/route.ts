import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { AtsScanRequestSchema } from '@/lib/validation/ats-schema';
import { analyzeResumeATS } from '@/lib/ats/ats-analyzer';

// In-memory rate limiter: 15 scans per hour per IP hash
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ipHash: string, limit: number = 15, windowMs: number = 3600000): boolean {
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

    const isAllowed = checkRateLimit(ipHash, 15, 3600000);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'ATS Scan limit exceeded. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = AtsScanRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid ATS scan parameters.',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const result = await analyzeResumeATS(parseResult.data);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('[API /api/ats-scanner] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to process ATS resume scan.' },
      { status: 500 }
    );
  }
}
