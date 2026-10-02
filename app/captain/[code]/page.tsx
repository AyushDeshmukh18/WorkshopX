'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { getCaptainMessages } from '@/lib/i18n/captain-messages';

export default function CaptainKitPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'te'>('en');
  const [copied, setCopied] = useState(false);

  const captainCode = (code || 'CAPTAIN01').toUpperCase();
  const collegeName = 'Your College Campus';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const referralUrl = `${appUrl}/r/${captainCode}`;
  const posterUrl = `${appUrl}/api/og/${captainCode}?format=vertical&college=${encodeURIComponent(collegeName)}`;

  const messages = getCaptainMessages('Captain', collegeName, referralUrl);
  const currentMsg = messages.find((m) => m.language === selectedLang) || messages[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentMsg.whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14 page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-200 dark:border-blue-800 mb-2">
            CAMPUS CAPTAIN TOOLKIT
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Cohort Leadership Kit
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Attribution Code: <span className="font-bold text-neutral-900 dark:text-neutral-100">{captainCode}</span>
          </p>
        </div>

        {/* Live Attribution Counter */}
        <div className="warm-card px-5 py-3 rounded-lg text-center shadow-sm">
          <div className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-neutral-100">
            8
          </div>
          <div className="text-[11px] font-mono text-neutral-500 uppercase">
            Registrations Attributed
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Left Column: Forward-Ready Message Generator */}
        <div className="md:col-span-2 warm-card rounded-lg p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-[#e8e5de] dark:border-[#232833] pb-4 mb-4">
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Forward-Ready WhatsApp Announcement
            </h2>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#f6f4ee] dark:bg-[#191d24] p-1 rounded-md border border-[#e8e5de] dark:border-[#232833]">
              {(['en', 'hi', 'te'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLang(lang)}
                  className={`text-xs font-mono px-2.5 py-1 rounded transition-colors ${
                    selectedLang === lang
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#fbfaf7] dark:bg-[#15181f] border border-[#e8e5de] dark:border-[#232833] rounded-md p-4 mb-4">
            <pre className="text-xs text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap font-sans leading-relaxed">
              {currentMsg.whatsappMessage}
            </pre>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
            >
              {copied ? '✓ Copied to Clipboard!' : 'Copy Announcement Message'}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(currentMsg.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#e8e5de] dark:border-[#232833] bg-[#fbfaf7] dark:bg-[#15181f] hover:bg-[#ece8df] text-neutral-900 dark:text-neutral-100 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
            >
              Forward Directly on WhatsApp
            </a>
          </div>
        </div>

        {/* Right Column: Poster Preview & Download */}
        <div className="warm-card rounded-lg p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              WhatsApp Status Poster
            </h2>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              High-resolution 1080x1920 poster with your personal referral link.
            </p>
            <div className="aspect-[9/16] bg-[#14171d] rounded-lg border border-[#232833] p-4 text-center flex flex-col items-center justify-center text-xs text-neutral-400 mb-4">
              <span className="font-mono text-blue-400 font-bold mb-1">
                FIRSTBUILD WORKSHOP
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">PASS #{captainCode}</span>
            </div>
          </div>

          <a
            href={posterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold py-2.5 rounded-md transition-colors"
          >
            Download HD Poster
          </a>
        </div>
      </div>

      <div className="warm-card p-4 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <span>Need official department circulars, permission letters, or slide decks for your college?</span>
        <Link
          href="/#register"
          prefetch={true}
          className="font-semibold text-neutral-900 dark:text-neutral-100 underline hover:no-underline"
        >
          Contact Faculty Liaison &rarr;
        </Link>
      </div>
    </div>
  );
}

