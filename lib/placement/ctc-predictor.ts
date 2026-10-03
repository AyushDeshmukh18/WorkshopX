import 'server-only';
import {
  CtcPredictorResponseSchema,
  type CtcPredictorRequest,
  type CtcPredictorResponse,
  type BacklogStatus,
  type ProjectExperience,
} from '../validation/ctc-predictor-schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_FREE_TIER_MODELS } from '../ai/gemini-provider';

export function runHeuristicCtcPrediction(
  cgpa: number,
  branch: string = 'CSE',
  backlogs: BacklogStatus = 'none',
  experience: ProjectExperience = 'academic-crud'
): CtcPredictorResponse {
  const hasActiveBacklogs = backlogs === 'active';
  const isHighCgpa = cgpa >= 7.5;
  const isEligibleForMNCs = cgpa >= 6.0 && !hasActiveBacklogs;

  let currentTier = 'Mass Recruitment Pool (TCS Ninja / Cognizant GenC)';
  let currentCtc = '₹3.36 – ₹3.80 LPA';
  let projectedTier = 'Differential Advanced Track (TCS Digital / Cognizant GenC Next)';
  let projectedCtc = '₹7.50 – ₹9.20 LPA';
  let leapAmount = '+₹4.20 LPA to +₹5.40 LPA';
  let threeYearDelta = '₹14,50,000+ Lifetime Compounding Surge';

  if (hasActiveBacklogs) {
    currentTier = 'Campus Shortlist High Risk (Filtered by MNC Criteria)';
    currentCtc = '₹2.80 – ₹3.20 LPA';
    projectedTier = 'Off-Campus Proof-of-Work Startup Track';
    projectedCtc = '₹6.50 – ₹8.50 LPA';
    leapAmount = '+₹3.70 LPA to +₹5.30 LPA';
    threeYearDelta = '₹12,00,000+ Career Trajectory Recovery';
  } else if (isHighCgpa && experience === 'mini-project') {
    currentTier = 'Upper Service Track (Accenture Advanced / LTIMindtree)';
    currentCtc = '₹4.50 – ₹5.00 LPA';
    projectedTier = 'Product Engineering & Specialist Track (Infosys SP / Amazon SDE-1)';
    projectedCtc = '₹9.50 – ₹14.00 LPA';
    leapAmount = '+₹5.00 LPA to +₹9.00 LPA';
    threeYearDelta = '₹22,00,000+ High-Growth Trajectory';
  }

  const companies = [
    {
      company: 'TCS Digital / Prime',
      ctc_range: '₹7.5 – ₹9.0 LPA',
      track_name: 'Digital Differential Track',
      eligible: cgpa >= 6.5 && !hasActiveBacklogs,
      eligibility_status: (cgpa >= 6.5 && !hasActiveBacklogs ? 'eligible' : hasActiveBacklogs ? 'blocked' : 'conditional') as 'eligible' | 'conditional' | 'blocked',
      requirement_note: 'Requires 65%+ in academics and advanced coding evaluation with real architectural project viva.',
    },
    {
      company: 'Cognizant GenC Next',
      ctc_range: '₹6.75 – ₹8.5 LPA',
      track_name: 'Advanced Full-Stack AI Track',
      eligible: cgpa >= 6.0 && !hasActiveBacklogs,
      eligibility_status: (cgpa >= 6.0 && !hasActiveBacklogs ? 'eligible' : hasActiveBacklogs ? 'blocked' : 'conditional') as 'eligible' | 'conditional' | 'blocked',
      requirement_note: 'Prioritizes candidates with deployed GenAI and modern web framework projects.',
    },
    {
      company: 'Infosys Specialist Programmer',
      ctc_range: '₹9.5 – ₹11.0 LPA',
      track_name: 'Specialist Coding Stream',
      eligible: cgpa >= 6.0 && !hasActiveBacklogs,
      eligibility_status: (cgpa >= 6.0 && !hasActiveBacklogs ? 'eligible' : hasActiveBacklogs ? 'blocked' : 'conditional') as 'eligible' | 'conditional' | 'blocked',
      requirement_note: 'Evaluates system reliability, concurrency handling, and low-level architectural problem solving.',
    },
    {
      company: 'High-Growth AI Product Startups',
      ctc_range: '₹8.0 – ₹16.0 LPA',
      track_name: 'Proof-of-Work Off-Campus Stream',
      eligible: true,
      eligibility_status: 'eligible' as const,
      requirement_note: 'Zero CGPA/backlog bias: 100% evaluated on live deployed URL, GitHub code quality, and LLM boundaries.',
    },
  ];

  return {
    current_tier_name: currentTier,
    current_estimated_ctc: currentCtc,
    projected_tier_name: projectedTier,
    projected_estimated_ctc: projectedCtc,
    ctc_leap_amount: leapAmount,
    three_year_compounding_delta: threeYearDelta,
    eligibility_verdict: hasActiveBacklogs
      ? 'Campus recruitment filters currently flag your active backlogs. However, product startups and modern differential tracks bypass GPA filters entirely when candidates demonstrate a live, production-deployed AI system with public code verification.'
      : `Your ${cgpa} CGPA clears baseline corporate eligibility, but without verified production AI projects, you remain trapped in the mass service recruiter band. Upgrading your project portfolio unlocks differential package shortlists immediately.`,
    company_eligibility: companies,
    the_3_milestone_leap_plan: [
      {
        milestone: 'Milestone 1: Replace Toy CRUD with Production AI',
        description: 'Eliminate weather apps and bookstore management projects that scream "tutorial student".',
        action: 'Build the 60-minute resilient LLM project with real transactional database locks during the workshop.',
      },
      {
        milestone: 'Milestone 2: Ship Live Verifiable URL & Clean GitHub',
        description: 'Technical recruiters discard resumes without a clickable, working deployed product.',
        action: 'Deploy your Next.js and Supabase project live to Vercel with automated test coverage.',
      },
      {
        milestone: 'Milestone 3: Master Placement Viva Defense',
        description: 'Explain system design, latency benchmarking (<200ms), and error failover with confidence.',
        action: 'Use the workshop IEEE documentation and architectural talking points in technical interview rounds.',
      },
    ],
    why_workshop_bridges_the_gap:
      'The 60-minute workshop directly produces the exact proof-of-work asset required by differential interviewers: a live deployed Next.js 15 app with multi-tier AI inference, atomic database locking, and a verifiable credential ID.',
    source: 'heuristic',
  };
}

