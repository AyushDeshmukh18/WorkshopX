import 'server-only';
import { getSession, SessionPayload } from './session';

export async function getAdminSession(): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session) return null;

  const adminEmailsRaw =
    process.env.ADMIN_EMAILS ||
    'deshmukhajd2005@gmail.com,admin@firstbuild.dev,admin@test.com';
  const allowedAdmins = adminEmailsRaw
    .split(',')
    .map((e) => e.trim().toLowerCase());

  if (session.role === 'admin' || allowedAdmins.includes(session.email.toLowerCase())) {
    return {
      ...session,
      role: 'admin',
    };
  }

  return null;
}
