'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  Copy,
  Check,
  Briefcase,
  ExternalLink,
  Clock,
  TrendingUp,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import type { ColdPitchRequest, ColdPitchResponse, RecipientRole } from '@/lib/validation/cold-pitch-schema';

const SAMPLE_PROFILE: ColdPitchRequest = {
  student_name: 'Ananya Sharma',
  student_branch: 'Computer Science Engineering (CSE)',
  target_company: 'Razorpay',
  recipient_role: 'engineering-manager',
  recipient_name: 'Vikram Mehta',
  project_title: '60-Minute Real-Time AI Placement ATS Scanner',
  project_live_url: 'https://ats-doctor.vercel.app',
  github_repo_url: 'https://github.com/ananya-sharma/ats-doctor',
  key_tech_stack: 'Next.js 16, OpenRouter, Supabase, TypeScript',
};

export default function ColdPitchSection() {
  const [formData, setFormData] = useState<ColdPitchRequest>(SAMPLE_PROFILE);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ColdPitchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'linkedin' | 'email' | 'followup'>('linkedin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/cold-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate outreach pitch.');
      }

      const data: ColdPitchResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="cold-pitch"
      className="scroll-mt-24 my-8 rounded-2xl bg-gradient-to-b from-[#111827] via-[#0d121c] to-[#090d15] text-neutral-100 border border-neutral-800 p-5 sm:p-9 shadow-2xl relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Send className="w-3.5 h-3.5" />
            1-CLICK COLD OUTREACH ENGINE &bull; 100% FREE AI
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Recruiter LinkedIn InMail &amp; Cold Email Pitch Generator
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-2xl mx-auto leading-relaxed">
            Stop sending generic &ldquo;Please refer me&rdquo; DMs. Generate high-converting, proof-of-work outreach messages that highlight your live deployed workshop project and verified credential to get 40%+ recruiter reply rates.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="bg-[#121824]/90 border border-neutral-800 rounded-xl p-5 sm:p-7 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <span className="text-xs font-mono uppercase font-bold text-neutral-400 tracking-wider">
              1. Candidate &amp; Target Recruiter Details
            </span>
            <button
              type="button"
              onClick={() => {
                setFormData(SAMPLE_PROFILE);
                setError(null);
              }}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline font-semibold cursor-pointer"
            >
              Load Sample Profile (Razorpay SDE)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Your Full Name *</label>
              <input
                type="text"
                value={formData.student_name}
                onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                required
                className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Your Engineering Branch *</label>
              <input
                type="text"
                value={formData.student_branch}
                onChange={(e) => setFormData({ ...formData, student_branch: e.target.value })}
                required
                className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Target Company *</label>
              <input
                type="text"
                value={formData.target_company}
                onChange={(e) => setFormData({ ...formData, target_company: e.target.value })}
                required
                placeholder="e.g. Google, Razorpay, Amazon"
                className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Recipient Hiring Role *</label>
              <select
                value={formData.recipient_role}
                onChange={(e) => setFormData({ ...formData, recipient_role: e.target.value as RecipientRole })}
                className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="engineering-manager">Engineering Manager / Tech Lead (Highest Conversion)</option>
                <option value="recruiter">Technical Campus Recruiter / Talent Acquisition</option>
                <option value="startup-founder">Startup Founder / CTO</option>
                <option value="alumni">College Alumni at Company</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Recipient Name (Optional)</label>
              <input
                type="text"
                value={formData.recipient_name}
                onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                placeholder="e.g. Vikram Mehta or leave blank for Hiring Team"
                className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-neutral-800/80 pt-4 mt-4">
            <span className="text-xs font-mono uppercase font-bold text-neutral-400 tracking-wider block mb-3">
              2. Proof-of-Work Project Artifact
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Project Title Built in Workshop *</label>
                <input
                  type="text"
                  value={formData.project_title}
                  onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                  required
                  className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Key Tech Stack *</label>
                <input
                  type="text"
                  value={formData.key_tech_stack}
                  onChange={(e) => setFormData({ ...formData, key_tech_stack: e.target.value })}
                  required
                  placeholder="e.g. Next.js 16, OpenRouter, Supabase, TypeScript"
                  className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Live Deployed URL (HTTPS)</label>
                <input
                  type="url"
                  value={formData.project_live_url}
                  onChange={(e) => setFormData({ ...formData, project_live_url: e.target.value })}
                  placeholder="https://my-project.vercel.app"
                  className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">GitHub Repository URL</label>
                <input
                  type="url"
                  value={formData.github_repo_url}
                  onChange={(e) => setFormData({ ...formData, github_repo_url: e.target.value })}
                  placeholder="https://github.com/my-username/my-repo"
                  className="w-full bg-[#0b0f17] border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Cold Pitch...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Generate High-Converting Pitch &rarr;</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Panel */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Top Stat Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-[#121824] border border-neutral-800 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Estimated Response Rate</span>
                  <span className="text-base font-mono font-bold text-emerald-400">{result.estimated_reply_rate}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121824] border border-neutral-800 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Proof-of-Work Artifact</span>
                  <span className="text-xs font-semibold text-white truncate block">{result.proof_of_work_highlight}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#121824] border border-neutral-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase block">Optimal Send Time</span>
                  <span className="text-xs font-mono font-bold text-amber-300">Tue / Thu 10:30 AM IST</span>
                </div>
              </div>
            </div>

            {/* Output Tabs Switcher */}
            <div className="bg-[#121824] border border-neutral-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mb-5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveOutputTab('linkedin')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase transition-colors shrink-0 ${
                    activeOutputTab === 'linkedin'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  💼 LinkedIn InMail DM (75 Words)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOutputTab('email')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase transition-colors shrink-0 ${
                    activeOutputTab === 'email'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  📧 Cold Email &amp; Subject
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOutputTab('followup')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold font-mono uppercase transition-colors shrink-0 ${
                    activeOutputTab === 'followup'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  ⏱️ Day +3 &amp; +7 Follow-Up
                </button>
              </div>

              {/* Tab 1: LinkedIn InMail */}
              {activeOutputTab === 'linkedin' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>Direct Message &bull; Zero Fluff, 100% Proof-of-Work</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(result.linkedin_dm_75_words, 'linkedin')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/30 font-mono text-xs transition-colors"
                    >
                      {copiedKey === 'linkedin' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy LinkedIn Pitch</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-[#090d16] p-4 sm:p-5 rounded-xl border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans select-all whitespace-pre-wrap">
                    {result.linkedin_dm_75_words}
                  </div>
                </div>
              )}

              {/* Tab 2: Cold Email */}
              {activeOutputTab === 'email' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                      <span className="font-mono uppercase font-bold text-[11px]">Subject Line (High Open Rate)</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.cold_email_subject, 'subject')}
                        className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        {copiedKey === 'subject' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Subject</span>
                      </button>
                    </div>
                    <div className="bg-[#090d16] p-3 rounded-lg border border-neutral-800 text-xs font-mono text-cyan-300">
                      {result.cold_email_subject}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                      <span className="font-mono uppercase font-bold text-[11px]">Email Body</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.cold_email_body, 'body')}
                        className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        {copiedKey === 'body' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Email Body</span>
                      </button>
                    </div>
                    <div className="bg-[#090d16] p-4 sm:p-5 rounded-xl border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap select-all font-sans">
                      {result.cold_email_body}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Follow-Up Sequence */}
              {activeOutputTab === 'followup' && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                      <span className="font-mono font-bold text-amber-400 uppercase text-[11px]">
                        Day +3 Gentle Value-Add Follow-Up
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.followup_day_3, 'day3')}
                        className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        {copiedKey === 'day3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Day 3</span>
                      </button>
                    </div>
                    <div className="bg-[#090d16] p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap select-all">
                      {result.followup_day_3}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                      <span className="font-mono font-bold text-purple-400 uppercase text-[11px]">
                        Day +7 Final Check-In &amp; Pipeline Close
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(result.followup_day_7, 'day7')}
                        className="text-xs font-mono text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        {copiedKey === 'day7' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Day 7</span>
                      </button>
                    </div>
                    <div className="bg-[#090d16] p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap select-all">
                      {result.followup_day_7}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recruiter Strategy Tips */}
            <div className="p-5 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-2">
              <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider block">
                🎯 Recruiter InMail Outreach Playbook
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {result.pitch_strategy_tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">&bull;</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
