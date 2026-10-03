'use client';

import React from 'react';

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-16 sm:py-20 bg-[#f8fafc] dark:bg-[#0c111c] border-b border-neutral-200 dark:border-neutral-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            TRANSFORMATIVE TECH PATHWAYS
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 dark:text-white tracking-tight leading-tight">
            Designed to transform you into a highly skilled Software Professional
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-3 leading-relaxed">
            Whether you are in your early college years, approaching final-year placements, or a graduate transitioning into tech, NxtWave CCBP 4.0 delivers tailored, industry-proven programs.
          </p>
        </div>

        {/* 4 Cards Grid (Featuring 60-Minute AI Workshop as the Flagship) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: 60-Minute Live AI Workshop (FEATURED SPOTLIGHT) */}
          <div className="relative bg-gradient-to-b from-blue-50/80 via-white to-white dark:from-[#11192e] dark:via-[#0e1320] dark:to-[#0e1320] border-2 border-blue-600 dark:border-blue-500 rounded-2xl p-6 shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
              ★ FEATURED LIVE WORKSHOP
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3 pt-2">
                <span className="text-[10px] font-mono font-bold uppercase bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                  FINAL YEAR & GRADUATES
                </span>
                <span className="text-[10px] font-mono font-bold uppercase bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                  100% FREE
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white leading-tight mb-2">
                Build Your First AI Project in 60 Minutes
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                Hands-on live laboratory designed by IIT Bombay & top MNC alumni. Build, wire Gemini AI, deploy live to cloud, and earn a verified credential for campus placements.
              </p>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 mb-6 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&check;</span>
                  <span>Personalized placement project blueprint</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&check;</span>
                  <span>Deploy live public URL in 60 mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&check;</span>
                  <span>Cryptographic QR LinkedIn credential</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&check;</span>
                  <span>Limited to 500 verified cohort seats</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="#register"
                className="w-full inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors shadow-xs"
              >
                Claim Free Seat &rarr;
              </a>
              <a
                href="/tools#blueprints"
                className="w-full inline-block text-center border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs py-2 rounded-lg transition-colors"
              >
                Explore Blueprints
              </a>
            </div>
          </div>

          {/* Card 2: CCBP 4.0 Academy */}
          <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded">
                  POST 12TH / INTERMEDIATE
                </span>
                <span className="text-[10px] font-mono font-bold uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                  1ST, 2ND, 3RD YEAR
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white leading-tight mb-2">
                NxtWave Academy
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                Learn like top IITians and achieve high-paid software jobs with continuous upskilling alongside your college degree.
              </p>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 mb-6 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>50+ Real-world AI & Full Stack Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Highest Package: ₹37 LPA</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Up to 6 internship opportunities per student</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Flexible classes matching college hours</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="https://forms.ccbp.in/public/form/talk-to-career-expert"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors"
              >
                Request Callback
              </a>
              <a
                href="https://www.ccbp.in/academy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs py-2 rounded-lg transition-colors"
              >
                Know More
              </a>
            </div>
          </div>

          {/* Card 3: CCBP 4.0 Intensive */}
          <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                  GRADUATES & FINAL YEAR
                </span>
                <span className="text-[10px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded">
                  ANY BRANCH OR DEGREE
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white leading-tight mb-2">
                NxtWave Intensive
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                A proven full-time upskilling program to build your software career in 4.5+3.5 months with guaranteed placement support.
              </p>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 mb-6 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Offline Center at Kukatpally & Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>750+ Hours Developer Curriculum</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>2,500+ Hiring Partners placement drives</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>1:1 Doubt solving from 11 AM - 8 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="https://www.ccbp.in/intensive"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors"
              >
                Know More
              </a>
              <a
                href="https://forms.ccbp.in/public/form/talk-to-career-expert"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs py-2 rounded-lg transition-colors"
              >
                Book a Free Demo
              </a>
            </div>
          </div>

          {/* Card 4: NIAT Institutional Upskilling */}
          <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 px-2 py-0.5 rounded">
                  POST 12TH / PCM
                </span>
                <span className="text-[10px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded">
                  25+ INSTITUTIONS
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white leading-tight mb-2">
                NIAT Industry-Ready Upskilling
              </h3>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                Embedded tech skilling at collaborating institutions across India. Learn emerging technologies within college curriculum.
              </p>

              <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 mb-6 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Enrollments Open For 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Hands-on AI & Cloud laboratories</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Collaborative industry hackathons</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-bold">&bull;</span>
                  <span>Dual institutional certification</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="https://apply.niatindia.com/login"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors"
              >
                Request Callback
              </a>
              <a
                href="https://www.niatindia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block text-center border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs py-2 rounded-lg transition-colors"
              >
                Know More
              </a>
            </div>
          </div>
        </div>

        {/* Comparison Matrix: Traditional College vs. NxtWave CCBP 4.0 */}
        <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-10 shadow-xs mb-16 overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
              OBJECTIVE COMPARISON
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Choose the Path That Makes You Employable
            </h3>
            <p className="text-[11px] text-neutral-500 mt-1.5 sm:hidden font-mono">
              &larr; Swipe horizontally to view full matrix &rarr;
            </p>
          </div>

          <div className="overflow-x-auto w-full pb-2 scrollbar-thin">
            <table className="w-full text-xs text-left min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 uppercase font-mono text-[11px]">
                <th className="py-3 px-4">Evaluation Criteria</th>
                <th className="py-3 px-4 text-neutral-500">Traditional College Degree</th>
                <th className="py-3 px-4 text-blue-600 dark:text-blue-400 font-bold">NxtWave CCBP 4.0 Ecosystem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">Starting Salary Benchmark</td>
                <td className="py-3.5 px-4 text-neutral-500">₹3 - 5 LPA</td>
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">Up to ₹38 LPA Packages</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">Curriculum Scope</td>
                <td className="py-3.5 px-4 text-neutral-500">Outdated textbook theory</td>
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">Generative AI, Cloud & Full Stack Systems</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">Instructors & Mentors</td>
                <td className="py-3.5 px-4 text-neutral-500">Academic professors with no MNC code exp</td>
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">Alumni of IITs, Amazon, Microsoft, Apple & Google</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">Hands-on Projects</td>
                <td className="py-3.5 px-4 text-neutral-500">Generic textbook clones</td>
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">15 - 25+ Real-world Industry Capstone Systems</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">Paid Internship Pipeline</td>
                <td className="py-3.5 px-4 text-neutral-500">Zero mandatory placement internships</td>
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">Up to 6 Internship Opportunities per Student</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">Doubt Clarification</td>
                <td className="py-3.5 px-4 text-neutral-500">No structured support</td>
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">1:1 Dedicated Product Developer Solving (11 AM - 8 PM)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-neutral-800 dark:text-neutral-200">Verifiable Credential</td>
                <td className="py-3.5 px-4 text-neutral-500">Paper degree with unverified projects</td>
                <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">Cryptographically Audited QR Ledger Credential</td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </section>
  );
}
