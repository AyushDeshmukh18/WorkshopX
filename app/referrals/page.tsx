import { Metadata } from 'next';
import Link from 'next/link';
import ReferralTrackerSection from '@/components/ReferralTrackerSection';
import {
  Users,
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Gift,
  CheckCircle2,
  FileCode,
  Share2,
  BookOpen
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Peer Referral Program & Tracker | NxtWave CCBP 4.0',
  description:
    'Invite engineering batchmates to the 60-Minute AI Project Workshop. Track your referrals live, unlock FAANG interview kits, 1-on-1 code reviews, and campus ambassador credentials.',
};

export default function ReferralsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#0d1015] text-neutral-900 dark:text-neutral-100 page-enter">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-[#e8e5de] dark:border-[#232833] bg-[#f5f2eb]/70 dark:bg-[#12161f]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              NxtWave CCBP 4.0
            </Link>
            <span>/</span>
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold">
              Peer Referral Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              2026 Placement Drive Active
            </span>
            <Link
              href="/#register"
              className="text-xs font-semibold px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 transition-colors"
            >
              Get Free Seat
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-mono font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PEER ATTRIBUTION & REWARDS ENGINE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 max-w-3xl mx-auto leading-tight sm:leading-tight mb-4">
          Refer Engineering Batchmates. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-600 bg-clip-text text-transparent">
            Unlock Differential Placement Perks.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Help your peers build and deploy their first production AI project in 60 minutes.
          Every verified registration with your referral code brings you closer to FAANG interview toolkits, 1-on-1 mock viva audits, and campus leadership status.
        </p>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10 text-left">
          <div className="p-4 rounded-xl border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#131720]">
            <div className="text-xs font-mono uppercase text-neutral-500 mb-1">Tier 1 • 3 Refs</div>
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              FAANG SDE Toolkit
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">100 System design prompts & cheat sheets</div>
          </div>

          <div className="p-4 rounded-xl border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#131720]">
            <div className="text-xs font-mono uppercase text-neutral-500 mb-1">Tier 2 • 5 Refs</div>
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              1-on-1 Mock Viva
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Senior engineer code & resume defense</div>
          </div>

          <div className="p-4 rounded-xl border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#131720]">
            <div className="text-xs font-mono uppercase text-neutral-500 mb-1">Tier 3 • 10 Refs</div>
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              Campus Ambassador
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Exclusive drive fast-track & verified badge</div>
          </div>

          <div className="p-4 rounded-xl border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#131720]">
            <div className="text-xs font-mono uppercase text-neutral-500 mb-1">Anti-Cheat Audit</div>
            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Real-time Ledger
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">Zero spam, verified email OTP attributions</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Tracker & Referral Engine */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <ReferralTrackerSection />
      </div>

      {/* Program Mechanics & Anti-Fraud Architecture */}
      <div className="border-t border-[#e8e5de] dark:border-[#232833] bg-[#f5f2eb]/60 dark:bg-[#11141c]/60 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase text-neutral-500 tracking-wider">
              TRANSPARENT & SECURE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              How Peer Referral Attribution Works
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Every peer attribution is verified cryptographically with zero self-referrals and strict DPDP Act compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#141822]">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Share Your Unique Code or Link
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Send your unique <code className="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 rounded">/r/CODE</code> link via WhatsApp, LinkedIn, or QR code. The referral is permanently saved in their browser session.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#141822]">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Peer OTP Verification
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                When your peer verifies their seat with an authentic college email OTP, the system attributes +1 verified referral to your ledger instantly.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#141822]">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                Automatic Milestone Unlock
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Reaching 3, 5, or 10 verified peers immediately unlocks download badges, priority mock viva bookings, and Campus Captain credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
