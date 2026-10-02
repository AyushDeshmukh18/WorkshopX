import { z } from 'zod';
import { BranchEnum, InterestEnum, SkillLevelEnum } from './blueprint-schema';

export const LanguageEnum = z.enum(['en', 'hi', 'te']);
export type Language = z.infer<typeof LanguageEnum>;

export const StartRegistrationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  college_name: z.string().min(2, 'College name is required').max(150),
  branch: BranchEnum,
  grad_year: z.coerce.number().int().min(2024).max(2029),
  skill_level: SkillLevelEnum,
  interest: InterestEnum,
  language: LanguageEnum.default('en'),
  referral_code: z.string().max(16).optional().nullable(),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must provide consent pursuant to DPDP Act 2023 to proceed.' }),
  }),
  consent_marketing: z.boolean().default(false),
  utm_source: z.string().max(50).optional().nullable(),
  utm_medium: z.string().max(50).optional().nullable(),
  utm_campaign: z.string().max(50).optional().nullable(),
});

export type StartRegistrationInput = z.infer<typeof StartRegistrationSchema>;

export const VerifyRegistrationSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be a 6-digit numeric code'),
});

export type VerifyRegistrationInput = z.infer<typeof VerifyRegistrationSchema>;
