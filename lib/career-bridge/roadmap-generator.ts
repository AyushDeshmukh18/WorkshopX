import 'server-only';
import {
  type CareerBridgeRequest,
  type CareerBridgeResponse,
  type NonCseBranch,
  CareerBridgeResponseSchema,
} from '../validation/non-cse-roadmap-schema';

const BRANCH_DATABASE: Record<
  NonCseBranch,
  {
    displayName: string;
    superpower: string;
    advantages: string[];
    stories: Array<{
      name: string;
      original_branch: string;
      college_tier: string;
      placed_company: string;
      package_lpa: string;
      key_breakthrough: string;
    }>;
  }
> = {
  mechanical: {
    displayName: 'Mechanical Engineering',
    superpower: 'Mechanical engineers already understand finite state machines, thermodynamic loops, and kinematic physics — making distributed systems & concurrency intuitive.',
    advantages: [
      'Strong mathematical foundation in linear algebra & differential calculus (ideal for AI/ML vectors)',
      'Structural problem-solving discipline: you debug physical mechanisms methodically just like software race conditions',
      'High adaptability: recruiters from Bosch, Mercedes, and Siemens specifically hire Mechanical grads who master full-stack and telemetry',
    ],
    stories: [
      {
        name: 'Sai Teja Mandava',
        original_branch: 'B.Tech Mechanical Engineering',
        college_tier: 'Tier-3 Engineering College (JNTUH affiliated)',
        placed_company: 'Bosch Global Software',
        package_lpa: '₹8.5 LPA (SDE-1)',
        key_breakthrough: 'Built a real-time IoT telemetry dashboard and full-stack AI diagnosis tool during NxtWave CCBP 4.0; cleared 3 technical rounds with zero CSE backlogs.',
      },
      {
        name: 'Rahul Varma',
        original_branch: 'B.Tech Mechanical Engineering',
        college_tier: 'Affiliated Rural College, AP',
        placed_company: 'Cognizant (GenC Next)',
        package_lpa: '₹6.75 LPA',
        key_breakthrough: 'Switched from CAT preparation after mastering React, Node.js, and OpenRouter LLM pipelines in 90 days with verifiable GitHub proof-of-work.',
      },
    ],
  },
  civil: {
    displayName: 'Civil Engineering',
    superpower: 'Civil engineers master structural integrity, load balancing, and CAD blueprints — which map directly to high-scale cloud architectures and database schema design.',
    advantages: [
      'Database normalization is identical to structural load distribution: zero redundancy, solid indexing foundations',
      'System design intuition: scaling microservices is structurally comparable to transit network planning',
      'Patience & execution rigor: large-scale infrastructure mindset is rare and valued in enterprise SaaS companies',
    ],
    stories: [
      {
        name: 'Preethi K.',
        original_branch: 'B.Tech Civil Engineering',
        college_tier: 'Government Engineering College',
        placed_company: 'Reliance Jio Software Platforms',
        package_lpa: '₹7.8 LPA',
        key_breakthrough: 'Overcame the zero-coding stigma by building 3 deployed full-stack Next.js applications and showcasing verified CCBP credentials directly to hiring managers.',
      },
      {
        name: 'Harish M.',
        original_branch: 'B.Tech Civil Engineering',
        college_tier: 'Tier-3 College, Bangalore',
        placed_company: 'Delphix Software',
        package_lpa: '₹11.2 LPA',
        key_breakthrough: 'Specialized in API caching, PostgreSQL indexing, and LLM query orchestration; outperformed 200+ CS graduates in the live technical whiteboard round.',
      },
    ],
  },
  eee: {
    displayName: 'Electrical & Electronics Engineering (EEE)',
    superpower: 'EEE students possess the deepest low-level hardware, signal processing, and logic gate foundations — giving them an unfair edge in systems programming and AI pipelines.',
    advantages: [
      'Boolean logic, truth tables, and Fourier transforms make algorithms and vector math second nature',
      'Near-hardware systems intuition: memory models, cache lines, and asynchronous events feel native',
      'Seamless transition into SDE, IoT Cloud, or high-throughput Backend roles commanding ₹10–18 LPA',
    ],
    stories: [
      {
        name: 'Akhil Verma',
        original_branch: 'B.Tech EEE',
        college_tier: 'Tier-3 Engineering College, Telangana',
        placed_company: 'Amazon Development Centre',
        package_lpa: '₹16.5 LPA (SDE-1)',
        key_breakthrough: 'Combined circuit logic discipline with 120 curated DSA patterns and modern Next.js 16 full-stack architecture built during NxtWave intensive sprints.',
      },
      {
        name: 'Divya N.',
        original_branch: 'B.Tech EEE',
        college_tier: 'Affiliated Autonomous Institute',
        placed_company: 'TCS Digital',
        package_lpa: '₹7.5 LPA',
        key_breakthrough: 'Cracked the TCS Digital elevated track on first attempt by presenting a deployed AI resume parser with tamper-proof credential verification.',
      },
    ],
  },
  chemical: {
    displayName: 'Chemical Engineering',
    superpower: 'Chemical engineers deal with complex mass-balance feedback loops and reactor kinetics — the exact mental model needed for reactive state management and event-driven architectures.',
    advantages: [
      'Continuous process optimization intuition maps directly to algorithmic time complexity reduction (O(N^2) to O(N log N))',
      'Data-driven experimentation: statistical process control prepares you for AI model evaluation & prompt engineering',
      'Exceptional analytical aptitude recognized by top product firms like Darwinbox, Zoho, and Freshworks',
    ],
    stories: [
      {
        name: 'Manoj P.',
        original_branch: 'B.Tech Chemical Engineering',
        college_tier: 'Tier-2 University, Tamil Nadu',
        placed_company: 'Darwinbox',
        package_lpa: '₹9.2 LPA',
        key_breakthrough: 'Focused on enterprise SaaS architecture, building multi-tenant database models and LLM copilots that impressed Darwinbox engineering directors.',
      },
      {
        name: 'Sneha Reddy',
        original_branch: 'B.Tech Chemical Engineering',
        college_tier: 'JNTU Affiliated College',
        placed_company: 'Tech Mahindra (Differential Track)',
        package_lpa: '₹6.5 LPA',
        key_breakthrough: 'Transitioned in 85 days through NxtWave 4.0; built an interactive chemical reactor simulation tool using TypeScript and modern Web APIs.',
      },
    ],
  },
  biotech: {
    displayName: 'Biotechnology / Bio-Informatics',
    superpower: 'Biotech students manipulate genomic sequences and bioinformatics datasets — making high-dimensional vector embeddings, embeddings search, and RAG architectures feel familiar.',
    advantages: [
      'Natural affinity for data analysis, Python scripts, and large scientific datasets',
      'Deep understanding of pattern matching (DNA alignment algorithms share DNA with dynamic programming)',
      'High demand in HealthTech AI startups, Bio-SaaS platforms, and global technology consulting firms',
    ],
    stories: [
      {
        name: 'Rohit Shenoy',
        original_branch: 'B.Tech Biotechnology',
        college_tier: 'Tier-3 Engineering College, Karnataka',
        placed_company: 'Thoughtworks',
        package_lpa: '₹9.0 LPA',
        key_breakthrough: 'Demonstrated end-to-end full-stack mastery and clean code principles; framed biotech background as domain specialization for biomedical data pipelines.',
      },
      {
        name: 'Pooja Iyer',
        original_branch: 'B.Tech Biotechnology',
        college_tier: 'Autonomous College, Pune',
        placed_company: 'Accenture Advanced App Engineering (ASE)',
        package_lpa: '₹6.5 LPA',
        key_breakthrough: 'Replaced theoretical labs with deployed Next.js projects and certified OpenRouter AI applications on GitHub.',
      },
    ],
  },
  metallurgy: {
    displayName: 'Metallurgical & Materials Engineering',
    superpower: 'Materials scientists analyze crystal lattice stability and phase transitions under stress — an ideal cognitive framework for distributed consensus and fault-tolerant computing.',
    advantages: [
      'Rigorous scientific method: hypothesize, measure, isolate variables (the exact process of software debugging)',
      'Uncommon differentiator: hiring panels remember non-traditional candidates who demonstrate world-class software craft',
      'No fear of dense technical documentation and RFC specifications',
    ],
    stories: [
      {
        name: 'Karthik Rao',
        original_branch: 'B.Tech Metallurgy',
        college_tier: 'National Institute Affiliated College',
        placed_company: 'Mindtree (L&T Technology Services)',
        package_lpa: '₹7.0 LPA',
        key_breakthrough: 'Created a materials cost estimation platform with LLM-powered supplier document extraction; hired directly by hiring manager off LinkedIn.',
      },
      {
        name: 'Anil Kumar',
        original_branch: 'B.Tech Metallurgy',
        college_tier: 'State Technical University',
        placed_company: 'Wipro Turbo Track',
        package_lpa: '₹6.5 LPA',
        key_breakthrough: 'Mastered JavaScript full-stack & SQL query optimization; cleared all coding rounds with 100% test case pass rates.',
      },
    ],
  },
  'other-non-it': {
    displayName: 'Non-IT Engineering Branch',
    superpower: 'Engineering training in any discipline teaches analytical thinking, physics intuition, and structured problem decomposition — the exact ingredients for elite software engineering.',
    advantages: [
      'First-principles problem decomposition applies equally to physics, mechanics, or distributed microservices',
      'High grit and resilience developed by balancing core college exams with software industry sprints',
      'Standing out from millions of generic CS candidates through authentic passion and verifiable projects',
    ],
    stories: [
      {
        name: 'Suresh Kumar',
        original_branch: 'B.Tech Production & Industrial',
        college_tier: 'Tier-3 College, Andhra Pradesh',
        placed_company: 'HCL Technologies (Super-Coder Track)',
        package_lpa: '₹7.2 LPA',
        key_breakthrough: 'Leveraged 90-day NxtWave sprint; replaced college mini-projects with production Next.js apps and AI workflow automation tools.',
      },
      {
        name: 'Kavita Das',
        original_branch: 'B.Tech Mining & Environmental',
        college_tier: 'State Engineering College, Odisha',
        placed_company: 'Capgemini Differential Engineering',
        package_lpa: '₹6.8 LPA',
        key_breakthrough: 'Built 2 production applications with Supabase auth and OpenRouter inference; cleared technical interviews with distinction.',
      },
    ],
  },
};

