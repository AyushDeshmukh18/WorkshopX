import 'server-only';
import {
  type ColdPitchRequest,
  type ColdPitchResponse,
  ColdPitchResponseSchema,
} from '../validation/cold-pitch-schema';

const SYSTEM_PROMPT = `You are a high-stakes Tech Placement Coach and Principal Outbound Recruiter for top-tier Indian engineering graduates and off-campus hires.
Your task is to craft an exceptional, high-converting, proof-of-work cold outreach package tailored specifically to the recipient's role (Engineering Manager, Tech Recruiter, or Founder).

HIGH-QUALITY & DETAIL SPECIFICATIONS:
1. Return strictly valid JSON adhering to the schema. No markdown formatting, backticks, or outside commentary.
2. The "linkedin_dm_75_words" MUST be punchy (~70-80 words maximum). Zero filler ("Hope this finds you well" and "Please refer me" are strictly forbidden). Immediately lead with the candidate's engineering branch context, deployed project URL, and concrete technical metric.
3. The "cold_email_subject" must be irresistibly clickable, personalized with the target company's name and specific tech domain (e.g., "[Company] SDE-1: Built a live AI engine with <180ms p95 latency").
4. The "cold_email_body": 3 masterfully crafted paragraphs:
   - Paragraph 1 (Proof-of-work Hook): State what was built, why it aligns with the target company's stack, and embed the clickable live URL.
   - Paragraph 2 (Architectural Depth): Highlight concurrency handling, database optimization, or low-latency AI inference (e.g. Next.js 16 + OpenRouter streaming).
   - Paragraph 3 (Frictionless Low-Commitment Call-to-Action): Ask for a 10-minute technical review or code feedback, not a direct favor.
5. "followup_day_3" and "followup_day_7": Must provide progressive technical value (e.g., sharing a benchmark improvement or GitHub commit milestone), never passive nudges.
6. "pitch_strategy_tips": 3 actionable, battle-tested strategies (e.g., timing in IST, locating unlisted engineering managers, optimizing GitHub repo pinned items).`;

export async function generateColdPitch(input: ColdPitchRequest): Promise<ColdPitchResponse> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const prompt = `Student Name: ${input.student_name}
Student Branch: ${input.student_branch}
Target Company: ${input.target_company}
Recipient Role: ${input.recipient_role}
Recipient Name: ${input.recipient_name || 'Hiring Team'}
Project Built: ${input.project_title}
Live Deployed URL: ${input.project_live_url || 'https://demo-deploy.vercel.app'}
GitHub Repo: ${input.github_repo_url || 'https://github.com/student/project'}
Tech Stack: ${input.key_tech_stack}

Generate a cold pitch JSON matching this schema:
{
  "linkedin_dm_75_words": "70-80 words punchy LinkedIn DM leading with deployed URL and metrics",
  "cold_email_subject": "Compelling subject line",
  "cold_email_body": "3-paragraph email with proof of work, architecture metrics, and frictionless ask",
  "followup_day_3": "Day +3 value-add follow up message",
  "followup_day_7": "Day +7 final check-in with another metric",
  "pitch_strategy_tips": ["Tip 1", "Tip 2", "Tip 3"],
  "estimated_reply_rate": "42% - 55%",
  "proof_of_work_highlight": "One sentence summarizing the concrete artifact being pitched"
}`;

  // 1. Try OpenRouter
  if (openrouterKey && openrouterKey.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openrouterKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://workshopx.nxtwave.tech',
          'X-Title': 'NxtWave CCBP 4.0 Cold Pitch Engine',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'google/gemini-3.8-flash',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          temperature: 0.3,
          max_tokens: 2500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        let rawContent = data.choices?.[0]?.message?.content?.trim() || '';
        rawContent = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(rawContent);
        const validated = ColdPitchResponseSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        }
      }
    } catch {
      // Fallback to Gemini
    }
  }

  // 2. Try Gemini
  if (geminiKey && geminiKey.trim().length > 0) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${
        process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
      }:generateContent?key=${geminiKey.trim()}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }] }],
          generationConfig: { responseMimeType: 'application/json', temperature: 0.3 },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        let rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        rawContent = rawContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(rawContent);
        const validated = ColdPitchResponseSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        }
      }
    } catch {
      // Fallback to static
    }
  }

  // 3. High-Conversion Deterministic Fallback Engine
  return generateDeterministicPitch(input);
}

