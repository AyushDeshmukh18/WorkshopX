import Link from 'next/link';
import { getSession } from '@/lib/auth/session';

export default async function StudentDashboardPage() {
  const session = await getSession();

  // If not logged in, show access form/prompt
  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center page-enter">
        <div className="warm-card p-8 rounded-lg shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block mb-3"></span>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Access Your Workshop Pass
          </h1>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            Register or enter your registered email address on the homepage to receive a verification OTP and open your active pass.
          </p>
          <Link
            href="/#register"
            prefetch={true}
            className="inline-block bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-semibold text-xs px-6 py-2.5 rounded transition-colors"
          >
            Go to Workshop Registration &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const referralCode = 'FB8X91K2';
  const verifiedRefs = 2; // Verified count
  const seatNumber = 42;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const referralLink = `${appUrl}/r/${referralCode}`;

  const whatsappShareText = encodeURIComponent(
    `Hey, I just registered for the free workshop "Build Your First AI Project in 60 Minutes" to get a verified project on my placement resume! Join with my link: ${referralLink}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappShareText}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    referralLink
  )}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 page-enter">
      {/* Student Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            SEAT #{seatNumber} CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {session.name || 'Workshop Attendee'}
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-0.5">{session.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/live"
            prefetch={true}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs px-4 py-2.5 rounded-md transition-colors text-center"
          >
            Enter Live Room &rarr;
          </Link>
        </div>
      </div>

      {/* Workshop Admission Pass Card */}
      <div className="warm-card rounded-lg p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e8e5de] dark:border-[#232833] pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
              OFFICIAL ATTENDEE CREDENTIAL
            </span>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
              Live Session Pass
            </h2>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#f6f4ee] dark:bg-[#191d24] text-neutral-700 dark:text-neutral-300 border border-[#e8e5de] dark:border-[#232833]">
            BATCH 2026-OCT
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-xs font-mono">
          <div className="p-3 bg-[#fbfaf7] dark:bg-[#15181f] rounded-md border border-[#e8e5de] dark:border-[#232833]">
            <span className="text-[10px] text-neutral-500 uppercase block">FORMAT</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">Live Hands-on</span>
          </div>
          <div className="p-3 bg-[#fbfaf7] dark:bg-[#15181f] rounded-md border border-[#e8e5de] dark:border-[#232833]">
            <span className="text-[10px] text-neutral-500 uppercase block">DURATION</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">60 Minutes</span>
          </div>
          <div className="p-3 bg-[#fbfaf7] dark:bg-[#15181f] rounded-md border border-[#e8e5de] dark:border-[#232833]">
            <span className="text-[10px] text-neutral-500 uppercase block">STATUS</span>
            <span className="font-bold text-blue-700 dark:text-blue-400">Seat Verified</span>
          </div>
          <div className="p-3 bg-[#fbfaf7] dark:bg-[#15181f] rounded-md border border-[#e8e5de] dark:border-[#232833]">
            <span className="text-[10px] text-neutral-500 uppercase block">CERTIFICATE</span>
            <span className="font-bold text-neutral-900 dark:text-neutral-100">Audit Enabled</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-md bg-[#f6f4ee] dark:bg-[#191d24] border border-[#e8e5de] dark:border-[#232833] text-xs">
          <span className="text-neutral-600 dark:text-neutral-400 text-center sm:text-left">
            Have your development environment (Node.js & GitHub account) ready before joining.
          </span>
          <Link
            href="/live"
            prefetch={true}
            className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-semibold px-4 py-2 rounded transition-colors whitespace-nowrap"
          >
            Launch Dev Checklist
          </Link>
        </div>
      </div>

      {/* Referral & Milestone Progress Card */}
      <div className="warm-card rounded-lg p-6 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
          Peer Referral Program
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
          Invite batchmates from your college to unlock priority project review and campus leadership recognition.
        </p>

        {/* Copyable Link Field */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 bg-[#fbfaf7] dark:bg-[#15181f] border border-[#e8e5de] dark:border-[#232833] rounded px-3 py-2 text-xs font-mono text-neutral-900 dark:text-neutral-100"
          />
        </div>

        {/* Share Buttons */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-2"
          >
            Share on WhatsApp
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] hover:bg-[#ece8df] text-neutral-900 dark:text-neutral-100 text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-2"
          >
            Share on LinkedIn
          </a>
        </div>

        {/* Milestone Tracker */}
        <div className="border-t border-[#e8e5de] dark:border-[#232833] pt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
              REFERRAL PROGRESS
            </span>
            <span className="font-mono text-neutral-500">
              {verifiedRefs} VERIFIED OF 10 GOAL
            </span>
          </div>

          <div className="w-full bg-[#e8e5de] dark:bg-[#232833] h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${Math.min((verifiedRefs / 10) * 100, 100)}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`border p-4 rounded-lg text-xs transition-colors ${
                verifiedRefs >= 3
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                  : 'border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between font-mono font-bold mb-1">
                <span>TIER 1: 3 REFERRALS</span>
                <span className={verifiedRefs >= 3 ? 'text-blue-700 dark:text-blue-400' : 'text-neutral-400'}>
                  {verifiedRefs >= 3 ? '[UNLOCKED]' : `${3 - verifiedRefs} MORE`}
                </span>
              </div>
              <p>Priority live code review and instructor feedback during the session.</p>
            </div>

            <div
              className={`border p-4 rounded-lg text-xs transition-colors ${
                verifiedRefs >= 10
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                  : 'border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <div className="flex items-center justify-between font-mono font-bold mb-1">
                <span>TIER 2: 10 REFERRALS</span>
                <span className={verifiedRefs >= 10 ? 'text-blue-700 dark:text-blue-400' : 'text-neutral-400'}>
                  {verifiedRefs >= 10 ? '[UNLOCKED]' : `${10 - verifiedRefs} MORE`}
                </span>
              </div>
              <p>Official Campus Captain Leadership Certificate and special placement honors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
