import 'server-only';
import { createHash } from 'crypto';
import {
  BlueprintPayloadSchema,
  type BlueprintPayload,
  type Branch,
  type Interest,
  type SkillLevel,
} from '../validation/blueprint-schema';
import { generateWithOpenRouter } from './openrouter-provider';
import { generateWithGemini } from './gemini-provider';
import { generateWithGroq } from './groq-provider';
import { getStaticBlueprint } from './static-blueprints';
import { checkAndIncrementBudget } from './budget-guard';

export type BlueprintSource = 'openrouter' | 'gemini' | 'groq' | 'static' | 'cache';

export interface GeneratedBlueprintResult {
  blueprint: BlueprintPayload;
  source: BlueprintSource;
  cacheKey: string;
}

// In-memory fast cache for generated blueprints
const blueprintCache = new Map<string, BlueprintPayload>();

export function computeBlueprintCacheKey(
  branch: Branch,
  interest: Interest,
  level: SkillLevel
): string {
  const rawKey = `${branch}|${interest}|${level}|schema_v1`;
  return createHash('sha256').update(rawKey).digest('hex');
}

export async function generateBlueprint(
  branch: Branch,
  interest: Interest,
  level: SkillLevel,
  options?: {
    openrouterKey?: string;
    openrouterModel?: string;
    geminiKey?: string;
    geminiModel?: string;
    groqKey?: string;
    groqModel?: string;
  }
): Promise<GeneratedBlueprintResult> {
  const cacheKey = computeBlueprintCacheKey(branch, interest, level);

  // 1. Check in-memory cache
  const cached = blueprintCache.get(cacheKey);
  if (cached) {
    return {
      blueprint: cached,
      source: 'cache',
      cacheKey,
    };
  }

  const openrouterKey =
    options?.openrouterKey !== undefined
      ? options.openrouterKey
      : process.env.OPENROUTER_API_KEY;
  const openrouterModel =
    options?.openrouterModel ||
    process.env.OPENROUTER_MODEL ||
    'google/gemini-3.8-flash';

  const geminiKey =
    options?.geminiKey !== undefined
      ? options.geminiKey
      : process.env.GEMINI_API_KEY;
  const geminiModel =
    options?.geminiModel ||
    process.env.GEMINI_MODEL ||
    'gemini-3.1-flash-lite';

  const groqKey =
    options?.groqKey !== undefined
      ? options.groqKey
      : process.env.GROQ_API_KEY;
  const groqModel =
    options?.groqModel ||
    process.env.GROQ_MODEL ||
    'llama-3.3-70b-versatile';

  // 2. Tier 1: OpenRouter (Primary with user-supplied key)
  if (openrouterKey && openrouterKey.trim().length > 0) {
    const hasBudget = await checkAndIncrementBudget('openrouter', 2000);
    if (hasBudget) {
      try {
        const bp = await generateWithOpenRouter(
          openrouterKey,
          openrouterModel,
          branch,
          interest,
          level,
          8000
        );
        const validated = BlueprintPayloadSchema.parse(bp);
        blueprintCache.set(cacheKey, validated);
        return {
          blueprint: validated,
          source: 'openrouter',
          cacheKey,
        };
      } catch (openrouterError) {
        console.warn(
          '[AI Pipeline] OpenRouter generation failed, falling back to Gemini:',
          openrouterError
        );
      }
    }
  }

  // 3. Tier 2: Google Gemini (First Fallback)
  if (geminiKey && geminiKey.trim().length > 0) {
    const hasBudget = await checkAndIncrementBudget('gemini', 1200);
    if (hasBudget) {
      try {
        const bp = await generateWithGemini(
          geminiKey,
          geminiModel,
          branch,
          interest,
          level,
          8000
        );
        const validated = BlueprintPayloadSchema.parse(bp);
        blueprintCache.set(cacheKey, validated);
        return {
          blueprint: validated,
          source: 'gemini',
          cacheKey,
        };
      } catch (geminiError) {
        console.warn(
          '[AI Pipeline] Gemini generation failed, falling back to Groq:',
          geminiError
        );
      }
    }
  }

  // 4. Tier 3: Groq Llama 3.3 (Second Fallback)
  if (groqKey && groqKey.trim().length > 0) {
    const hasBudget = await checkAndIncrementBudget('groq', 12000);
    if (hasBudget) {
      try {
        const bp = await generateWithGroq(
          groqKey,
          groqModel,
          branch,
          interest,
          level,
          8000
        );
        const validated = BlueprintPayloadSchema.parse(bp);
        blueprintCache.set(cacheKey, validated);
        return {
          blueprint: validated,
          source: 'groq',
          cacheKey,
        };
      } catch (groqError) {
        console.warn(
          '[AI Pipeline] Groq generation failed, falling back to static library:',
          groqError
        );
      }
    }
  }

  // 5. Tier 4: Static Blueprint Library (Guaranteed 100% Offline Fallback)
  const staticBp = getStaticBlueprint(branch, interest, level);
  blueprintCache.set(cacheKey, staticBp);

  return {
    blueprint: staticBp,
    source: 'static',
    cacheKey,
  };
}