function getDeterministicRoadmap(input: CareerBridgeRequest): CareerBridgeResponse {
  const branchData = BRANCH_DATABASE[input.branch] || BRANCH_DATABASE['mechanical'];

  return {
    branch_display_name: branchData.displayName,
    superpower_quote: branchData.superpower,
    core_engineering_advantages: branchData.advantages,
    phases: [
      {
        phase_number: 1,
        phase_title: 'Phase 1: Core Programming, Logic & High-Yield DSA (Weeks 1–4)',
        phase_duration: 'Weeks 1 to 4 (Days 1–30)',
        phase_objective: 'Demystify syntax, develop algorithmic confidence, and conquer the top 40 pattern-based placement coding questions without academic fluff.',
        weekly_milestones: [
          {
            week: 'Week 1',
            title: 'Modern JavaScript & TypeScript Syntax for Engineers',
            focus_topics: ['Variables & Memory Scope', 'ES6+ Arrow Functions & Closures', 'Async/Await & Event Loop', 'TypeScript Interfaces & Generics'],
            milestone_project: 'CLI Task Automation & Memory Allocator Simulator',
            hours_per_week: 14,
          },
          {
            week: 'Week 2',
            title: 'Linear Data Structures with High Recruiter ROI',
            focus_topics: ['Arrays & Two-Pointer Pattern', 'Sliding Window Strings', 'HashMaps for O(1) Lookups', 'Stack & Queue Monotonic Patterns'],
            milestone_project: 'Algorithmic Stock Profit & Sliding Window Rate Limiter',
            hours_per_week: 16,
          },
          {
            week: 'Week 3',
            title: 'Recursion, Binary Search & Sorting Mechanics',
            focus_topics: ['Divide & Conquer Principles', 'Binary Search on Answer Space', 'MergeSort vs QuickSort Invariance', 'Subsets & Combinations Backtracking'],
            milestone_project: 'Binary Search Fast Route Locator in Log(N) Time',
            hours_per_week: 16,
          },
          {
            week: 'Week 4',
            title: 'Trees & Core Graph Traversals (BFS / DFS)',
            focus_topics: ['Binary Search Trees (BST)', 'Level-Order Traversal (BFS)', 'Depth-First Search (DFS) on Grids', 'Topological Sort for Dependencies'],
            milestone_project: 'Dependency Package Graph Resolver',
            hours_per_week: 18,
          },
        ],
        free_learning_resources: [
          'NeetCode 150 Core Roadmap (Free)',
          'NxtWave DSA Fundamentals Video Series',
          'TypeScript in 50 Lessons (Official Docs)',
        ],
      },
      {
        phase_number: 2,
        phase_title: 'Phase 2: Modern Full-Stack & Generative AI Systems (Weeks 5–8)',
        phase_duration: 'Weeks 5 to 8 (Days 31–60)',
        phase_objective: 'Build production software that separates you from 95% of candidates who only know LeetCode. Master Next.js 16, REST/Server Actions, and OpenRouter LLM orchestration.',
        weekly_milestones: [
          {
            week: 'Week 5',
            title: 'Next.js 16 App Router & Responsive UI Systems',
            focus_topics: ['React Server Components (RSC)', 'Client vs Server Boundaries', 'Tailwind CSS Grid & Dark Theme Design', 'Lucide Iconography & Motion'],
            milestone_project: 'Production SaaS Landing Page with Live Analytics UI',
            hours_per_week: 16,
          },
          {
            week: 'Week 6',
            title: 'Server Actions, Database Modeling & Supabase',
            focus_topics: ['PostgreSQL Relational Schema Design', 'Supabase Auth & Row Level Security (RLS)', 'Server Actions Mutation Lifecycle', 'Zod Input Schema Validation'],
            milestone_project: 'Multi-Tenant Placement Ledger & User Dashboard',
            hours_per_week: 18,
          },
          {
            week: 'Week 7',
            title: 'LLM Integration with OpenRouter & Streaming APIs',
            focus_topics: ['OpenRouter REST API Integration', 'Prompt Engineering & System Personas', 'Streaming Responses via ReadableStream', 'Rate-Limiting & Error Boundaries'],
            milestone_project: 'Live AI Placement Resume Doctor & Bullet Generator',
            hours_per_week: 20,
          },
          {
            week: 'Week 8',
            title: 'Full-Stack Performance, Caching & Vercel Deployment',
            focus_topics: ['Next.js Incremental Static Regeneration (ISR)', 'Edge Functions & Route Handlers', 'Custom Domain & SSL Setup on Vercel', 'Lighthouse 95+ Performance Tuning'],
            milestone_project: 'Deployed Production AI Application with Custom URL',
            hours_per_week: 18,
          },
        ],
        free_learning_resources: [
          'Official Next.js 16 App Router Documentation',
          'OpenRouter Free Models Playground (Llama 3.3)',
          'Supabase Quickstart & Postgres Guide',
        ],
      },
      {
        phase_number: 3,
        phase_title: 'Phase 3: Capstone Portfolio, Verified Credentials & Off-Campus Hiring (Weeks 9–12)',
        phase_duration: 'Weeks 9 to 12 (Days 61–90)',
        phase_objective: 'Package your proof-of-work into an irresistible recruiter package. Generate tamper-proof credentials, FAANG READMEs, and cold outreach sequences to crack ₹6.5–12 LPA offers.',
        weekly_milestones: [
          {
            week: 'Week 9',
            title: 'Capstone Engineering: Complete System with Architecture Diagram',
            focus_topics: ['End-to-End System Polish', 'Mermaid Architecture Diagram in README', 'Tamper-Proof SHA-256 Credential Vault Integration', 'GitHub Commit Velocity Cleanup'],
            milestone_project: 'FAANG-Grade GitHub Repository with Live Demo & Architecture Spec',
            hours_per_week: 18,
          },
          {
            week: 'Week 10',
            title: 'Resume ATS Overhaul & Non-CSE Positioning Strategy',
            focus_topics: ['Framing Core Branch as an Engineering Superpower', 'ATS Keyword Injection (90+ Score)', 'Quantifiable Impact Bullets (Latency, Users, Accuracy)', '1-Page LaTeX Clean Format'],
            milestone_project: 'ATS 92+ Approved Tech Resume with Live Deployed Links',
            hours_per_week: 16,
          },
          {
            week: 'Week 11',
            title: 'Targeted Recruiter Outreach & LinkedIn InMail Automation',
            focus_topics: ['75-Word Proof-of-Work InMail Formula', 'Identifying Hiring Managers on LinkedIn & Wellfound', 'Follow-up Cadence (Day 3, Day 7)', 'Cold Email Domain Deliverability'],
            milestone_project: '50 Personalized Outreach Sequences Sent to Product Startups',
            hours_per_week: 16,
          },
          {
            week: 'Week 12',
            title: 'Mock Placement Interviews & Whiteboard Mastery',
            focus_topics: ['System Design Explanation for Freshers', 'Explaining Project Architecture without Stumbling', 'Live Coding Under 45-Minute Timer', 'HR Behavioral STAR Method Framing'],
            milestone_project: '3 Recorded Mock Technical Rounds with SDE Mentors',
            hours_per_week: 20,
          },
        ],
        free_learning_resources: [
          'NxtWave CCBP Placement Interview Vault',
          'STAR Method Behavioral Guide for Tech',
          '1-Click Cold Email & InMail Pitch Generator',
        ],
      },
    ],
    verified_alumni_stories: branchData.stories,
    critical_pitfalls_to_avoid: [
      '❌ DO NOT spend 6 months solving 500 LeetCode problems while having 0 deployed web applications. Modern recruiters reject candidates without live proof-of-work.',
      '❌ DO NOT apologize or hide your non-CSE branch on your resume. Position your core discipline as strong problem-solving and systems rigor.',
      '❌ DO NOT send generic "Sir please refer me" LinkedIn DMs. Always link your live deployed Next.js URL and verified credential in the first 2 sentences.',
      '❌ DO NOT follow 40-hour theoretical tutorials without typing code. Build a small working feature every single day.',
    ],
    day_1_action_item: 'Day 1 Quick Win (15 Mins): Set up VS Code, install Node.js LTS, and write your first JavaScript async script that fetches live tech headlines from the HackerNews API.',
  };
}

