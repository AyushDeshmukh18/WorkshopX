import 'server-only';
import {
  type ReadmeGeneratorRequest,
  type ReadmeGeneratorResponse,
  ReadmeGeneratorResponseSchema,
} from '../validation/readme-schema';

const SYSTEM_PROMPT = `You are a Principal Staff Software Engineer and Open-Source Technical Lead at top-tier developer platforms.
Your task is to generate an exhaustive, FAANG-caliber GitHub README.md for an engineering student's project repository.

HIGH-QUALITY & DETAIL SPECIFICATIONS:
1. Return strictly valid JSON adhering to the schema without Markdown code fences or extra text.
2. The "markdown_content" must be a complete, beautifully structured, enterprise-grade README document containing:
   - Centered or bold Project Title & High-impact tagline
   - Curated Shields.io SVG Badges (Next.js 16, TypeScript, OpenRouter AI, Supabase, Tailwind, MIT License, Vercel Production)
   - Comprehensive "System Architecture" section embedding the Mermaid graph TD diagram
   - "Core Engineering Capabilities" bulleted breakdown
   - "Technical Architecture & Tech Stack" table mapping each tool to its architectural purpose
   - "Getting Started" guide with prerequisites, step-by-step terminal commands (git clone, npm install, .env.example setup, npm run dev)
   - "API Specification & Inference Contracts" detailing request/response payloads
   - "Security & Tamper-Proof Verification" section explaining credential generation
   - "Production Deployment" guide for Vercel and edge infrastructure
   - "License" (MIT) and contributor guidelines
3. "mermaid_diagram": Valid, detailed Mermaid syntax (e.g. \`\`\`mermaid\\ngraph TD\\n  Client[Next.js 16 App] --> Route[App Router / Server Action]\\n  Route --> Auth[(Supabase Auth / RLS)]\\n  Route --> LLM[OpenRouter Inference]\\n  Route --> Ledger[(Encrypted Postgres)]\\n\`\`\`).
4. "badges": Array of 4-6 markdown badge image links.
5. "key_highlights": Exactly 3 compelling, data-backed reasons why this documentation immediately converts recruiters and engineering managers.`;

export async function generateReadme(input: ReadmeGeneratorRequest): Promise<ReadmeGeneratorResponse> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const prompt = `Project Title: ${input.project_title}
Tagline: ${input.project_tagline}
Engineering Domain: ${input.domain}
Core Features: ${input.core_features}
Tech Stack: ${input.tech_stack}
Demo URL: ${input.demo_url || 'https://demo.vercel.app'}
GitHub Repo URL: ${input.github_repo_url || 'https://github.com/student/repo'}

Generate a publication-grade GitHub README.md JSON response conforming to:
{
  "markdown_content": "Complete, comprehensive, highly detailed README.md markdown text",
  "mermaid_diagram": "graph TD\\n  Client[Next.js Client] --> API[Route Handler]\\n  API --> LLM[OpenRouter Inference]\\n  API --> DB[Supabase Ledger]",
  "badges": ["![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)", "![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)"],
  "key_highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
}`;

  // 1. Try OpenRouter
  if (openrouterKey && openrouterKey.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9500);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openrouterKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://workshopx.nxtwave.tech',
          'X-Title': 'NxtWave CCBP 4.0 README Generator',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'google/gemini-3.8-flash',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 3500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        let raw = data.choices?.[0]?.message?.content?.trim() || '';
        raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(raw);
        const validated = ReadmeGeneratorResponseSchema.safeParse(parsed);
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
          generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        let raw = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        const parsed = JSON.parse(raw);
        const validated = ReadmeGeneratorResponseSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        }
      }
    } catch {
      // Fallback to deterministic
    }
  }

  // 3. Deterministic High-Fidelity Fallback
  return generateDeterministicReadme(input);
}

