import { describe, it, expect } from 'vitest';
import { normalizeEmail } from '@/lib/validation/email';

describe('Email Normalization & Disposable Domain Filter', () => {
  it('strips dots and +tag for Gmail addresses', () => {
    const res1 = normalizeEmail('arjun.kumar+workshop@gmail.com');
    expect(res1.normalized).toBe('arjunkumar@gmail.com');

    const res2 = normalizeEmail('a.r.j.u.n@googlemail.com');
    expect(res2.normalized).toBe('arjun@gmail.com');
  });

  it('preserves dots for non-Gmail addresses but strips +tags', () => {
    const res = normalizeEmail('john.doe+news@college.edu');
    expect(res.normalized).toBe('john.doe@college.edu');
  });

  it('detects and flags disposable email domains', () => {
    const spam = normalizeEmail('testuser@mailinator.com');
    expect(spam.isDisposable).toBe(true);

    const temp = normalizeEmail('student@10minutemail.com');
    expect(temp.isDisposable).toBe(true);

    const legitimate = normalizeEmail('student@jntuh.ac.in');
    expect(legitimate.isDisposable).toBe(false);
  });

  it('throws on invalid email formats', () => {
    expect(() => normalizeEmail('invalid-email')).toThrowError('Invalid email format');
    expect(() => normalizeEmail('user@domain@another.com')).toThrowError('Invalid email format');
  });
});
