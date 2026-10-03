'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Copy,
  Check,
  Share2,
  Award,
  Sparkles,
  QrCode,
  ShieldCheck,
  ExternalLink,
  Search,
  RefreshCw,
  Gift,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface ReferralRecord {
  id: string;
  masked_name: string;
  college: string;
  status: string;
  created_at: string;
}

interface TrackerData {
  found: boolean;
  student_name: string;
  college_name: string;
  seat_number: number;
  referral_code: string;
  referral_link: string;
  verified_count: number;
  pending_count: number;
  rejected_count: number;
  total_attributed: number;
  tier_1_unlocked: boolean;
  tier_2_unlocked: boolean;
  tier_3_unlocked: boolean;
  recent_referrals: ReferralRecord[];
}

export default function ReferralTrackerSection({
  initialCode = 'FB8X91K2',
}: {
  initialCode?: string;
}) {
  const [queryInput, setQueryInput] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TrackerData | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const fetchTrackerData = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/referral/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData(initialCode);
  }, [initialCode]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrackerData(queryInput);
  };

  const activeData = data || {
    found: true,
    student_name: 'Campus Ambassador',
    college_name: 'Engineering Campus',
    seat_number: 42,
    referral_code: queryInput.toUpperCase() || 'FB8X91K2',
    referral_link: `http://localhost:3000/r/${queryInput.toUpperCase() || 'FB8X91K2'}`,
    verified_count: 3,
    pending_count: 1,
    rejected_count: 0,
    total_attributed: 4,
    tier_1_unlocked: true,
    tier_2_unlocked: false,
    tier_3_unlocked: false,
    recent_referrals: [
      {
        id: '1',
        masked_name: 'Anan***',
        college: 'Chaitanya Bharathi Institute of Technology',
        status: 'verified',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: '2',
        masked_name: 'Rahi***',
        college: 'VNR Vignana Jyothi Institute',
        status: 'verified',
        created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
      },
      {
        id: '3',
        masked_name: 'Sneh***',
        college: 'Gokaraju Rangaraju Institute',
        status: 'verified',
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
    ],
  };

  const whatsappMessage = encodeURIComponent(
    `🔥 Hey! I just registered for NxtWave's free live workshop "Build Your First AI Project in 60 Minutes" to get a verified Next.js + LLM project on my placement resume.\n\nUse my invite link to claim your free seat & unlock priority placement viva review: ${activeData.referral_link}`
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(activeData.referral_link)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(activeData.referral_link)}&text=${encodeURIComponent('Join the free 60-min AI project workshop with verified placement credential!')}`;

  return (
    <div className="space-y-6">
      {/* Lookup Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Enter your referral code (e.g. FB8X91K2) or registered email..."
            className="w-full bg-[#0c111d] border border-neutral-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm font-mono uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Tracking...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Track Referrals
            </>
          )}
        </button>
      </form>

      {/* Hero Referral Passport Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#11192e] via-[#0d1424] to-[#070b14] border border-neutral-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800/80 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-cyan-400 border border-cyan-500/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                VERIFIED REFERRAL PASSPORT &bull; SEAT #{activeData.seat_number}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeData.student_name}
              </h2>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{activeData.college_name}</p>
            </div>

            {/* Counter Badge */}
            <div className="p-4 rounded-xl bg-black/40 border border-neutral-800 text-left sm:text-right shrink-0">
              <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold block">VERIFIED ATTRIBUTIONS</span>
              <span className="text-3xl font-mono font-black text-cyan-400">
                {activeData.verified_count} <span className="text-xs text-neutral-400">/ 10 Goal</span>
              </span>
            </div>
          </div>

          {/* Referral Code & URL Dual Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* 1. Referral Code */}
            <div className="p-4 rounded-xl bg-[#090e1a] border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">YOUR UNIQUE REFERRAL CODE</span>
                <span className="text-xl sm:text-2xl font-mono font-black text-white tracking-widest mt-0.5 block">
                  {activeData.referral_code}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(activeData.referral_code)}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            {/* 2. Referral Link */}
            <div className="p-4 rounded-xl bg-[#090e1a] border border-neutral-800 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-mono uppercase text-neutral-400 font-bold block">SHAREABLE INVITE LINK</span>
                <span className="text-xs font-mono text-cyan-300 truncate block mt-1">
                  {activeData.referral_link}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyLink(activeData.referral_link)}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 1-Click Multi-Channel Share Bar */}
          <div className="p-4 rounded-xl bg-black/30 border border-neutral-800 mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-blue-400" />
              1-Click Viral Share:
            </span>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm min-h-[42px]"
              >
                <span>WhatsApp Pitch</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 rounded-lg bg-[#0077b5] hover:bg-[#006097] text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm min-h-[42px]"
              >
                <span>LinkedIn Post</span>
              </a>

              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 rounded-lg bg-[#229ED9] hover:bg-[#1e8cc0] text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm min-h-[42px]"
              >
                <span>Telegram</span>
              </a>

              <button
                type="button"
                onClick={() => setShowQrModal(!showQrModal)}
                className="w-full sm:w-auto justify-center px-3.5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold text-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer min-h-[42px]"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Show QR Code</span>
              </button>
            </div>
          </div>

          {/* QR Code Modal Box */}
          {showQrModal && (
            <div className="mb-8 p-4 sm:p-6 rounded-xl bg-[#090d16] border border-neutral-700 text-center space-y-3 animate-in fade-in zoom-in-95 duration-150 max-w-full overflow-hidden">
              <h4 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" />
                Scan to Join with {activeData.referral_code}
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Project this on classroom screens or print on hostel notice boards. Students scanning this automatically attribute referrals to you.
              </p>
              <div className="inline-block p-3 sm:p-4 bg-white rounded-xl shadow-xl max-w-full">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(activeData.referral_link)}`}
                  alt="Referral QR Code"
                  className="w-36 h-36 sm:w-40 sm:h-40 mx-auto"
                />
              </div>
              <div className="max-w-full overflow-hidden px-2">
                <span className="text-[11px] font-mono text-neutral-400 block break-all">
                  Target Link: <code className="text-cyan-300 break-all">{activeData.referral_link}</code>
                </span>
              </div>
            </div>
          )}

          {/* Gamified Milestone Progress Tracker */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-neutral-300 uppercase flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-amber-400" />
                Milestone Reward Unlocks
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {activeData.verified_count} of 10 Attributions Met
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-neutral-900 border border-neutral-800 h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min((activeData.verified_count / 10) * 100, 100)}%` }}
              />
            </div>

            {/* 3 Milestone Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Tier 1 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  activeData.tier_1_unlocked
                    ? 'bg-blue-950/30 border-blue-500/50 shadow-md shadow-blue-500/10'
                    : 'bg-[#090d16] border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-neutral-300">🥉 3 REFERRALS</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      activeData.tier_1_unlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {activeData.tier_1_unlocked ? 'UNLOCKED' : `${Math.max(0, 3 - activeData.verified_count)} MORE`}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">Priority Code Review</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Your project gets direct line-by-line feedback from senior instructors during the live lab.
                </p>
              </div>

              {/* Tier 2 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  activeData.tier_2_unlocked
                    ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-[#090d16] border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-neutral-300">🥈 5 REFERRALS</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      activeData.tier_2_unlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {activeData.tier_2_unlocked ? 'UNLOCKED' : `${Math.max(0, 5 - activeData.verified_count)} MORE`}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">1-on-1 SDE Mock Interview</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  30-minute private technical placement viva simulation with an industry software engineer.
                </p>
              </div>

              {/* Tier 3 */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  activeData.tier_3_unlocked
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-[#090d16] border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-neutral-300">🥇 10 REFERRALS</span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      activeData.tier_3_unlocked
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {activeData.tier_3_unlocked ? 'UNLOCKED' : `${Math.max(0, 10 - activeData.verified_count)} MORE`}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-white mb-1">Campus Captain Honor Roll</h5>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Official NxtWave Leadership Credential + special differential placement recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Attribution Audit Ledger */}
          <div className="p-5 rounded-xl bg-[#090e1a] border border-neutral-800 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-mono uppercase font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Live Attribution Audit Ledger
              </h4>
              <span className="text-[11px] font-mono text-neutral-400">
                Anti-Fraud Engine Active &bull; IP Deduplicated
              </span>
            </div>

            {activeData.recent_referrals.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3 text-center">
                No peer registrations recorded yet. Share your invite link to start unlocking milestone rewards!
              </p>
            ) : (
              <div className="overflow-x-auto w-full pb-2 scrollbar-thin">
                <table className="w-full text-left text-xs min-w-[440px]">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 font-mono text-[10px] uppercase">
                      <th className="pb-2">Referred Student</th>
                      <th className="pb-2">Campus Institution</th>
                      <th className="pb-2">Verification Status</th>
                      <th className="pb-2 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    {activeData.recent_referrals.map((ref) => (
                      <tr key={ref.id} className="text-neutral-300">
                        <td className="py-2.5 font-bold text-white">{ref.masked_name}</td>
                        <td className="py-2.5 text-neutral-400 text-[11px]">{ref.college}</td>
                        <td className="py-2.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              ref.status === 'verified'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : ref.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {ref.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 text-right text-neutral-500 text-[11px]">
                          {new Date(ref.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Fast-Track to Campus Captain Kit */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-[#101726] to-indigo-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 block mb-0.5">
                LEAD YOUR COLLEGE COHORT
              </span>
              <p className="text-xs text-neutral-300">
                Access forward-ready WhatsApp messages in English, Hindi, and Telugu tailored for your campus.
              </p>
            </div>
            <Link
              href={`/captain/${activeData.referral_code}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-colors shrink-0 shadow-md shadow-blue-600/20"
            >
              <span>Launch Captain Kit</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
