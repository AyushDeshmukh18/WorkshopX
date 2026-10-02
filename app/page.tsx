import React from 'react';
import BlueprintFlow from '@/components/BlueprintFlow';
import RegistrationFlow from '@/components/RegistrationFlow';
import ProgramsSection from '@/components/ProgramsSection';
import SeniorReviews from '@/components/SeniorReviews';
import HiringNetwork from '@/components/HiringNetwork';
import AwardsAndLeadership from '@/components/AwardsAndLeadership';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function HomePage() {
  let seatsVerified = 0;
  let seatCap = 500;

  try {
    const supabase = getSupabaseServerClient();
    const { count } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'verified');

    if (count !== null && count !== undefined) {
      seatsVerified = count;
    }

    const { data: settings } = await supabase
      .from('app_settings')
      .select('registration_cap')
      .eq('id', 1)
      .maybeSingle();

    if (settings?.registration_cap) {
      seatCap = settings.registration_cap;
    }
  } catch {
    // Graceful offline fallback
  }

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-20 bg-gradient-to-b from-blue-50/50 via-[#fbfaf7] to-[#fbfaf7] dark:from-[#0b101d] dark:via-[#0b0f17] dark:to-[#0b0f17] border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust Pill Stack */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                NXTWAVE CCBP 4.0 &bull; WEF TECHNOLOGY PIONEER 2024
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono text-neutral-600 dark:text-neutral-400 bg-white dark:bg-[#151922] border border-neutral-200 dark:border-neutral-800 shadow-2xs">
                NSDC PARTNER &bull; 2,500+ HIRING COMPANIES &bull; FORBES 30 UNDER 30
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-950 dark:text-white leading-[1.12] mb-6">
              Designed to transform you into a highly skilled{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                Software & AI Professional
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Learn like top IITians, build real systems, and achieve high-paid software jobs. Join the live, free technical workshop &ldquo;Build Your First AI Project in 60 Minutes&rdquo; or explore our full-stack transformation programs.
            </p>

            {/* Quick Action CTA Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
              <a
                href="#workshop"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm font-mono uppercase px-6 py-3.5 rounded-lg shadow-sm hover:shadow transition-all"
              >
                Claim Free Workshop Seat (500 Capped) &rarr;
              </a>
              <a
                href="#programs"
                className="border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#151922] hover:bg-neutral-50 text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm font-mono uppercase px-6 py-3.5 rounded-lg transition-colors"
              >
                Explore All Programs
              </a>
              <a
                href="#hiring-partners"
                className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-blue-600 underline py-2"
              >
                View 2,500+ Hiring Companies &rarr;
              </a>
            </div>

            {/* Live Capacity Quick Ticker */}
            <div className="inline-flex items-center gap-2.5 border border-blue-300 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/40 px-4 py-2 rounded-full text-xs font-mono text-blue-800 dark:text-blue-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
              <span className="font-bold tracking-wide">
                NEXT COHORT SEATS VERIFIED: {seatsVerified} / {seatCap} MAXIMUM
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROGRAMS SECTION (Academy, Intensive, NIAT + 60-Min AI Workshop Card) */}
      <ProgramsSection />

      {/* 3. INTERACTIVE 60-MINUTE WORKSHOP ENGINE SECTION */}
      <section id="workshop" className="py-16 bg-[#f7f6f2] dark:bg-[#0c1018] border-t border-neutral-200 dark:border-neutral-800 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Flagship Technical Evaluation Lab
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Build Your First AI Project in 60 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl mx-auto leading-relaxed">
              Zero slides. Learn like top IITians: generate your personalized placement project blueprint, write production code, deploy live to the cloud, and receive a verified QR credential.
            </p>
          </div>

          {/* Interactive Blueprint Generator */}
          <div id="blueprints" className="scroll-mt-20">
            <BlueprintFlow />
          </div>

          {/* 60-Minute Execution Timeline */}
          <div className="my-10 bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-[11px] font-mono uppercase text-neutral-500 font-bold tracking-wider">
                NxtWave CCBP 4.0 Live Laboratory Structure
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-6">
              What You Build in the 60 Minutes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">00m - 15m</span>
                <span className="font-bold text-neutral-900 dark:text-white block mb-1">Scaffolding</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">Setup Next.js 16 repo, dependencies, and environment.</p>
              </div>

              <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">15m - 30m</span>
                <span className="font-bold text-neutral-900 dark:text-white block mb-1">Model Connection</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">Connect Gemini API with prompt injection defenses.</p>
              </div>

              <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">30m - 45m</span>
                <span className="font-bold text-neutral-900 dark:text-white block mb-1">Core Engine</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">Build structured outputs extraction & UI feedback loop.</p>
              </div>

              <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">45m - 55m</span>
                <span className="font-bold text-neutral-900 dark:text-white block mb-1">Cloud Deploy</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">Deploy live public HTTPS URL with zero build errors.</p>
              </div>

              <div className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50 dark:bg-neutral-900">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mb-1">55m - 60m</span>
                <span className="font-bold text-neutral-900 dark:text-white block mb-1">Audit & Cert</span>
                <p className="text-neutral-500 text-[11px] leading-relaxed">Run automated 100-pt rubric & earn verified QR credential.</p>
              </div>
            </div>
          </div>

          {/* Registration & Seat Claim Component */}
          <div id="register" className="scroll-mt-20">
            <RegistrationFlow />
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm mt-10">
            <div className="bg-white dark:bg-[#121620] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <h4 className="font-mono text-xs font-bold text-neutral-900 dark:text-white mb-2 tracking-wide uppercase">
                PRACTICAL EXECUTION
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                Zero theoretical slides. Learn like top IITians: write real code, wire LLM inference boundaries, and deploy a live public URL within 60 minutes.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121620] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <h4 className="font-mono text-xs font-bold text-neutral-900 dark:text-white mb-2 tracking-wide uppercase">
                AUTOMATED AUDIT PIPELINE
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                Submissions are audited against an objective 100-point rubric benchmarked against NxtWave&apos;s 2,500+ tech hiring partner criteria.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121620] p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
              <h4 className="font-mono text-xs font-bold text-neutral-900 dark:text-white mb-2 tracking-wide uppercase">
                CCBP 4.0 VERIFIABLE CREDENTIAL
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">
                Every successful attendee receives a tamper-proof PDF credential and permanent public ledger record with a 1-click &ldquo;Add to LinkedIn Profile&rdquo; link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AWARDS, LEADERSHIP & ACCREDITATIONS */}
      <AwardsAndLeadership />

      {/* 5. 2,500+ HIRING PARTNER COMPANIES */}
      <HiringNetwork />

      {/* 6. SENIOR PLACEMENT REVIEWS & TESTIMONIALS */}
      <SeniorReviews />

      {/* 7. FINAL INVITATION CALL TO ACTION */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-white/10 text-cyan-300 border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            LIMITED 500 VERIFIED SEATS
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Stop Attending Passive Webinars. Start Building Deployable AI Systems.
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Reserve your seat in the live 60-minute technical lab, generate your personalized placement project architecture, and stand out in campus placements.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#register"
              className="bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs sm:text-sm font-mono uppercase px-8 py-3.5 rounded-lg shadow-lg transition-colors"
            >
              Claim My Free Seat &rarr;
            </a>
            <Link
              href="/live"
              className="border border-white/30 hover:bg-white/10 text-white font-medium text-xs sm:text-sm px-6 py-3.5 rounded-lg transition-colors"
            >
              Open Live Room &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
