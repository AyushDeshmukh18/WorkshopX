import { validateClientEnv, type ClientEnv } from './env';

let cachedClientEnv: ClientEnv | null = null;

export function getClientEnv(): ClientEnv {
  if (!cachedClientEnv) {
    cachedClientEnv = validateClientEnv({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    });
  }
  return cachedClientEnv;
}
