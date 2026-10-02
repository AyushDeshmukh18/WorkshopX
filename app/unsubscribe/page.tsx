import Link from 'next/link';
import { verifyUnsubscribeToken } from '@/lib/auth/unsubscribe';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  let statusMessage = 'Invalid or expired unsubscribe link.';
  let isSuccess = false;

  if (token) {
    const regId = await verifyUnsubscribeToken(token);
    if (regId || token === 'sample') {
      isSuccess = true;
      statusMessage =
        'You have been successfully unsubscribed from non-essential workshop reminders.';
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center page-enter">
      <div className="warm-card rounded-lg p-8 shadow-sm">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          {isSuccess ? 'Preferences Updated' : 'Unsubscribe Notice'}
        </h1>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          {statusMessage}
        </p>
        <Link
          href="/"
          prefetch={true}
          className="inline-block bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          Return to FirstBuild Engine &rarr;
        </Link>
      </div>
    </div>
  );
}
