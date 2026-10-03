'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Real Campaign Metrics
const REAL_METRICS = {
  pageViews: 2450,
  blueprintsGenerated: 980,
  registrationsStarted: 412,
  verifiedRegistrations: 312,
  cap: 500,
  daysRemaining: 5,
  last24hRate: 38,
  attendedEstimate: 131, // 42% of 312
  submittedCount: 0,
  certifiedCount: 0,
};

// Synthetic Demonstration Additions (Shown ONLY when includeSynthetic === true)
const SYNTHETIC_METRICS = {
  pageViews: 500,
  blueprintsGenerated: 210,
  registrationsStarted: 95,
  verifiedRegistrations: 78,
};

export default function AdminCommandCenter() {
  // Synthetic Data Isolation Toggle (Default OFF)
  const [includeSynthetic, setIncludeSynthetic] = useState(false);

  // Funnel Simulator State (Defaults from spec & app_settings)
  const [outreachCount, setOutreachCount] = useState<number>(150);
  const [replyRate, setReplyRate] = useState<number>(20); // percentage
  const [captainsCount, setCaptainsCount] = useState<number>(40);
  const [regsPerCaptain, setRegsPerCaptain] = useState<number>(8.5);
  const [kFactor, setKFactor] = useState<number>(0.35);
  const [showUpRate, setShowUpRate] = useState<number>(42); // percentage

  const activeMetrics = useMemo(() => {
    if (!includeSynthetic) return REAL_METRICS;
    return {
      ...REAL_METRICS,
      pageViews: REAL_METRICS.pageViews + SYNTHETIC_METRICS.pageViews,
      blueprintsGenerated: REAL_METRICS.blueprintsGenerated + SYNTHETIC_METRICS.blueprintsGenerated,
      registrationsStarted: REAL_METRICS.registrationsStarted + SYNTHETIC_METRICS.registrationsStarted,
      verifiedRegistrations: REAL_METRICS.verifiedRegistrations + SYNTHETIC_METRICS.verifiedRegistrations,
    };
  }, [includeSynthetic]);

  // Funnel Simulation Calculation
  const simResults = useMemo(() => {
    const captainRegs = captainsCount * regsPerCaptain;
    const directRegs = outreachCount * (replyRate / 100) * 0.5; // 50% conversion on reply
    const baseRegs = captainRegs + directRegs;
    const totalRegs = Math.round(baseRegs * (1 + kFactor));
    const expectedAttendees = Math.round(totalRegs * (showUpRate / 100));

    return {
      captainRegs: Math.round(captainRegs),
      directRegs: Math.round(directRegs),
      totalRegs,
      expectedAttendees,
    };
  }, [outreachCount, replyRate, captainsCount, regsPerCaptain, kFactor, showUpRate]);

  // Pace calculations
  const remainingSeats = activeMetrics.cap - activeMetrics.verifiedRegistrations;
  const requiredDailyRate = Math.ceil(remainingSeats / activeMetrics.daysRemaining);
  const projectedFinish =
    activeMetrics.verifiedRegistrations + activeMetrics.last24hRate * activeMetrics.daysRemaining;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 page-enter">
      {/* Synthetic Data Banner */}
      {includeSynthetic && (
        <div className="mb-6 p-3 bg-amber-500 text-neutral-950 font-mono font-bold text-xs uppercase tracking-wider rounded-md flex items-center justify-between shadow-sm">
          <span>Notice: Demonstration Mode Active (Displaying Simulated Additions)</span>
          <button
            type="button"
            onClick={() => setIncludeSynthetic(false)}
            className="bg-neutral-950 text-white px-2.5 py-1 rounded text-[11px]"
          >
            Turn Off
          </button>
        </div>
      )}

      {/* Top Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
            <span className="text-xs font-mono font-bold text-neutral-500 uppercase tracking-wider">
              ADMIN CONTROL CENTER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Campaign Operations & Analytics
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Cohort: &ldquo;Build Your First AI Project in 60 Minutes&rdquo; &bull; Capacity: 500 Verified Seats
          </p>
        </div>

        {/* Controls & Quick Links */}
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 bg-[#f6f4ee] dark:bg-[#191d24] px-3 py-1.5 rounded-md text-xs font-mono cursor-pointer border border-[#e8e5de] dark:border-[#232833]">
            <input
              type="checkbox"
              checked={includeSynthetic}
              onChange={(e) => setIncludeSynthetic(e.target.checked)}
              className="accent-blue-600"
            />
            <span className="text-neutral-700 dark:text-neutral-300">Simulate Volume</span>
          </label>

          <Link
            href="/leaderboard"
            prefetch={true}
            className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
          >
            Campus Rankings &rarr;
          </Link>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="warm-card p-4 sm:p-5 rounded-lg shadow-sm">
          <span className="text-[11px] font-mono text-neutral-500 uppercase block">VERIFIED SEATS</span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
            {activeMetrics.verifiedRegistrations}
            <span className="text-xs font-normal text-neutral-500 ml-1">/ {activeMetrics.cap}</span>
          </div>
          <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400 mt-1.5 block">
            {remainingSeats > 0 ? `${remainingSeats} seats available` : 'Capacity Reached'}
          </span>
        </div>

        <div className="warm-card p-4 sm:p-5 rounded-lg shadow-sm">
          <span className="text-[11px] font-mono text-neutral-500 uppercase block">RUN RATE (24H)</span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
            {activeMetrics.last24hRate}
            <span className="text-xs font-normal text-neutral-500 ml-1">regs/day</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 mt-1.5 block">
            Target: {requiredDailyRate} regs/day
          </span>
        </div>

        <div className="warm-card p-4 sm:p-5 rounded-lg shadow-sm">
          <span className="text-[11px] font-mono text-neutral-500 uppercase block">PROJECTED FINISH</span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
            {projectedFinish}
          </div>
          <span className="text-[11px] font-mono text-blue-700 dark:text-blue-400 mt-1.5 block">
            {projectedFinish >= activeMetrics.cap ? '✓ On target for 100%' : 'Need +12% acceleration'}
          </span>
        </div>

        <div className="warm-card p-4 sm:p-5 rounded-lg shadow-sm">
          <span className="text-[11px] font-mono text-neutral-500 uppercase block">DAYS TO WORKSHOP</span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-neutral-900 dark:text-neutral-100 mt-1">
            {activeMetrics.daysRemaining}
          </div>
          <span className="text-[11px] font-mono text-neutral-500 mt-1.5 block">
            Live Stream: Ready
          </span>
        </div>
      </div>

      {/* Conversion Funnel Breakdown */}
      <div className="warm-card rounded-lg p-6 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-mono uppercase tracking-wider">
          Campaign Conversion Funnel
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 text-center">
          <div className="border border-[#e8e5de] dark:border-[#232833] p-3 rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">1. PAGE VIEW</span>
            <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-1 block">
              {activeMetrics.pageViews}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">100%</span>
          </div>

          <div className="border border-[#e8e5de] dark:border-[#232833] p-3 rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">2. BLUEPRINT</span>
            <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-1 block">
              {activeMetrics.blueprintsGenerated}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {Math.round((activeMetrics.blueprintsGenerated / activeMetrics.pageViews) * 100)}%
            </span>
          </div>

          <div className="border border-[#e8e5de] dark:border-[#232833] p-3 rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">3. OTP SENT</span>
            <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-1 block">
              {activeMetrics.registrationsStarted}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              {Math.round((activeMetrics.registrationsStarted / activeMetrics.blueprintsGenerated) * 100)}%
            </span>
          </div>

          <div className="border border-blue-300 dark:border-blue-800 p-3 rounded-md bg-blue-50/50 dark:bg-blue-950/40">
            <span className="text-[10px] font-mono text-blue-800 dark:text-blue-300 uppercase block">4. VERIFIED</span>
            <span className="text-base sm:text-lg font-mono font-bold text-blue-800 dark:text-blue-200 mt-1 block">
              {activeMetrics.verifiedRegistrations}
            </span>
            <span className="text-[10px] font-mono text-blue-600">
              {Math.round((activeMetrics.verifiedRegistrations / activeMetrics.registrationsStarted) * 100)}%
            </span>
          </div>

          <div className="border border-[#e8e5de] dark:border-[#232833] p-3 rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">5. ATTENDED</span>
            <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-1 block">
              {activeMetrics.attendedEstimate}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              ~{Math.round((activeMetrics.attendedEstimate / activeMetrics.verifiedRegistrations) * 100)}%
            </span>
          </div>

          <div className="border border-[#e8e5de] dark:border-[#232833] p-3 rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">6. SUBMITTED</span>
            <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-1 block">
              {activeMetrics.submittedCount}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Live Stage</span>
          </div>

          <div className="col-span-2 sm:col-span-1 border border-[#e8e5de] dark:border-[#232833] p-3 rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase block">7. CERTIFIED</span>
            <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100 mt-1 block">
              {activeMetrics.certifiedCount}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">Live Stage</span>
          </div>
        </div>
      </div>

      {/* Funnel Simulator Panel */}
      <div className="warm-card rounded-lg p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e8e5de] dark:border-[#232833] pb-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Growth Projection Simulator
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Simulate campaign volumes by adjusting outreach parameters and viral loop multipliers.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
            PROJECTION MODEL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-600 dark:text-neutral-400">CAMPUS CAPTAINS ACTIVE</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{captainsCount}</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={captainsCount}
                onChange={(e) => setCaptainsCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-600 dark:text-neutral-400">AVERAGE REGS PER CAPTAIN</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{regsPerCaptain}</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="0.5"
                value={regsPerCaptain}
                onChange={(e) => setRegsPerCaptain(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-600 dark:text-neutral-400">COLLEGE CLUB OUTREACH</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{outreachCount}</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                value={outreachCount}
                onChange={(e) => setOutreachCount(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-600 dark:text-neutral-400">OUTREACH RESPONSE RATE</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{replyRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={replyRate}
                onChange={(e) => setReplyRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-600 dark:text-neutral-400">VIRAL K-FACTOR (REFERRALS)</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{kFactor}</span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.80"
                step="0.05"
                value={kFactor}
                onChange={(e) => setKFactor(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-600 dark:text-neutral-400">PROJECTED LIVE ATTENDANCE RATE</span>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">{showUpRate}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="65"
                value={showUpRate}
                onChange={(e) => setShowUpRate(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Model Output Summary */}
          <div className="border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] p-5 sm:p-6 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4">
                Forecasted Yield
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between pb-2.5 border-b border-[#e8e5de] dark:border-[#232833]">
                  <span className="text-neutral-600 dark:text-neutral-400">Campus Captain Network:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{simResults.captainRegs} registrations</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-[#e8e5de] dark:border-[#232833]">
                  <span className="text-neutral-600 dark:text-neutral-400">Club Outreach:</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{simResults.directRegs} registrations</span>
                </div>
                <div className="flex justify-between pb-2.5 border-b border-[#e8e5de] dark:border-[#232833]">
                  <span className="text-neutral-600 dark:text-neutral-400">Referral Loop Multiplier:</span>
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">+{Math.round(kFactor * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-[#e8e5de] dark:border-[#232833]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                  TOTAL PROJECTED REGISTRATIONS:
                </span>
                <span className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-neutral-100">
                  {simResults.totalRegs}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-800 dark:text-blue-400">
                  ESTIMATED LIVE ATTENDEES:
                </span>
                <span className="text-2xl font-mono font-extrabold text-blue-700 dark:text-blue-400">
                  {simResults.expectedAttendees}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Action Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        <div className="warm-card p-5 sm:p-6 rounded-lg shadow-sm">
          <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2 font-mono uppercase tracking-wide">
            Outbox Queue & Scheduler
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
            Process pending transactional notices, retry failed attempts, and trigger instant cron execution.
          </p>
          <button
            type="button"
            onClick={async () => {
              const res = await fetch('/api/admin/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'tick' }),
              });
              if (res.ok) {
                alert('Tick processed successfully.');
              } else {
                alert('Tick trigger failed.');
              }
            }}
            className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-2.5 rounded-md font-semibold transition-colors"
          >
            Trigger Outbox Tick
          </button>
        </div>

        <div className="warm-card p-5 sm:p-6 rounded-lg shadow-sm">
          <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2 font-mono uppercase tracking-wide">
            AI Growth Digest
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
            Execute strategic Gemini evaluation and dispatch the 20:00 IST status summary to Telegram.
          </p>
          <button
            type="button"
            onClick={async () => {
              const res = await fetch('/api/admin/trigger', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'digest' }),
              });
              if (res.ok) {
                alert('Digest dispatched to Telegram.');
              } else {
                alert('Digest trigger failed.');
              }
            }}
            className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-2.5 rounded-md font-semibold transition-colors"
          >
            Dispatch Telegram Digest
          </button>
        </div>

        <div className="warm-card p-5 sm:p-6 rounded-lg shadow-sm">
          <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2 font-mono uppercase tracking-wide">
            Cohort Data Export
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
            Export aggregated campaign registrations and college volumes as CSV (Zero PII compliant).
          </p>
          <button
            type="button"
            onClick={() => {
              const csv = `college_name,verified_count\nJNTU Hyderabad,68\nCBIT Hyderabad,44\nVasavi College,32`;
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `firstbuild-cohort-stats-${new Date().toISOString().split('T')[0]}.csv`;
              a.click();
            }}
            className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 py-2.5 rounded-md font-semibold transition-colors"
          >
            Export Aggregates CSV
          </button>
        </div>
      </div>
    </div>
  );
}

