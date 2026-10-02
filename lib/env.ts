import { z } from 'zod';

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3000'),
  NEXT_PUBLIC_APP_NAME: z.string().min(1).default('FirstBuild Engine'),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required'),
});

const serverSchema = z.object({
  // Supabase Service Role Key (Database Admin)
  SUPABASE_SECRET_KEY: z.string().min(1, 'SUPABASE_SECRET_KEY is required'),

  // AI Providers
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().min(1).default('gemini-3.1-flash-lite'),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().min(1).default('llama-3.3-70b-versatile'),

  // Email System
  EMAIL_PROVIDER: z.enum(['brevo', 'resend', 'smtp']).default('brevo'),
  BREVO_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM_NAME: z.string().default('FirstBuild Workshop'),
  EMAIL_FROM_ADDRESS: z.string().email('EMAIL_FROM_ADDRESS must be a valid email address'),
  EMAIL_DAILY_LIMIT: z.coerce.number().int().positive().default(250),

  // Telegram Notifications
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_ADMIN_CHAT_ID: z.string().optional(),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),

  // External Verification & Rate Raising
  GITHUB_TOKEN: z.string().optional(),
  PAGESPEED_API_KEY: z.string().optional(),

  // Security, Sessions & Cron
  SESSION_SECRET: z
    .string()
    .min(32, 'SESSION_SECRET must be at least 32 characters for cryptographic signing'),
  CRON_SECRET: z.string().min(8, 'CRON_SECRET must be at least 8 characters'),
  ADMIN_EMAILS: z
    .string()
    .min(1, 'ADMIN_EMAILS is required')
    .transform((val) => val.split(',').map((email) => email.trim().toLowerCase())),
  IP_HASH_SALT: z.string().min(16, 'IP_HASH_SALT must be at least 16 characters for secure hashing'),
  COMMUNITY_INVITE_URL: z.string().url('COMMUNITY_INVITE_URL must be a valid URL').optional(),
});

export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

export function validateClientEnv(env: Record<string, string | undefined>): ClientEnv {
  const result = clientSchema.safeParse(env);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `[FirstBuild Engine] Missing or invalid client environment variables:\n${errorDetails}`
    );
  }
  return result.data;
}

export function validateServerEnv(env: Record<string, string | undefined>): ServerEnv {
  const result = serverSchema.safeParse(env);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `[FirstBuild Engine] Missing or invalid server environment variables:\n${errorDetails}`
    );
  }
  return result.data;
}

export function validateAllEnv(env: Record<string, string | undefined>) {
  const client = validateClientEnv(env);
  const server = validateServerEnv(env);
  return { client, server };
}
