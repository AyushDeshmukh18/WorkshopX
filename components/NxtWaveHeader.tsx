'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Github,
  TrendingUp,
  BookOpen,
  Globe,
  Sparkles,
  ChevronDown,
  Laptop,
  Users,
  Building2,
  Award,
  Send,
  FileCode2,
  Compass,
  Gift
} from 'lucide-react';

export default function NxtWaveHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [aiSuiteOpen, setAiSuiteOpen] = useState(false);
  const [placementsOpen, setPlacementsOpen] = useState(false);
  const pathname = usePathname();

  const programsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aiSuiteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const placementsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isLive = pathname === '/live';
  const isLeaderboard = pathname === '/leaderboard';
  const isSubmit = pathname === '/submit';
  const isDashboard = pathname === '/dashboard/me';
  const isTools = pathname === '/tools';
  const isReferrals = pathname === '/referrals';

  const handleProgramsMouseEnter = () => {
    if (programsTimeoutRef.current) clearTimeout(programsTimeoutRef.current);
    setProgramsOpen(true);
  };
  const handleProgramsMouseLeave = () => {
    programsTimeoutRef.current = setTimeout(() => setProgramsOpen(false), 150);
  };

  const handleAiSuiteMouseEnter = () => {
    if (aiSuiteTimeoutRef.current) clearTimeout(aiSuiteTimeoutRef.current);
    setAiSuiteOpen(true);
  };
  const handleAiSuiteMouseLeave = () => {
    aiSuiteTimeoutRef.current = setTimeout(() => setAiSuiteOpen(false), 150);
  };

  const handlePlacementsMouseEnter = () => {
    if (placementsTimeoutRef.current) clearTimeout(placementsTimeoutRef.current);
    setPlacementsOpen(true);
  };
  const handlePlacementsMouseLeave = () => {
    placementsTimeoutRef.current = setTimeout(() => setPlacementsOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (programsTimeoutRef.current) clearTimeout(programsTimeoutRef.current);
      if (aiSuiteTimeoutRef.current) clearTimeout(aiSuiteTimeoutRef.current);
      if (placementsTimeoutRef.current) clearTimeout(placementsTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-blue-700/40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2.5 flex-wrap text-center">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-200 px-1.5 sm:px-2 py-0.5 rounded font-mono text-[9px] sm:text-[10px] uppercase font-bold border border-blue-400/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            LIVE WORKSHOP
          </span>
          <span className="font-medium text-neutral-200 text-[11px] sm:text-xs">
            Build Your First AI Project in 60 Mins &bull; 500 Seats
          </span>
          <a
            href="/#register"
            className="inline-flex items-center gap-1 underline font-bold text-cyan-300 hover:text-white transition-colors shrink-0"
          >
            <span>Claim Seat &rarr;</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#080c14]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Brand Logo & CCBP 4.0 Badge */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 group">
            <div className="flex items-baseline">
              <span className="text-lg sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                NXT<span className="text-blue-600 dark:text-blue-400">WAVE</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-neutral-400 dark:text-neutral-500 ml-0.5">
                TM
              </span>
            </div>
            <span className="whitespace-nowrap text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-1.5 sm:px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              CCBP 4.0
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <Link
              href="/"
              className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === '/' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </Link>

            {/* 1. 60-Min AI Workshop */}
            <a
              href="/#workshop"
              className="whitespace-nowrap flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>60-Min Workshop</span>
            </a>

            {/* 2. AI Placement Suite Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleAiSuiteMouseEnter}
              onMouseLeave={handleAiSuiteMouseLeave}
            >
              <button
                type="button"
                onClick={() => setAiSuiteOpen(!aiSuiteOpen)}
                className={`whitespace-nowrap flex items-center gap-1.5 py-2 font-semibold transition-colors focus:outline-none ${
                  isTools
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-neutral-800 dark:text-neutral-200 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>AI Placement Suite</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  9 FREE
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aiSuiteOpen ? 'rotate-180' : ''}`} />
              </button>

              {aiSuiteOpen && (
                <div className="absolute top-full left-0 w-[410px] bg-white dark:bg-[#111726] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="px-2 py-1.5 mb-2 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400">
                      Zero-Cost Career Tools (100% Free AI)
                    </span>
                    <Link
                      href="/tools"
                      onClick={() => setAiSuiteOpen(false)}
                      className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      Open Full Suite &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    <Link
                      href="/tools#ats-scanner"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-200 dark:border-cyan-800">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            ATS Resume Scanner
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 px-1.5 py-0.2 rounded font-bold">
                            +30% Score
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Test resume against TCS, Cognizant, Amazon &amp; get instant placement bullet.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#github-doctor"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                        <Github className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            AI GitHub Repo Doctor
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                            Audit
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Audit commit velocity &amp; Campus Recruiter Attractiveness Index.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#cold-pitch"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                        <Send className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            Cold InMail &amp; Pitch Generator
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded font-bold">
                            75 Words
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Proof-of-work outreach with live deployed workshop URLs.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#readme-generator"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                        <FileCode2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            FAANG README &amp; Architecture
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">
                            Mermaid
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Open-source grade documentation suite with vector architecture flow.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#career-bridge"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            Non-CSE Career Bridge
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                            90-Day
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Mech, Civil, EEE &amp; Chem transition roadmaps with verified alumni.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#ctc-predictor"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            CTC Tier Leap Predictor
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-bold">
                            ₹3.5L ➔ ₹9.5L
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Escape the mass recruiter bracket with specific project milestones.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#major-project-synopsis"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            IEEE Project Synopsis Generator
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                            Sem 7/8
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Compliant institutional synopses, problem formulation &amp; architecture.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#tech-trends"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            2026 Tech Market Radar
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded font-bold">
                            Live Pulse
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          HackerNews, Dev.to &amp; GitHub live tech hiring salary benchmarks.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/tools#blueprints"
                      onClick={() => setAiSuiteOpen(false)}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white group-hover:text-blue-600">
                            AI Project Blueprint Generator
                          </span>
                          <span className="text-[9px] font-mono uppercase bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-bold">
                            60-Min Lab
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                          Custom system architecture &amp; milestones tailored to your branch.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Programs Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleProgramsMouseEnter}
              onMouseLeave={handleProgramsMouseLeave}
            >
              <button
                type="button"
                onClick={() => setProgramsOpen(!programsOpen)}
                className="whitespace-nowrap flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 focus:outline-none"
              >
                <span>Programs</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${programsOpen ? 'rotate-180' : ''}`} />
              </button>

              {programsOpen && (
                <div className="absolute top-full left-0 w-72 bg-white dark:bg-[#121722] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-2.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <a
                    href="/#programs"
                    onClick={() => setProgramsOpen(false)}
                    className="block p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                      CCBP 4.0 Academy
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5 leading-relaxed">
                      For 1st, 2nd, 3rd year engineering students.
                    </span>
                  </a>

                  <a
                    href="/#programs"
                    onClick={() => setProgramsOpen(false)}
                    className="block p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                      CCBP 4.0 Intensive
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5 leading-relaxed">
                      For final year &amp; graduates. Kukatpally &amp; Online.
                    </span>
                  </a>

                  <a
                    href="/#programs"
                    onClick={() => setProgramsOpen(false)}
                    className="block p-2.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                      NIAT Upskilling
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5 leading-relaxed">
                      At 25+ collaborating colleges across India.
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* 4. Placements & Proof Dropdown (Organized clean grouping) */}
            <div
              className="relative"
              onMouseEnter={handlePlacementsMouseEnter}
              onMouseLeave={handlePlacementsMouseLeave}
            >
              <button
                type="button"
                onClick={() => setPlacementsOpen(!placementsOpen)}
                className="whitespace-nowrap flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 focus:outline-none"
              >
                <span>Placements</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${placementsOpen ? 'rotate-180' : ''}`} />
              </button>

              {placementsOpen && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-[#121722] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <a
                    href="/#hiring-partners"
                    onClick={() => setPlacementsOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                        2,500+ Companies
                      </span>
                      <span className="text-[10px] text-neutral-500 block">Top product &amp; MNC network</span>
                    </div>
                  </a>

                  <a
                    href="/#reviews"
                    onClick={() => setPlacementsOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                        Senior Reviews
                      </span>
                      <span className="text-[10px] text-neutral-500 block">Placement success stories</span>
                    </div>
                  </a>

                  <Link
                    href="/leaderboard"
                    onClick={() => setPlacementsOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <Award className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                        College Leaderboard
                      </span>
                      <span className="text-[10px] text-neutral-500 block">National campus rankings</span>
                    </div>
                  </Link>

                  <Link
                    href="/referrals"
                    onClick={() => setPlacementsOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <Gift className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                          Referral Tracker
                        </span>
                        <span className="text-[9px] font-mono uppercase bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 px-1 rounded font-bold">
                          Perks
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 block">Track invites &amp; claim FAANG kits</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Referrals */}
            <Link
              href="/referrals"
              className={`whitespace-nowrap inline-flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                isReferrals
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800'
                  : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-amber-500" />
              <span>Referrals</span>
            </Link>

            {/* 6. Live Room */}
            <Link
              href="/live"
              className={`whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                isLive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800'
                  : 'hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span>Live Room</span>
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <Link
              href="/submit"
              className={`hidden 2xl:inline-flex whitespace-nowrap items-center px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                isSubmit
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              Submit Project
            </Link>

            <Link
              href="/dashboard/me"
              className={`hidden sm:inline-flex whitespace-nowrap items-center px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isDashboard
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 hover:border-blue-300 bg-white dark:bg-[#121622]'
              }`}
            >
              Student Pass
            </Link>

            <a
              href="/#register"
              className="hidden min-[380px]:inline-flex whitespace-nowrap items-center justify-center px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0"
            >
              <span className="hidden sm:inline">Book Free Seat</span>
              <span className="sm:hidden">Claim Seat</span>
            </a>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] px-4 py-5 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
            {/* Primary Workshop Action */}
            <div className="p-3 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-700 dark:text-blue-300">
                  FLAGSHIP 60-MIN WORKSHOP
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-600 text-white font-bold">
                  FREE SEAT
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/#register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-blue-600 text-white font-bold text-xs rounded-lg uppercase tracking-wide hover:bg-blue-700 transition-colors"
                >
                  Claim Seat &rarr;
                </a>
                <Link
                  href="/dashboard/me"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 bg-white dark:bg-[#121622] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-bold text-xs rounded-lg uppercase tracking-wide hover:border-blue-500 transition-colors"
                >
                  Student Pass
                </Link>
              </div>
            </div>

            {/* AI Placement Suite Section */}
            <div className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider flex items-center justify-between">
                <Link
                  href="/tools"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:underline flex items-center gap-1 text-blue-600 dark:text-blue-400"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Placement Suite (9 Free Tools)</span>
                </Link>
                <span className="text-cyan-600 dark:text-cyan-400 text-[10px]">100% Free AI</span>
              </div>
              <Link
                href="/tools#ats-scanner"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <FileText className="w-4 h-4 text-cyan-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">ATS Resume Scanner</div>
                  <div className="text-[10px] text-neutral-500">Target company scoring &amp; placement bullets</div>
                </div>
              </Link>
              <Link
                href="/tools#github-doctor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <Github className="w-4 h-4 text-indigo-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">AI GitHub Repo Doctor</div>
                  <div className="text-[10px] text-neutral-500">Recruiter attractiveness &amp; repo audit</div>
                </div>
              </Link>
              <Link
                href="/tools#cold-pitch"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <Send className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">Cold InMail &amp; Pitch Generator</div>
                  <div className="text-[10px] text-neutral-500">75-word proof-of-work outreach</div>
                </div>
              </Link>
              <Link
                href="/tools#readme-generator"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <FileCode2 className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">FAANG README Visualizer</div>
                  <div className="text-[10px] text-neutral-500">Mermaid architecture &amp; SVG badges</div>
                </div>
              </Link>
              <Link
                href="/tools#career-bridge"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <Compass className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">Non-CSE Career Bridge</div>
                  <div className="text-[10px] text-neutral-500">90-day roadmaps for Mech/Civil/EEE</div>
                </div>
              </Link>
              <Link
                href="/tools#ctc-predictor"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">CTC Tier Leap Predictor</div>
                  <div className="text-[10px] text-neutral-500">Escape ₹3.5L pool to ₹9.5L track</div>
                </div>
              </Link>
              <Link
                href="/tools#major-project-synopsis"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">IEEE Major Project Synopsis</div>
                  <div className="text-[10px] text-neutral-500">Final year compliant report generator</div>
                </div>
              </Link>
              <Link
                href="/tools#tech-trends"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <Globe className="w-4 h-4 text-blue-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">2026 Tech Market Radar</div>
                  <div className="text-[10px] text-neutral-500">Live HackerNews, Dev.to salary pulse</div>
                </div>
              </Link>
              <Link
                href="/tools#blueprints"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs text-neutral-800 dark:text-neutral-200"
              >
                <Laptop className="w-4 h-4 text-purple-500 shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold">AI Project Blueprint Generator</div>
                  <div className="text-[10px] text-neutral-500">60-minute tailored project architecture</div>
                </div>
              </Link>
            </div>

            {/* Core Programs & Ecosystem */}
            <div className="space-y-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <div className="px-2 py-1 text-[11px] font-mono font-bold uppercase text-neutral-400 tracking-wider">
                Programs &amp; Ecosystem
              </div>
              <a
                href="/#programs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
              >
                CCBP 4.0 Programs (Academy &amp; Intensive)
              </a>
              <a
                href="/#hiring-partners"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
              >
                2,500+ Hiring Partners Network
              </a>
              <a
                href="/#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
              >
                Senior Reviews &amp; Placement Wall
              </a>
              <Link
                href="/leaderboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
              >
                Colleges &amp; Campus Leaderboard
              </Link>
              <Link
                href="/referrals"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-2 py-1.5 text-xs text-amber-700 dark:text-amber-300 font-semibold bg-amber-50/50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/50"
              >
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-500" />
                  <span>Peer Referral Tracker &amp; Perks</span>
                </span>
                <span className="text-[9px] font-mono font-bold uppercase bg-amber-200/60 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded">
                  Milestones
                </span>
              </Link>
              <Link
                href="/live"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400"
              >
                Live Workshop Room &rarr;
              </Link>
              <Link
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
              >
                Submit Project for Audit
              </Link>
              <Link
                href="/dashboard/me"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium"
              >
                My Admission Pass
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-1.5 text-xs font-mono text-neutral-500"
              >
                Admin Operations Center &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
