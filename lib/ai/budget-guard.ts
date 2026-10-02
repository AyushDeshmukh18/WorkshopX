import 'server-only';

// In-memory daily counter fallback if database is not reachable
const memoryUsage = new Map<string, number>();

export async function checkAndIncrementBudget(
  provider: 'gemini' | 'groq',
  dailyMax: number = 1000
): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0];
  const key = `${today}:${provider}`;

  const currentCalls = memoryUsage.get(key) || 0;
  if (currentCalls >= dailyMax) {
    return false; // Quota guard tripped
  }

  memoryUsage.set(key, currentCalls + 1);
  return true;
}
