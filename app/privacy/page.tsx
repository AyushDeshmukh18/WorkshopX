import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | FirstBuild Engine',
  description:
    'Privacy Policy and data protection disclosure under the Digital Personal Data Protection Act (DPDP Act 2023).',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 page-enter">
      <div className="border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
          Privacy Policy & Data Notice
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Last Updated: October 2, 2026 &bull; Compliance: Digital Personal Data Protection Act (DPDP Act 2023, India)
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            1. Purpose and Data Fiduciary
          </h2>
          <p>
            FirstBuild Engine operates as a technical workshop platform providing engineering
            education for college students. We collect only the minimum personal data strictly
            required to organize the workshop, allocate verified seats, send critical reminders,
            and issue verifiable certificates.
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            2. Personal Data We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Identity & Contact:</strong> Full name and email address.
            </li>
            <li>
              <strong>Academic Information:</strong> College name, engineering branch, graduation
              year, and technical interest.
            </li>
            <li>
              <strong>Security Hashes:</strong> We do not store raw IP addresses or plain phone
              numbers. IP addresses are cryptographically salted and hashed for rate-limiting
              purposes only.
            </li>
          </ul>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            3. Explicit Consent & Legitimate Use
          </h2>
          <p>
            We process your personal data solely with your explicit consent provided during
            registration. We never engage in web scraping, purchase third-party marketing lists, or
            sell your data to recruitment agencies or advertisers.
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            4. Communications and Unsubscribe
          </h2>
          <p>
            Transactional notifications include login OTPs, seat confirmations, and time-critical
            workshop reminders (24 hours, 2 hours, and 15 minutes before the session). Every
            reminder email contains a one-click, token-based unsubscribe link. Opting out immediately
            ceases non-essential dispatches.
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            5. Your Rights & Data Erasure (Right to be Forgotten)
          </h2>
          <p>
            In compliance with Section 12 of the DPDP Act 2023, you have the right to access,
            rectify, and erase your personal data. Registered students can request full data
            erasure at any time by accessing their dashboard or via the authenticated endpoint{' '}
            <code className="bg-[#f6f4ee] dark:bg-[#191d24] px-1.5 py-0.5 rounded text-xs font-mono text-blue-800 dark:text-blue-300">
              DELETE /api/me
            </code>
            .
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            6. Contact Data Protection Officer
          </h2>
          <p>
            For inquiries regarding your personal data or privacy grievances, reach out directly to
            our team at{' '}
            <code className="bg-[#f6f4ee] dark:bg-[#191d24] px-1.5 py-0.5 rounded text-xs font-mono text-blue-800 dark:text-blue-300">
              privacy@firstbuild.engine
            </code>
            .
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-[#e8e5de] dark:border-[#232833] flex justify-between text-xs text-neutral-500">
        <Link href="/" prefetch={true} className="hover:underline">
          &larr; Return to Home
        </Link>
        <Link href="/terms" prefetch={true} className="hover:underline">
          Terms of Participation &rarr;
        </Link>
      </div>
    </div>
  );
}
