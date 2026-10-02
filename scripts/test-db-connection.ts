import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Parse .env directly without third-party dependencies
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

console.log('[DB Test] Connecting to Supabase at:', url);

if (!url || !key) {
  console.error('[DB Test] Missing Supabase URL or Key in environment.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

async function runCheck() {
  console.log('[DB Test] Testing database tables...');

  const tablesToCheck = [
    'app_settings',
    'colleges',
    'college_stats',
    'registrations',
    'email_otps',
    'blueprints',
    'referrals',
    'notifications',
    'polls',
    'poll_options',
    'submissions',
    'certificates',
  ];

  let successCount = 0;
  for (const table of tablesToCheck) {
    try {
      const { error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error(`❌ Table "${table}": ${error.message}`);
      } else {
        console.log(`✅ Table "${table}": Accessible (Count: ${count ?? 0})`);
        successCount++;
      }
    } catch (err: unknown) {
      console.error(`❌ Table "${table}": Exception ->`, err instanceof Error ? err.message : err);
    }
  }

  // Check app_settings singleton
  const { data: settings, error: settingsErr } = await supabase
    .from('app_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (settings) {
    console.log('\n[DB Test] App Settings Loaded:');
    console.log(' - Workshop Name:', settings.workshop_name);
    console.log(' - Registration Cap:', settings.registration_cap);
    console.log(' - Registration Open:', settings.registration_open);
  } else if (settingsErr) {
    console.warn('\n[DB Test] Could not read app_settings row:', settingsErr.message);
  } else {
    console.log('\n[DB Test] app_settings row is empty (seed.sql not executed yet).');
  }

  console.log(`\n[DB Test] Result: ${successCount}/${tablesToCheck.length} tables verified.`);
}

runCheck().catch((err) => {
  console.error('[DB Test] Fatal error:', err);
  process.exit(1);
});
