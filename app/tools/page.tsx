import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import AiPlacementSuite from '@/components/AiPlacementSuite';
import { ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Placement & Career Suite | 9 Free Tools | NxtWave CCBP 4.0',
  description:
    '9 Free industry-grade AI & career tools for engineering students: ATS Resume Scanner, GitHub Repo Doctor, Recruiter Cold InMail Pitcher, FAANG README Visualizer, Non-CSE Career Bridge Roadmap, CTC Tier Leap Predictor, IEEE Project Synopsis, 2026 Tech Market Radar, and AI Blueprint Generator.',
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      {/* Top Banner & Breadcrumb Header */}
      <div className="border-b border-neutral-800 bg-[#0c111c] py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <span>/</span>
            <span className="text-cyan-400 font-semibold font-mono">AI Placement Suite</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden xl:inline text-neutral-400">
              Limited 500 verified seats available for the live 60-min laboratory
            </span>
            <Link
              href="/#register"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-mono uppercase tracking-wider transition-colors shadow-xs shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Claim Free Seat</span>
            </Link>
          </div>
        </div>
      </div>

      {/* The 6-in-1 Dedicated Tool Suite */}
      <AiPlacementSuite />

      {/* Bottom Sticky Action Banner */}
      <div className="border-t border-neutral-800 bg-gradient-to-r from-blue-950/80 via-[#0d1424] to-indigo-950/80 py-10 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-cyan-300 border border-blue-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>DEPLOY A LIVE AI SYSTEM IN 60 MINUTES</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Put These Metrics Into Action?
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of engineering students from IITs and 25+ colleges in the live, hands-on workshop. Build your personalized AI project, deploy live to cloud, and earn a verified QR credential.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#register"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm font-mono uppercase tracking-wider shadow-lg transition-all"
            >
              Book Free Workshop Seat &rarr;
            </Link>
            <Link
              href="/live"
              className="px-5 py-3 rounded-xl border border-neutral-700 hover:bg-neutral-800/60 text-neutral-200 font-medium text-xs sm:text-sm transition-colors"
            >
              Open Live Workshop Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
