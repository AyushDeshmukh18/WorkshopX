'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch administrator authentication code.');
      }

      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
        setOtp(data.devOtp);
      }

      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Invalid administrator verification code.');
      }

      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 page-enter">
      <div className="warm-card rounded-lg p-8 shadow-sm">
        <div className="border-b border-[#e8e5de] dark:border-[#232833] pb-4 mb-6">
          <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
            RESTRICTED ACCESS
          </span>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
            Operations Center Login
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Authorized administrator email allowlist verification only.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-300 text-xs rounded-md">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOtp}>
            <div className="mb-4">
              <label
                htmlFor="admin-email"
                className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                ADMINISTRATOR EMAIL
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deshmukhajd2005@gmail.com"
                className="w-full bg-[#fbfaf7] dark:bg-[#15181f] border border-[#e8e5de] dark:border-[#232833] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying Allowlist...' : 'Send Administrator OTP &rarr;'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            {devOtpHint && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs rounded-md font-mono flex items-center justify-between">
                <span>Code dispatched to inbox. Sandbox Code:</span>
                <span className="font-bold text-sm bg-white dark:bg-neutral-900 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700">
                  {devOtpHint}
                </span>
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="admin-otp"
                className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
              >
                6-DIGIT VERIFICATION CODE
              </label>
              <input
                id="admin-otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full bg-[#fbfaf7] dark:bg-[#15181f] border border-[#e8e5de] dark:border-[#232833] rounded-md px-3.5 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Enter Operations Center &rarr;'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
