import { describe, it, expect } from 'vitest';
import { validateClientEnv, validateServerEnv, validateAllEnv } from '@/lib/env';

describe('Environment Variable Validation (Fail-Fast Verification)', () => {
  const validClientEnv = {
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    NEXT_PUBLIC_APP_NAME: 'FirstBuild Engine',
    NEXT_PUBLIC_SUPABASE_URL: 'https://test-project.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'test-anon-key-12345',
  };

  const validServerEnv = {
    SUPABASE_SECRET_KEY: 'test-service-role-secret-key-12345',
    EMAIL_PROVIDER: 'brevo',
    EMAIL_FROM_ADDRESS: 'workshop@example.com',
    SESSION_SECRET: 'super-secret-random-key-at-least-32-chars-long',
    CRON_SECRET: 'cron-secret-123',
    ADMIN_EMAILS: 'admin1@test.com, admin2@test.com',
    IP_HASH_SALT: 'salt-must-be-at-least-16-chars',
  };

  it('passes validation when all required client and server variables are provided', () => {
    const { client, server } = validateAllEnv({
      ...validClientEnv,
      ...validServerEnv,
    });

    expect(client.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000');
    expect(client.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY).toBe('test-anon-key-12345');
    expect(server.SUPABASE_SECRET_KEY).toBe('test-service-role-secret-key-12345');
    expect(server.ADMIN_EMAILS).toEqual(['admin1@test.com', 'admin2@test.com']);
  });

  it('fails fast when NEXT_PUBLIC_SUPABASE_URL is missing', () => {
    const invalidEnv = { ...validClientEnv, NEXT_PUBLIC_SUPABASE_URL: undefined };
    expect(() => validateClientEnv(invalidEnv)).toThrowError(
      /Missing or invalid client environment variables/
    );
  });

  it('fails fast when SUPABASE_SECRET_KEY is missing on server', () => {
    const invalidEnv = { ...validServerEnv, SUPABASE_SECRET_KEY: undefined };
    expect(() => validateServerEnv(invalidEnv)).toThrowError(
      /Missing or invalid server environment variables/
    );
  });

  it('fails when SESSION_SECRET is shorter than 32 characters', () => {
    const invalidEnv = { ...validServerEnv, SESSION_SECRET: 'too-short' };
    expect(() => validateServerEnv(invalidEnv)).toThrowError(
      /SESSION_SECRET must be at least 32 characters/
    );
  });

  it('fails when EMAIL_FROM_ADDRESS is not a valid email', () => {
    const invalidEnv = { ...validServerEnv, EMAIL_FROM_ADDRESS: 'not-an-email' };
    expect(() => validateServerEnv(invalidEnv)).toThrowError(/must be a valid email address/);
  });

  it('fails when IP_HASH_SALT is shorter than 16 characters', () => {
    const invalidEnv = { ...validServerEnv, IP_HASH_SALT: 'short-salt' };
    expect(() => validateServerEnv(invalidEnv)).toThrowError(
      /IP_HASH_SALT must be at least 16 characters/
    );
  });
});
