import 'server-only';
import {
  MajorProjectResponseSchema,
  type MajorProjectRequest,
  type MajorProjectResponse,
} from '../validation/major-project-schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_FREE_TIER_MODELS } from '../ai/gemini-provider';

const CURATED_SYNOPSES: Record<string, Partial<MajorProjectResponse>> = {
  'CSE-AI': {
    project_title: 'Scalable LLM Orchestration Platform with Resilient Outbox Delivery',
    ieee_abstract:
      'In contemporary distributed computing paradigms, generative artificial intelligence APIs often suffer from erratic downstream latency, transient rate limit quotas, and lack of transaction safety. This paper presents the design and implementation of a fault-tolerant, high-throughput AI orchestration platform. By synthesizing the Transactional Outbox pattern with atomic database locks (SELECT FOR UPDATE SKIP LOCKED) and deterministic heuristic failover chains, the proposed architecture guarantees zero-downtime execution and sub-200ms user interaction response times. Experimental evaluation under concurrent load proves that the system maintains 100% notification delivery and eliminates duplicate payload processing, providing a production-grade blueprint for modern AI application engineering.',
    problem_statement:
      'Current microservice integrations with large language models rely on unbuffered HTTP request cycles, leading to connection timeouts, dropped student notifications, and prohibitive operational costs during traffic spikes.',
    existing_system_drawbacks: [
      'Synchronous external API blocking causing high request queuing latency.',
      'Absence of transactional idempotency leading to duplicate email transmissions.',
      'Heavy reliance on costly proprietary third-party workflow automation engines.',
    ],
    proposed_system_innovations: [
      'Asynchronous PostgreSQL outbox table decoupling client response from AI inference.',
      'Atomic database locks ensuring zero-collision multi-worker polling.',
      'Three-tier dynamic AI fallback (OpenRouter -> Gemini -> Heuristic) guaranteeing 100% uptime.',
    ],
    system_architecture_mermaid:
      'graph TD\n  Client[Browser UI] -->|REST/Next.js| App[Next.js App Server]\n  App -->|Atomic Lock| DB[(PostgreSQL Outbox)]\n  DB -->|SKIP LOCKED| Worker[Async Background Dispatcher]\n  Worker -->|Tier 1| OpenRouter[OpenRouter LLM Engine]\n  Worker -.->|Fallback| Gemini[Google Gemini Flash]\n  Worker -.->|Fallback| Matrix[Deterministic Heuristic Matrix]',
    hardware_software_requirements: {
      hardware: ['Intel Core i5 / AMD Ryzen 5 or higher', '8GB RAM minimum', 'High-speed broadband internet'],
      software: ['Node.js 20+ Runtime', 'Next.js 15 (App Router)', 'PostgreSQL / Supabase Database', 'TypeScript 5.7', 'OpenRouter / Gemini API'],
    },
    viva_defense_qa: [
      {
        question: 'What is the purpose of the Transactional Outbox pattern in your architecture?',
        answer: 'It decouples the state mutation (student registration) from external asynchronous side effects (email and LLM calls). This guarantees that network failures or API outages never corrupt database consistency.',
        examiner_focus: 'System Reliability and Distributed ACID Guarantees',
      },
      {
        question: 'How does your system prevent race conditions under concurrent seat registrations?',
        answer: 'We utilize atomic row-level database locking (SELECT FOR UPDATE) inside a dedicated PostgreSQL stored procedure, ensuring exactly 500 verified seats are allocated without overbooking.',
        examiner_focus: 'Concurrency Control and Database Locking Mechanics',
      },
    ],
  },
  'ECE-EMBEDDED': {
    project_title: 'Edge-Assisted IoT Sensor Telemetry with Intelligent Cloud Inference',
    ieee_abstract:
      'Industrial IoT sensor networks demand robust data aggregation and real-time anomaly detection under constrained bandwidth. This investigation designs an edge-to-cloud telemetry pipeline. Low-power microcontrollers stream sensor payloads to an event-driven edge gateway, which compresses metrics and orchestrates cloud-based AI anomaly classification with automated failovers. Results demonstrate a 60% bandwidth reduction and real-time failure prediction within 150ms.',
    problem_statement:
      'Industrial IoT telemetry streams suffer from network intermittency, packet losses, and excessive cloud inference costs when raw unfiltered metrics are transmitted continuously.',
    existing_system_drawbacks: [
      'Continuous streaming of redundant metrics draining network bandwidth.',
      'No local edge buffering during gateway network disconnects.',
      'Lack of automated failover between cloud inference providers.',
    ],
    proposed_system_innovations: [
      'Edge-level delta-compression transmitting only anomalous deviations.',
      'Resilient transactional buffer retaining readings until cloud synchronization occurs.',
      'Multi-tier AI triage prioritizing mission-critical safety alerts.',
    ],
    system_architecture_mermaid:
      'graph TD\n  Sensors[IoT Sensors] -->|SPI/I2C| Edge[Microcontroller Edge]\n  Edge -->|MQTT/WebSocket| Gateway[Next.js Gateway]\n  Gateway --> DB[(Telemetry Store)]\n  Gateway --> AI[OpenRouter Anomaly Detector]',
    hardware_software_requirements: {
      hardware: ['ESP32 / Raspberry Pi Pico microcontroller', 'Analog/Digital Sensor Array', 'Host Workstation'],
      software: ['Embedded C++ / FreeRTOS', 'Next.js & Supabase Gateway', 'OpenRouter API', 'Mosquitto MQTT Broker'],
    },
    viva_defense_qa: [
      {
        question: 'How do you handle edge node power constraints during frequent AI inferences?',
        answer: 'Inference is offloaded to an asynchronous cloud pipeline; the edge node only executes lightweight threshold delta calculations, reducing active duty cycle by 78%.',
        examiner_focus: 'Embedded Power Optimization & Edge-Cloud Tradeoffs',
      },
      {
        question: 'What happens when internet connectivity is lost at the edge gateway?',
        answer: 'Readings are stored in local flash ring-buffers and synchronized atomically upon network restoration via idempotency keys.',
        examiner_focus: 'Fault Tolerance in Constrained Environments',
      },
    ],
  },
};

