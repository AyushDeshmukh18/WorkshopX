import 'server-only';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  BlueprintPayloadSchema,
  type BlueprintPayload,
  type Branch,
  type Interest,
  type SkillLevel,
} from '../validation/blueprint-schema';

/**
 * Free-Tier Models Pool (prioritized by Daily Request Quota & Rate Limits)
 * - gemini-3.1-flash-lite: 500 RPD, 15 RPM
 * - gemini-3.5-flash-lite: 500 RPD, 15 RPM
 * - gemini-3.8-flash: 20 RPD, 5 RPM
 * - gemini-3.7-flash: 20 RPD, 5 RPM
 * - gemini-3.6-flash: 20 RPD, 5 RPM
 * - gemini-3.5-flash: 20 RPD, 5 RPM
 */
export const GEMINI_FREE_TIER_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
];

const SYSTEM_PROMPT = `You are a principal engineer and campus placement mentor for final-year Indian engineering students.
Your task is to generate a realistic, placement-ready 60-minute technical project blueprint for a student based on their engineering branch, domain focus, and skill level.

NON-NEGOTIABLE RULES:
1. Return strictly valid JSON adhering to the required schema. No Markdown backticks, no markdown wrapping, no extra commentary.
2. The project MUST be realistically buildable and deployable within 60 minutes during a live workshop.
3. The match_score must be an integer between 75 and 98.
4. "first_3_steps" must contain exactly 3 concise, chronological engineering milestones.
5. "stack" must contain 3-5 modern, relevant technologies.
6. "resume_bullet" must be an action-oriented placement bullet with quantified or technical impact.
7. Do not invent obscure APIs. Stick to established tools (Next.js, Tailwind, Gemini, Groq, Supabase, Canvas, Web Audio, Recharts).`;

export async function generateWithGemini(
  apiKey: string,
  preferredModel: string,
  branch: Branch,
  interest: Interest,
  level: SkillLevel,
  timeoutMs: number = 8000
): Promise<BlueprintPayload> {
  const genAI = new GoogleGenerativeAI(apiKey);

  // Build model try-order: preferred model first, then the remaining active free-tier pool
  const modelsToTry = [
    preferredModel,
    ...GEMINI_FREE_TIER_MODELS.filter((m) => m !== preferredModel),
  ];

  const prompt = `Generate a realistic 60-minute technical project blueprint for:
Engineering Branch: ${branch}
Domain Interest: ${interest}
Experience Level: ${level}

CRITICAL: You must return strictly valid JSON matching this exact structure:
{
  "project_name": "Concise Project Title (3-8 words)",
  "one_liner": "Single compelling sentence describing what the project accomplishes",
  "what_youll_build_in_60_min": "2-3 sentences explaining the concrete working prototype built during the 60-minute workshop",
  "stack": ["Tech1", "Tech2", "Tech3", "Tech4"],
  "resume_bullet": "Quantified action-oriented resume bullet suitable for placement portals and campus interviews",
  "match_score": 94,
  "first_3_steps": [
    "Step 1: Scaffolding and setup",
    "Step 2: Core feature and AI API connection",
    "Step 3: Deployment and verification"
  ],
  "why_it_fits": "1-2 sentences explaining why this specifically fits this student's branch and background"
}`;

  let lastError: unknown = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
        systemInstruction: SYSTEM_PROMPT,
      });

      const fetchPromise = async () => {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const parsedJson = JSON.parse(responseText);
        return BlueprintPayloadSchema.parse(parsedJson);
      };

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Gemini model ${modelName} timed out after ${timeoutMs}ms`)), timeoutMs);
      });

      // Execute race against timeout
      const payload = await Promise.race([fetchPromise(), timeoutPromise]);
      return payload;
    } catch (err: unknown) {
      lastError = err;
      console.warn(`[Gemini Provider] Model "${modelName}" failed or throttled. Falling over to next model in loop:`, err instanceof Error ? err.message : err);
      // Continue to next model in pool
    }
  }

  throw lastError || new Error('All Gemini free-tier candidate models exhausted.');
}
