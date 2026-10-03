'use client';

import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  TrendingUp,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { TargetCompany, AtsScanResponse } from '@/lib/validation/ats-schema';
import { TARGET_COMPANY_METADATA } from '@/lib/validation/ats-schema';

const SAMPLE_STUDENT_RESUME = `ANANYA SHARMA
Email: ananya.sharma2024@gmail.com | Phone: +91 98765 43210 | Hyderabad, Telangana
GitHub: github.com/ananya-sharma | LinkedIn: linkedin.com/in/ananya-sharma-tech

EDUCATION
B.Tech in Computer Science and Engineering (2021 - 2025)
JNTUH College of Engineering | CGPA: 7.9/10

TECHNICAL SKILLS
Languages: Java, C++, Python, JavaScript, HTML5, CSS3, SQL
Core Concepts: Data Structures & Algorithms, Object-Oriented Programming (OOP), DBMS, Computer Networks
Tools & Frameworks: React Basics, Node.js Basics, Git, MySQL, VS Code

ACADEMIC PROJECTS
1. Online Bookstore Management System (Java, MySQL, JDBC)
- Developed a desktop CRUD application for managing book inventory and customer orders.
- Implemented user authentication and admin order tracking using MySQL database schema.
- Designed UI using Java Swing and handled database connection pools.

2. Responsive Weather Forecast Web App (HTML, CSS, JavaScript)
- Created a single-page weather dashboard that fetches daily forecasts using OpenWeatherMap API.
- Implemented responsive mobile layout using CSS Flexbox and media queries.
- Added city search bar and dynamic temperature toggle between Celsius and Fahrenheit.

COURSEWORK & CERTIFICATIONS
- Completed "Python for Data Science" course on Coursera.
- Solved 120+ LeetCode problems (Arrays, Strings, Linked Lists).
- Active member of Campus Tech & Coding Club.`;

