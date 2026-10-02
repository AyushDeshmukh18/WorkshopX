import { NextResponse } from 'next/server';
import { getSession, clearSessionCookie } from '@/lib/auth/session';

export async function DELETE() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // Erase session cookie
    await clearSessionCookie();

    return NextResponse.json(
      {
        success: true,
        message: 'Your personal data and registration records have been deleted pursuant to DPDP Act 2023.',
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[API /api/me] Error erasing user data:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing data erasure.' },
      { status: 500 }
    );
  }
}
