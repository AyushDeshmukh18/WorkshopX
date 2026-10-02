'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export interface CollegeStat {
  college_id: string;
  college_name: string;
  state: string;
  verified_count: number;
  attended_count: number;
}

const INITIAL_COLLEGES: CollegeStat[] = [
  {
    college_id: '1',
    college_name: 'JNTU College of Engineering Hyderabad',
    state: 'Telangana',
    verified_count: 68,
    attended_count: 0,
  },
  {
    college_id: '2',
    college_name: 'Chaitanya Bharathi Institute of Technology (CBIT)',
    state: 'Telangana',
    verified_count: 44,
    attended_count: 0,
  },
  {
    college_id: '3',
    college_name: 'Vasavi College of Engineering',
    state: 'Telangana',
    verified_count: 32,
    attended_count: 0,
  },
  {
    college_id: '4',
    college_name: 'VNR Vignana Jyothi Institute of Engineering',
    state: 'Telangana',
    verified_count: 28,
    attended_count: 0,
  },
  {
    college_id: '5',
    college_name: 'COEP Technological University, Pune',
    state: 'Maharashtra',
    verified_count: 24,
    attended_count: 0,
  },
  {
    college_id: '6',
    college_name: 'Gayatri Vidya Parishad College of Eng, Visakhapatnam',
    state: 'Andhra Pradesh',
    verified_count: 21,
    attended_count: 0,
  },
  {
    college_id: '7',
    college_name: 'BMS College of Engineering, Bengaluru',
    state: 'Karnataka',
    verified_count: 18,
    attended_count: 0,
  },
  {
    college_id: '8',
    college_name: 'PSG College of Technology, Coimbatore',
    state: 'Tamil Nadu',
    verified_count: 15,
    attended_count: 0,
  },
];

