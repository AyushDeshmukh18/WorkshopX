'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const PRE_SEEDED_COLLEGES = [
  'JNTU College of Engineering Hyderabad',
  'Chaitanya Bharathi Institute of Technology (CBIT)',
  'Vasavi College of Engineering',
  'VNR Vignana Jyothi Institute of Engineering',
  'Gokaraju Rangaraju Institute of Engineering (GRIET)',
  'CVR College of Engineering',
  'Sreenidhi Institute of Science and Technology (SNIST)',
  'Andhra University College of Engineering',
  'Gayatri Vidya Parishad College of Engineering',
  'RVR & JC College of Engineering, Guntur',
  'VR Siddhartha Engineering College, Vijayawada',
  'SRKR Engineering College, Bhimavaram',
  'G. Pulla Reddy Engineering College, Kurnool',
  'COEP Technological University, Pune',
  'Vishwakarma Institute of Technology (VIT Pune)',
  'Walchand College of Engineering, Sangli',
  'Government College of Engineering, Amravati',
  'PSG College of Technology, Coimbatore',
  'Thiagarajar College of Engineering, Madurai',
  'Coimbatore Institute of Technology (CIT)',
  'BMS College of Engineering, Bengaluru',
  'M. S. Ramaiah Institute of Technology (MSRIT)',
  'Siddaganga Institute of Technology, Tumakuru',
];

interface BlueprintData {
  project_name: string;
  one_liner: string;
  what_youll_build_in_60_min: string;
  stack: string[];
  resume_bullet: string;
  match_score: number;
  first_3_steps: string[];
  why_it_fits: string;
}

interface ConfirmedSeat {
  seat_number: number;
  referral_code: string;
  join_token: string;
  share_url: string;
  blueprint: BlueprintData;
}

