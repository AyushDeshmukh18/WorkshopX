'use client';

import React from 'react';
import Link from 'next/link';

export default function NxtWaveFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#f8f9fa] dark:bg-[#080b11] text-neutral-600 dark:text-neutral-400 text-xs">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Organization & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                NXT<span className="text-blue-600">WAVE</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                CCBP 4.0
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-neutral-600 dark:text-neutral-400">
              India&apos;s leading technical education initiative. Recognized as a 2024 Technology Pioneer by the World Economic Forum (#techpioneers24). Empowering youth across India to bridge the theory-to-production gap.
            </p>

            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-neutral-900 dark:text-neutral-200">
                Headquarters:
              </p>
              <p className="text-neutral-500 leading-relaxed max-w-xs">
                8th Floor, Sohini Tech Park, Nanakramguda Rd, Financial District, Gachibowli, Hyderabad, Telangana 500032
              </p>
            </div>

            <div className="pt-2 space-y-1">
              <p>
                <span className="font-semibold text-neutral-800 dark:text-neutral-300">WhatsApp: </span>
                <a
                  href="https://forms.ccbp.in/public/form/whatsapp-us-have-a-query"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  +91 9390111761 (WhatsApp Only)
                </a>
              </p>
              <p>
                <span className="font-semibold text-neutral-800 dark:text-neutral-300">Email: </span>
                <a
                  href="mailto:support@nxtwave.tech"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  support@nxtwave.tech
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Programs & Workshops */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
              Programs
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#workshop" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  60-Min AI Live Workshop
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/academy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  CCBP 4.0 Academy
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/intensive" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  CCBP 4.0 Intensive
                </a>
              </li>
              <li>
                <a href="https://www.niatindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  NIAT Institutional Upskilling
                </a>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-blue-600 transition-colors">
                  Campus Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-blue-600 transition-colors">
                  Live Technical Room
                </Link>
              </li>
              <li>
                <Link href="/submit" className="hover:text-blue-600 transition-colors">
                  Automated Project Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.ccbp.in/hire" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Hire with Us (Zero Fee)
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/reviews" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Reviews & Success Stories
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/about-us" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  About Us & Leadership
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/careers" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Careers at NxtWave
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/blog" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Tech Blog
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-neutral-900 dark:hover:text-white font-mono text-[11px]">
                  Operations Center &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
              Governance & Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <a href="https://www.ccbp.in/cookie-policy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/grievance-redressal" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Grievance Redressal
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/corporate-information" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Corporate Information
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/csr-policy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  CSR Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Course Tracks Accordion / Directory Snippet */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-wider font-bold text-neutral-800 dark:text-neutral-200 mb-3">
            Comprehensive Course Tracks & Technical Centers Across India
          </p>
          <div className="text-[11px] leading-relaxed text-neutral-500 space-y-2">
            <p>
              <strong className="text-neutral-700 dark:text-neutral-300">Full Stack & MERN Stack Developer Tracks: </strong>
              Hyderabad (Kukatpally Offline Center) &bull; Bangalore &bull; Pune &bull; Mumbai &bull; Delhi &bull; Chennai &bull; Coimbatore &bull; Noida &bull; Kolkata &bull; Kochi &bull; Bhubaneswar &bull; Visakhapatnam &bull; Vijayawada &bull; Gurgaon &bull; Jaipur &bull; Indore &bull; Lucknow &bull; Nagpur. Available in English, Hindi, Telugu, and Tamil.
            </p>
            <p>
              <strong className="text-neutral-700 dark:text-neutral-300">Applied Generative AI & Data Analytics Tracks: </strong>
              Advanced foundations in LLMs, Prompt Engineering, LangChain, Gemini API, PyTorch, SQL, and Data Warehousing.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & DPDP Act Compliance */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>
            &copy; 2026 NxtWave Disruptive Technologies Pvt. Ltd. All rights reserved. CCBP 4.0 is a registered trademark.
          </p>
          <p className="font-mono">
            Compliance: India DPDP Act 2023 &bull; Cryptographic Ledger Verification Verified
          </p>
        </div>
      </div>
    </footer>
  );
}
