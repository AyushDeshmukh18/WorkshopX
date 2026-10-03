'use client';

import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  BookOpen,
  Building2,
  GraduationCap,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  Flame
} from 'lucide-react';
import type {
  CareerBridgeRequest,
  CareerBridgeResponse,
  NonCseBranch,
  StudentYear,
  CodingExperience
} from '@/lib/validation/non-cse-roadmap-schema';

const BRANCH_PILLS: Array<{ id: NonCseBranch; label: string; icon: string }> = [
  { id: 'mechanical', label: 'Mechanical', icon: '⚙️' },
  { id: 'civil', label: 'Civil', icon: '🏗️' },
  { id: 'eee', label: 'EEE / Electrical', icon: '⚡' },
  { id: 'chemical', label: 'Chemical', icon: '🧪' },
  { id: 'biotech', label: 'Biotech', icon: '🧬' },
  { id: 'metallurgy', label: 'Metallurgy', icon: '🔬' },
  { id: 'other-non-it', label: 'Other Non-IT', icon: '📐' },
];

export default function CareerBridgeSection() {
  const [formData, setFormData] = useState<CareerBridgeRequest>({
    branch: 'mechanical',
    current_year: '3rd-year',
    prior_experience: 'basic-c-or-python',
    target_role: 'Full-Stack Software Development Engineer (SDE-1)',
    target_ctc_tier: '₹8.5–12 LPA',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CareerBridgeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/career-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate career bridge roadmap.');
      }

      const data: CareerBridgeResponse = await res.json();
      setResult(data);
      setActivePhaseIndex(0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summary = `NxtWave 90-Day Tech Bridge Roadmap for ${result.branch_display_name}
Target Role: ${formData.target_role} | Target CTC: ${formData.target_ctc_tier}

${result.phases
  .map(
    (p) =>
      `--- ${p.phase_title} (${p.phase_duration}) ---\nObjective: ${p.phase_objective}\n` +
      p.weekly_milestones
        .map((m) => `  * ${m.week}: ${m.title} -> Milestone Project: ${m.milestone_project}`)
        .join('\n')
  )
  .join('\n\n')}

Day 1 Action Item:
${result.day_1_action_item}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      id="career-bridge"
      className="scroll-mt-24 my-8 rounded-2xl bg-gradient-to-b from-[#131b2e] via-[#0d1322] to-[#070b14] text-neutral-100 border border-neutral-800 p-5 sm:p-9 shadow-2xl relative overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            <Compass className="w-3.5 h-3.5" />
            NON-CSE TO TECH CAREER BRIDGE &bull; 100% FREE AI
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Non-CSE to Tech Career Bridge Roadmap Planner
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl mx-auto leading-relaxed">
            Mechanical, Civil, EEE, and Chemical students are not locked out of high-paying tech jobs.
            Map your exact 90-day transition roadmap, filter out irrelevant academic theory, and focus exclusively on core placement requirements: high-yield DSA, modern Full-Stack &amp; Generative AI proof-of-work.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="bg-[#101726]/90 border border-neutral-800 rounded-xl p-5 sm:p-7 mb-8 shadow-lg">
          {/* Branch Pill Selector */}
          <div className="mb-6">
            <label className="block text-xs font-mono uppercase font-bold text-neutral-400 tracking-wider mb-2.5">
              1. Select Your Engineering Branch
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {BRANCH_PILLS.map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, branch: pill.id })}
                  className={`px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    formData.branch === pill.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/10 font-bold'
                      : 'bg-[#090d16] text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  <span>{pill.icon}</span>
                  <span>{pill.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Current Academic Year</label>
              <select
                value={formData.current_year}
                onChange={(e) => setFormData({ ...formData, current_year: e.target.value as StudentYear })}
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="1st-year">1st Year (B.Tech / B.E.)</option>
                <option value="2nd-year">2nd Year (Pre-Placement Prep)</option>
                <option value="3rd-year">3rd Year (Crucial Placement Window)</option>
                <option value="4th-year">4th Year (Final Year / Off-Campus)</option>
                <option value="recent-graduate">Recent Graduate (Passed Out)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Prior Coding Experience</label>
              <select
                value={formData.prior_experience}
                onChange={(e) => setFormData({ ...formData, prior_experience: e.target.value as CodingExperience })}
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="absolute-beginner">Absolute Beginner (Zero Coding)</option>
                <option value="basic-c-or-python">Basic C / Python (College Labs)</option>
                <option value="moderate">Moderate (Familiar with Loops/Arrays)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Target Engineering Role</label>
              <input
                type="text"
                value={formData.target_role}
                onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                placeholder="e.g. SDE-1 / Full-Stack Engineer"
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Target CTC Tier</label>
              <select
                value={formData.target_ctc_tier}
                onChange={(e) => setFormData({ ...formData, target_ctc_tier: e.target.value })}
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
              >
                <option value="₹6.5–9.0 LPA">₹6.5–9.0 LPA (Differential Track)</option>
                <option value="₹9.0–14.0 LPA">₹9.0–14.0 LPA (Product Tier)</option>
                <option value="₹15.0+ LPA">₹15.0+ LPA (FAANG / High-Growth Startup)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-800">
            <span className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Includes verified NxtWave branch transitions &amp; 90-day milestone deliverables
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black hover:opacity-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Mapping 90-Day Transition with OpenRouter...
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  Synthesize 90-Day Transition Roadmap
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-sm flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
            <div>
              <p className="font-semibold">Failed to synthesize roadmap</p>
              <p className="text-xs text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results Area */}
        {result && (
          <div className="space-y-6">
            {/* Superpower & Advantage Banner */}
            <div className="bg-gradient-to-r from-amber-950/30 via-[#131b2e] to-blue-950/30 border border-amber-500/30 rounded-xl p-5 sm:p-7 shadow-xl">
              <div className="flex items-start gap-3 mb-4">
                <Flame className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {result.branch_display_name} Engineering Superpower
                  </h3>
                  <p className="text-sm text-amber-200/90 mt-1 italic">
                    &ldquo;{result.superpower_quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-800/80">
                {result.core_engineering_advantages.map((adv, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/40 border border-neutral-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-neutral-300 leading-snug">{adv}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 90-Day Timeline Phase Navigator */}
            <div className="bg-[#101726]/90 border border-neutral-800 rounded-xl p-5 sm:p-7 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-400" />
                    90-Day Accelerated Placement Blueprint
                  </h3>
                  <p className="text-xs text-neutral-400">Zero academic fluff • Targeted strictly for placement technical rounds</p>
                </div>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Roadmap Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy 90-Day Summary
                    </>
                  )}
                </button>
              </div>

              {/* Phase Switcher Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {result.phases.map((phase, idx) => (
                  <button
                    key={phase.phase_number}
                    type="button"
                    onClick={() => setActivePhaseIndex(idx)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      activePhaseIndex === idx
                        ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/5'
                        : 'bg-[#090d16] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-mono font-bold ${activePhaseIndex === idx ? 'text-amber-400' : 'text-neutral-400'}`}>
                        Month {idx + 1}
                      </span>
                      <span className="text-[11px] text-neutral-500 font-mono">{phase.phase_duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-white line-clamp-1">{phase.phase_title}</p>
                  </button>
                ))}
              </div>

              {/* Active Phase Details */}
              {result.phases[activePhaseIndex] && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#090d16] border border-neutral-800">
                    <span className="text-[11px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                      Phase Focus &amp; Objective
                    </span>
                    <p className="text-sm text-neutral-200 mt-1">
                      {result.phases[activePhaseIndex].phase_objective}
                    </p>
                  </div>

                  {/* Weekly Milestone Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.phases[activePhaseIndex].weekly_milestones.map((m, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#0b101c] border border-neutral-800 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-neutral-800 text-amber-300">
                              {m.week}
                            </span>
                            <span className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-neutral-400" />
                              {m.hours_per_week} hrs/wk
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-2">{m.title}</h4>

                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {m.focus_topics.map((t, idx2) => (
                              <span key={idx2} className="text-[11px] px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-neutral-300">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-neutral-800/80">
                          <span className="text-[11px] font-mono text-cyan-400 block font-semibold">
                            Hands-On Milestone Deliverable:
                          </span>
                          <p className="text-xs text-neutral-200 mt-0.5 font-medium">
                            🚀 {m.milestone_project}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Free Resources */}
                  <div className="p-3.5 rounded-lg bg-black/40 border border-neutral-800/80 flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      Free Curated Resources:
                    </span>
                    {result.phases[activePhaseIndex].free_learning_resources.map((r, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-neutral-800/70 border border-neutral-700/60 rounded-md text-neutral-200">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verified Alumni Success Stories */}
            <div className="bg-[#101726]/90 border border-neutral-800 rounded-xl p-5 sm:p-7 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">
                  Verified NxtWave {result.branch_display_name} Transitions
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mb-6">
                Real alumni from your exact non-CSE discipline who cracked high-paying offers through verified proof-of-work.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.verified_alumni_stories.map((story, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#090d16] border border-neutral-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-white">{story.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {story.package_lpa}
                        </span>
                      </div>
                      <div className="text-xs text-neutral-400 mb-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-amber-300 font-medium">{story.original_branch}</span>
                        <span>&bull;</span>
                        <span>{story.college_tier}</span>
                      </div>
                      <div className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5 mb-2.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        Placed at: <span className="text-white font-bold">{story.placed_company}</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed bg-[#111827] p-2.5 rounded-lg border border-neutral-800 italic">
                        &ldquo;{story.key_breakthrough}&rdquo;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pitfalls & Day 1 Quick Win */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#101726]/90 border border-neutral-800 rounded-xl p-5 shadow-xl">
                <h4 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  Critical Traps to Avoid
                </h4>
                <div className="space-y-2 text-xs text-neutral-300">
                  {result.critical_pitfalls_to_avoid.map((pitfall, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30">
                      {pitfall}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-950/30 via-[#101726] to-[#090d16] border border-emerald-500/30 rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    Day 1 Immediate Action Item
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                    Momentum starts with one small, concrete software deliverable today. Don&apos;t wait for your semester exams to finish:
                  </p>
                  <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-200 leading-relaxed">
                    {result.day_1_action_item}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Step 1 of your 90-Day Transition</span>
                  <a
                    href="#register"
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                  >
                    Join 60-Min AI Project Lab
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
