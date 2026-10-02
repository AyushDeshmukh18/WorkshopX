import 'server-only';

export interface GitHubRepoInfo {
  owner: string;
  repo: string;
  apiUrl: string;
}

/**
 * Validates and parses a public GitHub repository URL.
 * Strictly prevents SSRF by enforcing strict regex parsing.
 */
export function parseAndValidateGitHubUrl(url: string): GitHubRepoInfo | null {
  try {
    const trimmed = url.trim();
    const match = trimmed.match(/^https:\/\/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+?)(?:\.git|\/)?$/);
    if (!match) return null;

    const owner = match[1];
    const repo = match[2];

    return {
      owner,
      repo,
      apiUrl: `https://api.github.com/repos/${owner}/${repo}`,
    };
  } catch {
    return null;
  }
}

/**
 * Validates a live project deployment URL.
 * Strictly blocks localhost, loopback, private RFC 1918 subnets, IP literals, and insecure protocols.
 */
export function validateLiveDeploymentUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl.trim());

    // Protocol must be HTTPS
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, local domains, and IP addresses
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.onion') ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    ) {
      return false;
    }

    // Reject IPv4 numeric addresses (prevents 10.x.x.x, 192.168.x.x, 172.16.x.x, 169.254.x.x)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(hostname)) {
      return false;
    }

    // Must have a valid dot-separated public domain
    if (!hostname.includes('.')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