export function runHeuristicSynopsis(
  branch: string = 'CSE',
  domain: string = 'AI',
  customTitle?: string
): MajorProjectResponse {
  const key = `${branch}-${domain}`;
  const base = CURATED_SYNOPSES[key] || CURATED_SYNOPSES['CSE-AI']!;

  return {
    project_title: customTitle || base.project_title || 'Intelligent Production AI Application Engine',
    branch,
    domain,
    ieee_abstract: base.ieee_abstract!,
    problem_statement: base.problem_statement!,
    existing_system_drawbacks: base.existing_system_drawbacks!,
    proposed_system_innovations: base.proposed_system_innovations!,
    system_architecture_mermaid: base.system_architecture_mermaid!,
    hardware_software_requirements: base.hardware_software_requirements!,
    viva_defense_qa: base.viva_defense_qa as Array<{ question: string; answer: string; examiner_focus: string }>,
    source: 'heuristic',
  };
}

export async function generateMajorProjectSynopsis(
  params: MajorProjectRequest
): Promise<MajorProjectResponse> {
  const { branch, domain, project_title, team_size } = params;

  const prompt = `You are a Department Head, Senior University Project Guide, and IEEE Fellow evaluating final-year Indian engineering projects (${branch} branch, ${domain} domain).
Generate a publication-grade, formal IEEE-standard Major Project Synopsis and Viva Defense document for university semester 7/8 submission based on the live full-stack AI system built in the workshop.

Input context:
Engineering Discipline: ${branch}
Core Domain Focus: ${domain}
Project Team Size: ${team_size} members
Optional Title Hint: ${project_title || 'None provided'}

HIGH-QUALITY & DETAIL SPECIFICATIONS:
1. Return strictly valid JSON adhering to the schema below without Markdown wrappers.
2. "project_title": Formal academic project title (7-14 words) reflecting production-grade algorithmic and full-stack rigor.
3. "ieee_abstract": Comprehensive IEEE standard abstract (150-240 words) covering problem motivation, system design methodology, experimental setup, and quantitative evaluation (e.g. latency, throughput, accuracy).
4. "problem_statement": Clear 3-4 sentence mathematical and computational formulation of the engineering challenge.
5. "existing_system_drawbacks": Array of 3-4 specific technical flaws in legacy/monolithic implementations (e.g. O(N^2) bottlenecks, single point of failure, unbuffered memory spikes).
6. "proposed_system_innovations": Array of 3-4 architectural innovations built during the workshop (e.g. streaming LLM inference, edge caching, atomic database locks, verifiable cryptographic credentials).
7. "system_architecture_mermaid": Valid syntax string for a multi-tier Mermaid flowchart (e.g. "graph TD\\n  Client[Next.js Client] --> Gateway[API Gateway]\\n  Gateway --> Worker[Edge Worker]\\n  Worker --> LLM[OpenRouter Inference]\\n  Worker --> DB[(Supabase PostgreSQL)]").
8. "hardware_software_requirements": Object with keys { hardware: string[], software: string[] } detailing precise minimum and recommended production specifications.
9. "viva_defense_qa": Array of 3 in-depth objects { question, answer, examiner_focus } covering real challenging questions external university examiners ask during viva defenses.

Schema structure:
{
  "project_title": "string",
  "ieee_abstract": "string",
  "problem_statement": "string",
  "existing_system_drawbacks": ["Drawback 1", "Drawback 2", "Drawback 3"],
  "proposed_system_innovations": ["Innovation 1", "Innovation 2", "Innovation 3"],
  "system_architecture_mermaid": "graph TD\\n  A[Client] --> B[Server]",
  "hardware_software_requirements": {
    "hardware": ["Intel Core i5 / Apple Silicon", "16GB RAM recommended", "High-speed broadband"],
    "software": ["Node.js 20+ LTS", "Next.js 16 (App Router)", "TypeScript 5+", "Supabase PostgreSQL", "OpenRouter AI"]
  },
  "viva_defense_qa": [
    {
      "question": "Question text",
      "answer": "Answer text",
      "examiner_focus": "Evaluation focus area"
    }
  ]
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
          'X-Title': 'FirstBuild Major Project Synopsis',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'google/gemini-3.8-flash',
          messages: [
            {
              role: 'system',
              content:
                'You are an IEEE Fellow and Senior University Project Guide. Return strictly valid JSON adhering to the specified schema with deep academic rigor and technical depth.',
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 3000,
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

          const validated = MajorProjectResponseSchema.parse({
            ...parsed,
            branch,
            domain,
            source: 'openrouter',
          });

          return validated;
        }
      }
    } catch (err) {
      console.warn('[Synopsis Generator] OpenRouter call failed, trying Gemini:', err);
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

          return MajorProjectResponseSchema.parse({
            ...parsed,
            branch,
            domain,
            source: 'gemini',
          });
        } catch (mErr) {
          console.warn(`[Synopsis Generator] Gemini model ${modelName} failed:`, mErr);
        }
      }
    } catch (gErr) {
      console.warn('[Synopsis Generator] Gemini fallback failed, using heuristic:', gErr);
    }
  }

  // 3. Tier 3: Deterministic Curated Synopsis Fallback
  return runHeuristicSynopsis(branch, domain, project_title);
}
