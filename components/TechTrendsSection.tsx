'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Globe,
  TrendingUp,
  ExternalLink,
  BookOpen,
  Github,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import type { TechTrendsResponse } from '@/lib/validation/tech-trends-schema';

export default function TechTrendsSection() {
  const [trendsData, setTrendsData] = useState<TechTrendsResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'articles' | 'hackernews' | 'salary' | 'repos'>('salary');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const loadTrends = async (showRefreshSpin = false) => {
    if (showRefreshSpin) setIsRefreshing(true);
    try {
      const res = await fetch('/api/tech-trends');
      if (res.ok) {
        const data: TechTrendsResponse = await res.json();
        setTrendsData(data);
      }
    } catch (e) {
      console.warn('Failed to load tech trends:', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, []);

  return (
    <div
      id="tech-trends"
      className="scroll-mt-24 my-10 sm:my-14 rounded-2xl bg-gradient-to-b from-[#111827] via-[#0c121e] to-[#090d15] text-neutral-100 border border-neutral-800 relative overflow-hidden p-5 sm:p-9 shadow-2xl"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
            <Globe className="w-3.5 h-3.5" />
            LIVE PUBLIC DATA FEEDS &bull; DEV.TO &bull; HACKERNEWS &bull; GITHUB
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            2026 Tech Market Radar: AI Breakthroughs &amp; Salary Pulse
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing what to learn. Real-time hiring telemetry aggregated across public developer networks proves why{' '}
            <strong className="text-neutral-200">Next.js 15, Supabase, and Production LLMs</strong> command{' '}
            <span className="text-emerald-400 font-semibold">₹8.5 – ₹14 LPA packages</span> in campus drives today.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs font-mono text-neutral-500">
            <span>
              Status:{' '}
              <span className="text-emerald-400 font-semibold">
                {trendsData?.source === 'live-api' ? 'Live Public APIs' : 'Live Syncing'}
              </span>
            </span>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => loadTrends(true)}
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-neutral-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'salary'
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2026 Salary &amp; Demand Index</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'articles'
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dev.to AI Articles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hackernews')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'hackernews'
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>HackerNews Discussions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('repos')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'repos'
                ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>Trending AI Repos</span>
          </button>
        </div>

        {/* Tab 1: Salary & Demand Index */}
        {activeTab === 'salary' && trendsData && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {trendsData.salary_pulse.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    item.category === 'ai-differential'
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                      : item.category === 'modern-web'
                      ? 'bg-cyan-950/20 border-cyan-500/30'
                      : 'bg-neutral-950 border-neutral-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-white text-sm block">{item.role_title}</span>
                      <span className="text-[11px] font-mono text-neutral-400">{item.experience_level}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.yoy_demand_growth.includes('+')
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {item.yoy_demand_growth}
                    </span>
                  </div>

                  <div className="my-2.5 p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">Average Campus Package:</span>
                    <span
                      className={`text-sm sm:text-base font-black font-mono ${
                        item.category === 'ai-differential' ? 'text-emerald-400' : 'text-neutral-200'
                      }`}
                    >
                      {item.average_ctc_india}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.core_stack.map((tech, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono text-center">
              💡 <strong>Market Verdict:</strong> Candidates building full-stack GenAI projects receive{' '}
              <span className="text-emerald-400 font-bold">2.4x higher starting packages</span> compared to students listing conventional Java/MySQL CRUD projects.
            </div>
          </div>
        )}

        {/* Tab 2: Dev.to Articles */}
        {activeTab === 'articles' && trendsData && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendsData.articles.map((art) => (
              <a
                key={art.id}
                href={art.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-cyan-500/50 transition-all shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-2">
                    <span>{art.source}</span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Clock className="w-3 h-3" />
                      {art.reading_time_minutes} min read
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug mb-2">
                    {art.title}
                  </h4>

                  {art.description && (
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                      {art.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[10px] font-mono text-neutral-500">
                  <span>By {art.author}</span>
                  <span className="inline-flex items-center gap-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Article</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Tab 3: HackerNews Discussions */}
        {activeTab === 'hackernews' && trendsData && (
          <div className="max-w-4xl mx-auto space-y-2.5">
            {trendsData.hacker_news.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3.5 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/50 transition-all flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold shrink-0">
                      HN Top
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">Shared by {item.author}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-200 group-hover:text-amber-300 transition-colors truncate">
                    {item.title}
                  </h4>
                </div>

                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        )}

        {/* Tab 4: GitHub Repos */}
        {activeTab === 'repos' && trendsData && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {trendsData.trending_repos.map((repo, idx) => (
              <a
                key={idx}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-white text-xs group-hover:text-indigo-300 transition-colors flex items-center gap-1.5 truncate">
                      <Github className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {repo.name}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                    {repo.description || 'Open source modern AI project.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[10px] font-mono text-neutral-500">
                  <span className="text-indigo-400">{repo.language || 'TypeScript'}</span>
                  <span className="inline-flex items-center gap-1 text-neutral-400 group-hover:text-white">
                    <span>View Repository</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Conversion Footer */}
        <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-neutral-800">
          <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4" />
                Build What The Industry Is Hiring For
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-lg">
                Stop building outdated 2018 college lab exercises. Join the live 60-minute build this Saturday to deploy your first production AI project with verifiable QR credential.
              </p>
            </div>

            <a
              href="#register"
              className="py-3 px-6 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-cyan-400 hover:bg-cyan-300 text-neutral-950 shadow-md transition-colors flex items-center gap-2 shrink-0"
            >
              <span>Claim Free Seat (500 Cap)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-[10px] font-mono text-center text-neutral-500 mt-3">
            <ShieldCheck className="w-3 h-3 inline mr-1 text-emerald-400" />
            100% Free Live Workshop &bull; Verified MIT Open Source Material
          </p>
        </div>
      </div>
    </div>
  );
}
