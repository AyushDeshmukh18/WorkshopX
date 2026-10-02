import { describe, it, expect } from 'vitest';
import {
  StartRegistrationSchema,
  VerifyRegistrationSchema,
} from '@/lib/validation/registration-schema';
import { normalizeEmail } from '@/lib/validation/email';
import { createEmailOtp, verifyEmailOtp, hashOtp } from '@/lib/auth/otp';
import { createSessionToken, verifySessionToken } from '@/lib/auth/session';
import { createUnsubscribeToken, verifyUnsubscribeToken } from '@/lib/auth/unsubscribe';

describe('Phase 3 Registration, Security & Auth Engine', () => {
  const salt = 'test-salt-secret-at-least-16-chars';

  describe('Validation & Normalization', () => {
    it('validates a complete student registration payload', () => {
      const payload = {
        email: 'bhavana.rao@college.edu',
        full_name: 'Bhavana Rao',
        college_name: 'Vasavi College of Engineering',
        branch: 'ECE',
        grad_year: 2025,
        skill_level: 'beginner',
        interest: 'AI',
        language: 'en',
        consent: true,
      };

      const result = StartRegistrationSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects registration without explicit DPDP consent', () => {
      const payload = {
        email: 'student@college.edu',
        full_name: 'Student Name',
        college_name: 'College',
        branch: 'CSE',
        grad_year: 2025,
        skill_level: 'beginner',
        interest: 'AI',
        consent: false,
      };

      const result = StartRegistrationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it('rejects disposable email domains', () => {
      const email = 'spammer@10minutemail.com';
      const { isDisposable } = normalizeEmail(email);
      expect(isDisposable).toBe(true);
    });

    it('validates 6-digit OTP format in VerifyRegistrationSchema', () => {
      expect(VerifyRegistrationSchema.safeParse({ email: 'test@college.edu', otp: '123456' }).success).toBe(true);
      expect(VerifyRegistrationSchema.safeParse({ email: 'test@college.edu', otp: '12345' }).success).toBe(false);
      expect(VerifyRegistrationSchema.safeParse({ email: 'test@college.edu', otp: 'abcdef' }).success).toBe(false);
    });
  });

  describe('OTP Security & Verification', () => {
    it('generates a 6-digit numeric OTP and verifies correctly', async () => {
      const email = 'arjun@college.edu';
      const { otp } = await createEmailOtp(email, 'register', salt);

      expect(otp).toMatch(/^\d{6}$/);

      const verifyRes = await verifyEmailOtp(email, otp, salt);
      expect(verifyRes.success).toBe(true);
    });

    it('rejects incorrect OTP codes and decrements remaining attempts', async () => {
      const email = 'wrong_code@college.edu';
      await createEmailOtp(email, 'register', salt);

      const verifyRes = await verifyEmailOtp(email, '000000', salt);
      expect(verifyRes.success).toBe(false);
      expect(verifyRes.error).toContain('attempt(s) remaining');
    });

    it('produces repeatable cryptographic SHA256 hashes', () => {
      const hash1 = hashOtp('123456', salt);
      const hash2 = hashOtp('123456', salt);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64);
    });
  });

  describe('Signed Sessions & Unsubscribe Tokens', () => {
    it('signs and verifies JWT session tokens via jose', async () => {
      process.env.SESSION_SECRET = 'this-is-a-32-byte-secret-for-jose-testing';
      const token = await createSessionToken({
        sub: 'reg_12345',
        email: 'test@example.com',
        role: 'student',
      });

      expect(token).toBeDefined();

      const payload = await verifySessionToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.sub).toBe('reg_12345');
      expect(payload?.role).toBe('student');
    });

    it('creates and verifies DPDP-compliant unsubscribe tokens', async () => {
      process.env.SESSION_SECRET = 'this-is-a-32-byte-secret-for-jose-testing';
      const token = await createUnsubscribeToken('reg_99999');
      const verifiedSub = await verifyUnsubscribeToken(token);
      expect(verifiedSub).toBe('reg_99999');
    });
  });
});