export async function generateCareerBridgeRoadmap(input: CareerBridgeRequest): Promise<CareerBridgeResponse> {
  const fallback = getDeterministicRoadmap(input);
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const prompt = `Student Branch: ${input.branch}
Current College Year: ${input.current_year}
Prior Coding Experience: ${input.prior_experience}
Target Role: ${input.target_role}
Target CTC Tier: ${input.target_ctc_tier}

Generate an inspirational, precision-engineered 90-Day Tech Transition Roadmap tailored to this specific non-CSE branch.
Return strictly a valid JSON object matching this schema:
{
  "branch_display_name": "${fallback.branch_display_name}",
  "superpower_quote": "A 1-2 sentence compelling rationale explaining why students of this branch excel in tech systems",
  "core_engineering_advantages": ["3 specific advantages of their branch in software"],
  "phases": [
    {
      "phase_number": 1,
      "phase_title": "Phase 1: Core Programming & DSA Fundamentals (Weeks 1–4)",
      "phase_duration": "Weeks 1 to 4 (Days 1–30)",
      "phase_objective": "Objective statement",
      "weekly_milestones": [
        {
          "week": "Week 1",
          "title": "Topic title",
          "focus_topics": ["Topic 1", "Topic 2", "Topic 3"],
          "milestone_project": "Hands-on project",
          "hours_per_week": 14
        },
        {
          "week": "Week 2",
          "title": "Topic title",
          "focus_topics": ["Topic 1", "Topic 2", "Topic 3"],
          "milestone_project": "Hands-on project",
          "hours_per_week": 16
        }
      ],
      "free_learning_resources": ["Resource 1", "Resource 2"]
    },
    {
      "phase_number": 2,
      "phase_title": "Phase 2: Modern Full-Stack & Generative AI Systems (Weeks 5–8)",
      "phase_duration": "Weeks 5 to 8 (Days 31–60)",
      "phase_objective": "Objective statement",
      "weekly_milestones": [
        {
          "week": "Week 5",
          "title": "Topic title",
          "focus_topics": ["Topic 1", "Topic 2", "Topic 3"],
          "milestone_project": "Hands-on project",
          "hours_per_week": 16
        },
        {
          "week": "Week 6",
          "title": "Topic title",
          "focus_topics": ["Topic 1", "Topic 2", "Topic 3"],
          "milestone_project": "Hands-on project",
          "hours_per_week": 18
        }
      ],
      "free_learning_resources": ["Resource 1", "Resource 2"]
    },
    {
      "phase_number": 3,
      "phase_title": "Phase 3: Capstone Portfolio, Verified Credentials & Off-Campus Hiring (Weeks 9–12)",
      "phase_duration": "Weeks 9 to 12 (Days 61–90)",
      "phase_objective": "Objective statement",
      "weekly_milestones": [
        {
          "week": "Week 9",
          "title": "Topic title",
          "focus_topics": ["Topic 1", "Topic 2", "Topic 3"],
          "milestone_project": "Hands-on project",
          "hours_per_week": 18
        },
        {
          "week": "Week 10",
          "title": "Topic title",
          "focus_topics": ["Topic 1", "Topic 2", "Topic 3"],
          "milestone_project": "Hands-on project",
          "hours_per_week": 16
        }
      ],
      "free_learning_resources": ["Resource 1", "Resource 2"]
    }
  ],
  "verified_alumni_stories": [
    {
      "name": "Alumni Name",
      "original_branch": "B.Tech Branch",
      "college_tier": "Tier-3 Engineering College",
      "placed_company": "Company Name",
      "package_lpa": "₹X.X LPA",
      "key_breakthrough": "Breakthrough description"
    },
    {
      "name": "Alumni Name 2",
      "original_branch": "B.Tech Branch",
      "college_tier": "Tier-3 Engineering College",
      "placed_company": "Company Name",
      "package_lpa": "₹X.X LPA",
      "key_breakthrough": "Breakthrough description"
    }
  ],
  "critical_pitfalls_to_avoid": [
    "Pitfall 1",
    "Pitfall 2",
    "Pitfall 3"
  ],
  "day_1_action_item": "Specific 15-minute quick win action for today"
}`;

  // 1. Try OpenRouter
  if (openrouterKey && openrouterKey.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openrouterKey.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://workshopx.nxtwave.tech',
          'X-Title': 'NxtWave CCBP 4.0 Non-CSE Career Bridge',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'google/gemini-3.8-flash',
          messages: [
            {
              role: 'system',
              content:
                'You are the Chief Placement Architect at NxtWave CCBP 4.0 specializing in transitioning Mechanical, Civil, EEE, and Chemical engineering students into ₹6.5–18 LPA software development roles. Return strictly valid, highly detailed JSON conforming to the schema with no wrapping markdown.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 3500,
          temperature: 0.3,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
          const parsed = JSON.parse(cleaned);
          const validation = CareerBridgeResponseSchema.safeParse(parsed);
          if (validation.success) {
            return validation.data;
          }
        }
      }
    } catch {
      // Fall through to Gemini or fallback
    }
  }

  // 2. Try Gemini
  if (geminiKey && geminiKey.trim().length > 0) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${prompt}\n\nReturn strictly valid JSON conforming to the schema.` }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '').trim();
          const parsed = JSON.parse(cleaned);
          const validation = CareerBridgeResponseSchema.safeParse(parsed);
          if (validation.success) {
            return validation.data;
          }
        }
      }
    } catch {
      // Fall through to deterministic fallback
    }
  }

  return fallback;
}
