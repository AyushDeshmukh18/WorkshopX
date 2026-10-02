'use client';

import React from 'react';

const FEATURED_COMPANIES = [
  'Google', 'Amazon', 'NVIDIA', 'Microsoft', 'Apple', 'Deloitte', 'Oracle', 'Samsung',
  'Goldman Sachs', 'Bank of America', 'Jio', 'TCS', 'Infosys', 'Tech Mahindra', 'Cognizant',
  'Accenture', 'Bosch', 'Wipro', 'Capgemini', 'SAP', 'Cyient', 'HCL', 'Tata Elxsi',
  'CGI', 'Merkle', 'Mindtree', 'Delhivery', 'Needl.ai', 'Fareportal', 'Prodapt',
  'Tanla', 'GlobalLogic', 'NTT DATA', 'Fractal', 'PwC', 'Publicis Sapient', 'Optum',
  'Eurofins', 'Rakuten', 'Societe Generale', 'HighRadius', 'ValueMomentum', 'ZS', 'ADP',
  'Swiggy', 'Flipkart', 'Zomato', 'Paytm'
];

export default function HiringNetwork() {
  return (
    <section id="hiring-partners" className="py-16 border-t border-neutral-200 dark:border-neutral-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            INDUSTRY ENDORSEMENT
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            2,500+ Companies Have Hired NxtWave Learners
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-2">
            From global tech giants and high-growth product innovators to Fortune 500 enterprises, our graduates are driving software impact from Day 1.
          </p>
        </div>

        {/* High Density Logo Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3 mb-10">
          {FEATURED_COMPANIES.map((company) => (
            <div
              key={company}
              className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-lg py-3 px-2 flex items-center justify-center text-center shadow-2xs hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-xs transition-all group"
            >
              <span className="text-xs sm:text-[13px] font-bold text-neutral-700 dark:text-neutral-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {company}
              </span>
            </div>
          ))}
        </div>

        {/* Recruiter Metrics Bar (From /hire page) */}
        <div id="hire" className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-blue-950 text-white rounded-2xl p-6 sm:p-10 shadow-lg mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
                NXTWAVE HIRE RECRUITMENT NETWORK
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Fastest Way to Hire Job-Ready Developers at Zero Cost
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                We recommend best-fit candidates from our rigorously assessed pool of developers trained by IIT and IIM alumni.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <a
                  href="#register"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded-md transition-colors shadow-xs"
                >
                  Join as Student &rarr;
                </a>
                <a
                  href="https://www.ccbp.in/hire"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-neutral-700 hover:border-neutral-500 bg-neutral-850 text-neutral-200 text-xs px-5 py-2.5 rounded-md transition-colors"
                >
                  Recruiter Inquiries &rarr;
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="text-2xl font-black text-cyan-400 block mb-1">ZERO</span>
                <span className="text-[11px] text-neutral-300 block leading-tight">
                  Hiring Fee for Recruiters
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="text-2xl font-black text-cyan-400 block mb-1">3 - 5 Days</span>
                <span className="text-[11px] text-neutral-300 block leading-tight">
                  Average Time to Hire
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="text-2xl font-black text-cyan-400 block mb-1">TOP 1%</span>
                <span className="text-[11px] text-neutral-300 block leading-tight">
                  Trained by IIT Alumni
                </span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="text-2xl font-black text-cyan-400 block mb-1">80 NPS</span>
                <span className="text-[11px] text-neutral-300 block leading-tight">
                  From 2,000+ Hiring Partners
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Why Top Companies Prefer NxtWave Developers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block mb-2">
              01 &bull; 750+ HOURS CURRICULUM
            </span>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
              Intensive Hands-on Code Architecture
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every learner completes 500+ hours of coding practice sets and builds 8+ end-to-end full stack & AI capstone projects.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block mb-2">
              02 &bull; PROVEN REASONING
            </span>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
              Learn Programming, Not Just Coding
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Trained in core systems thinking, algorithms, clean code patterns, and prompt engineering pipelines designed by MAANG engineers.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 block mb-2">
              03 &bull; AUDITED PORTFOLIO
            </span>
            <h4 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
              Cryptographically Audited Projects
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Recruiters evaluate verified live deployments and objective 100-point rubric scores rather than unverified resumes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
