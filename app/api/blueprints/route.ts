import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { BlueprintRequestSchema } from '@/lib/validation/blueprint-schema';
import { generateBlueprint } from '@/lib/ai/blueprint-generator';

// Simple in-memory rate limiter for public blueprint generation
const ipRateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ipHash: string, limit: number = 10, windowMs: number = 3600000): boolean {
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

    // Rate limit: 10 per hour per IP hash
    const isAllowed = checkRateLimit(ipHash, 10, 3600000);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in an hour.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parseResult = BlueprintRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid input parameters.',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { branch, interest, skill_level } = parseResult.data;
    const { blueprint, source } = await generateBlueprint(branch, interest, skill_level);

    // Return strictly teaser data before registration
    return NextResponse.json(
      {
        project_name: blueprint.project_name,
        one_liner: blueprint.one_liner,
        match_score: blueprint.match_score,
        branch,
        interest,
        skill_level,
        teaser_only: true,
        source,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[API /api/blueprints] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Failed to process blueprint generation request.' },
      { status: 500 }
    );
  }
}
