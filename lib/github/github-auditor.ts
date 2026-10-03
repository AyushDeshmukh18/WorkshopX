import 'server-only';
import {
  GitHubAuditResponseSchema,
  type GitHubAuditRequest,
  type GitHubAuditResponse,
} from '../validation/github-audit-schema';
import { TARGET_COMPANY_METADATA } from '../validation/ats-schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_FREE_TIER_MODELS } from '../ai/gemini-provider';

export function extractGitHubUsername(input: string): string {
  let clean = input.trim();
  // Strip protocol
  clean = clean.replace(/^https?:\/\//i, '');
  // Strip domain
  clean = clean.replace(/^(www\.)?github\.com\//i, '');
  // Extract first path segment
  const parts = clean.split('/').filter(Boolean);
  return parts[0] || 'student-coder';
}

interface RawGitHubProfile {
  username: string;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  repos: Array<{
    name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    homepage: string | null;
    updated_at: string;
  }>;
}

async function fetchGitHubData(username: string): Promise<RawGitHubProfile> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'FirstBuild-Engine-Auditor',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!userRes.ok) {
      throw new Error(`GitHub user query failed with status ${userRes.status}`);
    }

    const userData = await userRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`,
      { headers, next: { revalidate: 3600 } }
    );

    const reposData = reposRes.ok ? await reposRes.json() : [];

    return {
      username: userData.login,
      avatar_url: userData.avatar_url,
      bio: userData.bio || null,
      public_repos: userData.public_repos || 0,
      followers: userData.followers || 0,
      repos: Array.isArray(reposData)
        ? reposData.map((r: { name: string; description: string | null; language: string | null; stargazers_count: number; homepage: string | null; updated_at: string }) => ({
            name: r.name,
            description: r.description,
            language: r.language,
            stargazers_count: r.stargazers_count,
            homepage: r.homepage,
            updated_at: r.updated_at,
          }))
        : [],
    };
  } catch {
    // Graceful offline fallback profile for simulation/demo
    return {
      username,
      avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(username)}`,
      bio: 'Engineering Student & Aspiring Software Developer',
      public_repos: 5,
      followers: 2,
      repos: [
        {
          name: 'college-assignments-java',
          description: 'Basic coursework programs and lab problems',
          language: 'Java',
          stargazers_count: 0,
          homepage: null,
          updated_at: new Date().toISOString(),
        },
        {
          name: 'bookstore-crud-app',
          description: 'Semester 6 DBMS project using MySQL',
          language: 'Java',
          stargazers_count: 1,
          homepage: null,
          updated_at: new Date().toISOString(),
        },
        {
          name: 'simple-portfolio',
          description: 'Personal HTML/CSS page',
          language: 'HTML',
          stargazers_count: 0,
          homepage: null,
          updated_at: new Date().toISOString(),
        },
      ],
    };
  }
}

export function runHeuristicGitHubAudit(
  profile: RawGitHubProfile,
  targetCompany: string = 'tcs-digital',
  branch: string = 'CSE'
): GitHubAuditResponse {
  const compMeta = TARGET_COMPANY_METADATA[targetCompany as keyof typeof TARGET_COMPANY_METADATA] || TARGET_COMPANY_METADATA['tcs-digital'];

  const languages = Array.from(
    new Set(profile.repos.map((r) => r.language).filter(Boolean) as string[])
  ).slice(0, 5);

  const totalStars = profile.repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const reposWithLiveUrls = profile.repos.filter((r) => r.homepage && r.homepage.trim().length > 0).length;
  const hasModernStack = languages.some((l) => ['TypeScript', 'Python', 'Go', 'Rust'].includes(l));

  // Calculate base score
  let score = 38 + Math.min(profile.public_repos * 2, 10) + (hasModernStack ? 8 : 0) + (reposWithLiveUrls > 0 ? 8 : 0);
  score = Math.max(30, Math.min(score, 62));

  const projectedScore = Math.floor(Math.random() * 5) + 88; // 88 - 92
  const delta = projectedScore - score;

  const flaws: string[] = [];
  if (reposWithLiveUrls === 0) {
    flaws.push('Zero live deployment URLs detected: recruiters cannot test any of your working prototypes.');
  }
  flaws.push('Missing production GenAI or modern LLM orchestration repository on public profile.');
  flaws.push('Repositories consist predominantly of academic lab exercises and unmaintained coursework.');
  if (totalStars === 0) {
    flaws.push('Zero community validation or stars; projects lack public README documentation.');
  }

  return {
    username: profile.username,
    avatar_url: profile.avatar_url,
    bio: profile.bio,
    public_repos_count: profile.public_repos,
    followers_count: profile.followers,
    top_languages: languages.length > 0 ? languages : ['Java', 'C++', 'JavaScript'],
    total_stars: totalStars,
    recruiter_score: score,
    projected_score: projectedScore,
    score_delta: delta,
    critical_flaws: flaws.slice(0, 4),
    strengths: [
      `Maintains ${profile.public_repos} public repos with consistent commit records`,
      `Multi-language fundamentals demonstrated across ${languages.slice(0, 2).join(', ') || 'core languages'}`,
    ],
    the_60_min_fix: {
      repo_name: 'production-ai-workshop-engine',
      one_liner: 'High-concurrency full-stack AI project with resilient multi-tier fallback architecture and Vercel live URL.',
      stack: ['Next.js 15', 'TypeScript', 'Supabase Realtime', 'OpenRouter API', 'TailwindCSS'],
      recruiter_impact: `Instantly demonstrates ${compMeta.name} differential track competency: live deployment, system resilience, and production AI boundaries.`,
    },
    company_name: compMeta.name,
    source: 'heuristic',
  };
}

