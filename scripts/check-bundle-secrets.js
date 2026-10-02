import fs from 'fs';
import path from 'path';

// Sensitive environment variable names that must NEVER appear in client bundles
const SENSITIVE_VARS = [
  'SUPABASE_SECRET_KEY',
  'GEMINI_API_KEY',
  'GROQ_API_KEY',
  'BREVO_API_KEY',
  'RESEND_API_KEY',
  'SMTP_PASS',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_WEBHOOK_SECRET',
  'SESSION_SECRET',
  'CRON_SECRET',
  'IP_HASH_SALT',
];

const STATIC_DIR = path.join(process.cwd(), '.next', 'static');

function scanDirectory(dir) {
  let foundViolations = [];
  if (!fs.existsSync(dir)) {
    return foundViolations;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      foundViolations = foundViolations.concat(scanDirectory(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.json'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const secretKey of SENSITIVE_VARS) {
        if (content.includes(secretKey)) {
          foundViolations.push({
            file: fullPath,
            key: secretKey,
          });
        }
      }
    }
  }

  return foundViolations;
}

const violations = scanDirectory(STATIC_DIR);

if (violations.length > 0) {
  console.error('\n[SECURITY ERROR] Sensitive environment variable keys found in client bundle:');
  for (const v of violations) {
    console.error(`  - Found "${v.key}" in: ${v.file}`);
  }
  process.exit(1);
} else {
  console.log('[SECURITY CHECK PASSED] No sensitive secret keys discovered in client static bundle.');
}
