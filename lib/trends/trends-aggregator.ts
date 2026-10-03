import 'server-only';
import {
  TechTrendsResponseSchema,
  type TechTrendsResponse,
  type NewsArticleItem,
  type TrendingRepoItem,
  type SalaryPulseItem,
} from '../validation/tech-trends-schema';

interface CacheEntry {
  data: TechTrendsResponse;
  expiresAt: number;
}

let memoryCache: CacheEntry | null = null;

const FALLBACK_ARTICLES: NewsArticleItem[] = [
  {
    id: 'art-1',
    title: 'Why Next.js 15 and Production LLM Orchestration are Dominating 2026 Tech Hiring',
    description: 'A comprehensive study of over 12,000 engineering job postings across Indian product startups and MNC differential tracks.',
    url: 'https://dev.to',
    source: 'Dev.to Tech Pulse',
    published_at: new Date().toISOString(),
    reading_time_minutes: 5,
    tags: ['ai', 'nextjs', 'career', 'webdev'],
    author: 'Principal Placement Architect',
    cover_image: null,
  },
  {
    id: 'art-2',
    title: 'From ₹3.5 LPA to ₹9 LPA: How Proof-of-Work Projects Reshape Campus Placement Offers',
    description: 'Case studies of Tier-3 engineering graduates who bypassed mass recruiters by shipping full-stack AI applications.',
    url: 'https://dev.to',
    source: 'Engineering Career Insights',
    published_at: new Date().toISOString(),
    reading_time_minutes: 6,
    tags: ['placements', 'ai', 'careers'],
    author: 'Tech Talent Strategist',
    cover_image: null,
  },
  {
    id: 'art-3',
    title: 'Building Resilient Micro-Inference Systems: The Transactional Outbox Pattern in Practice',
    description: 'Eliminating third-party automation dependencies like Zapier by orchestrating atomic database locking in PostgreSQL.',
    url: 'https://dev.to',
    source: 'Distributed Systems Journal',
    published_at: new Date().toISOString(),
    reading_time_minutes: 7,
    tags: ['architecture', 'supabase', 'database'],
    author: 'Cloud Systems Engineer',
    cover_image: null,
  },
];

const FALLBACK_HN_STORIES: NewsArticleItem[] = [
  {
    id: 'hn-1',
    title: 'OpenAI and DeepMind publish new benchmarks on agentic tool calling',
    description: 'Discussions on production-grade multi-agent architectures and low-latency inference boundaries.',
    url: 'https://news.ycombinator.com',
    source: 'HackerNews',
    published_at: new Date().toISOString(),
    reading_time_minutes: 3,
    tags: ['ai', 'research'],
    author: 'hn_community',
    cover_image: null,
  },
  {
    id: 'hn-2',
    title: 'Why engineering managers are rejecting generic tutorial projects in screening rounds',
    description: 'Recruiters discuss the saturation of todo apps and weather dashboards on fresher resumes.',
    url: 'https://news.ycombinator.com',
    source: 'HackerNews',
    published_at: new Date().toISOString(),
    reading_time_minutes: 4,
    tags: ['hiring', 'advice'],
    author: 'hn_community',
    cover_image: null,
  },
];

const FALLBACK_REPOS: TrendingRepoItem[] = [
  {
    name: 'open-webui',
    full_name: 'open-webui/open-webui',
    description: 'User-friendly WebUI for LLMs with multimodal support and extensible pipelines.',
    html_url: 'https://github.com/open-webui/open-webui',
    stargazers_count: 58400,
    language: 'TypeScript',
    topics: ['ai', 'llm', 'nextjs', 'fullstack'],
  },
  {
    name: 'langchainjs',
    full_name: 'langchain-ai/langchainjs',
    description: 'Build context-aware reasoning applications using JavaScript/TypeScript.',
    html_url: 'https://github.com/langchain-ai/langchainjs',
    stargazers_count: 14200,
    language: 'TypeScript',
    topics: ['ai', 'agents', 'embeddings'],
  },
  {
    name: 'supabase',
    full_name: 'supabase/supabase',
    description: 'The open-source Firebase alternative with built-in Postgres vector embeddings and realtime WebSockets.',
    html_url: 'https://github.com/supabase/supabase',
    stargazers_count: 73000,
    language: 'TypeScript',
    topics: ['database', 'postgres', 'realtime'],
  },
];

const SALARY_PULSE_INDEX: SalaryPulseItem[] = [
  {
    role_title: 'GenAI & LLM Orchestration Engineer',
    experience_level: 'Fresher / Junior (0-1 yrs)',
    average_ctc_india: '₹8.50 – ₹14.00 LPA',
    yoy_demand_growth: '+312% YoY',
    core_stack: ['Next.js 15', 'OpenRouter / Gemini', 'Supabase Vector', 'TypeScript'],
    category: 'ai-differential',
  },
  {
    role_title: 'Full-Stack Modern Web Engineer',
    experience_level: 'Fresher / Junior (0-1 yrs)',
    average_ctc_india: '₹6.75 – ₹11.00 LPA',
    yoy_demand_growth: '+184% YoY',
    core_stack: ['React 19', 'TailwindCSS', 'PostgreSQL', 'REST & WebSockets'],
    category: 'modern-web',
  },
  {
    role_title: 'High-Growth AI Startup SDE-1',
    experience_level: 'Fresher (0 yrs Proof-of-Work)',
    average_ctc_india: '₹12.00 – ₹20.00 LPA',
    yoy_demand_growth: '+220% YoY',
    core_stack: ['Full-Stack TypeScript', 'Edge Runtimes', 'AI Pipelines', 'Vercel'],
    category: 'ai-differential',
  },
  {
    role_title: 'Legacy Java 8 / Servlet Developer',
    experience_level: 'Fresher (Mass Recruiter Band)',
    average_ctc_india: '₹3.36 – ₹3.80 LPA',
    yoy_demand_growth: '-42% YoY Decline',
    core_stack: ['Java 8', 'JSP / Servlets', 'Basic MySQL', 'Eclipse IDE'],
    category: 'legacy-service',
  },
];

