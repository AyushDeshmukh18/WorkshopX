import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'node:crypto';
import { evaluateProjectSubmission } from '@/lib/evaluator/pipeline';
import { parseAndValidateGitHubUrl, validateLiveDeploymentUrl } from '@/lib/evaluator/url-validator';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const SubmissionSchema = z.object({
  repoUrl: z.string().url('Must be a valid URL.'),
  liveUrl: z.string().url('Must be a valid URL.'),
  projectName: z.string().min(2).max(100).optional().default('AI Application in 60 Minutes'),
  joinToken: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SubmissionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission data.', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { repoUrl, liveUrl, projectName, joinToken } = parsed.data;

    // 1. SSRF and URL validation
    const repoInfo = parseAndValidateGitHubUrl(repoUrl);
    if (!repoInfo) {
      return NextResponse.json(
        { error: 'Repository must be a valid public GitHub URL (e.g. https://github.com/username/repo).' },
        { status: 400 }
      );
    }

    const isLiveValid = validateLiveDeploymentUrl(liveUrl);
    if (!isLiveValid) {
      return NextResponse.json(
        { error: 'Live deployment must be a public HTTPS URL (localhost, IP literals, and private subnets are strictly blocked).' },
        { status: 400 }
      );
    }

    // 2. Evaluate project via deterministic checks & AI rubric
    const evalResult = await evaluateProjectSubmission(repoUrl, liveUrl);

    // 3. Cryptographically generate 12-char certificate ID if passed
    const certId = evalResult.passed
      ? crypto.randomBytes(6).toString('hex').toUpperCase()
      : null;

    // 4. Record to Supabase if available
    let supabase = null;
    try {
      supabase = getSupabaseServerClient();
    } catch {
      // Offline fallback
    }
    if (supabase && joinToken) {
      try {
        // Look up student by join token
        const { data: student } = await supabase
          .from('registrations')
          .select('id, full_name, email_normalized')
          .eq('join_token', joinToken)
          .maybeSingle();

        if (student) {
          // Upsert submission
          await supabase.from('submissions').upsert({
            registration_id: student.id,
            repo_url: repoUrl,
            live_url: liveUrl,
            status: 'done',
            score_total: evalResult.score_total,
            score_breakdown: evalResult.score_breakdown,
            tips: evalResult.tips,
            evaluated_at: new Date().toISOString(),
          }, { onConflict: 'registration_id' });

          // Record certificate if passed
          if (certId && evalResult.passed) {
            await supabase.from('certificates').upsert({
              id: certId,
              registration_id: student.id,
              score: evalResult.score_total,
              issued_at: new Date().toISOString(),
            }, { onConflict: 'registration_id' });

            // Queue certificate delivery email in outbox
            await supabase.from('notifications').upsert({
              registration_id: student.id,
              kind: 'certificate',
              channel: 'email',
              status: 'pending',
              run_at: new Date().toISOString(),
            }, { onConflict: 'registration_id,kind' });
          }
        }
      } catch (dbErr) {
        console.warn('[API /api/submissions] Supabase submission sync warning:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      score_total: evalResult.score_total,
      score_breakdown: evalResult.score_breakdown,
      tips: evalResult.tips,
      passed: evalResult.passed,
      evaluation_mode: evalResult.evaluation_mode,
      executive_summary: evalResult.executive_summary,
      key_strengths: evalResult.key_strengths,
      critical_weaknesses: evalResult.critical_weaknesses,
      placement_readiness_verdict: evalResult.placement_readiness_verdict,
      viva_defense_question: evalResult.viva_defense_question,
      viva_model_answer: evalResult.viva_model_answer,
      detected_tech_stack: evalResult.detected_tech_stack,
      certificate_id: certId,
      certificate_url: certId ? `/verify/${certId}` : null,
      pdf_url: certId ? `/api/certificate/${certId}` : null,
      project_name: projectName,
    });
  } catch (err: unknown) {
    console.error('[API /api/submissions] Error during evaluation:', err);
    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Project evaluation pipeline failed. Please check inputs and retry.';
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