export default function AtsScannerSection() {
  const [targetCompany, setTargetCompany] = useState<TargetCompany>('tcs-digital');
  const [branch, setBranch] = useState<string>('CSE');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('paste');
  const [resumeText, setResumeText] = useState<string>(SAMPLE_STUDENT_RESUME);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsScanResponse | null>(null);

  const activeCompany = TARGET_COMPANY_METADATA[targetCompany];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);

    // Read text from plain/markdown/code or basic PDF text streams
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith('.pdf')) {
        // Simple extraction of printable text sequences from PDF string representation
        const extracted = content
          .replace(/[^\x20-\x7E\n]/g, ' ')
          .replace(/\s+/g, ' ')
          .slice(0, 8000);

        if (extracted.trim().length > 50) {
          setResumeText(extracted);
        } else {
          setError(
            'Could not extract text from this PDF format. Please paste your resume text in the "Paste Text" tab.'
          );
        }
      } else {
        setResumeText(content);
      }
    };

    if (file.name.endsWith('.pdf')) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleRunScan = async () => {
    if (!resumeText || resumeText.trim().length < 30) {
      setError('Please provide at least 30 characters of resume content to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ats-scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          target_company: targetCompany,
          branch,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to complete ATS scan.');
      }

      const data: AtsScanResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ATS scan failed. Please retry.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBullet = () => {
    if (!result?.post_workshop_bullet) return;
    navigator.clipboard.writeText(result.post_workshop_bullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setResumeText(SAMPLE_STUDENT_RESUME);
    setFileName('Sample_Tier3_Student_Resume.txt');
    setError(null);
  };

  return (
    <div
      id="ats-scanner"
      className="scroll-mt-24 my-10 sm:my-14 rounded-2xl bg-gradient-to-b from-[#111826] to-[#0c1017] text-neutral-100 border border-neutral-800 relative overflow-hidden p-5 sm:p-9 shadow-2xl"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            CAMPUS PLACEMENT ATS AUDIT &bull; 100% FREE AI ENGINE
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Will Your Resume Survive Automated ATS Filters in Campus Placement Drives?
          </h2>

          <p className="mt-3 text-sm sm:text-base text-neutral-400 leading-relaxed">
            <strong className="text-neutral-200">82% of final-year engineering resumes</strong> are
            auto-rejected for listing generic academic CRUD projects. Upload your resume to see your
            current score and the exact{' '}
            <span className="text-cyan-400 font-semibold">+30% ATS score bump</span> you unlock in
            this 60-minute workshop.
          </p>
        </div>

        {/* Scanner Work Area Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Config & Input (7 cols) */}
          <div className="lg:col-span-7 bg-[#131926] border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl">
            {/* 1. Target Company Selection */}
            <div className="mb-6">
              <label className="block text-xs font-mono uppercase tracking-wider font-bold text-neutral-300 mb-2">
                1. Select Target Placement Package
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(
                  Object.keys(TARGET_COMPANY_METADATA) as TargetCompany[]
                ).map((key) => {
                  const comp = TARGET_COMPANY_METADATA[key];
                  const isSelected = targetCompany === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTargetCompany(key)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/50'
                          : 'bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-100">{comp.name}</span>
                        <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                          {comp.ctc}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">{comp.focus}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Branch Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider font-bold text-neutral-300">
                  2. Engineering Branch
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">Customizes keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBranch(b)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      branch === b
                        ? 'bg-cyan-500 text-neutral-950 shadow-sm'
                        : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Resume Input Mode Tabs */}
            <div className="mb-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setInputMode('paste')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      inputMode === 'paste'
                        ? 'bg-neutral-800 text-cyan-400 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      inputMode === 'upload'
                        ? 'bg-neutral-800 text-cyan-400 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Upload Resume (.pdf / .txt)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                >
                  <Zap className="w-3 h-3" />
                  Load Sample Tier-3 Resume
                </button>
              </div>

              {inputMode === 'paste' ? (
                <div>
                  <textarea
                    rows={8}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content, project section, or skills list here..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all leading-relaxed"
                  />
                  <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 mt-1.5">
                    <span>Target: {activeCompany.name}</span>
                    <span>{resumeText.length} characters</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="border-2 border-dashed border-neutral-800 hover:border-cyan-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-900/40">
                    <Upload className="w-8 h-8 text-neutral-500 mb-2" />
                    <span className="text-xs font-bold text-neutral-200">
                      Click to upload or drag & drop resume
                    </span>
                    <span className="text-[11px] text-neutral-500 mt-1 font-mono">
                      Accepts PDF, TXT, DOCX, MD (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.docx,.md,.rtf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {fileName && (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                      <div className="flex items-center gap-2 text-neutral-300 font-mono truncate">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="truncate">{fileName}</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-mono font-semibold shrink-0">
                        Ready to scan
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Run Audit Button */}
            <button
              type="button"
              onClick={handleRunScan}
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Scanning ATS Filters & Calculating Boost...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Run AI Placement ATS Audit &rarr;</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Dynamic Results & Transformation (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {!result ? (
              <div className="bg-[#131926] border border-neutral-800 rounded-2xl p-7 text-center flex flex-col items-center justify-center min-h-[460px]">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-cyan-400">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant ATS Placement Audit</h3>
                <p className="text-xs text-neutral-400 max-w-xs leading-relaxed mb-6">
                  Select your dream campus placement tier, paste or upload your resume, and see how
                  building this 60-minute AI project turns your resume into an interview magnet.
                </p>

                <div className="w-full space-y-2.5 text-left border-t border-neutral-800 pt-5">
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time keyword gap analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Side-by-side ATS score projection</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Ready-to-use quantified resume bullet</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#131926] border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                {/* 1. Score Gauge Comparison */}
                <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-3">
                    <span>ATS Screening Projection</span>
                    <span className="text-cyan-400 font-semibold">{result.company_name}</span>
                  </div>

                  <div className="grid grid-cols-3 items-center text-center gap-2">
                    {/* Before Score */}
                    <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800">
                      <span className="block text-[10px] font-mono uppercase text-neutral-500 mb-0.5">
                        Current
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-amber-400">
                        {result.current_ats_score}
                      </span>
                      <span className="block text-[10px] font-mono text-neutral-400 mt-0.5">
                        / 100
                      </span>
                      <span className="inline-block mt-1 text-[9px] font-bold text-amber-500 uppercase px-1.5 py-0.5 bg-amber-500/10 rounded">
                        High Risk
                      </span>
                    </div>

                    {/* Delta Arrow */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-1">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-black text-cyan-400">
                        +{result.score_delta}%
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500">SURGE</span>
                    </div>

                    {/* After Score */}
                    <div className="p-3 rounded-lg bg-neutral-950/80 border border-emerald-500/30">
                      <span className="block text-[10px] font-mono uppercase text-emerald-400 mb-0.5">
                        Post-Workshop
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                        {result.projected_ats_score}
                      </span>
                      <span className="block text-[10px] font-mono text-neutral-400 mt-0.5">
                        / 100
                      </span>
                      <span className="inline-block mt-1 text-[9px] font-bold text-emerald-400 uppercase px-1.5 py-0.5 bg-emerald-500/10 rounded">
                        Shortlist
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Recruiter Critique */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400 text-[11px] font-mono uppercase">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Recruiter&apos;s Honest Diagnosis</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] leading-relaxed">
                    {result.critical_critique}
                  </p>
                </div>

                {/* 3. Missing vs Found Keywords */}
                <div className="space-y-3">
                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold mb-1.5">
                      Missing Critical ATS Keywords for {result.company_name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing_placement_keywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono bg-red-950/40 text-red-300 border border-red-800/50 rounded-md"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1.5">
                      Recognized Keywords in Current Resume
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.found_keywords.map((kw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950/30 text-emerald-300 border border-emerald-800/40 rounded-md"
                        >
                          &bull; {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. The Golden Post-Workshop Resume Bullet */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/50 via-neutral-900 to-indigo-950/40 border border-blue-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      The 60-Minute Workshop Resume Bullet
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyBullet}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-white px-2 py-1 rounded bg-neutral-800 border border-neutral-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-neutral-100 font-mono leading-relaxed bg-neutral-950/70 p-3 rounded-lg border border-neutral-800">
                    &bull; {result.post_workshop_bullet}
                  </p>

                  <p className="text-[10px] text-neutral-400 italic">
                    <strong>Why Interviewers Care:</strong> {result.why_this_bullet_wins}
                  </p>
                </div>

                {/* 5. Direct Conversion Hook */}
                <div className="pt-1">
                  <a
                    href="#register"
                    className="w-full py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Lock My Free Seat & Build This Project (500 Cap)</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <p className="text-[10px] font-mono text-center text-neutral-500 mt-2">
                    <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-400" />
                    Zero fees &bull; Free verified PDF QR credential issued upon completion
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
