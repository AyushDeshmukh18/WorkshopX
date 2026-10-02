import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const url = new URL('/', req.nextUrl.origin);

  // Preserve any incoming query params (e.g. UTM tracking)
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const response = NextResponse.redirect(url, { status: 302 });

  // Store referral code in cookie for 30 days
  if (code && code.trim().length > 0) {
    response.cookies.set('ref', code.trim().toUpperCase(), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      sameSite: 'lax',
      httpOnly: false, // accessible to client or server
    });
  }

  return response;
}