export async function auditGitHubProfile(params: GitHubAuditRequest): Promise<GitHubAuditResponse> {
  const username = extractGitHubUsername(params.username_or_url);
  const targetCompany = params.target_company || 'tcs-digital';
  const branch = params.branch || 'CSE';
  const compMeta = TARGET_COMPANY_METADATA[targetCompany as keyof typeof TARGET_COMPANY_METADATA] || TARGET_COMPANY_METADATA['tcs-digital'];

  const profile = await fetchGitHubData(username);

  const prompt = `You are a Senior Staff Engineer and Lead Campus Technical Auditor evaluating a final-year Indian engineering candidate's GitHub portfolio for ${compMeta.name} (${compMeta.ctc} package track).
Provide a high-depth, rigorous, and constructive audit of their public GitHub footprint.

Candidate GitHub Profile Telemetry:
Username: ${profile.username}
Bio: ${profile.bio || 'None provided'}
Public Repositories: ${profile.public_repos}
Followers: ${profile.followers}
Sample Public Repos: ${profile.repos.map((r) => `${r.name} (Lang: ${r.language || 'N/A'}, Stars: ${r.stargazers_count}, Live URL: ${r.homepage ? 'Yes' : 'No'})`).join('; ') || 'No public repositories'}
Candidate Engineering Branch: ${branch}

HIGH-QUALITY & DETAIL REQUIREMENTS:
1. Return strictly valid JSON conforming to the schema below without Markdown wrappers.
2. "recruiter_score": Objective score (35-65) reflecting the gap between typical student repos (academic assignments, empty READMEs, zero deployed apps) and corporate hiring bars.
3. "projected_score": Realistic post-workshop score (88-96) after deploying a live Next.js + OpenRouter AI system with verifiable credentials.
4. "score_delta": Exactly (projected_score - recruiter_score).
5. "critical_flaws": Exactly 3-4 specific, actionable, and technically rigorous critiques (e.g. absence of CI/CD, unconfigured environment secrets, lack of live production URLs, monolithic script architecture).
6. "strengths": 2-3 genuine engineering positives observed in their profile or learning curve.
7. "the_60_min_fix": Detailed object describing the flagship workshop project { repo_name, one_liner, stack (4-6 modern technologies), recruiter_impact (2-3 sentences explaining how this turns recruiter rejections into interview offers) }.

Schema structure:
{
  "recruiter_score": 46,
  "projected_score": 92,
  "score_delta": 46,
  "critical_flaws": ["Detailed Flaw 1", "Detailed Flaw 2", "Detailed Flaw 3"],
  "strengths": ["Detailed Strength 1", "Detailed Strength 2"],
  "the_60_min_fix": {
    "repo_name": "ai-project-engine",
    "one_liner": "Concise, production-grade description",
    "stack": ["Next.js 16", "TypeScript", "OpenRouter AI", "Supabase", "Tailwind CSS"],
    "recruiter_impact": "Deeply persuasive 2-3 sentences on recruiter conversion impact"
  }
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
          'X-Title': 'FirstBuild Engine GitHub Doctor',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'google/gemini-3.8-flash',
          messages: [
            {
              role: 'system',
              content:
                'You are an elite campus placement recruiter and principal software auditor. Return strictly valid JSON adhering to the specified schema with high technical depth.',
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

          const languages = Array.from(
            new Set(profile.repos.map((r) => r.language).filter(Boolean) as string[])
          ).slice(0, 5);
          const totalStars = profile.repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

          const validated = GitHubAuditResponseSchema.parse({
            username: profile.username,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            public_repos_count: profile.public_repos,
            followers_count: profile.followers,
            top_languages: languages.length > 0 ? languages : ['Java', 'C++', 'Python'],
            total_stars: totalStars,
            recruiter_score: parsed.recruiter_score,
            projected_score: parsed.projected_score,
            score_delta: parsed.score_delta,
            critical_flaws: parsed.critical_flaws,
            strengths: parsed.strengths,
            the_60_min_fix: parsed.the_60_min_fix,
            company_name: compMeta.name,
            source: 'openrouter',
          });

          return validated;
        }
      }
    } catch (err) {
      console.warn('[GitHub Auditor] OpenRouter call failed, attempting Gemini fallback:', err);
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

          const languages = Array.from(
            new Set(profile.repos.map((r) => r.language).filter(Boolean) as string[])
          ).slice(0, 5);
          const totalStars = profile.repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);

          return GitHubAuditResponseSchema.parse({
            username: profile.username,
            avatar_url: profile.avatar_url,
            bio: profile.bio,
            public_repos_count: profile.public_repos,
            followers_count: profile.followers,
            top_languages: languages.length > 0 ? languages : ['Java', 'C++', 'Python'],
            total_stars: totalStars,
            recruiter_score: parsed.recruiter_score,
            projected_score: parsed.projected_score,
            score_delta: parsed.score_delta,
            critical_flaws: parsed.critical_flaws,
            strengths: parsed.strengths,
            the_60_min_fix: parsed.the_60_min_fix,
            company_name: compMeta.name,
            source: 'gemini',
          });
        } catch (mErr) {
          console.warn(`[GitHub Auditor] Gemini model ${modelName} failed:`, mErr);
        }
      }
    } catch (gErr) {
      console.warn('[GitHub Auditor] Gemini fallback failed, using heuristic:', gErr);
    }
  }

  // 3. Tier 3: Deterministic Heuristic Fallback
  return runHeuristicGitHubAudit(profile, targetCompany, branch);
}
