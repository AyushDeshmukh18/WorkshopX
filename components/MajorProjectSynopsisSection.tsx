'use client';

import React, { useState } from 'react';
import {
  FileCode2,
  Sparkles,
  Copy,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  Cpu,
  Layers,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import type { Branch, Interest } from '@/lib/validation/blueprint-schema';
import type { MajorProjectResponse } from '@/lib/validation/major-project-schema';

export default function MajorProjectSynopsisSection() {
  const [branch, setBranch] = useState<Branch>('CSE');
  const [domain, setDomain] = useState<Interest>('AI');
  const [teamSize, setTeamSize] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MajorProjectResponse | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/major-project-synopsis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          domain,
          team_size: teamSize,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate synopsis.');
      }

      const data: MajorProjectResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Synopsis generation failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySynopsis = () => {
    if (!result) return;
    const fullText = `MAJOR PROJECT SYNOPSIS (IEEE FORMAT)
TITLE: ${result.project_title}
BRANCH: ${result.branch} | DOMAIN: ${result.domain}

1. ABSTRACT:
${result.ieee_abstract}

2. PROBLEM STATEMENT:
${result.problem_statement}

3. DRAWBACKS OF EXISTING SYSTEMS:
${result.existing_system_drawbacks.map((d, i) => `${i + 1}. ${d}`).join('\n')}

4. PROPOSED SYSTEM INNOVATIONS:
${result.proposed_system_innovations.map((p, i) => `${i + 1}. ${p}`).join('\n')}

5. SYSTEM REQUIREMENTS:
- Hardware: ${result.hardware_software_requirements.hardware.join(', ')}
- Software: ${result.hardware_software_requirements.software.join(', ')}

6. VIVA DEFENSE PREPARATION:
${result.viva_defense_qa.map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}\nFocus: ${qa.examiner_focus}`).join('\n\n')}
`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const fullText = `MAJOR PROJECT SYNOPSIS (IEEE FORMAT)\nTITLE: ${result.project_title}\n\nABSTRACT:\n${result.ieee_abstract}\n\nPROBLEM STATEMENT:\n${result.problem_statement}\n`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.project_title.replace(/\s+/g, '_')}_IEEE_Synopsis.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="major-project-synopsis"
      className="scroll-mt-24 my-10 sm:my-14 rounded-2xl bg-gradient-to-b from-[#121622] to-[#0c1017] text-neutral-100 border border-neutral-800 relative overflow-hidden p-5 sm:p-9 shadow-2xl"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            COLLEGE 7TH & 8TH SEMESTER SUBMISSION SOLVED
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Generate Your Official Major Project IEEE Synopsis & Viva Defense
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            University project guides demand a formal IEEE abstract, problem statement, and architecture diagram.
            Select your branch to generate an academic-grade project document built around this Saturday&apos;s 60-minute live build.
          </p>
        </div>

        {/* Configuration Selector */}
        <div className="max-w-4xl mx-auto bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 mb-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Branch */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-400 font-bold mb-2">
                1. Engineering Branch
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'] as Branch[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={`py-1.5 px-2 rounded-md text-xs font-mono font-semibold transition-all ${
                      branch === b
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Domain Interest */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-400 font-bold mb-2">
                2. Project Domain
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['AI', 'WEB', 'DATA', 'EMBEDDED'] as Interest[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDomain(d)}
                    className={`py-1.5 px-2 rounded-md text-xs font-mono font-semibold transition-all ${
                      domain === d
                        ? 'bg-cyan-500 text-neutral-950 shadow-xs'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-400 font-bold mb-2">
                3. Lab Team Size
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setTeamSize(size)}
                    className={`flex-1 py-1.5 rounded-md text-xs font-mono font-semibold transition-all ${
                      teamSize === size
                        ? 'bg-emerald-500 text-neutral-950 shadow-xs'
                        : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:text-white'
                    }`}
                  >
                    {size} {size === 1 ? 'Solo' : 'Devs'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-lg font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Synthesizing IEEE Synopsis & Viva Defense...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Generate Official Major Project Synopsis &rarr;</span>
              </>
            )}
          </button>

          {error && (
            <div className="mt-3 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Generated Synopsis Document Presentation */}
        {result && (
          <div className="max-w-4xl mx-auto bg-neutral-950 border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Document Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                  IEEE STANDARD SPECIFICATION &bull; {result.branch} / {result.domain}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {result.project_title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopySynopsis}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-neutral-900 border border-neutral-700 text-neutral-200 hover:text-white hover:border-neutral-500 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Copy All</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* 1. Abstract */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                1. Academic Abstract
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed bg-neutral-900/60 p-4 rounded-lg border border-neutral-800">
                {result.ieee_abstract}
              </p>
            </div>

            {/* 2. Problem Statement */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                2. Problem Formulation
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-900/40 p-3.5 rounded-lg border border-neutral-800/80">
                {result.problem_statement}
              </p>
            </div>

            {/* 3. Existing Drawbacks vs Proposed Innovations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-950/20 border border-red-900/40 p-4 rounded-lg">
                <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block mb-2">
                  Legacy System Drawbacks
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {result.existing_system_drawbacks.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-lg">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Proposed Innovations
                </span>
                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {result.proposed_system_innovations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 4. Hardware & Software Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
                <span className="text-[11px] text-neutral-400 font-bold block mb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  HARDWARE ENVIRONMENT
                </span>
                <ul className="space-y-1 text-neutral-300 text-[11px]">
                  {result.hardware_software_requirements.hardware.map((hw, idx) => (
                    <li key={idx}>&bull; {hw}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-neutral-900/60 p-3.5 rounded-lg border border-neutral-800">
                <span className="text-[11px] text-neutral-400 font-bold block mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  SOFTWARE DEPENDENCIES
                </span>
                <ul className="space-y-1 text-neutral-300 text-[11px]">
                  {result.hardware_software_requirements.software.map((sw, idx) => (
                    <li key={idx}>&bull; {sw}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Internal Viva Defense Questions */}
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-2.5 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                Examiner Viva Defense Questions & Model Answers
              </span>

              <div className="space-y-2.5">
                {result.viva_defense_qa.map((qa, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                    <span className="font-bold text-white block mb-1">Q: {qa.question}</span>
                    <p className="text-neutral-300 mb-1.5 leading-relaxed">A: {qa.answer}</p>
                    <span className="text-[10px] font-mono text-cyan-400">
                      Examiner Evaluation Focus: {qa.examiner_focus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conversion Hook */}
            <div className="pt-2">
              <a
                href="#register"
                className="w-full py-3.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Build & Deploy This Exact Project in 60 Mins (Free Seat)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="text-[10px] font-mono text-center text-neutral-500 mt-2">
                <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-400" />
                Submit working live URL and verified code to your college internal review panel
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
