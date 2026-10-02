import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Participation | FirstBuild Engine',
  description:
    'Terms and conditions for participating in the Build Your First AI Project workshop.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 page-enter">
      <div className="border-b border-[#e8e5de] dark:border-[#232833] pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
          Terms of Participation
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Last Updated: October 2, 2026 &bull; FirstBuild Workshop Rules & Academic Integrity
        </p>
      </div>

      <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            1. Registration and Eligibility
          </h2>
          <p>
            Participation is free and open to engineering students currently enrolled in recognized
            colleges or universities. Each participant is entitled to one registration seat. Using
            temporary or disposable email domains is strictly prohibited.
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            2. Workshop Seat Limits and Attendance
          </h2>
          <p>
            Seats are strictly capped at 500 verified participants to maintain infrastructure
            stability and live support quality. If you cannot attend, we request that you cancel
            your seat so students on the waitlist can participate.
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            3. Project Submissions & Automated Evaluation
          </h2>
          <p>
            To qualify for a verified certificate of completion, attendees must submit a public
            GitHub repository containing code written during the workshop along with a reachable
            deployment URL. Projects are audited automatically using code analysis and AI rubric
            evaluations. Plagiarized or hollow repositories will be rejected.
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            4. Certificate Verification and Revocation
          </h2>
          <p>
            Issued completion certificates feature a unique 12-character identifier and tamper-proof
            QR code linking to our public verification portal. Certificates obtained through
            fraudulent referrals or automated bot submissions are subject to immediate revocation.
          </p>
        </section>

        <section className="warm-card p-6 rounded-lg space-y-2 shadow-sm">
          <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            5. Intellectual Property
          </h2>
          <p>
            All code written by participants during the workshop remains 100% their own intellectual
            property. Workshop learning materials and blueprints are provided under the MIT open
            license.
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-[#e8e5de] dark:border-[#232833] flex justify-between text-xs text-neutral-500">
        <Link href="/" prefetch={true} className="hover:underline">
          &larr; Return to Home
        </Link>
        <Link href="/privacy" prefetch={true} className="hover:underline">
          Privacy Policy &rarr;
        </Link>
      </div>
    </div>
  );
}
