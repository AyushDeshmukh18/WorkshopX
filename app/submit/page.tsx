'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  Award,
  Terminal,
  ExternalLink,
  ShieldCheck,
  FileCheck2,
  HelpCircle,
  Sparkles,
  Cpu,
  Download,
  Share2,
  RefreshCw,
  GitBranch,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ScoreBreakdown {
  works_deployed: number;
  uses_ai: number;
  originality: number;
  readme: number;
  code_structure: number;
}

interface EvalResponse {
  success: boolean;
  score_total: number;
  score_breakdown: ScoreBreakdown;
  tips: [string, string, string];
  passed: boolean;
  evaluation_mode: string;
  executive_summary?: string;
  key_strengths?: string[];
  critical_weaknesses?: string[];
  placement_readiness_verdict?: string;
  viva_defense_question?: string;
  viva_model_answer?: string;
  detected_tech_stack?: string[];
  certificate_id: string | null;
  certificate_url: string | null;
  pdf_url: string | null;
  project_name: string;
}

function SubmitForm() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('t') || '';

  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [projectName, setProjectName] = useState('Campus AI Placement Assistant');
  const [joinToken, setJoinToken] = useState(tokenParam);

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvalResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Basic client checks
    if (!repoUrl.includes('github.com')) {
      setError('Please provide a valid public GitHub repository URL (e.g., https://github.com/username/repo).');
      return;
    }
    if (!liveUrl.startsWith('https://')) {
      setError('Live deployment URL must use HTTPS (e.g. https://your-project.vercel.app).');
      return;
    }

    setIsLoading(true);
    setCurrentStep('Verifying repository security and live HTTPS endpoint...');

    try {
      const stepTimer1 = setTimeout(() => {
        setCurrentStep('OpenRouter Gemini 3.8 Flash evaluating 100-point rubric & inference architecture...');
      }, 1600);

      const stepTimer2 = setTimeout(() => {
        setCurrentStep('Synthesizing viva defense questions, code audit, & cryptographic certificate...');
      }, 3400);

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl,
          liveUrl,
          projectName,
          joinToken: joinToken.trim() || undefined,
        }),
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission evaluation failed.');
      }

      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Evaluation failed.');
    } finally {
      setIsLoading(false);
      setCurrentStep('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 page-enter">
      {/* Header */}
      <div className="border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
          <span className="text-xs font-mono font-bold tracking-wide uppercase text-blue-600 dark:text-blue-400">
            OPENROUTER AI &bull; 100-POINT CODE AUDIT &amp; CREDENTIALING
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Automated AI Project Evaluation
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl leading-relaxed">
          Submit your public GitHub repository and live HTTPS deployment. Our automated evaluation pipeline powered by OpenRouter audits your implementation against the official 100-point rubric, simulates technical viva defense rounds, and instantly issues tamper-proof verified credentials.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 rounded-xl text-xs text-red-800 dark:text-red-300 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Submission Error</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {!result ? (
        <div className="warm-card p-6 sm:p-9 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0e1422]/95 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-bold">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Campus Placement Resume Screener AI"
                className="w-full text-xs sm:text-sm px-4 py-3 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-bold">
                  GitHub Repository URL (Public) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/ai-project"
                  className="w-full text-xs sm:text-sm font-mono px-4 py-3 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <p className="text-[11px] text-neutral-500 mt-1">Must be public with clean README documentation.</p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-bold">
                  Live Deployment URL (HTTPS) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://your-project.vercel.app"
                  className="w-full text-xs sm:text-sm font-mono px-4 py-3 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <p className="text-[11px] text-neutral-500 mt-1">Deployed on Vercel, Netlify, Render, or Cloudflare.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-700 dark:text-neutral-300 mb-1.5 font-bold">
                Workshop Join Token <span className="text-neutral-500 font-normal">(Optional for guest audit)</span>
              </label>
              <input
                type="text"
                value={joinToken}
                onChange={(e) => setJoinToken(e.target.value)}
                placeholder="Paste token from registration pass to link with your student record"
                className="w-full text-xs sm:text-sm font-mono px-4 py-3 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            {isLoading && (
              <div className="border border-blue-300 dark:border-blue-800/80 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 text-xs font-mono text-blue-900 dark:text-blue-300 flex items-center gap-3">
                <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></span>
                <span className="font-semibold">{currentStep}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              {isLoading ? 'Running High-Caliber Evaluation...' : 'Run Automated AI Audit & Issue Credential'}
            </button>
          </form>
        </div>
      ) : (
        /* Evaluation Results Card */
        <div className="space-y-6">
          <div className="warm-card p-6 sm:p-9 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0c111d]/95 backdrop-blur-md">
            {/* Top Score & Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-6">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    result.passed
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      result.passed ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                    }`}
                  ></span>
                  {result.passed ? 'BENCHMARK MET (>= 50/100) &bull; CREDENTIAL ISSUED' : 'BENCHMARK NOT MET (< 50/100)'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white mt-3">
                  {result.project_name}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    Evaluator: {result.evaluation_mode === 'openrouter_ai_rubric' ? 'OpenRouter Gemini 3.8 Flash (High-Precision Audit)' : result.evaluation_mode}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right p-4 rounded-xl bg-neutral-50 dark:bg-[#111728] border border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-mono text-neutral-500 uppercase font-bold block">100-POINT AUDIT SCORE</span>
                <span className="text-4xl font-mono font-black text-neutral-900 dark:text-white">
                  {result.score_total} <span className="text-sm font-normal text-neutral-500">/ 100</span>
                </span>
              </div>
            </div>

            {/* Executive Evaluator Verdict */}
            {result.executive_summary && (
              <div className="mb-6 p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60">
                <span className="text-[11px] font-mono uppercase font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Executive Technical Verdict
                </span>
                <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                  {result.executive_summary}
                </p>
              </div>
            )}

            {/* Rubric Breakdown Grid with Visual Meters */}
            <div className="mb-8">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3 font-bold">
                100-Point Rubric Performance Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
                <div className="p-3 sm:p-3.5 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#131926]">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block font-semibold">Works Deployed</span>
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                    {result.score_breakdown.works_deployed} <span className="text-xs text-neutral-400">/ 30</span>
                  </span>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-blue-600 h-full" style={{ width: `${(result.score_breakdown.works_deployed / 30) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#131926]">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block font-semibold">AI Integration</span>
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                    {result.score_breakdown.uses_ai} <span className="text-xs text-neutral-400">/ 25</span>
                  </span>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-indigo-600 h-full" style={{ width: `${(result.score_breakdown.uses_ai / 25) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#131926]">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block font-semibold">Originality</span>
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                    {result.score_breakdown.originality} <span className="text-xs text-neutral-400">/ 15</span>
                  </span>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-purple-600 h-full" style={{ width: `${(result.score_breakdown.originality / 15) * 100}%` }} />
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#131926]">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block font-semibold">Documentation</span>
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                    {result.score_breakdown.readme} <span className="text-xs text-neutral-400">/ 15</span>
                  </span>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-emerald-600 h-full" style={{ width: `${(result.score_breakdown.readme / 15) * 100}%` }} />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3 sm:p-3.5 border border-[#e8e5de] dark:border-[#232833] rounded-xl bg-[#fbfaf7] dark:bg-[#131926]">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block font-semibold">Code Structure</span>
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-white">
                    {result.score_breakdown.code_structure} <span className="text-xs text-neutral-400">/ 15</span>
                  </span>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-cyan-600 h-full" style={{ width: `${(result.score_breakdown.code_structure / 15) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses 2-Column Grid */}
            {(result.key_strengths || result.critical_weaknesses) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {result.key_strengths && result.key_strengths.length > 0 && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                    <h4 className="text-xs font-mono uppercase font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Key Architectural Strengths
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {result.key_strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">&bull;</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.critical_weaknesses && result.critical_weaknesses.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                    <h4 className="text-xs font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5 mb-2.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Production Vulnerabilities &amp; Edge-Cases
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {result.critical_weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">&bull;</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Placement Viva Defense Simulator Card */}
            {result.viva_defense_question && (
              <div className="p-5 rounded-xl bg-[#111728] border border-blue-500/30 mb-8 space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono uppercase font-bold text-blue-400">
                    Campus Placement Viva Defense Simulator
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-white">
                  Q: &ldquo;{result.viva_defense_question}&rdquo;
                </div>
                {result.viva_model_answer && (
                  <div className="p-3.5 rounded-lg bg-black/40 border border-neutral-800 text-xs text-neutral-300 leading-relaxed">
                    <span className="font-bold text-cyan-400 font-mono block mb-1">RECOMMENDED MODEL ANSWER:</span>
                    {result.viva_model_answer}
                  </div>
                )}
                {result.placement_readiness_verdict && (
                  <p className="text-[11px] text-neutral-400 italic">
                    Recruiter Perspective: {result.placement_readiness_verdict}
                  </p>
                )}
              </div>
            )}

            {/* Actionable Engineering Tips */}
            <div className="mb-8">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3 font-bold">
                Actionable Optimization Steps
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                {result.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 border-l-2 border-blue-600 pl-3 py-1 bg-neutral-50 dark:bg-[#121624] rounded-r-md">
                    <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">0{idx + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Detected Tech Stack Tags */}
            {result.detected_tech_stack && result.detected_tech_stack.length > 0 && (
              <div className="mb-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-neutral-500 font-mono font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5" /> Stack:
                </span>
                {result.detected_tech_stack.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-[11px] border border-neutral-300 dark:border-neutral-700">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Action CTAs */}
            {result.passed && result.certificate_id && (
              <div className="pt-6 border-t border-[#e8e5de] dark:border-[#232833] flex flex-wrap items-center gap-3">
                <Link
                  href={result.certificate_url || `/verify/${result.certificate_id}`}
                  prefetch={true}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-600/20 inline-flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>View Verified Credential ({result.certificate_id}) &rarr;</span>
                </Link>

                {result.pdf_url && (
                  <a
                    href={result.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] hover:bg-[#ece8df] dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-semibold px-4 py-3 rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official PDF Certificate</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline ml-auto py-2"
                >
                  Submit Another Project
                </button>
              </div>
            )}

            {!result.passed && (
              <div className="pt-6 border-t border-[#e8e5de] dark:border-[#232833]">
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Address Recommendations and Resubmit
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12 text-xs font-mono text-neutral-500">Loading submission portal...</div>}>
      <SubmitForm />
    </Suspense>
  );
}