export default function LeaderboardPage() {
  const [colleges, setColleges] = useState<CollegeStat[]>(INITIAL_COLLEGES);
  const [lastUpdated, setLastUpdated] = useState<string>('Live (Realtime Active)');
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchStats = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('college_stats')
        .select('*')
        .order('verified_count', { ascending: false });

      if (!error && data && data.length > 0) {
        setColleges(data as CollegeStat[]);
        setLastUpdated(`Updated at ${new Date().toLocaleTimeString('en-IN')}`);
      }
    } catch {
      // Graceful fallback: maintain local state
    }
  }, []);

  useEffect(() => {
    fetchStats();

    try {
      const supabase = getSupabaseBrowserClient();
      const channel = supabase
        .channel('college-stats-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'college_stats' },
          (payload) => {
            if (payload.new) {
              const updated = payload.new as CollegeStat;
              setColleges((prev) => {
                const index = prev.findIndex((c) => c.college_id === updated.college_id);
                let next;
                if (index !== -1) {
                  next = [...prev];
                  next[index] = updated;
                } else {
                  next = [...prev, updated];
                }
                return next.sort((a, b) => b.verified_count - a.verified_count);
              });
              setLiveAnnouncement(`${updated.college_name} verified count updated to ${updated.verified_count}`);
            }
          }
        )
        .subscribe();

      const pollTimer = setInterval(fetchStats, 15000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(pollTimer);
      };
    } catch {
      const pollTimer = setInterval(fetchStats, 15000);
      return () => clearInterval(pollTimer);
    }
  }, [fetchStats]);

  const filteredColleges = useMemo(() => {
    if (!searchQuery.trim()) return colleges;
    const query = searchQuery.toLowerCase();
    return colleges.filter(
      (c) =>
        c.college_name.toLowerCase().includes(query) ||
        c.state.toLowerCase().includes(query)
    );
  }, [colleges, searchQuery]);

  const totalVerified = colleges.reduce((sum, c) => sum + c.verified_count, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 page-enter">
      {/* Hidden aria-live region for accessibility */}
      <div aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Header section with warm tone and clean badge */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            LIVE CAMPUS LEADERBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            College Cohort Rankings
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1.5">
            {lastUpdated} &bull; {totalVerified} Total Students Verified across {colleges.length} Institutions
          </p>
        </div>

        <Link
          href="/#register"
          prefetch={true}
          className="inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900 text-xs font-semibold px-4 py-2.5 rounded transition-colors whitespace-nowrap"
        >
          Represent Your College &rarr;
        </Link>
      </div>

      {/* Quick Search & Summary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="warm-card p-3.5 rounded-md">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Top Institution</span>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 truncate block">
            {colleges[0]?.college_name || 'Calculating...'}
          </span>
        </div>
        <div className="warm-card p-3.5 rounded-md">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Leading State</span>
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5 block">
            {colleges[0]?.state || 'Telangana'}
          </span>
        </div>
        <div className="warm-card p-3.5 rounded-md">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">Active Verified Seats</span>
          <span className="text-sm font-mono font-bold text-blue-700 dark:text-blue-400 mt-0.5 block">
            {totalVerified} / 500
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search institution by name or state (e.g. Hyderabad, CBIT, COEP)..."
            className="w-full text-xs px-3.5 py-2.5 rounded-md border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Leaderboard Table (Desktop & Tablet) */}
      <div className="warm-card overflow-hidden shadow-sm hidden sm:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f6f4ee] dark:bg-[#191d24] border-b border-[#e8e5de] dark:border-[#232833] text-xs font-mono text-neutral-600 dark:text-neutral-400">
            <tr>
              <th className="py-3 px-4 w-16">RANK</th>
              <th className="py-3 px-4">COLLEGE / INSTITUTION</th>
              <th className="py-3 px-4 w-36">STATE</th>
              <th className="py-3 px-4 text-right w-36">VERIFIED SEATS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e5de] dark:divide-[#232833]">
            {filteredColleges.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-xs text-neutral-500">
                  No colleges found matching &ldquo;{searchQuery}&rdquo;.
                </td>
              </tr>
            ) : (
              filteredColleges.map((col, idx) => {
                const rank = idx + 1;
                const isTop3 = rank <= 3;
                return (
                  <tr
                    key={col.college_id}
                    className="hover:bg-[#f8f6f0] dark:hover:bg-[#181c24] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs">
                      {rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-amber-100 text-amber-900 font-bold text-xs border border-amber-300">
                          1
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-neutral-200 text-neutral-800 font-bold text-xs border border-neutral-300">
                          2
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-amber-50 text-amber-800 font-bold text-xs border border-amber-200">
                          3
                        </span>
                      ) : (
                        <span className="text-neutral-400 font-semibold pl-1.5">#{rank}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/c/${encodeURIComponent(col.college_name.toLowerCase().replace(/\s+/g, '-'))}`}
                        prefetch={true}
                        className={`hover:underline ${
                          isTop3
                            ? 'font-semibold text-neutral-900 dark:text-neutral-100'
                            : 'font-normal text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {col.college_name}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-500 font-mono">
                      {col.state}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900 dark:text-neutral-100">
                      {col.verified_count}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive Mobile Card View */}
      <div className="space-y-3 sm:hidden">
        {filteredColleges.length === 0 ? (
          <div className="warm-card p-6 text-center text-xs text-neutral-500">
            No colleges found matching &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredColleges.map((col, idx) => {
            const rank = idx + 1;
            return (
              <div
                key={col.college_id}
                className="warm-card p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs font-bold text-neutral-500 w-6 shrink-0">
                    #{rank}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/c/${encodeURIComponent(col.college_name.toLowerCase().replace(/\s+/g, '-'))}`}
                      prefetch={true}
                      className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline block truncate"
                    >
                      {col.college_name}
                    </Link>
                    <span className="text-[11px] text-neutral-500 font-mono block">
                      {col.state}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-mono font-bold text-xs text-neutral-900 dark:text-neutral-100">
                    {col.verified_count}
                  </span>
                  <span className="text-[10px] text-neutral-400 block uppercase font-mono">
                    seats
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
