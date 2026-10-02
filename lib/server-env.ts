import 'server-only';
import { validateServerEnv, type ServerEnv } from './env';

let cachedServerEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (!cachedServerEnv) {
    cachedServerEnv = validateServerEnv(process.env);
  }
  return cachedServerEnv;
}
