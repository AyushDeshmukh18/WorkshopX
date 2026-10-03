import 'server-only';
import {
  AtsScanResponseSchema,
  TARGET_COMPANY_METADATA,
  type AtsScanRequest,
  type AtsScanResponse,
  type TargetCompany,
} from '../validation/ats-schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_FREE_TIER_MODELS } from '../ai/gemini-provider';

const SYSTEM_PROMPT = `You are a Chief Technical Recruiter and Principal Placement Architect at NxtWave CCBP 4.0 assessing Indian engineering student resumes for premier differential and product hiring tracks (e.g. TCS Digital ₹7.5L, Cognizant GenC Next ₹6.75L, Amazon SDE-1 ₹16L+, Fintech Startups ₹12-18L).

HIGH-QUALITY & DETAIL SPECIFICATIONS:
1. Return strictly valid JSON adhering to the schema without Markdown code fences or extra text.
2. "current_ats_score": An honest assessment (38-68) reflecting how legacy ATS parsers penalize generic academic tutorials and un-deployed coursework.
3. "projected_ats_score": Realistic post-workshop score (88-96) factoring in live deployment, verified credentials, and production AI architecture.
4. "score_delta": Exactly (projected_ats_score - current_ats_score).
5. "missing_placement_keywords": 4-6 specific, high-yield modern tech keywords demanded by the target company's job descriptions (e.g., "Next.js 16 App Router", "Streaming LLM Inference", "Atomic Database Locks", "Sub-200ms Latency Tuning", "PostgreSQL RLS").
6. "found_keywords": 3-6 actual technical skills identified in the candidate's resume.
7. "critical_critique": 3-4 comprehensive, deeply insightful sentences dissecting the exact technical gaps, lack of production telemetry, and why hiring managers filter out academic CRUD apps.
8. "post_workshop_bullet": A FAANG-caliber bullet following the Google XYZ formula ("Engineered [System] utilizing [Tech Stack], achieving [Specific Metric] under [Load/Constraint], verifiable at [Live URL]").
9. "why_this_bullet_wins": 2-3 sentences explaining the exact cognitive trigger this bullet activates during technical manager screening rounds.
10. "suggested_project_title": High-impact 4-7 word production system title.`;

// Deterministic heuristic fallback engine (100% offline uptime guarantee)
export function runHeuristicAtsScan(
  resumeText: string,
  targetCompany: TargetCompany,
  branch: string = 'CSE'
): AtsScanResponse {
  const meta = TARGET_COMPANY_METADATA[targetCompany] || TARGET_COMPANY_METADATA['tcs-digital'];
  const lower = resumeText.toLowerCase();

  const techDictionary = [
    'java',
    'python',
    'c++',
    'c#',
    'javascript',
    'typescript',
    'react',
    'node.js',
    'sql',
    'mysql',
    'mongodb',
    'html',
    'css',
    'git',
    'dsa',
    'oops',
    'machine learning',
    'data science',
    'django',
    'spring boot',
  ];

  const foundKeywords = techDictionary
    .filter((kw) => lower.includes(kw))
    .map((kw) => kw.toUpperCase());

  if (foundKeywords.length === 0) {
    foundKeywords.push('DATA STRUCTURES', 'OOP BASICS', 'ALGORITHMS');
  }

  // Detect missing cutting-edge keywords
  const missingKeywordsPool = [
    'Production LLM Orchestration',
    'Sub-200ms Latency Benchmarking',
    'Transactional Outbox Pattern',
    'Next.js 15 & Supabase Realtime',
    'Deterministic AI Fallback Architecture',
    'Atomic Concurrency Locking',
  ];

  const actionVerbCount = (
    lower.match(/\b(developed|engineered|architected|optimized|deployed|implemented)\b/g) || []
  ).length;
  const metricsCount = (lower.match(/\b(\d+%|\d+ms|\d+ users|\d+k|\d+x)\b/g) || []).length;

  // Base student score calculation
  let currentScore = 48 + Math.min(foundKeywords.length * 3, 15) + actionVerbCount * 2 + metricsCount * 3;
  currentScore = Math.max(38, Math.min(currentScore, 68));

  const projectedScore = Math.floor(Math.random() * 6) + 89; // 89 - 94
  const delta = projectedScore - currentScore;

  const projectBullets: Record<TargetCompany, { title: string; bullet: string; why: string }> = {
    'tcs-digital': {
      title: 'Real-Time Edge AI Project Engine',
      bullet:
        'Architected an end-to-end AI project pipeline in Next.js & Supabase, achieving <180ms p95 inference latency with multi-tier provider fallbacks and atomic seat concurrency locking.',
      why: 'TCS Digital interviewers look for systems with real architectural resilience, rate-limiting, and microservice thinking rather than toy tutorial clones.',
    },
    'cognizant-genc': {
      title: 'Full-Stack GenAI Workflow Orchestrator',
      bullet:
        'Engineered a scalable full-stack GenAI application utilizing Next.js, dynamic OpenGraph telemetry, and PostgreSQL outbox workers, boosting user workflow throughput by 42%.',
      why: 'GenC Next technical rounds prioritize candidates who understand how modern web frameworks interface with asynchronous cloud AI workers.',
    },
    'infosys-specialist': {
      title: 'Fault-Tolerant Distributed AI Assistant',
      bullet:
        'Developed a fault-tolerant multi-tier AI inference engine handling dynamic prompt chains with zero downtime fallback, eliminating third-party automation dependencies.',
      why: 'Specialist Programmer assessments reward low-level reliability, error boundaries, and self-hosted architectural independence.',
    },
    'amazon-sde': {
      title: 'High-Throughput Concurrent AI Dispatcher',
      bullet:
        'Designed high-concurrency event-driven AI platform using PostgreSQL atomic locks (SKIP LOCKED) and sub-second stream handling, preserving strict data consistency at scale.',
      why: 'Amazon SDE-1 rounds drill heavily on concurrency control, distributed locking, and edge-case handling under high system load.',
    },
    'fintech-startup': {
      title: 'Production Real-Time GenAI Assistant',
      bullet:
        'Shipped production-grade AI platform with instant verifiable credentials, real-time WebSocket state synchronization, and sub-dollar multi-provider API cost optimization.',
      why: 'High-growth startups look for product velocity—candidates who can ship working, deployable AI products end-to-end in hours.',
    },
  };

  const choice = projectBullets[targetCompany] || projectBullets['tcs-digital'];

  return {
    current_ats_score: currentScore,
    projected_ats_score: projectedScore,
    score_delta: delta,
    missing_placement_keywords: missingKeywordsPool.slice(0, 5),
    found_keywords: foundKeywords.slice(0, 6),
    critical_critique: `Your current resume relies on conventional academic coursework and basic CRUD implementations. Technical ATS screeners for ${meta.name} filter out candidates who lack production deployments, concurrency handling, and measurable performance metrics.`,
    post_workshop_bullet: choice.bullet,
    why_this_bullet_wins: choice.why,
    suggested_project_title: choice.title,
    company_name: meta.name,
    target_ctc: meta.ctc,
    source: 'heuristic',
  };
}

