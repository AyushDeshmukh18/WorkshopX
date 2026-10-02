'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NxtWaveHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const pathname = usePathname();

  const isLive = pathname === '/live';
  const isLeaderboard = pathname === '/leaderboard';
  const isSubmit = pathname === '/submit';
  const isDashboard = pathname === '/dashboard/me';

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-[11px] sm:text-xs py-2 px-4 border-b border-blue-700/40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap text-center">
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold border border-blue-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            LIVE TECHNICAL WORKSHOP
          </span>
          <span className="whitespace-nowrap font-medium">
            Build Your First AI Project in 60 Minutes &bull; Limited 500 Verified Seats.
          </span>
          <a
            href="/#register"
            className="whitespace-nowrap underline font-bold text-cyan-300 hover:text-white transition-colors"
          >
            Claim Free Seat &rarr;
          </a>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & CCBP 4.0 Badge */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                NXT<span className="text-blue-600 dark:text-blue-400">WAVE</span>
              </span>
              <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 ml-0.5">
                TM
              </span>
            </div>
            <span className="whitespace-nowrap text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
              CCBP 4.0
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-6 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <Link
              href="/"
              className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                pathname === '/' ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Home
            </Link>

            {/* Programs Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProgramsOpen(!programsOpen)}
                onMouseEnter={() => setProgramsOpen(true)}
                className="whitespace-nowrap flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2 focus:outline-none"
              >
                <span>Programs</span>
                <svg
                  className={`w-3 h-3 transition-transform ${programsOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {programsOpen && (
                <div
                  onMouseLeave={() => setProgramsOpen(false)}
                  className="absolute top-full left-0 w-72 bg-white dark:bg-[#121722] border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl p-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                >
                  <a
                    href="/#programs"
                    onClick={() => setProgramsOpen(false)}
                    className="block p-2.5 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                      CCBP 4.0 Academy
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                      For 1st, 2nd, 3rd year engineering students.
                    </span>
                  </a>

                  <a
                    href="/#programs"
                    onClick={() => setProgramsOpen(false)}
                    className="block p-2.5 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                      CCBP 4.0 Intensive
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                      For final year & graduates. Kukatpally & Online.
                    </span>
                  </a>

                  <a
                    href="/#programs"
                    onClick={() => setProgramsOpen(false)}
                    className="block p-2.5 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group"
                  >
                    <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-blue-600 block">
                      NIAT Upskilling
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                      At 25+ collaborating colleges across India.
                    </span>
                  </a>
                </div>
              )}
            </div>

            <a
              href="/#workshop"
              className="whitespace-nowrap flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping"></span>
              <span>60-Min AI Workshop</span>
            </a>

            <a
              href="/#hiring-partners"
              className="whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              2,500+ Companies
            </a>

            <a
              href="/#reviews"
              className="whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Reviews
            </a>

            <a
              href="/#hire"
              className="whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Hire with Us
            </a>

            <Link
              href="/leaderboard"
              className={`whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                isLeaderboard ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Colleges
            </Link>

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

            <Link
              href="/submit"
              className={`whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                isSubmit ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''
              }`}
            >
              Submit Project
            </Link>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/dashboard/me"
              className={`whitespace-nowrap inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                isDashboard
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                  : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 hover:border-blue-300'
              }`}
            >
              Student Pass
            </Link>

            <a
              href="/#register"
              className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              Book Free Seat
            </a>

            {/* Mobile / Tablet Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none"
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
          <div className="xl:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0d1117] px-4 py-4 space-y-2.5 animate-in slide-in-from-top-2 duration-150">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Home
            </Link>
            <a
              href="/#workshop"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400"
            >
              60-Min AI Workshop (Live)
            </a>
            <a
              href="/#programs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Programs (Academy & Intensive)
            </a>
            <a
              href="/#hiring-partners"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              2,500+ Hiring Partners
            </a>
            <a
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Reviews & Placement Stories
            </a>
            <a
              href="/#hire"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Hire with Us (Zero Fee)
            </a>
            <Link
              href="/leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Campus Leaderboard
            </Link>
            <Link
              href="/live"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400"
            >
              Live Workshop Room &rarr;
            </Link>
            <Link
              href="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              Submit Project Audit
            </Link>
            <Link
              href="/dashboard/me"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-medium text-neutral-800 dark:text-neutral-200"
            >
              My Admission Pass
            </Link>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-sm font-mono text-neutral-500"
            >
              Admin Operations Center &rarr;
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
