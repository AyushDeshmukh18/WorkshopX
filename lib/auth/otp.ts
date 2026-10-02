import 'server-only';
import { randomInt, createHash } from 'crypto';

export interface OtpRecord {
  id: string;
  email_normalized: string;
  code_hash: string;
  purpose: 'register' | 'admin' | 'login';
  expires_at: Date;
  attempts: number;
  consumed_at?: Date | null;
}

// In-memory OTP storage for development/sandbox mode or before live DB configuration
const memoryOtps = new Map<string, OtpRecord>();

export function hashOtp(code: string, salt: string): string {
  return createHash('sha256').update(`${code}:${salt}`).digest('hex');
}

export function generate6DigitOtp(): string {
  return randomInt(100000, 999999).toString();
}

export async function createEmailOtp(
  emailNormalized: string,
  purpose: 'register' | 'admin' | 'login' = 'register',
  salt: string
): Promise<{ otp: string; recordId: string }> {
  const otp = generate6DigitOtp();
  const codeHash = hashOtp(otp, salt);
  const recordId = `otp_${Date.now()}_${randomInt(1000, 9999)}`;
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes TTL

  const record: OtpRecord = {
    id: recordId,
    email_normalized: emailNormalized,
    code_hash: codeHash,
    purpose,
    expires_at: expiresAt,
    attempts: 0,
    consumed_at: null,
  };

  memoryOtps.set(emailNormalized, record);
  return { otp, recordId };
}

export async function verifyEmailOtp(
  emailNormalized: string,
  code: string,
  salt: string
): Promise<{ success: boolean; error?: string }> {
  const record = memoryOtps.get(emailNormalized);

  if (!record) {
    return { success: false, error: 'No OTP found or code expired. Please request a new code.' };
  }

  if (record.consumed_at) {
    return { success: false, error: 'This verification code has already been used.' };
  }

  if (new Date() > record.expires_at) {
    memoryOtps.delete(emailNormalized);
    return { success: false, error: 'Verification code has expired. Please request a new one.' };
  }

  if (record.attempts >= 5) {
    memoryOtps.delete(emailNormalized);
    return { success: false, error: 'Too many incorrect attempts. Please request a new code.' };
  }

  const expectedHash = hashOtp(code, salt);
  if (record.code_hash !== expectedHash) {
    record.attempts += 1;
    return {
      success: false,
      error: `Incorrect verification code. ${5 - record.attempts} attempt(s) remaining.`,
    };
  }

  // Mark consumed
  record.consumed_at = new Date();
  return { success: true };
}
