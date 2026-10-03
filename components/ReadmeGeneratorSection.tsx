'use client';

import React, { useState } from 'react';
import {
  FileCode2,
  Sparkles,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  Layers,
  Eye,
  Code,
  ShieldCheck,
  RefreshCw,
  GitBranch
} from 'lucide-react';
import type { ReadmeGeneratorRequest, ReadmeGeneratorResponse, ProjectDomain } from '@/lib/validation/readme-schema';

const PRESET_PROJECTS: Array<{ label: string; data: ReadmeGeneratorRequest }> = [
  {
    label: '⚡ 60-Min AI Placement ATS Doctor',
    data: {
      project_title: 'AI Resume Doctor & Placement Tier Leap Engine',
      project_tagline: 'Deterministic resume ATS audit and recruiter attractiveness analyzer powered by OpenRouter LLMs',
      domain: 'generative-ai',
      core_features: 'Regex token matching against 50+ ATS keywords, OpenRouter-driven bullet re-writing, dynamic ₹3.5L to ₹9.5L tier leap calculator',
      tech_stack: 'Next.js 16, TypeScript, OpenRouter Llama 3.3, TailwindCSS, Supabase',
      demo_url: 'https://ats-doctor.nxtwave-demo.vercel.app',
      github_repo_url: 'https://github.com/nxtwave-student/ai-resume-doctor',
    },
  },
  {
    label: '🌐 Real-Time Hiring Trends Radar',
    data: {
      project_title: 'DevPulse: Live Tech Hiring & Salary Market Radar',
      project_tagline: 'Real-time engineering job trends and package intelligence aggregated via HackerNews & GitHub REST APIs',
      domain: 'full-stack',
      core_features: 'Live HackerNews Firebase REST pollers, salary tier categorization, full-stack vs AI skill frequency indexing',
      tech_stack: 'Next.js 16 (App Router), TypeScript, Public HackerNews API, Lucide React',
      demo_url: 'https://devpulse.nxtwave-demo.vercel.app',
      github_repo_url: 'https://github.com/nxtwave-student/devpulse-radar',
    },
  },
  {
    label: '🛡️ Tamper-Proof Credential Vault',
    data: {
      project_title: 'VeriSkill: Cryptographic Certificate & Skills Ledger',
      project_tagline: 'SHA-256 verifiable workshop credentials and instant LinkedIn 1-click verification gateway',
      domain: 'distributed-systems',
      core_features: 'Deterministic SHA-256 hash generation, QR code instant verification, tamper-proof student transcript export',
      tech_stack: 'Next.js 16, TypeScript, Web Crypto API, Supabase Edge Functions',
      demo_url: 'https://veriskill.nxtwave-demo.vercel.app',
      github_repo_url: 'https://github.com/nxtwave-student/veriskill-vault',
    },
  },
];

