import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramAlert } from './telegram';
import { createHash } from 'crypto';

export interface JobLogEntry {
  job: string;
  status: 'success' | 'failure';
  duration_ms: number;
  details?: Record<string, unknown>;
  error?: string;
}

// In-memory job logs fallback
export const recentJobLogs: JobLogEntry[] = [];

export function withAlert(
  jobName: string,
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();
    try {
      const response = await handler(req);
      const durationMs = Date.now() - startTime;

      recentJobLogs.unshift({
        job: jobName,
        status: 'success',
        duration_ms: durationMs,
      });
      if (recentJobLogs.length > 100) recentJobLogs.pop();

      return response;
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;
      const errorMsg = err instanceof Error ? err.message : String(err);
      const signature = createHash('md5').update(`${jobName}:${errorMsg}`).digest('hex');

      recentJobLogs.unshift({
        job: jobName,
        status: 'failure',
        duration_ms: durationMs,
        error: errorMsg,
      });
      if (recentJobLogs.length > 100) recentJobLogs.pop();

      // Dispatch deduplicated alert
      await sendTelegramAlert(`Failure in ${jobName}`, errorMsg, signature);

      console.error(`[withAlert] Caught unhandled exception in ${jobName}:`, err);
      return NextResponse.json(
        { error: 'Internal execution failure.', job: jobName },
        { status: 500 }
      );
    }
  };
}
