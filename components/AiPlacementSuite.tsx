'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Github,
  TrendingUp,
  BookOpen,
  Globe,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Laptop,
  Send,
  FileCode2,
  Compass
} from 'lucide-react';
import AtsScannerSection from '@/components/AtsScannerSection';
import GitHubDoctorSection from '@/components/GitHubDoctorSection';
import CtcPredictorSection from '@/components/CtcPredictorSection';
import MajorProjectSynopsisSection from '@/components/MajorProjectSynopsisSection';
import TechTrendsSection from '@/components/TechTrendsSection';
import BlueprintFlow from '@/components/BlueprintFlow';
import ColdPitchSection from '@/components/ColdPitchSection';
import ReadmeGeneratorSection from '@/components/ReadmeGeneratorSection';
import CareerBridgeSection from '@/components/CareerBridgeSection';

export type TabKey =
  | 'ats'
  | 'github'
  | 'ctc'
  | 'synopsis'
  | 'trends'
  | 'blueprint'
  | 'cold-pitch'
  | 'readme'
  | 'career-bridge';

interface ToolConfig {
  id: TabKey;
  hash: string;
  name: string;
  shortName: string;
  badge: string;
  badgeColor: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS: ToolConfig[] = [
  {
    id: 'ats',
    hash: '#ats-scanner',
    name: 'ATS Resume Scanner & Bullet Simulator',
    shortName: 'ATS Resume Scanner',
    badge: 'Placement Hot',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    description: 'Audit your resume ATS score against TCS, Cognizant, Amazon and see the exact project bullet that boosts it +30%.',
    icon: FileText,
  },
  {
    id: 'github',
    hash: '#github-doctor',
    name: 'AI GitHub Repo Doctor & Audit',
    shortName: 'GitHub Doctor',
    badge: 'Code Velocity',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    description: 'Inspect commit frequency, architecture flaws, and compute your Campus Recruiter Attractiveness Index.',
    icon: Github,
  },
  {
    id: 'cold-pitch',
    hash: '#cold-pitch',
    name: '1-Click Cold Email & InMail Pitch Generator',
    shortName: 'Cold Pitch & InMail',
    badge: 'Proof-of-Work',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    description: 'Generate high-converting 75-word cold outreach messages and follow-ups with deployed proof-of-work links.',
    icon: Send,
  },
  {
    id: 'readme',
    hash: '#readme-generator',
    name: 'FAANG-Grade GitHub README & Architecture Visualizer',
    shortName: 'README & System Arch',
    badge: 'Mermaid Spec',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    description: 'Generate complete GitHub READMEs with Mermaid architecture diagrams, SVG shields, and local setup scripts.',
    icon: FileCode2,
  },
  {
    id: 'career-bridge',
    hash: '#career-bridge',
    name: 'Non-CSE to Tech Career Bridge Roadmap Planner',
    shortName: 'Non-CSE Career Bridge',
    badge: 'Mech/Civil/EEE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Tailored 90-day transition roadmap for non-IT branches with verified NxtWave alumni placement stories.',
    icon: Compass,
  },
  {
    id: 'ctc',
    hash: '#ctc-predictor',
    name: 'CTC Tier Leap Predictor',
    shortName: 'CTC Tier Leap',
    badge: '₹3.5L ➔ ₹9.5L',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Analyze CGPA, tier & backlogs to find your roadmap out of mass recruitment into high-paying differential roles.',
    icon: TrendingUp,
  },
  {
    id: 'synopsis',
    hash: '#major-project-synopsis',
    name: 'IEEE Major Project Synopsis Generator',
    shortName: 'IEEE Synopsis',
    badge: 'College Sem 7/8',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    description: 'Generate institutional IEEE-compliant project reports, problem formulations, and architectural diagrams.',
    icon: BookOpen,
  },
  {
    id: 'trends',
    hash: '#tech-trends',
    name: '2026 Tech Market Radar & Salary Pulse',
    shortName: 'Market Radar',
    badge: 'Live Data',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    description: 'Real-time hiring radar aggregated from Dev.to, HackerNews, and GitHub Jobs with active package benchmarks.',
    icon: Globe,
  },
  {
    id: 'blueprint',
    hash: '#blueprints',
    name: 'AI Project Blueprint Generator',
    shortName: 'AI Blueprint',
    badge: '60-Min Lab',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    description: 'Tailored 60-minute full-stack AI system architecture, schema definitions, and production deployment roadmap.',
    icon: Laptop,
  },
];

const HASH_TO_TAB: Record<string, TabKey> = {
  '#ats-scanner': 'ats',
  '#ats': 'ats',
  '#github-doctor': 'github',
  '#github': 'github',
  '#cold-pitch': 'cold-pitch',
  '#cold-outreach': 'cold-pitch',
  '#inmail': 'cold-pitch',
  '#pitch': 'cold-pitch',
  '#readme-generator': 'readme',
  '#readme': 'readme',
  '#github-readme': 'readme',
  '#architecture': 'readme',
  '#career-bridge': 'career-bridge',
  '#non-cse': 'career-bridge',
  '#branch-roadmap': 'career-bridge',
  '#roadmap': 'career-bridge',
  '#ctc-predictor': 'ctc',
  '#ctc': 'ctc',
  '#major-project-synopsis': 'synopsis',
  '#synopsis': 'synopsis',
  '#tech-trends': 'trends',
  '#trends': 'trends',
  '#radar': 'trends',
  '#blueprints': 'blueprint',
  '#blueprint': 'blueprint',
  '#ai-suite': 'ats',
  '#ai-placement-suite': 'ats',
};

export default function AiPlacementSuite() {
  const [activeTab, setActiveTab] = useState<TabKey>('ats');
  const suiteRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Sync tab with URL hash on mount & hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash && HASH_TO_TAB[hash]) {
        setActiveTab(HASH_TO_TAB[hash]);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const selectTab = (id: TabKey, updateHash = true) => {
    setActiveTab(id);
    const targetTool = TOOLS.find((t) => t.id === id);
    if (updateHash && targetTool && typeof window !== 'undefined') {
      window.history.replaceState(null, '', targetTool.hash);
    }
  };

  const currentToolIndex = TOOLS.findIndex((t) => t.id === activeTab);
  const currentTool = TOOLS[currentToolIndex] || TOOLS[0];
  const prevTool = TOOLS[(currentToolIndex - 1 + TOOLS.length) % TOOLS.length];
  const nextTool = TOOLS[(currentToolIndex + 1) % TOOLS.length];

  return (
    <section
      id="ai-placement-suite"
      ref={suiteRef}
      className="py-14 sm:py-20 bg-[#090d16] text-white border-t border-b border-neutral-800 scroll-mt-20 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[350px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider bg-blue-500/10 text-cyan-400 border border-cyan-500/30 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>NXTWAVE CCBP 4.0 &bull; INTERACTIVE CAREER SUITE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            9 Free Industry-Grade{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-300">
              AI &amp; Placement Tools
            </span>
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 mt-3 leading-relaxed">
            Everything final-year engineering students and tech aspirants need to crack high-paying offers:
            audit your resume, grade GitHub repos, draft 75-word recruiter InMails, create FAANG READMEs, map non-CSE roadmaps, predict CTC jumps, and track live hiring trends—all with 100% free AI engines.
          </p>
        </div>

        {/* Unified Tab Navigation Bar */}
        <div className="bg-[#101625]/90 border border-neutral-800/80 rounded-2xl p-2 sm:p-2.5 mb-8 shadow-xl backdrop-blur-md">
          <div
            ref={tabListRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
            role="tablist"
          >
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;

              return (
                <button
                  key={tool.id}
                  id={`tab-btn-${tool.id}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => selectTab(tool.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.01]'
                      : 'bg-neutral-900/60 text-neutral-400 hover:text-white hover:bg-neutral-800/70 border border-neutral-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                  <div className="flex flex-col">
                    <span className="whitespace-nowrap font-semibold leading-tight">{tool.shortName}</span>
                    <span
                      className={`text-[9px] font-mono uppercase font-bold mt-0.5 tracking-wider px-1.5 py-0.2 rounded w-fit ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : `${tool.badgeColor} border`
                      }`}
                    >
                      {tool.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tool Sub-Banner */}
          <div className="mt-3.5 pt-3 border-t border-neutral-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 text-xs">
            <div className="flex items-center gap-2.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold text-white">{currentTool.name}</span>
              <span className="hidden md:inline text-neutral-400">&bull; {currentTool.description}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 shrink-0">
              <span className="px-2 py-0.5 rounded bg-neutral-800/80 border border-neutral-700/60 text-cyan-300 font-bold">
                TOOL {currentToolIndex + 1} OF {TOOLS.length}
              </span>
              <span className="hidden sm:inline">&bull; 100% Free Open-Source &amp; LLM Stack</span>
            </div>
          </div>
        </div>

        {/* Tool Workstation Container (Keeps State Preserved Across Tabs) */}
        <div className="relative">
          {/* 1. ATS Scanner */}
          <div className={activeTab === 'ats' ? 'block' : 'hidden'}>
            <AtsScannerSection />
          </div>

          {/* 2. GitHub Repo Doctor */}
          <div className={activeTab === 'github' ? 'block' : 'hidden'}>
            <GitHubDoctorSection />
          </div>

          {/* 3. Cold Pitch & InMail */}
          <div className={activeTab === 'cold-pitch' ? 'block' : 'hidden'}>
            <ColdPitchSection />
          </div>

          {/* 4. FAANG README & Architecture Visualizer */}
          <div className={activeTab === 'readme' ? 'block' : 'hidden'}>
            <ReadmeGeneratorSection />
          </div>

          {/* 5. Non-CSE Career Bridge */}
          <div className={activeTab === 'career-bridge' ? 'block' : 'hidden'}>
            <CareerBridgeSection />
          </div>

          {/* 6. CTC Tier Leap Predictor */}
          <div className={activeTab === 'ctc' ? 'block' : 'hidden'}>
            <CtcPredictorSection />
          </div>

          {/* 7. IEEE Major Project Synopsis */}
          <div className={activeTab === 'synopsis' ? 'block' : 'hidden'}>
            <MajorProjectSynopsisSection />
          </div>

          {/* 8. Tech Market Radar */}
          <div className={activeTab === 'trends' ? 'block' : 'hidden'}>
            <TechTrendsSection />
          </div>

          {/* 9. AI Blueprint Generator */}
          <div className={activeTab === 'blueprint' ? 'block' : 'hidden'}>
            <div
              id="blueprints"
              className="scroll-mt-24 my-8 rounded-2xl bg-gradient-to-b from-[#111826] to-[#0c1017] text-neutral-100 border border-neutral-800 p-6 sm:p-9 shadow-2xl relative overflow-hidden"
            >
              <div className="text-center max-w-3xl mx-auto mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
                  <Laptop className="w-3.5 h-3.5" />
                  TAILORED 60-MINUTE SYSTEM BLUEPRINT
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Generate Your Custom Project Architecture
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                  Select your engineering branch, tech interest, and experience level to generate a custom system design with live code milestones.
                </p>
              </div>
              <BlueprintFlow />
            </div>
          </div>
        </div>

        {/* Bottom Interactive Navigation & Action Bar */}
        <div className="mt-8 bg-[#101625] border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => selectTab(prevTool.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev: {prevTool.shortName}</span>
            </button>

            <button
              onClick={() => selectTab(nextTool.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Next: {nextTool.shortName}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-neutral-400 hidden lg:inline">
              Ready to code and deploy live to the cloud?
            </span>
            <a
              href="#register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-sm transition-all"
            >
              <span>Claim Free 60-Min Workshop Seat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