export default function ReadmeGeneratorSection() {
  const [formData, setFormData] = useState<ReadmeGeneratorRequest>(PRESET_PROJECTS[0].data);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReadmeGeneratorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'raw' | 'architecture'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = (content: string, filename = 'README.md') => {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/readme-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate README.');
      }

      const data: ReadmeGeneratorResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="readme-generator"
      className="scroll-mt-24 my-8 rounded-2xl bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#040711] text-neutral-100 border border-neutral-800 p-5 sm:p-9 shadow-2xl relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
            <FileCode2 className="w-3.5 h-3.5" />
            FAANG-GRADE REPO DOCUMENTATION &bull; 100% FREE AI
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            GitHub README &amp; System Architecture Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl mx-auto leading-relaxed">
            95% of student repos have empty READMEs or 1-line notes, causing hiring managers to bounce in 5 seconds.
            Generate an open-source grade documentation suite with Mermaid system architecture, live SVG badges, and verified production setup instructions.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-[#111827]/70 border border-neutral-800/80 rounded-xl p-3 sm:p-4">
          <span className="text-xs font-mono font-bold text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_PROJECTS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData(preset.data)}
                className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border border-neutral-700/60 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="bg-[#101726]/90 border border-neutral-800 rounded-xl p-5 sm:p-7 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Project Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.project_title}
                onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                placeholder="e.g., OmniFlow AI Placement Orchestrator"
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Engineering Domain <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value as ProjectDomain })}
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="generative-ai">Generative AI &amp; LLM Systems</option>
                <option value="full-stack">Modern Full-Stack (Next.js / Node.js)</option>
                <option value="distributed-systems">Distributed Systems &amp; APIs</option>
                <option value="cloud-devops">Cloud Native &amp; DevOps</option>
                <option value="mobile-iot">Mobile &amp; Edge Systems</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Project Tagline / Recruiter Pitch <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.project_tagline}
              onChange={(e) => setFormData({ ...formData, project_tagline: e.target.value })}
              placeholder="e.g., Autonomous AI interview agent with sub-second voice latency &amp; tamper-proof verification"
              className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Core Features (Comma-separated) <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.core_features}
                onChange={(e) => setFormData({ ...formData, core_features: e.target.value })}
                placeholder="e.g., Real-time ATS match scoring, OpenRouter streaming inference, cryptographic credential ledger"
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Tech Stack Specifications <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                placeholder="e.g., Next.js 16, TypeScript, OpenRouter Llama 3.3, TailwindCSS, Supabase, Vercel"
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Live Production Demo URL <span className="text-neutral-500">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.demo_url || ''}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://your-project.vercel.app"
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                GitHub Repository URL <span className="text-neutral-500">(Optional)</span>
              </label>
              <input
                type="url"
                value={formData.github_repo_url || ''}
                onChange={(e) => setFormData({ ...formData, github_repo_url: e.target.value })}
                placeholder="https://github.com/username/project-repo"
                className="w-full bg-[#090d16] border border-neutral-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-800">
            <span className="text-xs text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Includes Mermaid System Architecture, MIT License &amp; Verified Badges
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white hover:opacity-95 shadow-lg shadow-purple-600/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Synthesizing FAANG README with OpenRouter...
                </>
              ) : (
                <>
                  <FileCode2 className="w-4 h-4" />
                  Generate Production README.md
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-sm flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0" />
            <div>
              <p className="font-semibold">Failed to generate README</p>
              <p className="text-xs text-red-300 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results Showcase */}
        {result && (
          <div className="bg-[#111827]/90 border border-neutral-800 rounded-xl p-5 sm:p-7 shadow-xl">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800 mb-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'preview'
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('raw')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'raw'
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  Raw Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('architecture')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'architecture'
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  System Architecture
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(result.markdown_content)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Markdown
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(result.markdown_content, `${formData.project_title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-README.md`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download README.md
                </button>
              </div>
            </div>

            {/* Recruiter Impact Highlights */}
            {result.key_highlights && result.key_highlights.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {result.key_highlights.map((h, i) => (
                  <div key={i} className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-purple-200 leading-snug">{h}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Preview */}
            {activeTab === 'preview' && (
              <div className="bg-[#090d16] border border-neutral-800 rounded-xl p-5 sm:p-7 overflow-x-auto text-sm text-neutral-200 font-sans space-y-4">
                <div className="flex flex-wrap gap-2 pb-4 border-b border-neutral-800">
                  {result.badges.map((b, i) => (
                    <span key={i} className="inline-block text-xs font-mono px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                      {b.replace(/!\[(.*?)\]\(.*?\)/, '$1')}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <h1 className="text-2xl font-black text-white">{formData.project_title}</h1>
                  <p className="text-neutral-400 italic mt-1">{formData.project_tagline}</p>
                </div>

                <div className="p-4 rounded-lg bg-[#111827] border border-neutral-800">
                  <h3 className="text-xs font-mono uppercase font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    System Architecture Diagram
                  </h3>
                  <pre className="font-mono text-xs text-cyan-300/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {result.mermaid_diagram}
                  </pre>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-bold text-white mb-2">Core Capabilities</h3>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-neutral-300">
                    {formData.core_features.split(',').map((f, i) => (
                      <li key={i}>{f.trim()}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <h3 className="text-sm font-bold text-white mb-2">Production Setup</h3>
                  <div className="bg-black/60 rounded-lg p-3 font-mono text-xs text-emerald-400 border border-neutral-800 flex items-center justify-between">
                    <code>git clone {formData.github_repo_url || 'https://github.com/student/repo.git'} &amp;&amp; npm install &amp;&amp; npm run dev</code>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Raw */}
            {activeTab === 'raw' && (
              <div className="relative">
                <pre className="bg-[#090d16] border border-neutral-800 rounded-xl p-5 text-xs font-mono text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {result.markdown_content}
                </pre>
              </div>
            )}

            {/* Tab: Architecture */}
            {activeTab === 'architecture' && (
              <div className="bg-[#090d16] border border-neutral-800 rounded-xl p-5 sm:p-7 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Mermaid 10.0 System Architecture Flow</h3>
                    <p className="text-xs text-neutral-400">Directly renders in GitHub Markdown previews and VS Code</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.mermaid_diagram)}
                    className="text-xs font-mono px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy Mermaid Code
                  </button>
                </div>

                <pre className="p-4 rounded-lg bg-[#111827] border border-neutral-800 text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {result.mermaid_diagram}
                </pre>

                <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-800/40 text-xs text-neutral-300">
                  <span className="font-semibold text-blue-300">How to use on GitHub:</span> Paste this block directly inside a <code className="text-cyan-300">```mermaid ... ```</code> code fence in your repo&apos;s <code className="text-white">README.md</code>. GitHub automatically renders it as an interactive vector graph for recruiters.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