function generateDeterministicReadme(input: ReadmeGeneratorRequest): ReadmeGeneratorResponse {
  const liveUrl = input.demo_url || 'https://demo-deploy.vercel.app';
  const repoUrl = input.github_repo_url || 'https://github.com/student/my-project';

  const mermaid = `graph TD
  User((Client Browser)) -->|HTTPS / WSS| Edge[Next.js 16 Edge / Server Actions]
  Edge -->|Strict Zod Validation| Guard[Prompt Sanitizer & Guardrails]
  Guard -->|Inference Call| LLM[OpenRouter / Gemini API Engine]
  Edge -->|State & Sessions| DB[(Supabase PostgreSQL Ledger)]
  LLM -->|Structured JSON Output| Edge
  Edge -->|Optimistic UI Update| User`;

  const badges = [
    `![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js&logoColor=white)`,
    `![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)`,
    `![OpenRouter](https://img.shields.io/badge/OpenRouter-AI%20Inference-7c3aed?style=for-the-badge)`,
    `![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)`,
  ];

  const markdown = `# ${input.project_title}

> ${input.project_tagline}

${badges.join(' ')}

[🚀 Live Public Demo](${liveUrl}) &bull; [📂 GitHub Repository](${repoUrl}) &bull; [📜 Documentation](#system-architecture)

---

## 📌 Problem & Motivation
In production engineering environments, standard prototypes lack runtime schema validation, observability, and robust LLM prompt guardrails. **${input.project_title}** solves this by engineering a verified, zero-latency pipeline built with modern industry standards.

---

## 🏗️ System Architecture

\`\`\`mermaid
${mermaid}
\`\`\`

### Architectural Principles:
1. **Isolated Inference Boundaries**: LLM interactions are decoupled behind server-side actions, eliminating client token leakage.
2. **Strict Schema Contracts**: All responses adhere to deterministic Zod schema validation.
3. **Resilient Fallback Chains**: Multi-tier fallback guarantees 99.9% uptime during third-party provider latency spikes.

---

## ✨ Core Features
${input.core_features
  .split('\n')
  .filter((f) => f.trim().length > 0)
  .map((f) => `- **${f.trim()}**`)
  .join('\n')}

---

## 🛠️ Tech Stack & Engineering Specifications

| Layer | Technologies Selected | Justification |
| :--- | :--- | :--- |
| **Frontend & SSR** | Next.js 16 (App Router), React 19, TailwindCSS | High-performance server rendering & instantaneous hydration |
| **Inference Orchestration** | OpenRouter REST API, Gemini 2.5 Flash | Cost-effective token throughput & fast TTFT (<300ms) |
| **Data Layer & Ledger** | Supabase (PostgreSQL), Edge Storage | Cryptographic audit logging with row-level security (RLS) |
| **Validation & Testing** | Zod 3.x, Vitest Unit Suite | Type-safe runtime boundary enforcement |

---

## 🚀 Quickstart & Local Installation

### Prerequisites
- Node.js \`>= 20.x\`
- npm \`>= 10.x\` or pnpm

### 1. Clone the repository
\`\`\`bash
git clone ${repoUrl}.git
cd ${input.project_title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup environment variables
Create a \`.env.local\` file in the root directory:
\`\`\`env
OPENROUTER_API_KEY=your_api_key_here
GEMINI_API_KEY=your_gemini_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Run development server
\`\`\`bash
npm run dev
\`\`\`
Visit [http://localhost:3000](http://localhost:3000) to view the live local application.

---

## 🧪 Automated Testing
\`\`\`bash
# Run unit test suite
npm run test

# Run production build validation
npm run build
\`\`\`

---

## 📄 License
Distributed under the **MIT License**. See \`LICENSE\` for more details.

---

*Engineered with NxtWave CCBP 4.0 Industry Standards.*
`;

  return {
    markdown_content: markdown,
    mermaid_diagram: mermaid,
    badges,
    key_highlights: [
      `FAANG-grade Mermaid diagram immediately catches recruiter eyes and demonstrates system design thinking.`,
      `Includes production setup instructions, environment variables template, and testing commands.`,
      `Shields.io badges and architectural justification table elevate project credibility above 99% of academic repos.`
    ],
  };
}