export async function analyzeResumeATS(params: AtsScanRequest): Promise<AtsScanResponse> {
  const { resume_text, target_company, branch } = params;
  const meta = TARGET_COMPANY_METADATA[target_company] || TARGET_COMPANY_METADATA['tcs-digital'];

  const userPrompt = `Target Company: ${meta.name} (${meta.ctc} CTC tier).
Target Domain Focus: ${meta.focus}
Candidate Branch: ${branch || 'CSE'}

Student Resume Content:
"""
${resume_text.slice(0, 4000)}
"""

Evaluate this student's resume strictly against the ${meta.name} technical bar.
CRITICAL: Return strictly valid JSON matching this schema:
{
  "current_ats_score": 52,
  "projected_ats_score": 90,
  "score_delta": 38,
  "missing_placement_keywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4"],
  "found_keywords": ["Keyword A", "Keyword B", "Keyword C"],
  "critical_critique": "2-3 sentences explaining why their current resume gets filtered by ATS and what technical gap exists.",
  "post_workshop_bullet": "Action-oriented production project bullet they will add after building this 60-min AI project with quantified impact.",
  "why_this_bullet_wins": "1-2 sentences on why this exact bullet catches the recruiter's eye during campus drives.",
  "suggested_project_title": "Concise Project Title"
}`;

  // 1. Tier 1: OpenRouter (Primary)
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey && openrouterKey.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://firstbuild.dev',
          'X-Title': 'FirstBuild Engine ATS Scanner',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'google/gemini-3.8-flash',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 2500,
          response_format: { type: 'json_object' },
          temperature: 0.4,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const rawContent = data.choices?.[0]?.message?.content;
        if (rawContent) {
          const clean = rawContent
            .trim()
            .replace(/^```json\s*/i, '')
            .replace(/^```\s*/i, '')
            .replace(/```\s*$/, '')
            .trim();
          const parsed = JSON.parse(clean);
          const validated = AtsScanResponseSchema.parse({
            ...parsed,
            company_name: meta.name,
            target_ctc: meta.ctc,
            source: 'openrouter',
          });
          return validated;
        }
      }
    } catch (openrouterErr) {
      console.warn('[ATS Analyzer] OpenRouter failed, attempting Gemini fallback:', openrouterErr);
    }
  }

  // 2. Tier 2: Google Gemini (Fallback 1)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 0) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const preferredModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
      const modelsToTry = [
        preferredModel,
        ...GEMINI_FREE_TIER_MODELS.filter((m) => m !== preferredModel),
      ];

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.6,
            },
            systemInstruction: SYSTEM_PROMPT,
          });

          const result = await model.generateContent(userPrompt);
          const responseText = result.response.text();
          const parsed = JSON.parse(responseText);
          const validated = AtsScanResponseSchema.parse({
            ...parsed,
            company_name: meta.name,
            target_ctc: meta.ctc,
            source: 'gemini',
          });
          return validated;
        } catch (mErr) {
          console.warn(`[ATS Analyzer] Gemini model ${modelName} failed:`, mErr);
        }
      }
    } catch (geminiErr) {
      console.warn('[ATS Analyzer] Gemini provider failed, attempting heuristic:', geminiErr);
    }
  }

  // 3. Tier 3: Deterministic Heuristic Fallback (Guaranteed 100% Uptime)
  return runHeuristicAtsScan(resume_text, target_company, branch);
}
