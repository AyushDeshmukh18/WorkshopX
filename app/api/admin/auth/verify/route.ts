import { NextRequest, NextResponse } from 'next/server';
import { normalizeEmail } from '@/lib/validation/email';
import { verifyEmailOtp } from '@/lib/auth/otp';
import { setSessionCookie } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json().catch(() => ({}));
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 });
    }

    const { normalized } = normalizeEmail(email);
    const salt = process.env.IP_HASH_SALT || 'firstbuild-salt-fallback-value-32';

    const verifyResult = await verifyEmailOtp(normalized, otp, salt);
    if (!verifyResult.success) {
      return NextResponse.json({ error: verifyResult.error }, { status: 400 });
    }

    // Set signed Admin session cookie
    await setSessionCookie({
      sub: normalized,
      email: normalized,
      name: 'System Administrator',
      role: 'admin',
    });

    return NextResponse.json({ success: true, message: 'Admin authenticated successfully.' });
  } catch (err: unknown) {
    console.error('[API /api/admin/auth/verify] Error:', err);
    return NextResponse.json({ error: 'Verification error.' }, { status: 500 });
  }
}
