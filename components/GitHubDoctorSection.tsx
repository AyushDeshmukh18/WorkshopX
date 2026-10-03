'use client';

import React, { useState } from 'react';
import {
  Github,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  GitBranch,
  Star,
  ExternalLink,
  Code2,
  Zap,
} from 'lucide-react';
import type { GitHubAuditResponse } from '@/lib/validation/github-audit-schema';
import type { TargetCompany } from '@/lib/validation/ats-schema';
import { TARGET_COMPANY_METADATA } from '@/lib/validation/ats-schema';

export default function GitHubDoctorSection() {
  const [inputVal, setInputVal] = useState<string>('ananya-sharma-tech');
  const [targetCompany, setTargetCompany] = useState<TargetCompany>('tcs-digital');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GitHubAuditResponse | null>(null);

  const activeCompany = TARGET_COMPANY_METADATA[targetCompany];

  const handleRunAudit = async () => {
    if (!inputVal || inputVal.trim().length === 0) {
      setError('Please enter a valid GitHub username or repository link.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/github-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username_or_url: inputVal.trim(),
          target_company: targetCompany,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to analyze GitHub profile.');
      }

      const data: GitHubAuditResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'GitHub audit failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sampleUser: string) => {
    setInputVal(sampleUser);
    setError(null);
  };

  return (
    <div
      id="github-doctor"
      className="scroll-mt-24 my-10 sm:my-14 rounded-2xl bg-gradient-to-b from-[#111726] to-[#0c1017] text-neutral-100 border border-neutral-800 relative overflow-hidden p-5 sm:p-9 shadow-2xl"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Github className="w-3.5 h-3.5" />
            AI GITHUB REPO DOCTOR &bull; LIVE PLACEMENT AUDIT
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            How Do Technical Recruiters Actually Judge Your GitHub Profile?
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Recruiters at TCS Digital, Cognizant, and product startups spend{' '}
            <strong className="text-neutral-200">&lt;15 seconds</strong> reviewing a student&apos;s
            GitHub. Audit your profile right now to detect critical red flags and see the exact
            production repo that elevates you into the top 5%.
          </p>
        </div>

        {/* Input & Config Bar */}
        <div className="max-w-3xl mx-auto bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 sm:p-5 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Username/URL input */}
            <div className="relative flex-1">
              <Github className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter GitHub username (e.g. rohan-dev) or repo URL..."
                className="w-full pl-10 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Target Company Dropdown */}
            <select
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value as TargetCompany)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono text-neutral-200 focus:outline-hidden focus:border-indigo-500"
            >
              {(Object.keys(TARGET_COMPANY_METADATA) as TargetCompany[]).map((key) => (
                <option key={key} value={key}>
                  {TARGET_COMPANY_METADATA[key].name} ({TARGET_COMPANY_METADATA[key].ctc})
                </option>
              ))}
            </select>

            {/* Audit Trigger Button */}
            <button
              type="button"
              onClick={handleRunAudit}
              disabled={isLoading}
              className="py-2.5 px-6 rounded-lg font-mono text-xs uppercase tracking-wider font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Inspecting Repos...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Audit GitHub &rarr;</span>
                </>
              )}
            </button>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-neutral-800 text-[11px] font-mono text-neutral-500">
            <span>Target: {activeCompany.name}</span>
            <div className="flex items-center gap-2">
              <span>Quick Test:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('ananya-sharma-tech')}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                Sample Student
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={() => handleLoadSample('shadcn')}
                className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
              >
                shadcn
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Audit Results Presentation */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Profile Overview & Score Gauge (5 cols) */}
            <div className="lg:col-span-5 bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-5">
              {/* Profile Bar */}
              <div className="flex items-center gap-3 pb-4 border-b border-neutral-800">
                <img
                  src={result.avatar_url}
                  alt={result.username}
                  className="w-12 h-12 rounded-full border border-neutral-700 bg-neutral-800 shrink-0"
                  onError={(e) => {
                    // Fallback avatar if external image fails
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${result.username}`;
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm truncate">@{result.username}</span>
                    <a
                      href={`https://github.com/${result.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-indigo-400"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-neutral-400 truncate">{result.bio || 'Public Developer'}</p>
                </div>
              </div>

              {/* Quick Profile Telemetry */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800">
                  <span className="block text-[10px] text-neutral-500">REPOS</span>
                  <span className="font-bold text-neutral-200">{result.public_repos_count}</span>
                </div>
                <div className="p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800">
                  <span className="block text-[10px] text-neutral-500">STARS</span>
                  <span className="font-bold text-neutral-200 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    {result.total_stars}
                  </span>
                </div>
                <div className="p-2.5 bg-neutral-950/60 rounded-lg border border-neutral-800">
                  <span className="block text-[10px] text-neutral-500">FOLLOWERS</span>
                  <span className="font-bold text-neutral-200">{result.followers_count}</span>
                </div>
              </div>

              {/* Languages Tag Cloud */}
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-1.5">
                  Detected Tech Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.top_languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recruiter Attractiveness Score Gauge */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
                  Recruiter Shortlist Probability
                </span>

                <div className="grid grid-cols-3 items-center text-center gap-2">
                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <span className="block text-[9px] font-mono text-neutral-500">CURRENT</span>
                    <span className="text-2xl font-black text-amber-400">{result.recruiter_score}</span>
                    <span className="block text-[9px] font-mono text-amber-500/80">Filtered</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-indigo-400">+{result.score_delta}pts</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-neutral-900 border border-emerald-500/40">
                    <span className="block text-[9px] font-mono text-emerald-400">PROJECTED</span>
                    <span className="text-2xl font-black text-emerald-400">{result.projected_score}</span>
                    <span className="block text-[9px] font-mono text-emerald-400">Shortlisted</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Flaws, 60-Minute Fix & Conversion CTA (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Critical Red Flags Box */}
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5">
                <span className="block text-xs font-mono font-bold text-red-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Recruiter Red Flags Detected in Repositories
                </span>

                <ul className="space-y-2">
                  {result.critical_flaws.map((flaw, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                      <span>{flaw}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* The 60-Minute GitHub Fix */}
              <div className="bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-blue-950/40 border border-indigo-500/40 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                    The 60-Minute GitHub Upgrade Repository
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    +40pts Surge
                  </span>
                </div>

                <div className="bg-neutral-950/80 p-3.5 rounded-lg border border-neutral-800">
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-mono font-bold text-white text-xs">{result.the_60_min_fix.repo_name}</span>
                  </div>
                  <p className="text-xs text-neutral-300 mb-2 leading-relaxed">
                    {result.the_60_min_fix.one_liner}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.the_60_min_fix.stack.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed italic">
                  <strong>Why it fixes your placement chances:</strong> {result.the_60_min_fix.recruiter_impact}
                </p>

                <div className="pt-2">
                  <a
                    href="#register"
                    className="w-full py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-indigo-500 hover:bg-indigo-400 text-white shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Build & Push This Project This Saturday (Free Seat)</span>
                    <ArrowRight className="w-4 h-4" />
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
