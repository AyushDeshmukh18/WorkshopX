import 'server-only';
import Groq from 'groq-sdk';
import {
  BlueprintPayloadSchema,
  type BlueprintPayload,
  type Branch,
  type Interest,
  type SkillLevel,
} from '../validation/blueprint-schema';

const SYSTEM_PROMPT = `You are an expert engineering mentor for Indian engineering students preparing for tech placements.
Generate a realistic 60-minute technical project blueprint adhering strictly to this JSON structure:
{
  "project_name": "string (3-100 chars)",
  "one_liner": "string (10-200 chars)",
  "what_youll_build_in_60_min": "string (20-500 chars)",
  "stack": ["string", "string"],
  "resume_bullet": "string (20-300 chars)",
  "match_score": int between 75 and 98,
  "first_3_steps": ["step 1", "step 2", "step 3"],
  "why_it_fits": "string (15-400 chars)"
}
Return only valid JSON matching this schema.`;

export async function generateWithGroq(
  apiKey: string,
  modelName: string,
  branch: Branch,
  interest: Interest,
  level: SkillLevel,
  timeoutMs: number = 8000
): Promise<BlueprintPayload> {
  const groq = new Groq({ apiKey });

  const fetchWithTimeout = async () => {
    const completion = await groq.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Branch: ${branch}, Domain Interest: ${interest}, Experience Level: ${level}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Groq returned empty response');
    }

    const parsed = JSON.parse(responseContent);
    return BlueprintPayloadSchema.parse(parsed);
  };

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Groq API request timed out')), timeoutMs);
  });

  return Promise.race([fetchWithTimeout(), timeoutPromise]);
}
