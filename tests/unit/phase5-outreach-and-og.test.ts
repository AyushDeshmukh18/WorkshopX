import { describe, it, expect } from 'vitest';
import { parseOutreachCsv } from '@/lib/outreach/csv-importer';
import { getCaptainMessages } from '@/lib/i18n/captain-messages';

describe('Phase 5 Outreach Copilot, Captain Kits & Consent Verification', () => {
  describe('Outreach CSV Importer & DPDP Compliance', () => {
    it('successfully parses valid outreach contacts with documented consent_basis', () => {
      const csv = `college_name,contact_role,contact_name,contact_email,consent_basis
JNTU Hyderabad,club head,Rohit Sharma,rohit@jntuh.ac.in,Publicly listed IEEE student branch lead
CBIT Hyderabad,TPO,Dr. K. Rao,tpo@cbit.ac.in,Official institutional placement directory listing`;

      const result = parseOutreachCsv(csv);
      expect(result.valid).toHaveLength(2);
      expect(result.rejected).toHaveLength(0);
      expect(result.valid[0].contact_name).toBe('Rohit Sharma');
      expect(result.valid[0].consent_basis).toBe('Publicly listed IEEE student branch lead');
    });

    it('strictly REJECTS rows lacking consent_basis (DPDP Act Compliance Gate)', () => {
      const csv = `college_name,contact_role,contact_name,contact_email,consent_basis
Vasavi College,CR,Karthik Reddy,karthik@vasavi.edu,
VNR VJIET,club head,Sita Kumari,sita@vnrvjiet.ac.in,Official club roster`;

      const result = parseOutreachCsv(csv);
      expect(result.valid).toHaveLength(1);
      expect(result.valid[0].contact_name).toBe('Sita Kumari');

      expect(result.rejected).toHaveLength(1);
      expect(result.rejected[0].rowNumber).toBe(2);
      expect(result.rejected[0].reason).toContain("Missing mandatory 'consent_basis'");
    });

    it('deduplicates contacts with the same normalized email address', () => {
      const csv = `college_name,contact_role,contact_name,contact_email,consent_basis
COEP Pune,TPO,Anand Patil,anand.patil@coep.ac.in,Public directory
COEP Pune,TPO,Anand Patil Clone,anand.patil+duplicate@coep.ac.in,Public directory`;

      // Notice: anand.patil@coep.ac.in and anand.patil+duplicate@coep.ac.in normalize to the same address!
      const result = parseOutreachCsv(csv);
      expect(result.valid).toHaveLength(1);
      expect(result.rejected).toHaveLength(1);
      expect(result.rejected[0].reason).toContain('Duplicate email');
    });
  });

  describe('Campus Captain Multi-Lingual Kits', () => {
    it('generates forward messages in English, Hindi, and Telugu', () => {
      const messages = getCaptainMessages('Arjun', 'JNTU Hyderabad', 'https://firstbuild.dev/r/CAP01');
      expect(messages).toHaveLength(3);

      const en = messages.find((m) => m.language === 'en');
      const hi = messages.find((m) => m.language === 'hi');
      const te = messages.find((m) => m.language === 'te');

      expect(en?.whatsappMessage).toContain('JNTU Hyderabad');
      expect(hi?.whatsappMessage).toContain('JNTU Hyderabad');
      expect(te?.whatsappMessage).toContain('JNTU Hyderabad');
      expect(en?.whatsappMessage).toContain('https://firstbuild.dev/r/CAP01');
    });
  });
});
