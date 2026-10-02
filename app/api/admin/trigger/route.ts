import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/admin-auth';

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required.' }, { status: 401 });
  }

  try {
    const { action } = await req.json();
    const cronSecret = process.env.CRON_SECRET || 'default-cron-secret-firstbuild';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;

    if (action === 'tick') {
      const res = await fetch(`${baseUrl}/api/cron/tick`, {
        method: 'POST',
        headers: { authorization: `Bearer ${cronSecret}` },
      });
      const data = await res.json();
      return NextResponse.json({ success: true, result: data });
    }

    if (action === 'digest') {
      const res = await fetch(`${baseUrl}/api/cron/digest`, {
        method: 'POST',
        headers: { authorization: `Bearer ${cronSecret}` },
      });
      const data = await res.json();
      return NextResponse.json({ success: true, result: data });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (err: unknown) {
    console.error('[Admin Trigger Error]', err);
    return NextResponse.json({ error: 'Failed to execute trigger.' }, { status: 500 });
  }
}
