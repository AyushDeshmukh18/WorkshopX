import { NextRequest, NextResponse } from 'next/server';
import { VerifyRegistrationSchema } from '@/lib/validation/registration-schema';
import { normalizeEmail } from '@/lib/validation/email';
import { verifyEmailOtp } from '@/lib/auth/otp';
import { generateBlueprint } from '@/lib/ai/blueprint-generator';
import { setSessionCookie } from '@/lib/auth/session';
import { sendEmail } from '@/lib/email/email-provider';
import { renderWelcomeEmail } from '@/lib/email/templates';
import { pendingRegistrations } from '../start/route';

// In-memory counter for verified registrations
let globalSeatCounter = 1;
const verifiedStudents = new Map<string, unknown>();

export async function POST(req: NextRequest) {
  try {
    const salt = process.env.IP_HASH_SALT || 'firstbuild-salt-fallback-value-32';
    const body = await req.json().catch(() => ({}));
    const parseResult = VerifyRegistrationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: parseResult.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { email, otp } = parseResult.data;
    const { normalized } = normalizeEmail(email);

    // Verify OTP
    const verifyResult = await verifyEmailOtp(normalized, otp, salt);
    if (!verifyResult.success) {
      return NextResponse.json({ error: verifyResult.error }, { status: 400 });
    }

    // Retrieve pending draft
    const draft = pendingRegistrations.get(normalized) as Record<string, unknown> | undefined;
    const branch = (draft?.branch as string) || 'CSE';
    const interest = (draft?.interest as string) || 'AI';
    const skillLevel = (draft?.skill_level as string) || 'beginner';
    const fullName = (draft?.full_name as string) || 'Student';

    // Assign sequential seat number
    const seatNumber = globalSeatCounter++;
    // Generate unambiguous 8-character referral code
    const referralCode = `FB${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const registrationId = `reg_${Date.now()}_${seatNumber}`;

    // Generate full blueprint
    const { blueprint } = await generateBlueprint(
      branch as 'CSE',
      interest as 'AI',
      skillLevel as 'beginner'
    );

    // Save to verified registry
    const verifiedRecord = {
      id: registrationId,
      email,
      email_normalized: normalized,
      full_name: fullName,
      seat_number: seatNumber,
      referral_code: referralCode,
      join_token: draft?.join_token || `tok_${registrationId}`,
      branch,
      interest,
      skill_level: skillLevel,
      blueprint,
      verified_at: new Date().toISOString(),
    };
    verifiedStudents.set(normalized, verifiedRecord);
    pendingRegistrations.delete(normalized);

    // Set signed HTTP-only session cookie
    await setSessionCookie({
      sub: registrationId,
      email: normalized,
      name: fullName,
      role: 'student',
    });

    // Send Welcome Email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const emailContent = renderWelcomeEmail(
      fullName,
      seatNumber,
      referralCode,
      blueprint.project_name,
      {
        appUrl,
        unsubscribeUrl: `${appUrl}/unsubscribe?token=sample`,
      }
    );

    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    return NextResponse.json(
      {
        success: true,
        seat_number: seatNumber,
        referral_code: referralCode,
        join_token: verifiedRecord.join_token,
        share_url: `${appUrl}/r/${referralCode}`,
        blueprint,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[API /api/register/verify] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while verifying your seat.' },
      { status: 500 }
    );
  }
}
