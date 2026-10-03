'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Building2,
  Milestone,
} from 'lucide-react';
import type { Branch } from '@/lib/validation/blueprint-schema';
import type { BacklogStatus, ProjectExperience, CtcPredictorResponse } from '@/lib/validation/ctc-predictor-schema';

export default function CtcPredictorSection() {
  const [cgpa, setCgpa] = useState<number>(7.2);
  const [branch, setBranch] = useState<Branch>('CSE');
  const [backlogs, setBacklogs] = useState<BacklogStatus>('none');
  const [experience, setExperience] = useState<ProjectExperience>('academic-crud');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CtcPredictorResponse | null>(null);

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ctc-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa,
          branch,
          backlog_status: backlogs,
          project_experience: experience,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to compute CTC prediction.');
      }

      const data: CtcPredictorResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Prediction failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ctc-predictor"
      className="scroll-mt-24 my-10 sm:my-14 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0b0f19] text-neutral-100 border border-neutral-800 relative overflow-hidden p-5 sm:p-9 shadow-2xl"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            CAMPUS PLACEMENT ELIGIBILITY &amp; CTC TIER PREDICTOR
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Are You Trapped in the ₹3.5 LPA Mass Recruiter Bucket?
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            In campus drives, students with identical CGPAs get divided into{' '}
            <strong className="text-neutral-200">₹3.5 LPA mass roles</strong> vs.{' '}
            <span className="text-emerald-400 font-semibold">₹7.5 - ₹9.5 LPA differential packages</span>{' '}
            purely based on whether they have a live, production-grade AI project. Calculate your eligibility leap below.
          </p>
        </div>

        {/* Input Controls Grid */}
        <div className="max-w-4xl mx-auto bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 mb-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {/* 1. CGPA Slider */}
            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-mono uppercase text-neutral-400 font-bold">
                  1. Current CGPA
                </label>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                  {cgpa.toFixed(1)} / 10.0
                </span>
              </div>
              <input
                type="range"
                min="5.0"
                max="9.9"
                step="0.1"
                value={cgpa}
                onChange={(e) => setCgpa(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>5.0</span>
                <span>7.5</span>
                <span>9.9</span>
              </div>
            </div>

            {/* 2. Branch */}
            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <label className="block text-[11px] font-mono uppercase text-neutral-400 font-bold mb-2">
                2. Branch
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'] as Branch[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={`py-1 text-[11px] font-mono font-semibold rounded transition-all ${
                      branch === b
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Backlog Status */}
            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <label className="block text-[11px] font-mono uppercase text-neutral-400 font-bold mb-2">
                3. Backlogs Status
              </label>
              <div className="flex flex-col gap-1 text-[11px] font-mono">
                {[
                  { id: 'none', label: '0 Backlogs (Clean)' },
                  { id: 'cleared', label: 'Past Cleared Backlogs' },
                  { id: 'active', label: '1+ Active Backlog' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBacklogs(item.id as BacklogStatus)}
                    className={`py-1 px-2 rounded text-left transition-all ${
                      backlogs === item.id
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Current Project Level */}
            <div className="bg-neutral-950 p-3.5 rounded-lg border border-neutral-800">
              <label className="block text-[11px] font-mono uppercase text-neutral-400 font-bold mb-2">
                4. Existing Projects
              </label>
              <div className="flex flex-col gap-1 text-[11px] font-mono">
                {[
                  { id: 'none', label: 'No Projects Yet' },
                  { id: 'academic-crud', label: 'Basic Academic CRUD' },
                  { id: 'mini-project', label: 'Standard Mini-Project' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExperience(item.id as ProjectExperience)}
                    className={`py-1 px-2 rounded text-left transition-all ${
                      experience === item.id
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handlePredict}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-lg font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-500 hover:from-amber-400 hover:to-emerald-400 text-neutral-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></span>
                <span>Evaluating Campus Eligibility &amp; CTC Leap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>Calculate Placement CTC Leap &amp; Eligibility &rarr;</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Results Display */}
        {result && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 1. The CTC Leap Comparison Banner */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 sm:p-7 shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-3">
                Calculated Campus Compensation Leap
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Current CTC */}
                <div className="p-4 rounded-xl bg-neutral-900/90 border border-neutral-800">
                  <span className="block text-[10px] font-mono text-neutral-500 uppercase mb-1">
                    Current Placement Trajectory
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-400 block mb-1">
                    {result.current_estimated_ctc}
                  </span>
                  <span className="text-xs text-neutral-400 leading-tight block">
                    {result.current_tier_name}
                  </span>
                </div>

                {/* The Leap Badge */}
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/30">
                  <span className="text-xs font-mono font-bold text-emerald-400 block mb-1">
                    {result.ctc_leap_amount}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    STARTING SALARY SURGE
                  </span>
                  <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded block truncate">
                    {result.three_year_compounding_delta}
                  </span>
                </div>

                {/* Projected CTC */}
                <div className="p-4 rounded-xl bg-neutral-900/90 border border-emerald-500/40">
                  <span className="block text-[10px] font-mono text-emerald-400 uppercase mb-1">
                    Post-Workshop Trajectory
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-400 block mb-1">
                    {result.projected_estimated_ctc}
                  </span>
                  <span className="text-xs text-neutral-300 leading-tight block">
                    {result.projected_tier_name}
                  </span>
                </div>
              </div>

              {/* Recruiter Verdict */}
              <div className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-300 leading-relaxed font-mono">
                <p>
                  <strong className="text-amber-400">Recruiter Verdict:</strong> {result.eligibility_verdict}
                </p>
              </div>
            </div>

            {/* 2. Company-by-Company Eligibility Matrix */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 block mb-3 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                Target Company Eligibility Breakdown
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {result.company_eligibility.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-white text-xs">{comp.company}</span>
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            comp.eligibility_status === 'eligible'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : comp.eligibility_status === 'conditional'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {comp.eligibility_status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400 mb-1.5">{comp.ctc_range} &bull; {comp.track_name}</div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{comp.requirement_note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. The 3-Milestone Differential Leap Plan */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-5 shadow-lg">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 block mb-3 flex items-center gap-1.5">
                <Milestone className="w-4 h-4" />
                The 3-Milestone Differential Upgrade Roadmap
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {result.the_3_milestone_leap_plan.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-neutral-900/90 border border-neutral-800 space-y-1.5">
                    <span className="font-mono font-bold text-amber-400 text-[11px] block">{step.milestone}</span>
                    <p className="text-[11px] text-neutral-300 leading-relaxed">{step.description}</p>
                    <div className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 p-1.5 rounded border border-emerald-900/50 mt-1">
                      &bull; Action: {step.action}
                    </div>
                  </div>
                ))}
              </div>

              {/* Conversion Footer Hook */}
              <div className="mt-5 pt-4 border-t border-neutral-800">
                <p className="text-xs text-neutral-400 mb-3 italic">
                  <strong>How the 60-Min Workshop Bridges This:</strong> {result.why_workshop_bridges_the_gap}
                </p>

                <a
                  href="#register"
                  className="w-full py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-neutral-950 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Lock Your Free Seat &amp; Claim The Differential Project (500 Cap)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <p className="text-[10px] font-mono text-center text-neutral-500 mt-2">
                  <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-400" />
                  Free 60-Minute Workshop &bull; Verifiable QR Credential Included
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