export async function predictPlacementCtc(
  params: CtcPredictorRequest
): Promise<CtcPredictorResponse> {
  const { cgpa, branch, backlog_status, project_experience, dream_role } = params;

  const prompt = `You are a Principal Campus Placement Director and Compensation Strategist evaluating final-year Indian engineering candidates.
Analyze the candidate's academic and technical profile to calculate their baseline vs. differential CTC placement tier with high mathematical rigor and deep domain insights.

Candidate Profile:
- CGPA: ${cgpa}/10.0
- Engineering Branch: ${branch}
- Backlog Status: ${backlog_status} (none/cleared/active)
- Current Project Portfolio: ${project_experience}
- Target Dream Role: ${dream_role}

HIGH-QUALITY & DETAIL REQUIREMENTS:
1. Return strictly valid JSON matching the schema below without Markdown code fences.
2. "current_tier_name": Precise placement tier (e.g., "Mass Recruiter Bracket (TCS Ninja / Cognizant GenC / Wipro Elite)").
3. "current_estimated_ctc": Realistic Indian campus starting salary band (e.g., "₹3.36 – ₹4.00 LPA").
4. "projected_tier_name": Elevated differential tier (e.g., "Differential Product Track (TCS Digital / Cognizant GenC Next / Product Startups)").
5. "projected_estimated_ctc": Upgraded package band (e.g., "₹7.50 – ₹10.50 LPA").
6. "ctc_leap_amount": Net starting jump (e.g., "+₹4.14 LPA to +₹6.50 LPA (120% – 180% Surge)").
7. "three_year_compounding_delta": 3-year cumulative wealth surge with 15-25% annual hikes (e.g., "₹18,50,000+ Lifetime Compounding Surge").
8. "eligibility_verdict": 3-4 comprehensive sentences delivering an unvarnished, strategic assessment of their placement prospects, how recruiters evaluate their CGPA/backlogs, and why verified proof-of-work bypasses traditional cutoffs.
9. "company_eligibility": Array of 4-5 diverse company tiers (Mass Service, Service Differential, Product SaaS, Unicorn Startup) with { company, ctc_range, track_name, eligible (boolean), eligibility_status ("eligible"|"conditional"|"blocked"), requirement_note (detailed qualification note) }.
10. "the_3_milestone_leap_plan": Array of exactly 3 granular milestone objects { milestone, description, action } mapping out the exact transformation from generic tutorial apps to production systems.
11. "why_workshop_bridges_the_gap": 2-3 sentences detailing how the 60-minute live workshop hands them the exact verifiable credential, deployed Next.js system, and architecture Viva defense talking points needed to close the gap.

Schema structure:
{
  "current_tier_name": "Mass Recruiter Bracket (₹3.36L - ₹4.00L)",
  "current_estimated_ctc": "₹3.36 – ₹4.00 LPA",
  "projected_tier_name": "Differential Tech Track (TCS Digital / GenC Next)",
  "projected_estimated_ctc": "₹7.50 – ₹10.50 LPA",
  "ctc_leap_amount": "+₹4.14 LPA to +₹6.50 LPA (140% Increase)",
  "three_year_compounding_delta": "₹18,50,000+ Compounded Wealth Difference",
  "eligibility_verdict": "Detailed 3-4 sentence strategic verdict",
  "company_eligibility": [
    {
      "company": "TCS Digital / Prime",
      "ctc_range": "₹7.5 – ₹9.0 LPA",
      "track_name": "Digital Differential",
      "eligible": true,
      "eligibility_status": "eligible",
      "requirement_note": "Requires live deployed full-stack project with system architecture viva defense"
    }
  ],
  "the_3_milestone_leap_plan": [
    { "milestone": "Milestone 1", "description": "Comprehensive description", "action": "Concrete action" },
    { "milestone": "Milestone 2", "description": "Comprehensive description", "action": "Concrete action" },
    { "milestone": "Milestone 3", "description": "Comprehensive description", "action": "Concrete action" }
  ],
  "why_workshop_bridges_the_gap": "Compelling explanation of how the 60-min workshop delivers proof-of-work"
}`;

  // 1. Tier 1: OpenRouter (Primary)
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey && openrouterKey.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9500);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://firstbuild.dev',
          'X-Title': 'FirstBuild CTC Leap Predictor',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'google/gemini-3.8-flash',
          messages: [
            {
              role: 'system',
              content:
                'You are an authoritative campus placement director and compensation strategist. Return strictly valid JSON conforming to the schema with high detail and accuracy.',
            },
            { role: 'user', content: prompt },
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
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const clean = content.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/, '').trim();
          const parsed = JSON.parse(clean);

          const validated = CtcPredictorResponseSchema.parse({
            ...parsed,
            source: 'openrouter',
          });

          return validated;
        }
      }
    } catch (err) {
      console.warn('[CTC Predictor] OpenRouter call failed, attempting Gemini:', err);
    }
  }

  // 2. Tier 2: Google Gemini (Fallback 1)
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey.trim().length > 0) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const preferredModel = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
      const modelsToTry = [preferredModel, ...GEMINI_FREE_TIER_MODELS.filter((m) => m !== preferredModel)];

      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json', temperature: 0.6 },
          });

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const parsed = JSON.parse(responseText);

          return CtcPredictorResponseSchema.parse({
            ...parsed,
            source: 'gemini',
          });
        } catch (mErr) {
          console.warn(`[CTC Predictor] Gemini model ${modelName} failed:`, mErr);
        }
      }
    } catch (gErr) {
      console.warn('[CTC Predictor] Gemini fallback failed, using heuristic:', gErr);
    }
  }

  // 3. Tier 3: Deterministic Heuristic Fallback
  return runHeuristicCtcPrediction(cgpa, branch, backlog_status, project_experience);
}
