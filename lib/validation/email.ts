// Maintained list of known disposable email domains
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  'dispostable.com',
  'fakemailgenerator.com',
  'getairmail.com',
  'guerrillamail.biz',
  'guerrillamail.com',
  'guerrillamail.de',
  'guerrillamail.net',
  'guerrillamail.org',
  'guerrillamailblock.com',
  'mailcatch.com',
  'mailinator.com',
  'mailinator.net',
  'mailinator2.com',
  'sharklasers.com',
  'spamgourmet.com',
  'temp-mail.org',
  'tempmail.com',
  'tempmail.net',
  'throwawaymail.com',
  'trashmail.com',
  'trashmail.net',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
]);

export interface EmailNormalizationResult {
  raw: string;
  normalized: string;
  domain: string;
  isDisposable: boolean;
}

/**
 * Normalizes email address:
 * - Trims whitespace
 * - Converts to lowercase
 * - Strips +tags (+anything before @)
 * - For gmail.com and googlemail.com: strips dots from the username part
 * - Identifies disposable email domains
 */
export function normalizeEmail(email: string): EmailNormalizationResult {
  const raw = email.trim();
  const lower = raw.toLowerCase();
  const parts = lower.split('@');

  if (parts.length !== 2) {
    throw new Error('Invalid email format');
  }

  let [user, domain] = parts;

  // Strip +tag
  const plusIndex = user.indexOf('+');
  if (plusIndex !== -1) {
    user = user.substring(0, plusIndex);
  }

  // Strip dots for Gmail / Googlemail
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    user = user.replace(/\./g, '');
    domain = 'gmail.com'; // Canonicalize googlemail to gmail
  }

  const normalized = `${user}@${domain}`;
  const isDisposable = DISPOSABLE_EMAIL_DOMAINS.has(domain);

  return {
    raw,
    normalized,
    domain,
    isDisposable,
  };
}
