'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  FileText,
  Github,
  TrendingUp,
  BookOpen,
  Globe,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Send,
  FileCode2,
  Compass,
  Gift
} from 'lucide-react';

export default function NxtWaveFooter() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-[#f8fafc] dark:bg-[#070a10] text-neutral-600 dark:text-neutral-400 text-xs transition-colors">
      {/* Upper Action Callout Banner */}
      <div className="border-b border-neutral-200 dark:border-neutral-800/80 bg-blue-50/60 dark:bg-[#0c121e] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span className="font-bold text-sm text-neutral-900 dark:text-white">
              Build Your First AI Project in 60 Minutes
            </span>
            <span className="hidden sm:inline text-neutral-400">&bull;</span>
            <span className="text-neutral-600 dark:text-neutral-300 text-xs">
              Live technical laboratory with automated 100-pt rubric &amp; QR credential.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/tools"
              className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline px-3 py-1.5"
            >
              Explore 9 AI Tools &rarr;
            </Link>
            <a
              href="/#register"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs font-mono uppercase tracking-wider shadow-xs transition-all min-h-[40px]"
            >
              <span>Claim Free Seat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-12">
          {/* Column 1: Organization & Accreditation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                NXT<span className="text-blue-600">WAVE</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
                CCBP 4.0
              </span>
            </div>

            <p className="text-xs leading-relaxed max-w-sm text-neutral-600 dark:text-neutral-400">
              India&apos;s leading technical education initiative. Recognized as a 2024 Technology Pioneer by the World Economic Forum (#techpioneers24) and official partner of the National Skill Development Corporation (NSDC).
            </p>

            {/* Trust Badges Pill Stack */}
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#121622] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold shadow-2xs">
                🌿 WEF Tech Pioneer 2024
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white dark:bg-[#121622] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold shadow-2xs">
                🏆 NSDC &bull; NASSCOM
              </span>
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  8th Floor, Sohini Tech Park, Nanakramguda Rd, Financial District, Gachibowli, Hyderabad, Telangana 500032
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>WhatsApp: </span>
                <a
                  href="https://forms.ccbp.in/public/form/whatsapp-us-have-a-query"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  +91 9390111761
                </a>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Support: </span>
                <a
                  href="mailto:support@nxtwave.tech"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  support@nxtwave.tech
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: AI Placement Suite (Dedicated Links to /tools) */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Placement Suite</span>
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tools"
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <span>Launch 9-in-1 Suite</span>
                  <span>&rarr;</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#ats-scanner"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-cyan-500" />
                  <span>ATS Resume Scanner</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#github-doctor"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3 h-3 text-indigo-500" />
                  <span>AI GitHub Repo Doctor</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#cold-pitch"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-blue-500" />
                  <span>Cold Outreach Pitcher</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#readme-generator"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <FileCode2 className="w-3 h-3 text-purple-500" />
                  <span>FAANG README Visualizer</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#career-bridge"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-3 h-3 text-amber-500" />
                  <span>Non-CSE Career Bridge</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#ctc-predictor"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3 h-3 text-amber-500" />
                  <span>CTC Tier Leap Predictor</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#major-project-synopsis"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 text-emerald-500" />
                  <span>IEEE Project Synopsis</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#tech-trends"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3 h-3 text-blue-500" />
                  <span>2026 Tech Market Radar</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/tools#blueprints"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <Laptop className="w-3 h-3 text-purple-500" />
                  <span>AI Project Blueprint</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Flagship Programs & Classroom */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
              Programs &amp; Ecosystem
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/#workshop" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  60-Min AI Live Workshop
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/academy" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  CCBP 4.0 Academy (1st-3rd Yr)
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/intensive" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  CCBP 4.0 Intensive (Final Yr)
                </a>
              </li>
              <li>
                <a href="https://www.niatindia.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  NIAT College Upskilling
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
              <li>
                <Link href="/dashboard/me" className="hover:text-blue-600 transition-colors">
                  Student Admission Pass
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100">
                  <Gift className="w-3.5 h-3.5 text-amber-500" />
                  <span>Peer Referral Engine</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Hiring, Reviews & Governance */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white font-mono">
              Company &amp; Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/#hiring-partners" className="hover:text-blue-600 transition-colors">
                  2,500+ Hiring Partners
                </a>
              </li>
              <li>
                <a href="/#reviews" className="hover:text-blue-600 transition-colors">
                  Senior Placement Reviews
                </a>
              </li>
              <li>
                <a href="https://www.ccbp.in/hire" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Hire with Us (Zero Fee)
                </a>
              </li>
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
                <a href="https://www.ccbp.in/grievance-redressal" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                  Grievance Redressal
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-neutral-900 dark:hover:text-white font-mono text-[11px]">
                  Operations Center &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Course Tracks Accordion / Directory Snippet */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 pb-4">
          <p className="font-mono text-[11px] uppercase tracking-wider font-bold text-neutral-800 dark:text-neutral-200 mb-2">
            Comprehensive Course Tracks &amp; Technical Centers Across India
          </p>
          <div className="text-[11px] leading-relaxed text-neutral-500 space-y-1.5">
            <p>
              <strong className="text-neutral-700 dark:text-neutral-300">Developer Tracks: </strong>
              Hyderabad (Kukatpally Offline Center) &bull; Bengaluru &bull; Pune &bull; Mumbai &bull; Delhi-NCR &bull; Chennai &bull; Coimbatore &bull; Noida &bull; Kolkata &bull; Kochi &bull; Bhubaneswar &bull; Visakhapatnam &bull; Vijayawada &bull; Gurgaon &bull; Jaipur &bull; Indore.
            </p>
            <p>
              <strong className="text-neutral-700 dark:text-neutral-300">Technical Specializations: </strong>
              Applied Generative AI &bull; Full-Stack Next.js 16 &bull; Cloud Microservices &bull; LLM Inference Orchestration &bull; Vector Embeddings &bull; Python AI Systems.
            </p>
          </div>
        </div>

        {/* Bottom Copyright & DPDP Act Compliance */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>
            &copy; 2026 NxtWave Disruptive Technologies Pvt. Ltd. All rights reserved. CCBP 4.0 is a registered trademark.
          </p>
          <p className="font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Compliance: India DPDP Act 2023 &bull; Cryptographic Ledger Verification Verified</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
