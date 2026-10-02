import Link from 'next/link';
import BlueprintFlow from '@/components/BlueprintFlow';

export default async function CollegeLandingPage({
  params,
}: {
  params: Promise<{ collegeSlug: string }>;
}) {
  const { collegeSlug } = await params;
  const decodedCollege = decodeURIComponent(collegeSlug).replace(/-/g, ' ');

  const studentCount = 12; // When >= 3, show social proof banner

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 page-enter">
      {/* College Social Proof Banner */}
      {studentCount >= 3 && (
        <div className="inline-flex items-center gap-2 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-md text-xs font-mono text-blue-800 dark:text-blue-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>{studentCount} STUDENTS FROM {decodedCollege.toUpperCase()} HAVE REGISTERED</span>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white mb-4 leading-tight">
        Build Your First AI Project in 60 Minutes
      </h1>

      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl leading-relaxed">
        Special workshop cohort allocation for students of{' '}
        <strong className="text-neutral-900 dark:text-neutral-100 capitalize">{decodedCollege}</strong>.
        Generate your customized project blueprint below, build and deploy live with instructors, and receive a verified
        credential for your placement resume.
      </p>

      {/* Interactive Blueprint Flow */}
      <BlueprintFlow />

      <div className="warm-card p-6 sm:p-8 rounded-lg text-sm mt-8 shadow-sm">
        <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Want to represent your campus as a Campus Captain?
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
          Campus Captains lead their college cohort, earn priority project review from instructors, and receive an
          official leadership certificate upon 10 verified student registrations.
        </p>
        <Link
          href="/#register"
          prefetch={true}
          className="text-xs font-semibold text-blue-700 dark:text-blue-400 underline hover:no-underline"
        >
          Learn more about the Campus Captain Network &rarr;
        </Link>
      </div>
    </div>
  );
}

