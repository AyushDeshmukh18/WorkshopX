'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Milestone {
  id: string;
  minute: string;
  title: string;
  description: string;
  commandSnippet?: string;
}

const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    minute: '00m',
    title: 'Environment Setup & Next.js Scaffolding',
    description: 'Clone repository template, initialize dependencies, and verify local dev server on localhost:3000.',
    commandSnippet: 'git clone https://github.com/firstbuild/starter-template && npm install',
  },
  {
    id: 'm2',
    minute: '15m',
    title: 'AI Provider Integration & Secrets',
    description: 'Obtain free Gemini / Groq API key, configure .env.local, and implement server-side inference boundary.',
    commandSnippet: 'AI_API_KEY=AIzaSy... AI_MODEL=gemini-3.1-flash-lite',
  },
  {
    id: 'm3',
    minute: '30m',
    title: 'Core Application Engine & Logic',
    description: 'Implement structured output extraction, prompt-injection defense delimiters, and error fallbacks.',
  },
  {
    id: 'm4',
    minute: '45m',
    title: 'Production Vercel Deployment',
    description: 'Push changes to GitHub and deploy to Vercel with HTTPS domain and zero build warnings.',
    commandSnippet: 'git push origin main && vercel --prod',
  },
  {
    id: '60m',
    minute: '60m',
    title: 'Automated Submission & Verified Certificate',
    description: 'Submit GitHub repository and live deployment URL for automated 100-point rubric audit.',
  },
];

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Question {
  id: string;
  author: string;
  text: string;
  upvotes: number;
  hasUpvoted: boolean;
  isAnswered: boolean;
  time: string;
}

