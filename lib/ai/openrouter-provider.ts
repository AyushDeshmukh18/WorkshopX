import 'server-only';
import {
  BlueprintPayloadSchema,
  type BlueprintPayload,
  type Branch,
  type Interest,
  type SkillLevel,
} from '../validation/blueprint-schema';

export const OPENROUTER_MODELS_POOL = [
  'google/gemini-3.8-flash',
  'google/gemini-2.5-flash',
  'meta-llama/llama-3.3-70b-instruct',
  'deepseek/deepseek-chat',
  'mistralai/mistral-small-24b-instruct-2501',
];

const SYSTEM_PROMPT = `You are a distinguished Principal Software Engineer and Elite Campus Placement Architect at NxtWave CCBP 4.0.
Your task is to generate an exceptional, highly detailed, placement-converting 60-minute technical project blueprint for final-year engineering students and tech aspirants.

HIGH-QUALITY & DETAIL REQUIREMENTS:
1. Return strictly valid JSON adhering to the schema. No Markdown backticks or wrapping.
2. The project MUST be a legitimate, production-grade full-stack system that can be scaffolded and deployed within a 60-minute live workshop.
3. "what_youll_build_in_60_min": Provide a deeply detailed, technically precise description (3-4 sentences) outlining the system architecture, real-time client/server data flows, inference loops, and verifiable proof-of-work.
4. "first_3_steps": Provide 3 comprehensive, chronologically sequential engineering milestones with exact tooling, configuration details, and commands.
5. "stack": Include 4-6 specific, modern, industry-standard technologies (e.g. Next.js 16, TypeScript, OpenRouter API, Supabase Realtime, Tailwind CSS).
6. "resume_bullet": Craft a high-impact, FAANG-caliber bullet point following the Google XYZ formula: "Accomplished [X] by implementing [Y], achieving [Z] (e.g., sub-200ms latency, 99.4% uptime, or 35% efficiency boost)".
7. "why_it_fits": Provide a compelling, insightful explanation explicitly connecting the candidate's engineering branch (e.g., physical systems, circuit logic, fluid mechanics, or structural design) to modern distributed software.
8. "match_score" must be an integer between 84 and 98.`;

export async function generateWithOpenRouter(
  apiKey: string,
  preferredModel: string = 'google/gemini-3.8-flash',
  branch: Branch,
  interest: Interest,
  level: SkillLevel,
  timeoutMs: number = 9500
): Promise<BlueprintPayload> {
  const modelsToTry = [
    preferredModel,
    ...OPENROUTER_MODELS_POOL.filter((m) => m !== preferredModel),
  ];

  const userPrompt = `Generate a high-caliber, deeply detailed 60-minute technical project blueprint for:
Engineering Branch: ${branch}
Domain Specialization: ${interest}
Candidate Experience Level: ${level}

CRITICAL: Return strictly valid JSON conforming to this schema:
{
  "project_name": "High-Impact Project Title (3-8 words)",
  "one_liner": "Punchy, authoritative value proposition describing what the system accomplishes",
  "what_youll_build_in_60_min": "Exhaustive, 3-4 sentence technical breakdown of the working prototype (data flow, API routes, database schema, and live deployment)",
  "stack": ["Next.js 16", "TypeScript", "OpenRouter AI", "Supabase", "Tailwind CSS"],
  "resume_bullet": "FAANG-grade quantified resume bullet with concrete metrics (latency, throughput, accuracy)",
  "match_score": 96,
  "first_3_steps": [
    "Step 1: Scaffolding, TypeScript interfaces & environment secrets configuration",
    "Step 2: Core server actions, OpenRouter streaming inference & Supabase database integration",
    "Step 3: Edge optimization, Vercel zero-downtime deployment & verifiable QR credential issuance"
  ],
  "why_it_fits": "Deeply persuasive 2-3 sentence rationale linking candidate's engineering branch intuition directly to this AI software system"
}`;

  let lastError: unknown = null;

  for (const model of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://firstbuild.dev',
          'X-Title': 'FirstBuild Engine',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2500,
          response_format: { type: 'json_object' },
          temperature: 0.5,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('OpenRouter response returned empty content');
      }

      const cleanContent = content
        .trim()
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/, '')
        .trim();

      const parsedJson = JSON.parse(cleanContent);
      return BlueprintPayloadSchema.parse(parsedJson);
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      console.warn(`[OpenRouter Provider] Model ${model} failed, trying next:`, err);
    }
  }

  throw lastError || new Error('All OpenRouter models failed to generate blueprint');
}
