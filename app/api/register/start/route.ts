import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { StartRegistrationSchema } from '@/lib/validation/registration-schema';
import { normalizeEmail } from '@/lib/validation/email';
import { createEmailOtp } from '@/lib/auth/otp';
import { sendEmail } from '@/lib/email/email-provider';
import { renderOtpEmail } from '@/lib/email/templates';

// Rate limiting in-memory table
const ipLimits = new Map<string, { count: number; resetAt: number }>();
const emailLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(map: Map<string, { count: number; resetAt: number }>, key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) {
    return false;
  }
  entry.count += 1;
  return true;
}

// In-memory registration draft store for fast OTP pairing
export const pendingRegistrations = new Map<string, unknown>();

export async function POST(req: NextRequest) {
  try {
    const rawIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';
    const salt = process.env.IP_HASH_SALT || 'firstbuild-salt-fallback-value-32';
    const ipHash = createHash('sha256').update(`${rawIp}:${salt}`).digest('hex');

    // Rate Limit: 10 per hour per IP
    if (!checkRateLimit(ipLimits, ipHash, 10, 3600000)) {
      return NextResponse.json(
        { error: 'Too many registration requests from this network. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = StartRegistrationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const input = parseResult.data;

    // Normalize email & check disposable domains
    let emailNorm;
    try {
      emailNorm = normalizeEmail(input.email);
    } catch {
      return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
    }

    if (emailNorm.isDisposable) {
      return NextResponse.json(
        { error: 'Disposable and temporary email addresses are not permitted.' },
        { status: 400 }
      );
    }

    // Rate Limit: 3 OTPs per 10 minutes per email
    if (!checkRateLimit(emailLimits, emailNorm.normalized, 3, 600000)) {
      return NextResponse.json(
        { error: 'Too many OTP requests for this email. Please wait 10 minutes before requesting again.' },
        { status: 429 }
      );
    }

    // Check ref cookie if referred_by is not provided in body
    const refCookie = req.cookies.get('ref')?.value;
    const effectiveRefCode = input.referral_code || refCookie || null;

    const joinToken = randomBytes(16).toString('hex');

    // Store pending registration draft
    const draftPayload = {
      ...input,
      email_normalized: emailNorm.normalized,
      referred_by_code: effectiveRefCode,
      join_token: joinToken,
      ip_hash: ipHash,
    };
    pendingRegistrations.set(emailNorm.normalized, draftPayload);

    // Generate OTP
    const { otp } = await createEmailOtp(emailNorm.normalized, 'register', salt);

    // Send OTP email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailContent = renderOtpEmail(otp, { appUrl });

    await sendEmail({
      to: input.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'A 6-digit verification code has been dispatched to your email.',
        email: input.email,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[API /api/register/start] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while initiating registration.' },
      { status: 500 }
    );
  }
}