export default function RegistrationFlow() {
  const [step, setStep] = useState<'input' | 'otp' | 'confirmed'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [branch, setBranch] = useState<'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL'>('CSE');
  const [gradYear, setGradYear] = useState<number>(2026);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [interest, setInterest] = useState<'AI' | 'WEB' | 'DATA' | 'MOBILE' | 'EMBEDDED'>('AI');
  const [language, setLanguage] = useState<'en' | 'hi' | 'te'>('en');
  const [referralCode, setReferralCode] = useState('');
  const [consent, setConsent] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  // OTP Fields
  const [otpCode, setOtpCode] = useState('');
  const [otpSentEmail, setOtpSentEmail] = useState('');

  // Confirmed Result
  const [confirmedData, setConfirmedData] = useState<ConfirmedSeat | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Auto-detect referral code from URL query param ?ref= or cookie
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refParam = params.get('ref');
      if (refParam) {
        setReferralCode(refParam.toUpperCase().trim());
      } else {
        const match = document.cookie.match(/(?:^|;\s*)ref=([^;]+)/);
        if (match && match[1]) {
          setReferralCode(decodeURIComponent(match[1]).toUpperCase().trim());
        }
      }
    }
  }, []);

  // Listen to blueprint selections from the BlueprintFlow component
  useEffect(() => {
    const handleBlueprintSync = (e: Event) => {
      const customEvent = e as CustomEvent<{
        branch?: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL';
        interest?: 'AI' | 'WEB' | 'DATA' | 'MOBILE' | 'EMBEDDED';
        skillLevel?: 'beginner' | 'intermediate' | 'advanced';
      }>;
      if (customEvent.detail) {
        if (customEvent.detail.branch) setBranch(customEvent.detail.branch);
        if (customEvent.detail.interest) setInterest(customEvent.detail.interest);
        if (customEvent.detail.skillLevel) setSkillLevel(customEvent.detail.skillLevel);
      }
    };

    window.addEventListener('blueprint-selected', handleBlueprintSync);
    return () => window.removeEventListener('blueprint-selected', handleBlueprintSync);
  }, []);

  const handleStartRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!consent) {
      setError('You must provide consent pursuant to DPDP Act 2023 to proceed.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/register/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          full_name: fullName,
          college_name: collegeName,
          branch,
          grad_year: gradYear,
          skill_level: skillLevel,
          interest,
          language,
          consent: true,
          consent_marketing: consentMarketing,
          referral_code: referralCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (Array.isArray(data.details) ? data.details[0] : 'Registration failed.'));
      }

      setOtpSentEmail(email);
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit numeric verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpSentEmail,
          otp: otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired code.');
      }

      setConfirmedData(data);
      setStep('confirmed');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to verify verification code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyShareUrl = () => {
    if (confirmedData?.share_url) {
      navigator.clipboard.writeText(confirmedData.share_url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div id="register" className="scroll-mt-16 warm-card rounded-md p-6 sm:p-8 my-12">
      {/* Step Header */}
      <div className="border-b border-[#e8e5de] dark:border-[#232833] pb-5 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-500">
            {step === 'input' && 'Official Registration'}
            {step === 'otp' && 'Verification Check'}
            {step === 'confirmed' && 'Admission Pass Confirmed'}
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
          {step === 'input' && 'Claim Your Free Workshop Seat'}
          {step === 'otp' && 'Enter Verification Code'}
          {step === 'confirmed' && 'Your Seat is Officially Verified'}
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          {step === 'input' && 'Strict limit of 500 verified seats per cohort. Complete your details below to receive your one-time verification code.'}
          {step === 'otp' && `We sent a 6-digit verification code to ${otpSentEmail}. Enter it below to unlock your blueprint.`}
          {step === 'confirmed' && 'You are officially registered. Your full placement blueprint and live join pass are ready below.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded text-xs text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* STEP 1: Registration Input Form */}
      {step === 'input' && (
        <form onSubmit={handleStartRegistration} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arjun Sharma"
                className="w-full text-sm px-3.5 py-2.5 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. arjun@gmail.com or student@college.ac.in"
                className="w-full text-sm px-3.5 py-2.5 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
              Engineering College Name *
            </label>
            <input
              type="text"
              required
              list="college-suggestions"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="Search or type your engineering college name..."
              className="w-full text-sm px-3.5 py-2.5 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <datalist id="college-suggestions">
              {PRE_SEEDED_COLLEGES.map((c, i) => (
                <option key={i} value={c} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Branch
              </label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value as 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL')}
                className="w-full text-xs px-3 py-2 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Grad Year
              </label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100"
              >
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
                <option value={2028}>2028</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Domain Focus
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value as 'AI' | 'WEB' | 'DATA' | 'MOBILE' | 'EMBEDDED')}
                className="w-full text-xs px-3 py-2 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100"
              >
                <option value="AI">AI / ML</option>
                <option value="WEB">Full-Stack Web</option>
                <option value="DATA">Data Systems</option>
                <option value="MOBILE">Mobile Dev</option>
                <option value="EMBEDDED">Embedded / IoT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'te')}
                className="w-full text-xs px-3 py-2 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="te">Telugu</option>
              </select>
            </div>
          </div>

          {/* Referral Code (Optional) */}
          <div className="pt-2">
            <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium flex items-center justify-between">
              <span>Referral Code (Optional)</span>
              {referralCode && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                  &bull; CODE DETECTED
                </span>
              )}
            </label>
            <input
              type="text"
              placeholder="e.g. FB8X91K2"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              maxLength={16}
              className="w-full text-xs font-mono px-3 py-2 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-blue-600 uppercase"
            />
          </div>

          {/* Legal Disclosures (DPDP Act 2023) */}
          <div className="pt-3 border-t border-[#e8e5de] dark:border-[#232833] space-y-2">
            <label className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-[#dcd8cf] dark:border-[#2b313d] text-blue-600 focus:ring-0"
              />
              <span>
                I consent to receiving the one-time verification code, live workshop access link, and my AI project blueprint pursuant to the{' '}
                <Link href="/privacy" className="underline hover:text-neutral-900 dark:hover:text-white font-medium">
                  DPDP Act 2023 Privacy Policy
                </Link>.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-neutral-500 cursor-pointer">
              <input
                type="checkbox"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-0.5 rounded border-[#dcd8cf] dark:border-[#2b313d] text-blue-600 focus:ring-0"
              />
              <span>Keep me informed of future technical workshops and open-source hackathons (optional).</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono uppercase text-xs font-semibold py-3 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Reserving Seat & Sending Verification Code...' : 'Reserve Seat & Send Verification Code'}
          </button>
        </form>
      )}

      {/* STEP 2: 6-Digit OTP Verification */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-6 max-w-md mx-auto py-4">
          <div className="text-center">
            <span className="text-xs font-mono text-neutral-500 block mb-1">ENTER 6-DIGIT CODE SENT TO</span>
            <span className="text-sm font-mono font-bold text-neutral-900 dark:text-neutral-100">
              {otpSentEmail}
            </span>
          </div>

          <div>
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center tracking-[0.5em] text-2xl font-mono px-4 py-3 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-[#fbfaf7] dark:bg-[#12151b] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <p className="text-[11px] text-neutral-500 text-center mt-2">
              Valid for 10 minutes. Check your spam folder if you do not see it in 60 seconds.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono uppercase text-xs font-semibold py-3 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Verifying Code & Confirming Seat...' : 'Confirm Seat & Unlock Blueprint'}
          </button>

          <div className="flex items-center justify-between text-xs pt-2">
            <button
              type="button"
              onClick={() => setStep('input')}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
            >
              Change Email / Details
            </button>

            <button
              type="button"
              onClick={handleStartRegistration}
              disabled={isLoading}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
            >
              Resend Code
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Verified Seat & Unlocked Full Blueprint */}
      {step === 'confirmed' && confirmedData && (
        <div className="space-y-6">
          <div className="border border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20 p-6 rounded-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200 dark:border-blue-800/60 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase bg-blue-600 text-white px-2 py-0.5 rounded font-bold">
                  OFFICIAL ADMISSION PASS
                </span>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                  Seat #{confirmedData.seat_number} Reserved
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mt-0.5">
                  Referral Code: {confirmedData.referral_code}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/dashboard/me"
                  prefetch={true}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
                >
                  View Student Pass &rarr;
                </Link>
                <Link
                  href={`/live?t=${encodeURIComponent(confirmedData.join_token)}`}
                  prefetch={true}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
                >
                  Enter Live Room &rarr;
                </Link>
              </div>
            </div>

            {/* Share & Invite Section */}
            <div className="pt-2">
              <span className="text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 block mb-1">
                Your Priority Referral Link (Invite 3 Peers for VIP Access):
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={confirmedData.share_url}
                  className="flex-1 text-xs font-mono px-3 py-2 border border-[#dcd8cf] dark:border-[#2b313d] rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                />
                <button
                  type="button"
                  onClick={handleCopyShareUrl}
                  className="bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs px-3 py-2 rounded font-mono transition-colors"
                >
                  {copySuccess ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Full Unlocked Blueprint Card */}
          <div className="border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#12151b] p-6 rounded-md">
            <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold block mb-1">
              FULL UNLOCKED BLUEPRINT
            </span>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {confirmedData.blueprint.project_name}
            </h4>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
              {confirmedData.blueprint.one_liner}
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-mono text-neutral-500 uppercase block mb-1 font-bold">
                  What You&apos;ll Build in 60 Minutes:
                </span>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {confirmedData.blueprint.what_youll_build_in_60_min}
                </p>
              </div>

              <div>
                <span className="font-mono text-neutral-500 uppercase block mb-1.5 font-bold">
                  Validated Tech Stack:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {confirmedData.blueprint.stack.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-white dark:bg-neutral-900 border border-[#dcd8cf] dark:border-[#2b313d] text-neutral-800 dark:text-neutral-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-mono text-neutral-500 uppercase block mb-1 font-bold">
                  Placement Resume Bullet:
                </span>
                <div className="p-3 bg-white dark:bg-neutral-900 border border-[#e8e5de] dark:border-[#232833] rounded font-mono text-[11px] text-neutral-800 dark:text-neutral-200">
                  {confirmedData.blueprint.resume_bullet}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
