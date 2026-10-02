'use client';

import React, { useState } from 'react';
import type { Branch, Interest, SkillLevel, BlueprintTeaser } from '@/lib/validation/blueprint-schema';

export default function BlueprintFlow() {
  const [branch, setBranch] = useState<Branch>('CSE');
  const [interest, setInterest] = useState<Interest>('AI');
  const [level, setLevel] = useState<SkillLevel>('beginner');
  const [loading, setLoading] = useState(false);
  const [teaser, setTeaser] = useState<BlueprintTeaser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/blueprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          interest,
          skill_level: level,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate blueprint. Please try again.');
      }

      const data: BlueprintTeaser = await res.json();
      setTeaser(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="warm-card rounded-md p-6 sm:p-8 mb-12">
      <div className="border-b border-[#e8e5de] dark:border-[#232833] pb-4 mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-neutral-500">
            Interactive Architecture Planner
          </span>
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Personalized Placement Project Blueprint
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
          Select your engineering branch and technical interest. Our system will generate a verified project architecture tailored for campus placements.
        </p>
      </div>

      <form onSubmit={handleGenerate}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label
              htmlFor="branch-select"
              className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              ENGINEERING BRANCH
            </label>
            <select
              id="branch-select"
              aria-label="Engineering Branch"
              className="w-full bg-[#fbfaf7] dark:bg-[#12151b] border border-[#dcd8cf] dark:border-[#2b313d] rounded px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={branch}
              onChange={(e) => setBranch(e.target.value as Branch)}
            >
              <option value="CSE">Computer Science (CSE)</option>
              <option value="IT">Information Tech (IT)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="EEE">Electrical (EEE)</option>
              <option value="MECH">Mechanical (MECH)</option>
              <option value="CIVIL">Civil (CIVIL)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="interest-select"
              className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              DOMAIN INTEREST
            </label>
            <select
              id="interest-select"
              aria-label="Domain Focus"
              className="w-full bg-[#fbfaf7] dark:bg-[#12151b] border border-[#dcd8cf] dark:border-[#2b313d] rounded px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={interest}
              onChange={(e) => setInterest(e.target.value as Interest)}
            >
              <option value="AI">Applied Generative AI</option>
              <option value="WEB">Full-Stack Web Engineering</option>
              <option value="DATA">Data Engineering & Analytics</option>
              <option value="MOBILE">Mobile Systems</option>
              <option value="EMBEDDED">Embedded AI & Edge</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="level-select"
              className="block text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
            >
              EXPERIENCE LEVEL
            </label>
            <select
              id="level-select"
              aria-label="Experience Level"
              className="w-full bg-[#fbfaf7] dark:bg-[#12151b] border border-[#dcd8cf] dark:border-[#2b313d] rounded px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              value={level}
              onChange={(e) => setLevel(e.target.value as SkillLevel)}
            >
              <option value="beginner">Beginner (Foundational Coding)</option>
              <option value="intermediate">Intermediate (Built basic projects)</option>
              <option value="advanced">Advanced (Production deployment)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded text-xs text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 font-mono text-xs uppercase font-semibold px-6 py-3 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Synthesizing Architecture with AI...' : 'Generate My Project Blueprint'}
        </button>
      </form>

      {teaser && (
        <div className="mt-8 pt-8 border-t border-[#e8e5de] dark:border-[#232833]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
              Curated Placement Match: {teaser.match_score}%
            </span>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {teaser.project_name}
          </h3>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
            {teaser.one_liner}
          </p>

          <div className="bg-[#fbfaf7] dark:bg-[#12151b] border border-[#e8e5de] dark:border-[#232833] p-4 rounded mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase">
                What You Unlock In the Live 60-Minute Session:
              </span>
            </div>
            <ul className="text-xs text-neutral-600 dark:text-neutral-400 space-y-1.5 pl-4 list-disc">
              <li>Complete system architecture diagrams and verified tech stack specification.</li>
              <li>60-minute step-by-step live code implementation roadmap with IITian mentorship.</li>
              <li>Pre-formatted, quantified resume bullet point matching Tier-1 campus placement rubrics.</li>
              <li>Automated repository code audit and verifiable NxtWave CCBP 4.0 QR credential recognized by 2,500+ hiring partners.</li>
            </ul>
          </div>

          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(
                new CustomEvent('blueprint-selected', {
                  detail: { branch, interest, skillLevel: level },
                })
              );
              const target = document.getElementById('register');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono uppercase font-semibold px-6 py-3 rounded transition-colors text-center"
          >
            Claim Your Free Seat to Unlock Full Blueprint &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
