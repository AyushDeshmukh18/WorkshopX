'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

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
      setError('Please provide a valid GitHub repository URL.');
      return;
    }
    if (!liveUrl.startsWith('https://')) {
      setError('Live deployment URL must use HTTPS.');
      return;
    }

    setIsLoading(true);
    setCurrentStep('Validating repository and live deployment endpoints...');

    try {
      const stepTimer1 = setTimeout(() => {
        setCurrentStep('Auditing code quality, AI integration, and documentation...');
      }, 1500);

      const stepTimer2 = setTimeout(() => {
        setCurrentStep('Generating tamper-proof cryptographic credential...');
      }, 3200);

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
        throw new Error(data.error || 'Submission failed.');
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
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 page-enter">
      {/* Header */}
      <div className="border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8">
        <div className="flex items-center gap-2 mb-2.5">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-xs font-mono font-medium tracking-wide uppercase text-neutral-500">
            AUTOMATED PROJECT AUDIT & CREDENTIALING
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Submit Your AI Project
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed">
          Submit your public GitHub repository and live HTTPS deployment. Our automated pipeline audits your implementation against the 100-point rubric and instantly issues your verified credential.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 rounded-lg text-xs text-red-800 dark:text-red-300">
          <strong>Submission Error:</strong> {error}
        </div>
      )}

      {/* Submission Form */}
      {!result ? (
        <div className="warm-card p-6 sm:p-8 rounded-lg shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                Project Title
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Campus Placement Resume Screener AI"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                GitHub Repository URL (Public)
              </label>
              <input
                type="url"
                required
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/firstbuild-ai-project"
                className="w-full text-xs sm:text-sm font-mono px-3.5 py-2.5 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Must be a public repository containing your source code and documentation.</p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                Live Deployment URL (HTTPS)
              </label>
              <input
                type="url"
                required
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://your-project.vercel.app"
                className="w-full text-xs sm:text-sm font-mono px-3.5 py-2.5 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <p className="text-[11px] text-neutral-500 mt-1">Live application deployed on Vercel, Netlify, Render, or Cloudflare Pages.</p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1.5 font-medium">
                Workshop Join Token (Optional)
              </label>
              <input
                type="text"
                value={joinToken}
                onChange={(e) => setJoinToken(e.target.value)}
                placeholder="Paste token from registration pass (or leave blank for guest evaluation)"
                className="w-full text-xs sm:text-sm font-mono px-3.5 py-2.5 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {isLoading && (
              <div className="border border-blue-300 dark:border-blue-800/80 p-4 rounded-md bg-blue-50/50 dark:bg-blue-950/20 text-xs font-mono text-blue-900 dark:text-blue-300 flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0"></span>
                <span>{currentStep}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 font-semibold py-3 px-4 rounded-md text-xs sm:text-sm transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Running Audit Pipeline...' : 'Run Automated Audit & Issue Credential'}
            </button>
          </form>
        </div>
      ) : (
        /* Evaluation Results Card */
        <div className="space-y-6">
          <div className="warm-card p-6 sm:p-8 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-6">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold ${
                    result.passed
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      result.passed ? 'bg-blue-600' : 'bg-red-600'
                    }`}
                  ></span>
                  {result.passed ? 'BENCHMARK MET (>= 50/100)' : 'BENCHMARK NOT MET (< 50/100)'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-2">
                  {result.project_name}
                </h2>
                <p className="text-xs font-mono text-neutral-500 mt-1">
                  Evaluated via: {result.evaluation_mode === 'ai_rubric' ? 'Automated Code Analysis + Rubric' : 'Deterministic Technical Pipeline'}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-neutral-500 uppercase block">AUDIT SCORE</span>
                <span className="text-3xl font-mono font-extrabold text-neutral-900 dark:text-neutral-100">
                  {result.score_total} <span className="text-sm font-normal text-neutral-500">/ 100</span>
                </span>
              </div>
            </div>

            {/* Rubric Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
              <div className="p-3 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Works Deployed</span>
                <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {result.score_breakdown.works_deployed} <span className="text-xs text-neutral-400">/ 30</span>
                </span>
              </div>
              <div className="p-3 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">AI Integration</span>
                <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {result.score_breakdown.uses_ai} <span className="text-xs text-neutral-400">/ 25</span>
                </span>
              </div>
              <div className="p-3 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Originality</span>
                <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {result.score_breakdown.originality} <span className="text-xs text-neutral-400">/ 15</span>
                </span>
              </div>
              <div className="p-3 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Documentation</span>
                <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {result.score_breakdown.readme} <span className="text-xs text-neutral-400">/ 15</span>
                </span>
              </div>
              <div className="p-3 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f]">
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">Code Structure</span>
                <span className="text-base sm:text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {result.score_breakdown.code_structure} <span className="text-xs text-neutral-400">/ 15</span>
                </span>
              </div>
            </div>

            {/* Actionable Feedback Tips */}
            <div className="mb-8">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-3">
                Evaluator Feedback & Code Observations
              </h3>
              <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                {result.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 border-l-2 border-blue-600 pl-3 py-0.5">
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action CTAs */}
            {result.passed && result.certificate_id && (
              <div className="pt-6 border-t border-[#e8e5de] dark:border-[#232833] flex flex-wrap items-center gap-3">
                <Link
                  href={result.certificate_url || `/verify/${result.certificate_id}`}
                  prefetch={true}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
                >
                  View Verified Credential &rarr;
                </Link>

                {result.pdf_url && (
                  <a
                    href={result.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] hover:bg-[#ece8df] text-neutral-900 dark:text-neutral-100 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
                  >
                    Download Certificate (PDF)
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline ml-auto"
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
                  className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
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
