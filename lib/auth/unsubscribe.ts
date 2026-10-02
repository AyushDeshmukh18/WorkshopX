import 'server-only';
import { SignJWT, jwtVerify } from 'jose';

function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || 'firstbuild-fallback-session-secret-32-chars-long';
  return new TextEncoder().encode(secret);
}

export async function createUnsubscribeToken(registrationId: string): Promise<string> {
  const secret = getSecretKey();
  return new SignJWT({ sub: registrationId, purpose: 'unsubscribe' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('180d')
    .sign(secret);
}

export async function verifyUnsubscribeToken(token: string): Promise<string | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret);
    if (payload.purpose !== 'unsubscribe' || !payload.sub) {
      return null;
    }
    return payload.sub;
  } catch {
    return null;
  }
}
