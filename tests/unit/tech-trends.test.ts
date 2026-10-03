import { describe, it, expect } from 'vitest';
import { fetchTechTrends } from '@/lib/trends/trends-aggregator';
import { TechTrendsResponseSchema } from '@/lib/validation/tech-trends-schema';

describe('AI Market Radar & Tech Trends Aggregator', () => {
  it('fetches aggregated tech market data and passes strict Zod schema validation', async () => {
    const result = await fetchTechTrends();

    expect(result).toBeDefined();
    const parsed = TechTrendsResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    expect(result.articles.length).toBeGreaterThan(0);
    expect(result.hacker_news.length).toBeGreaterThan(0);
    expect(result.trending_repos.length).toBeGreaterThan(0);
    expect(result.salary_pulse.length).toBeGreaterThanOrEqual(3);
  }, 15000);

  it('validates 2026 Salary Pulse index comparing GenAI vs legacy CRUD packages', async () => {
    const result = await fetchTechTrends();

    const aiRole = result.salary_pulse.find((s) => s.category === 'ai-differential');
    const legacyRole = result.salary_pulse.find((s) => s.category === 'legacy-service');

    expect(aiRole).toBeDefined();
    expect(legacyRole).toBeDefined();

    expect(aiRole?.average_ctc_india).toContain('LPA');
    expect(aiRole?.yoy_demand_growth).toContain('+');
    expect(legacyRole?.yoy_demand_growth).toContain('Decline');
  }, 15000);
});
