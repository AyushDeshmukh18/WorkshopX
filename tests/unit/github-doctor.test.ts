import { describe, it, expect } from 'vitest';
import { extractGitHubUsername, runHeuristicGitHubAudit } from '@/lib/github/github-auditor';
import { GitHubAuditResponseSchema } from '@/lib/validation/github-audit-schema';

describe('AI GitHub Repo Doctor & Recruiter Attractiveness Auditor', () => {
  it('extracts clean usernames from various URL formats', () => {
    expect(extractGitHubUsername('https://github.com/rohan-dev')).toBe('rohan-dev');
    expect(extractGitHubUsername('http://github.com/ananya-sharma/my-repo')).toBe('ananya-sharma');
    expect(extractGitHubUsername('github.com/priya-tech')).toBe('priya-tech');
    expect(extractGitHubUsername('plain-username')).toBe('plain-username');
  });

  it('runs deterministic heuristic audit and passes strict Zod schema validation', () => {
    const mockProfile = {
      username: 'student-dev',
      avatar_url: 'https://api.dicebear.com/7.x/identicon/svg?seed=student-dev',
      bio: 'B.Tech CSE Student',
      public_repos: 6,
      followers: 3,
      repos: [
        {
          name: 'java-lab-programs',
          description: 'Basic semester assignments',
          language: 'Java',
          stargazers_count: 0,
          homepage: null,
          updated_at: new Date().toISOString(),
        },
        {
          name: 'weather-app',
          description: 'Weather app using OpenWeather',
          language: 'JavaScript',
          stargazers_count: 1,
          homepage: null,
          updated_at: new Date().toISOString(),
        },
      ],
    };

    const result = runHeuristicGitHubAudit(mockProfile, 'tcs-digital', 'CSE');

    expect(result).toBeDefined();
    const parsed = GitHubAuditResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    expect(result.recruiter_score).toBeGreaterThanOrEqual(30);
    expect(result.recruiter_score).toBeLessThanOrEqual(65);
    expect(result.projected_score).toBeGreaterThanOrEqual(85);
    expect(result.score_delta).toBeGreaterThan(15);
    expect(result.critical_flaws.length).toBeGreaterThanOrEqual(2);
    expect(result.the_60_min_fix.repo_name).toBeTruthy();
  });
});
