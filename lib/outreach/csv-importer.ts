import { normalizeEmail } from '../validation/email';

export interface OutreachContact {
  college_name: string;
  contact_role: 'club head' | 'CR' | 'TPO' | 'placement cell';
  contact_name: string;
  contact_email: string;
  contact_email_normalized: string;
  consent_basis: string;
  source_note?: string;
  draft_email?: string;
  draft_whatsapp?: string;
  status: 'new' | 'drafted' | 'contacted' | 'replied' | 'captain' | 'declined';
}

export interface CsvImportResult {
  valid: OutreachContact[];
  rejected: { rowNumber: number; reason: string; raw: Record<string, string> }[];
  totalProcessed: number;
}

const VALID_ROLES = new Set(['club head', 'cr', 'tpo', 'placement cell']);
const ROLE_MAP: Record<string, OutreachContact['contact_role']> = {
  'club head': 'club head',
  'cr': 'CR',
  'tpo': 'TPO',
  'placement cell': 'placement cell',
};

/**
 * Parses CSV content into structured outreach contacts.
 * Enforces strict DPDP Act validation: ANY row missing 'consent_basis' is rejected.
 */
export function parseOutreachCsv(csvContent: string): CsvImportResult {
  const lines = csvContent
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return { valid: [], rejected: [], totalProcessed: 0 };
  }

  // Parse header row
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const requiredHeaders = ['college_name', 'contact_role', 'contact_name', 'contact_email', 'consent_basis'];

  for (const reqHeader of requiredHeaders) {
    if (!headers.includes(reqHeader)) {
      throw new Error(`Invalid CSV: Missing required header column '${reqHeader}'`);
    }
  }

  const valid: OutreachContact[] = [];
  const rejected: CsvImportResult['rejected'] = [];
  const seenEmails = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rowNumber = i + 1;
    const values = lines[i].split(',').map((v) => v.trim());
    const rowData: Record<string, string> = {};

    headers.forEach((h, idx) => {
      rowData[h] = values[idx] || '';
    });

    const collegeName = rowData['college_name'];
    const contactRole = rowData['contact_role']?.toLowerCase();
    const contactName = rowData['contact_name'];
    const contactEmail = rowData['contact_email'];
    const consentBasis = rowData['consent_basis'];

    // 1. Mandatory DPDP Consent Basis Check
    if (!consentBasis || consentBasis.trim().length === 0) {
      rejected.push({
        rowNumber,
        reason: "Missing mandatory 'consent_basis' required by DPDP Act 2023.",
        raw: rowData,
      });
      continue;
    }

    // 2. Name & College Validation
    if (!contactName || !collegeName) {
      rejected.push({
        rowNumber,
        reason: 'Contact name and college name are mandatory.',
        raw: rowData,
      });
      continue;
    }

    // 3. Role Validation
    if (!VALID_ROLES.has(contactRole)) {
      rejected.push({
        rowNumber,
        reason: `Invalid contact role '${contactRole}'. Must be one of: club head, CR, TPO, placement cell.`,
        raw: rowData,
      });
      continue;
    }

    // 4. Email Validation & Deduplication
    try {
      const { normalized } = normalizeEmail(contactEmail);
      if (seenEmails.has(normalized)) {
        rejected.push({
          rowNumber,
          reason: `Duplicate email address '${contactEmail}'.`,
          raw: rowData,
        });
        continue;
      }
      seenEmails.add(normalized);

      valid.push({
        college_name: collegeName,
        contact_role: ROLE_MAP[contactRole] || 'club head',
        contact_name: contactName,
        contact_email: contactEmail,
        contact_email_normalized: normalized,
        consent_basis: consentBasis,
        source_note: rowData['source_note'] || 'Imported via CSV',
        status: 'new',
      });
    } catch {
      rejected.push({
        rowNumber,
        reason: `Invalid email address format '${contactEmail}'.`,
        raw: rowData,
      });
    }
  }

  return {
    valid,
    rejected,
    totalProcessed: lines.length - 1,
  };
}
