'use client';

import React from 'react';

export default function AwardsAndLeadership() {
  return (
    <section className="py-16 border-t border-neutral-200 dark:border-neutral-800 bg-[#f8f9fa] dark:bg-[#0a0d14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Accreditations Bar */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="h-px w-12 bg-neutral-300 dark:bg-neutral-700"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
              Recognized as the Greatest Brand in Education
            </span>
            <span className="h-px w-12 bg-neutral-300 dark:bg-neutral-700"></span>
          </div>

          {/* Laurel Wreath Mock */}
          <div className="flex flex-wrap items-center justify-center gap-8 my-6">
            <div className="inline-flex items-center gap-2 border border-amber-300/60 dark:border-amber-700/50 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-2 rounded-xl text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <span className="text-lg">🌿</span>
              <span>Greatest Brands & Leaders 2021-22</span>
              <span className="text-lg">🌿</span>
            </div>

            <div className="inline-flex items-center gap-2 border border-blue-300/60 dark:border-blue-700/50 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-2 rounded-xl text-blue-800 dark:text-blue-300 text-xs font-semibold">
              <span className="text-lg">🏆</span>
              <span>Most Preferred Tech Skilling Brand</span>
              <span className="text-lg">🏆</span>
            </div>
          </div>

          {/* Institutional Partner Badges */}
          <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-4 mt-6">
            RECOGNISED BY
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>NASSCOM</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Ministry of Commerce & Industry / DPIIT</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="w-2 h-2 rounded-full bg-orange-600"></span>
              <span>#startupindia</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-neutral-900 dark:hover:text-white transition-colors">
              <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
              <span>NSDC & Skill India Mission</span>
            </div>
          </div>
        </div>

        {/* World Economic Forum Tech Pioneer Hero Banner Card */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-blue-800/40 mb-16">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 px-3 py-1 rounded-full text-xs font-mono text-cyan-300 font-semibold">
                <span>WORLD ECONOMIC FORUM</span>
                <span>&bull;</span>
                <span>#techpioneers24</span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight">
                We are honored to be a 2024 Technology Pioneer
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
                NxtWave has been selected by the World Economic Forum as one of the world’s most innovative technology pioneers, driving deep systemic impact in youth employment and AI engineering education across India.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-cyan-200">
                <span>Honored by Shri Dharmendra Pradhan ji (Union Minister for Education & Skill Development)</span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl text-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-300">
                GLOBAL SELECTION
              </span>
              <span className="text-5xl sm:text-6xl font-black text-white mt-1 mb-1">
                100
              </span>
              <span className="text-xs text-cyan-300 font-medium">
                Startups chosen across the world
              </span>
            </div>
          </div>
        </div>

        {/* Leadership & Masterclass Mentors */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
              LEARN FROM INDUSTRY LEADERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white mt-1">
              Mentors & Masterclass Faculty
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              Learn the exact engineering mindset and production practices from innovators who have built and scaled systems at MAANG and top universities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold block mb-1">
                CO-FOUNDER &bull; FORBES 30 UNDER 30
              </span>
              <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                Sashank Gujjula
              </h4>
              <p className="text-xs text-neutral-500 font-mono mt-0.5 mb-2">
                IIT Bombay Alumnus
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Co-founder, NxtWave. Recipient of Times Business Awards and honored by T-Hub for building India’s largest tech skilling engine.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold block mb-1">
                CO-FOUNDER &bull; FORBES 30 UNDER 30
              </span>
              <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                Anupam Pedarla
              </h4>
              <p className="text-xs text-neutral-500 font-mono mt-0.5 mb-2">
                IIT Kharagpur Alumnus
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Co-founder, NxtWave. Pioneering vernacular and hands-on developer education to empower millions of Tier-2/3 youth.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold block mb-1">
                MASTERCLASS FACULTY
              </span>
              <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                Rakesh Misra
              </h4>
              <p className="text-xs text-neutral-500 font-mono mt-0.5 mb-2">
                Stanford &bull; IIT Madras &bull; Co-founder Uhana (Acquired by VMware)
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Leads high-impact masterclasses on cloud scale, distributed AI systems, and building zero-to-one tech companies.
              </p>
            </div>

            <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
              <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold block mb-1">
                AI & MACHINE LEARNING
              </span>
              <h4 className="font-bold text-base text-neutral-900 dark:text-white">
                Srividya Pranavi
              </h4>
              <p className="text-xs text-neutral-500 font-mono mt-0.5 mb-2">
                ML Scientist, Apple &bull; Carnegie Mellon &bull; IIT Kharagpur
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Guides NxtWave students on real-world machine learning architectures, foundation models, and computer vision pipelines.
              </p>
            </div>
          </div>
        </div>

        {/* Media & Recent Fundraise Strip */}
        <div className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold">
              SERIES A CAPITALIZATION
            </span>
            <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
              Announcing Our Latest Fundraise of INR 275 Crores ($33 Million)
            </h4>
            <p className="text-xs text-neutral-500">
              Led by Greater Pacific Capital to accelerate AI labs, student incubation, and nationwide placement infrastructure.
            </p>
          </div>

          <a
            href="https://economictimes.indiatimes.com/tech/funding/nxtwave-raises-33-million-in-funding-round-led-by-greater-pacific-capital/articleshow/98112172.cms"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-900 transition-colors shadow-2xs"
          >
            Read Press Release &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
