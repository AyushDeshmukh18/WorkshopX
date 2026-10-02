import { NextRequest, NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/validation/email';
import { createEmailOtp } from '@/lib/auth/otp';
import { sendEmail } from '@/lib/email/email-provider';
import { renderOtpEmail } from '@/lib/email/templates';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json().catch(() => ({}));
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const { normalized } = normalizeEmail(email);

    // Validate email against ADMIN_EMAILS allowlist
    const adminEmailsRaw =
      process.env.ADMIN_EMAILS ||
      'deshmukhajd2005@gmail.com,admin@test.com,admin@firstbuild.dev';
    const allowedAdmins = adminEmailsRaw
      .split(',')
      .map((e) => e.trim().toLowerCase());

    if (!allowedAdmins.includes(normalized)) {
      return NextResponse.json(
        { error: 'Access denied. Email is not in the administrator allowlist.' },
        { status: 403 }
      );
    }

    const salt = process.env.IP_HASH_SALT || 'firstbuild-salt-fallback-value-32';
    const { otp } = await createEmailOtp(normalized, 'admin', salt);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Admin Authentication] 6-digit verification code for ${normalized}: ${otp}`);
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailData = renderOtpEmail(otp, { appUrl });

    try {
      await sendEmail({
        to: normalized,
        subject: `Admin Login Code: ${otp}`,
        html: emailData.html,
        text: emailData.text,
      });
    } catch (sendErr) {
      console.warn('[Admin OTP] Email dispatch warning (sandbox fallback active):', sendErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Admin verification code sent.',
      devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (err: unknown) {
    console.error('[API /api/admin/auth/otp] Error:', err);
    return NextResponse.json({ error: 'Failed to dispatch admin OTP.' }, { status: 500 });
  }
}