function LiveRoom() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get('t') || '';

  const [joinToken, setJoinToken] = useState(tokenParam);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({
    m1: true,
  });

  // Live Poll State
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: 'opt1', text: 'Gemini 3.1 Flash Lite (Google AI Studio Free Tier)', votes: 84 },
    { id: 'opt2', text: 'Groq Llama-3.3-70b (Fast Inference)', votes: 42 },
    { id: 'opt3', text: 'Static Rule-Based Fallback Engine', votes: 12 },
  ]);

  // Live Q&A State
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      author: 'Rohit K.',
      text: 'Do we need a credit card to activate the Gemini API free tier?',
      upvotes: 18,
      hasUpvoted: false,
      isAnswered: true,
      time: '12m ago',
    },
    {
      id: 'q2',
      author: 'Sneha P.',
      text: 'What should we do if Vercel deployment fails with "Type error in layout.tsx"?',
      upvotes: 14,
      hasUpvoted: false,
      isAnswered: false,
      time: '6m ago',
    },
    {
      id: 'q3',
      author: 'Vikram S.',
      text: 'Does the automated rubric evaluate README architecture notes?',
      upvotes: 9,
      hasUpvoted: false,
      isAnswered: false,
      time: '2m ago',
    },
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  const toggleMilestone = (id: string) => {
    setCompletedMilestones((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePollVote = (optionId: string) => {
    if (pollVoted) return;
    setPollVoted(optionId);
    setPollOptions((prev) =>
      prev.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt))
    );
  };

  const handleUpvoteQuestion = (qId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          const delta = q.hasUpvoted ? -1 : 1;
          return { ...q, upvotes: q.upvotes + delta, hasUpvoted: !q.hasUpvoted };
        }
        return q;
      })
    );
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: Question = {
      id: `q_${Date.now()}`,
      author: joinToken ? 'Verified Student' : 'Guest Attendee',
      text: newQuestionText.trim(),
      upvotes: 1,
      hasUpvoted: true,
      isAnswered: false,
      time: 'Just now',
    };

    setQuestions([newQ, ...questions]);
    setNewQuestionText('');
  };

  const totalPollVotes = pollOptions.reduce((acc, cur) => acc + cur.votes, 0);
  const completedCount = Object.values(completedMilestones).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / MILESTONES.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 page-enter">
      {/* Top Banner / Stream Status */}
      <div className="warm-card p-6 md:p-8 rounded-lg mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-800 dark:text-blue-300">
                LIVE HANDS-ON WORKSHOP IN SESSION
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              Build Your First AI Project in 60 Minutes
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
              Follow the 5 structured build milestones below. Check in as you code, and submit your public GitHub repository before the 60m mark for instant automated evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://meet.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-semibold px-4 py-2.5 rounded transition-colors inline-flex items-center gap-1.5"
            >
              Join Meet Session &rarr;
            </a>

            <Link
              href={joinToken ? `/submit?t=${encodeURIComponent(joinToken)}` : '/submit'}
              prefetch={true}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-md transition-colors shadow-xs"
            >
              Submit Project &rarr;
            </Link>
          </div>
        </div>

        {/* Guest token linking bar if join token not in URL */}
        {!joinToken && (
          <div className="mt-5 pt-4 border-t border-[#e8e5de] dark:border-[#232833] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500">
              Attending as a guest? Link your verified registration token to bind your certificate:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={joinToken}
                onChange={(e) => setJoinToken(e.target.value)}
                placeholder="Paste token (e.g. FB-XXXX)"
                className="font-mono text-xs px-3 py-1.5 border border-[#e8e5de] dark:border-[#232833] rounded bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: 60-Minute Milestones Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="warm-card p-6 md:p-8 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e8e5de] dark:border-[#232833]">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  60-Minute Execution Roadmap
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Check in each milestone as you progress through the live stream.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  {completedCount} of {MILESTONES.length} Complete
                </span>
                <div className="w-24 bg-[#e8e5de] dark:bg-[#232833] h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {MILESTONES.map((milestone) => {
                const isDone = !!completedMilestones[milestone.id];
                return (
                  <div
                    key={milestone.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isDone
                        ? 'border-blue-300 dark:border-blue-800/80 bg-blue-50/40 dark:bg-blue-950/20'
                        : 'border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7]/60 dark:bg-[#15181f]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={`font-mono text-xs px-2.5 py-1 rounded font-bold shrink-0 ${
                            isDone
                              ? 'bg-blue-700 text-white'
                              : 'bg-[#e8e5de] dark:bg-[#232833] text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {milestone.minute}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            {milestone.title}
                          </h3>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                            {milestone.description}
                          </p>

                          {milestone.commandSnippet && (
                            <div className="mt-2.5 p-2.5 bg-[#14171d] text-blue-400 rounded-md font-mono text-[11px] overflow-x-auto border border-[#232833]">
                              <code>{milestone.commandSnippet}</code>
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleMilestone(milestone.id)}
                        className={`text-xs font-mono px-3.5 py-1.5 rounded transition-all whitespace-nowrap shrink-0 ${
                          isDone
                            ? 'bg-blue-700 hover:bg-blue-800 text-white font-semibold'
                            : 'border border-[#e8e5de] dark:border-[#232833] hover:bg-[#ece8df] dark:hover:bg-[#1f242d] text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        {isDone ? '✓ Checked In' : 'Check In'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-[#e8e5de] dark:border-[#232833] flex items-center justify-between">
              <span className="text-xs text-neutral-500">Finished building your project?</span>
              <Link
                href={joinToken ? `/submit?t=${encodeURIComponent(joinToken)}` : '/submit'}
                prefetch={true}
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
              >
                Submit Code for Verification &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Right Col: Live Polls & Upvoted Q&A */}
        <div className="space-y-6">
          {/* Live Poll Widget */}
          <div className="warm-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              <span className="text-[10px] font-mono uppercase text-neutral-500">Live Attendee Poll</span>
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              Which AI provider are you connecting today?
            </h3>

            <div className="space-y-2.5">
              {pollOptions.map((opt) => {
                const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                const isSelected = pollVoted === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handlePollVote(opt.id)}
                    disabled={!!pollVoted}
                    className={`w-full text-left p-3 rounded-md border text-xs relative overflow-hidden transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-neutral-900 dark:text-neutral-100 font-semibold'
                        : 'border-[#e8e5de] dark:border-[#232833] hover:border-neutral-400 bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <div
                      className="absolute inset-y-0 left-0 bg-neutral-200/50 dark:bg-neutral-800/40 transition-all pointer-events-none"
                      style={{ width: `${pct}%`, zIndex: 0 }}
                    ></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="pr-2">{opt.text}</span>
                      <span className="font-mono text-neutral-500 font-normal shrink-0">{pct}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] font-mono text-neutral-400 mt-3 text-right">
              {totalPollVotes} votes recorded live
            </p>
          </div>

          {/* Upvoted Q&A Feed */}
          <div className="warm-card p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Live Q&A
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Questions answered live by speaker and engineering mentors.
            </p>

            <form onSubmit={handlePostQuestion} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ask a technical question..."
                  className="flex-1 text-xs px-3 py-2 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-semibold px-3 py-2 rounded-md transition-colors whitespace-nowrap"
                >
                  Post
                </button>
              </div>
            </form>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-3 border border-[#e8e5de] dark:border-[#232833] rounded-md bg-[#fbfaf7]/60 dark:bg-[#15181f]/40 text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {q.author}
                    </span>
                    <div className="flex items-center gap-2">
                      {q.isAnswered && (
                        <span className="text-[10px] font-mono uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded">
                          Answered
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-neutral-400">{q.time}</span>
                    </div>
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 mb-2 leading-relaxed">{q.text}</p>

                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => handleUpvoteQuestion(q.id)}
                      className={`font-mono text-[11px] px-2.5 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                        q.hasUpvoted
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300'
                          : 'border-[#e8e5de] dark:border-[#232833] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      &uarr; {q.upvotes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LivePage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-4 py-12 text-xs font-mono text-neutral-500">Loading live workshop session...</div>}>
      <LiveRoom />
    </Suspense>
  );
}
