import { describe, it, expect } from 'vitest';
import { parseAndValidateGitHubUrl, validateLiveDeploymentUrl } from '@/lib/evaluator/url-validator';
import { clamp, evaluateProjectSubmission } from '@/lib/evaluator/pipeline';
import { generateCertificatePdf } from '@/lib/certificate/pdf-generator';

describe('Phase 7: Live Layer, SSRF Validator & Evaluator Pipeline', () => {
  describe('SSRF & URL Validation', () => {
    it('parses valid public GitHub repository URLs', () => {
      const valid1 = parseAndValidateGitHubUrl('https://github.com/octocat/Spoon-Knife');
      expect(valid1).not.toBeNull();
      expect(valid1?.owner).toBe('octocat');
      expect(valid1?.repo).toBe('Spoon-Knife');

      const valid2 = parseAndValidateGitHubUrl('https://github.com/dev-user/ai-project.git');
      expect(valid2).not.toBeNull();
      expect(valid2?.owner).toBe('dev-user');
      expect(valid2?.repo).toBe('ai-project');
    });

    it('rejects invalid or non-GitHub URLs', () => {
      expect(parseAndValidateGitHubUrl('https://gitlab.com/octocat/repo')).toBeNull();
      expect(parseAndValidateGitHubUrl('http://github.com/octocat/repo')).toBeNull();
      expect(parseAndValidateGitHubUrl('https://evil-github.com/octocat/repo')).toBeNull();
      expect(parseAndValidateGitHubUrl('not-a-url')).toBeNull();
    });

    it('validates public HTTPS live deployment URLs', () => {
      expect(validateLiveDeploymentUrl('https://firstbuild-demo.vercel.app')).toBe(true);
      expect(validateLiveDeploymentUrl('https://sub.domain.co.in/path?query=1')).toBe(true);
    });

    it('strictly blocks SSRF targets: localhost, IPv4 literals, and internal hostnames', () => {
      // Insecure HTTP
      expect(validateLiveDeploymentUrl('http://my-project.vercel.app')).toBe(false);

      // Localhost / Loopback
      expect(validateLiveDeploymentUrl('https://localhost:3000')).toBe(false);
      expect(validateLiveDeploymentUrl('https://127.0.0.1')).toBe(false);
      expect(validateLiveDeploymentUrl('https://[::1]')).toBe(false);

      // RFC 1918 Private Subnets & AWS Metadata
      expect(validateLiveDeploymentUrl('https://192.168.1.10')).toBe(false);
      expect(validateLiveDeploymentUrl('https://10.0.0.1')).toBe(false);
      expect(validateLiveDeploymentUrl('https://172.16.0.1')).toBe(false);
      expect(validateLiveDeploymentUrl('https://169.254.169.254/latest/meta-data')).toBe(false);

      // Internal / Local TLDs
      expect(validateLiveDeploymentUrl('https://internal.service.local')).toBe(false);
      expect(validateLiveDeploymentUrl('https://metadata.internal')).toBe(false);
    });
  });

  describe('Evaluator Pipeline & Rubric Clamping', () => {
    it('correctly clamps numbers within boundaries', () => {
      expect(clamp(35, 0, 30)).toBe(30);
      expect(clamp(-5, 0, 30)).toBe(0);
      expect(clamp(20, 0, 30)).toBe(20);
    });

    it('executes deterministic baseline evaluation and outputs valid rubric structure', async () => {
      const res = await evaluateProjectSubmission(
        'https://github.com/student/firstbuild-ai-project',
        'https://student-ai-project.vercel.app',
        '# AI Resume Screener\nBuilt with Next.js 16 and Gemini 1.5 Flash structured outputs.'
      );

      expect(res.score_total).toBeGreaterThanOrEqual(50);
      expect(res.score_total).toBeLessThanOrEqual(100);
      expect(res.passed).toBe(true);

      // Check all breakdown categories
      expect(res.score_breakdown.works_deployed).toBeLessThanOrEqual(30);
      expect(res.score_breakdown.uses_ai).toBeLessThanOrEqual(25);
      expect(res.score_breakdown.originality).toBeLessThanOrEqual(15);
      expect(res.score_breakdown.readme).toBeLessThanOrEqual(15);
      expect(res.score_breakdown.code_structure).toBeLessThanOrEqual(15);

      // Check 3 actionable tips
      expect(res.tips).toHaveLength(3);
    });
  });

  describe('Certificate PDF Generation', () => {
    it('generates a valid binary PDF with PDF header and QR verification link', async () => {
      const pdfBytes = await generateCertificatePdf({
        id: 'A1B2C3D4E5F6',
        fullName: 'Test Student',
        projectName: 'Smart Placement Assistant',
        score: 92,
        issueDate: 'October 2, 2026',
        appUrl: 'https://firstbuild.dev',
      });

      expect(pdfBytes).toBeInstanceOf(Uint8Array);
      expect(pdfBytes.length).toBeGreaterThan(1000);

      // Check PDF magic bytes '%PDF' (0x25, 0x50, 0x44, 0x46)
      const header = String.fromCharCode(...pdfBytes.subarray(0, 4));
      expect(header).toBe('%PDF');
    });
  });
});