export async function fetchTechTrends(): Promise<TechTrendsResponse> {
  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) {
    return { ...memoryCache.data, source: 'cached' };
  }

  let articles: NewsArticleItem[] = [...FALLBACK_ARTICLES];
  let hnStories: NewsArticleItem[] = [...FALLBACK_HN_STORIES];
  let repos: TrendingRepoItem[] = [...FALLBACK_REPOS];
  let hasLiveApiSuccess = false;

  // 1. Fetch Dev.to AI Articles
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch('https://dev.to/api/articles?tag=ai&per_page=6', {
      headers: { 'User-Agent': 'FirstBuild-Engine' },
      signal: controller.signal,
      next: { revalidate: 1800 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        articles = data.map((item: { id: number; title: string; description: string; url: string; published_at: string; reading_time_minutes: number; tag_list: string[]; user: { name: string }; cover_image: string | null }) => ({
          id: item.id,
          title: item.title,
          description: item.description || '',
          url: item.url,
          source: 'Dev.to Community',
          published_at: item.published_at,
          reading_time_minutes: item.reading_time_minutes || 4,
          tags: Array.isArray(item.tag_list) ? item.tag_list.slice(0, 4) : ['ai'],
          author: item.user?.name || 'Engineer',
          cover_image: item.cover_image || null,
        }));
        hasLiveApiSuccess = true;
      }
    }
  } catch (err) {
    console.warn('[Tech Trends] Dev.to API fetch failed, using fallback:', err);
  }

  // 2. Fetch HackerNews Top Stories (AI-filtered or top tech)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const topIdsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
      headers: { 'User-Agent': 'FirstBuild-Engine' },
      signal: controller.signal,
      next: { revalidate: 1800 },
    });
    clearTimeout(timeout);

    if (topIdsRes.ok) {
      const ids: number[] = await topIdsRes.json();
      const selectedIds = ids.slice(0, 6);

      const storyPromises = selectedIds.map(async (id) => {
        try {
          const sRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          if (sRes.ok) return await sRes.json();
        } catch {
          return null;
        }
      });

      const storyResults = await Promise.all(storyPromises);
      const validStories = storyResults.filter(Boolean);

      if (validStories.length > 0) {
        hnStories = validStories.map((s: { id: number; title: string; url?: string; time: number; by?: string }) => ({
          id: s.id,
          title: s.title,
          description: 'Trending community engineering discussion on HackerNews.',
          url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
          source: 'HackerNews Top Stories',
          published_at: new Date(s.time * 1000).toISOString(),
          reading_time_minutes: 3,
          tags: ['tech-news', 'hackernews'],
          author: s.by || 'HN Contributor',
          cover_image: null,
        }));
        hasLiveApiSuccess = true;
      }
    }
  } catch (err) {
    console.warn('[Tech Trends] HackerNews API fetch failed, using fallback:', err);
  }

  // 3. Fetch GitHub Trending AI Repositories
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const ghRes = await fetch(
      'https://api.github.com/search/repositories?q=topic:ai&sort=stars&order=desc&per_page=4',
      {
        headers: {
          'User-Agent': 'FirstBuild-Engine',
          Accept: 'application/vnd.github.v3+json',
        },
        signal: controller.signal,
        next: { revalidate: 3600 },
      }
    );
    clearTimeout(timeout);

    if (ghRes.ok) {
      const ghData = await ghRes.json();
      if (Array.isArray(ghData.items) && ghData.items.length > 0) {
        repos = ghData.items.map((r: { name: string; full_name: string; description: string | null; html_url: string; stargazers_count: number; language: string | null; topics: string[] }) => ({
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          html_url: r.html_url,
          stargazers_count: r.stargazers_count,
          language: r.language,
          topics: Array.isArray(r.topics) ? r.topics.slice(0, 4) : [],
        }));
        hasLiveApiSuccess = true;
      }
    }
  } catch (err) {
    console.warn('[Tech Trends] GitHub Repos API fetch failed, using fallback:', err);
  }

  const responseData: TechTrendsResponse = {
    articles,
    hacker_news: hnStories,
    trending_repos: repos,
    salary_pulse: SALARY_PULSE_INDEX,
    last_updated: new Date().toISOString(),
    source: hasLiveApiSuccess ? 'live-api' : 'fallback',
  };

  const validated = TechTrendsResponseSchema.parse(responseData);

  // Cache for 15 minutes (900,000 ms)
  memoryCache = {
    data: validated,
    expiresAt: now + 900000,
  };

  return validated;
}
