import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export interface SessionPayload {
  sub: string; // registration_id or admin email
  email: string;
  role: 'student' | 'captain' | 'admin';
  name?: string;
}

const COOKIE_NAME = 'firstbuild_session';

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || 'firstbuild-fallback-session-secret-32-chars-long';
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: SessionPayload,
  expiresIn: string = '30d'
): Promise<string> {
  const secret = getSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const isProduction = process.env.NODE_ENV === 'production';
  const token = await createSessionToken(
    payload,
    payload.role === 'admin' ? '24h' : '30d'
  );

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: payload.role === 'admin' ? 86400 : 30 * 86400,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