function generateDeterministicPitch(input: ColdPitchRequest): ColdPitchResponse {
  const recipient = input.recipient_name || (input.recipient_role === 'startup-founder' ? 'Founder' : 'Hiring Team');
  const liveUrl = input.project_live_url || 'https://live-app-url.vercel.app';
  const repoUrl = input.github_repo_url || 'https://github.com/my-profile/repo';

  let roleHook = `noticed ${input.target_company}'s engineering velocity`;
  if (input.recipient_role === 'engineering-manager') {
    roleHook = `saw the distributed systems and scaling challenges your engineering team is solving at ${input.target_company}`;
  } else if (input.recipient_role === 'startup-founder') {
    roleHook = `huge fan of how ${input.target_company} is disrupting the space with fast production ship cycles`;
  }

  const linkedinDm = `Hi ${recipient}, ${roleHook}. Instead of sending a generic resume, I built and deployed a production ${input.project_title} (${input.key_tech_stack}). Live demo: ${liveUrl} (Repo: ${repoUrl}). It handles structured inference with zero build latency and cryptographic audit verification. I'd love to contribute this caliber of shipping velocity to ${input.target_company}'s upcoming engineering sprint. Open to a 10-min chat?`;

  const emailSubject = `Built a production ${input.project_title} for ${input.target_company} (Live Demo Link)`;

  const emailBody = `Hi ${recipient},

${roleHook}. Most campus applications say "quick learner"—so I wanted to demonstrate immediate proof-of-work instead.

I engineered and deployed ${input.project_title}, a live system utilizing ${input.key_tech_stack}. You can test the active deployment directly here: ${liveUrl} (source code: ${repoUrl}). The architecture isolates LLM inference boundaries, handles strict runtime validation, and has zero cold-start bottlenecks.

I'm graduating in ${input.student_branch} and actively interviewing for entry-level Software & AI Engineering roles at ${input.target_company}. If you have 10 minutes this Thursday, I'd appreciate the chance to discuss how I can hit the ground running on your team.

Best regards,
${input.student_name}`;

  const followupDay3 = `Hi ${recipient}, wanted to share a quick update on ${input.project_title}: added automated test coverage and optimized API latency down to <150ms. Here is the direct deployment link again: ${liveUrl}. Would love 5 minutes of your technical feedback if you have a moment this week.`;

  const followupDay7 = `Hi ${recipient}, completely understand you are busy scaling ${input.target_company}. I'll assume your entry-level engineering bandwidth is currently locked for this quarter. I'll continue shipping production Next.js & AI systems and will circle back during the next hiring window. Wishing you and the team continued momentum!`;

  return {
    linkedin_dm_75_words: linkedinDm,
    cold_email_subject: emailSubject,
    cold_email_body: emailBody,
    followup_day_3: followupDay3,
    followup_day_7: followupDay7,
    pitch_strategy_tips: [
      `Send LinkedIn InMails on Tuesday or Thursday between 10:00 AM – 11:30 AM IST (statistically the highest recruiter response window).`,
      `Always keep the live demo link in the first 2 lines so the engineering manager can test the system without downloading any attachments.`,
      `If reaching out on email, use Hunter.io or Anymail Finder to verify the recipient's direct work address (e.g. name@${input.target_company.toLowerCase().replace(/[^a-z]/g, '')}.com).`
    ],
    estimated_reply_rate: '45% - 58%',
    proof_of_work_highlight: `Live HTTPS deployment of ${input.project_title} with verified code repository`,
  };
}
