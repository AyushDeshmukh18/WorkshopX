import { BlueprintPayload, Branch, Interest, SkillLevel } from '../validation/blueprint-schema';

export interface StaticBlueprintEntry {
  branch: Branch;
  interest: Interest;
  level: SkillLevel;
  blueprint: BlueprintPayload;
}

export const STATIC_BLUEPRINTS: StaticBlueprintEntry[] = [
  // --- CSE (Computer Science) ---
  {
    branch: 'CSE',
    interest: 'AI',
    level: 'beginner',
    blueprint: {
      project_name: 'Campus Placement Resume Screener AI',
      one_liner: 'An AI engine that scores student resumes against software engineering job descriptions.',
      what_youll_build_in_60_min: 'A Next.js application that accepts a resume text and target JD, passes them to Gemini via structured prompts, and calculates keyword match, missing skills, and recruiter ATS score.',
      stack: ['Next.js', 'Google Gemini API', 'Tailwind CSS', 'TypeScript'],
      resume_bullet: 'Engineered an automated ATS resume screener with Gemini API, analyzing 40+ technical skill alignments in under 800ms.',
      match_score: 96,
      first_3_steps: [
        'Scaffold Next.js App Router project and set up server action for Gemini prompt dispatch.',
        'Implement prompt schema extracting technical skills, impact metrics, and gap analysis.',
        'Build a responsive feedback dashboard displaying ATS compatibility score and rewrite suggestions.',
      ],
      why_it_fits: 'Directly solves campus placement preparation while demonstrating LLM prompt engineering and modern web development.',
    },
  },
  {
    branch: 'CSE',
    interest: 'AI',
    level: 'intermediate',
    blueprint: {
      project_name: 'RAG Documentation Assistant for Engineering Specs',
      one_liner: 'Retrieval-Augmented Generation system allowing students to query complex engineering documentation.',
      what_youll_build_in_60_min: 'A searchable vector-backed question answering interface using local embeddings and Groq LLM inference with source citations.',
      stack: ['TypeScript', 'Groq SDK', 'Llama 3.3', 'Vector Embeddings', 'Next.js'],
      resume_bullet: 'Architected a RAG documentation assistant utilizing Groq Llama 3.3 with semantic chunking, reducing spec lookup latency by 70%.',
      match_score: 94,
      first_3_steps: [
        'Chunk technical documentation into 500-token semantic segments.',
        'Compute cosine similarity against user query vectors to retrieve top-3 relevant context chunks.',
        'Construct prompt with strict context boundaries and stream answers with source line citations.',
      ],
      why_it_fits: 'Showcases advanced Generative AI concepts (RAG, cosine similarity, vector search) that interviewers actively look for.',
    },
  },
  {
    branch: 'CSE',
    interest: 'WEB',
    level: 'beginner',
    blueprint: {
      project_name: 'Real-Time Collaborative Code Review Workspace',
      one_liner: 'A live code playground with instant AI syntax and algorithmic complexity audits.',
      what_youll_build_in_60_min: 'A web-based code editor that highlights time and space complexity bottlenecks using LLM static analysis.',
      stack: ['Next.js', 'Tailwind CSS', 'Gemini API', 'Monaco Editor'],
      resume_bullet: 'Built an interactive code analyzer assessing Big-O time and space complexity with automated AST suggestions.',
      match_score: 92,
      first_3_steps: [
        'Embed Monaco editor with syntax highlighting for JavaScript and Python.',
        'Create a serverless endpoint sending code snippets to Gemini with structured output formatting.',
        'Display Big-O complexity badges and highlighted lines for optimization.',
      ],
      why_it_fits: 'Combines frontend polish with algorithmic intelligence, creating a standout resume conversation starter.',
    },
  },
  {
    branch: 'CSE',
    interest: 'DATA',
    level: 'beginner',
    blueprint: {
      project_name: 'Placement Statistics & Salary Trend Predictor',
      one_liner: 'Interactive dashboard analyzing campus recruitment trends using regression models and LLM summaries.',
      what_youll_build_in_60_min: 'A data pipeline that ingests historical placement records, calculates median CTC trends, and generates narrative takeaways.',
      stack: ['Next.js', 'Recharts', 'TypeScript', 'Gemini API'],
      resume_bullet: 'Developed an interactive campus placement analytics portal with Recharts and LLM-generated demographic insights.',
      match_score: 91,
      first_3_steps: [
        'Parse CSV dataset containing college placement history and normalize branch categories.',
        'Render dynamic salary distribution histograms and branch-wise placement percentages.',
        'Integrate AI summary generator that highlights top hiring skill patterns.',
      ],
      why_it_fits: 'Demonstrates data visualization, statistical analysis, and practical LLM reporting in a single repo.',
    },
  },
  {
    branch: 'CSE',
    interest: 'MOBILE',
    level: 'beginner',
    blueprint: {
      project_name: 'PWA Technical Flashcard & Interview Drill Engine',
      one_liner: 'Offline-capable mobile progressive web app for rapid technical interview question drills.',
      what_youll_build_in_60_min: 'A responsive mobile web app featuring spaced repetition algorithms and AI-generated concept explanations.',
      stack: ['Next.js', 'Tailwind CSS', 'IndexedDB', 'Gemini API'],
      resume_bullet: 'Designed a mobile-first PWA interview prep tool leveraging spaced repetition with offline caching.',
      match_score: 90,
      first_3_steps: [
        'Configure Next.js PWA manifest and service worker for offline concept storage.',
        'Implement Leitner 5-box spaced repetition algorithm for flashcard revision intervals.',
        'Add AI explanation generator to unpack difficult DSA and system design solutions on demand.',
      ],
      why_it_fits: 'Highlights mobile responsiveness, service workers, and client-side storage alongside AI capabilities.',
    },
  },
  {
    branch: 'CSE',
    interest: 'EMBEDDED',
    level: 'beginner',
    blueprint: {
      project_name: 'Edge AI Log Anomaly Detection Monitor',
      one_liner: 'A lightweight telemetry dashboard detecting security anomalies in serverless system logs.',
      what_youll_build_in_60_min: 'A dashboard that streams mock server logs and flags suspicious authentication patterns using heuristic clustering and LLM triage.',
      stack: ['Next.js', 'TypeScript', 'Groq API', 'Tailwind CSS'],
      resume_bullet: 'Engineered an automated log anomaly parser utilizing high-speed Groq inference to classify security events under 200ms.',
      match_score: 89,
      first_3_steps: [
        'Build real-time mock log generator simulating server access patterns.',
        'Implement regex tokenization to extract IP addresses, status codes, and user agents.',
        'Route suspicious request clusters to Groq LLM for security incident categorization.',
      ],
      why_it_fits: 'Bridges systems engineering, cyber security basics, and high-speed LLM processing.',
    },
  },

  // --- IT (Information Technology) ---
  {
    branch: 'IT',
    interest: 'AI',
    level: 'beginner',
    blueprint: {
      project_name: 'Cloud Infrastructure Cost Optimization Advisor',
      one_liner: 'AI assistant that audits AWS/GCP architecture configurations to identify cost waste.',
      what_youll_build_in_60_min: 'A tool that parses Terraform or YAML cloud architecture manifests and recommends rightsizing and serverless alternatives.',
      stack: ['Next.js', 'Gemini API', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Created an automated cloud infrastructure auditor analyzing Terraform manifests to reduce cloud expenditure estimates.',
      match_score: 95,
      first_3_steps: [
        'Create a YAML/JSON configuration input parser with schema validation.',
        'Feed architecture specifications to Gemini with strict pricing heuristics prompt.',
        'Render itemized savings checklist and alternative architecture diagrams.',
      ],
      why_it_fits: 'Highly relevant for cloud engineering and DevOps placements in IT consulting and product firms.',
    },
  },
  {
    branch: 'IT',
    interest: 'WEB',
    level: 'beginner',
    blueprint: {
      project_name: 'Database Query Explainer & Indexing Advisor',
      one_liner: 'Web tool that transforms raw SQL EXPLAIN plans into plain English performance recommendations.',
      what_youll_build_in_60_min: 'A developer utility that takes Postgres execution plans, identifies sequential scans, and suggests optimal B-tree indexes.',
      stack: ['Next.js', 'PostgreSQL', 'Gemini API', 'Tailwind CSS'],
      resume_bullet: 'Constructed a SQL query optimization portal converting EXPLAIN ANALYZE plans into actionable indexing strategies.',
      match_score: 93,
      first_3_steps: [
        'Build SQL query input interface with execution plan parser.',
        'Identify sequential scans, nested loops, and memory sort spikes algorithmically.',
        'Use Gemini to generate optimal CREATE INDEX statements with performance rationale.',
      ],
      why_it_fits: 'Demonstrates deep database understanding and developer tool craftsmanship.',
    },
  },
  {
    branch: 'IT',
    interest: 'DATA',
    level: 'beginner',
    blueprint: {
      project_name: 'Automated ETL Pipeline Health & Data Drift Monitor',
      one_liner: 'Dashboard tracking data schema changes and statistical drift across incoming API streams.',
      what_youll_build_in_60_min: 'A monitoring interface that validates JSON data feeds, computes null-rate drifts, and generates data contract alerts.',
      stack: ['Next.js', 'Zod', 'Recharts', 'TypeScript'],
      resume_bullet: 'Built a real-time data drift monitoring dashboard detecting schema contract breaks across JSON feeds.',
      match_score: 91,
      first_3_steps: [
        'Define strict Zod data contracts for incoming telemetry payloads.',
        'Implement statistical summary calculator for column distribution and null ratios.',
        'Render alerting status badges and automated schema change diff view.',
      ],
      why_it_fits: 'Highlights modern data engineering practices (data contracts, schema validation, telemetry monitoring).',
    },
  },
  {
    branch: 'IT',
    interest: 'MOBILE',
    level: 'beginner',
    blueprint: {
      project_name: 'Campus Incident Reporting & Dispatch Portal',
      one_liner: 'Mobile-responsive ticketing workflow with automated AI priority categorization.',
      what_youll_build_in_60_min: 'A mobile web interface for students to report IT lab issues, automatically triage urgency, and route to technicians.',
      stack: ['Next.js', 'Tailwind CSS', 'Gemini API', 'Supabase'],
      resume_bullet: 'Developed an IT ticketing portal with AI-based priority triage, reducing manual categorization overhead.',
      match_score: 90,
      first_3_steps: [
        'Build mobile reporting form with photo upload and location selectors.',
        'Classify ticket urgency (P1-P4) using Gemini based on description text.',
        'Implement real-time status board with technician claim workflows.',
      ],
      why_it_fits: 'Shows full-stack competence, enterprise workflow understanding, and practical utility.',
    },
  },
  {
    branch: 'IT',
    interest: 'EMBEDDED',
    level: 'beginner',
    blueprint: {
      project_name: 'API Gateway Telemetry & Rate-Limit Sentinel',
      one_liner: 'Edge-aware API gateway monitor tracking latency spikes and malicious bot traffic.',
      what_youll_build_in_60_min: 'A dashboard analyzing simulated HTTP traffic, tracking token bucket limits, and classifying DDoS patterns.',
      stack: ['Next.js', 'TypeScript', 'Groq API', 'Tailwind CSS'],
      resume_bullet: 'Implemented an API gateway telemetry observer analyzing rate limits and client traffic distributions.',
      match_score: 89,
      first_3_steps: [
        'Implement token bucket rate-limiting simulation in TypeScript.',
        'Track rolling 60-second request throughput and status code ratios.',
        'Use Groq inference to detect and categorize unusual burst access patterns.',
      ],
      why_it_fits: 'Demonstrates distributed systems fundamentals and network security concepts.',
    },
  },

  // --- ECE (Electronics & Communication) ---
  {
    branch: 'ECE',
    interest: 'AI',
    level: 'beginner',
    blueprint: {
      project_name: 'Audio Signal Classification & Noise Filter AI',
      one_liner: 'Web application that analyzes microphone audio frequencies and identifies signal interference.',
      what_youll_build_in_60_min: 'An audio visualizer utilizing the Web Audio API FFT analyzer combined with Gemini to identify signal noise sources.',
      stack: ['Web Audio API', 'Next.js', 'Gemini API', 'Canvas API'],
      resume_bullet: 'Engineered an in-browser audio spectrum analyzer with FFT frequency binning and AI noise classification.',
      match_score: 94,
      first_3_steps: [
        'Capture microphone input using Web Audio API and initialize AnalyserNode.',
        'Render real-time frequency spectrum on an HTML5 canvas element.',
        'Extract dominant frequency peaks and query Gemini for acoustic noise source identification.',
      ],
      why_it_fits: 'Directly bridges electronics signal processing theory (FFT, frequencies) with modern web AI.',
    },
  },
  {
    branch: 'ECE',
    interest: 'EMBEDDED',
    level: 'beginner',
    blueprint: {
      project_name: 'IoT Sensor Telemetry Simulator & Firmware Debugger',
      one_liner: 'Interactive dashboard simulating ESP32 / Arduino sensor telemetry with automated fault diagnosis.',
      what_youll_build_in_60_min: 'A virtual hardware simulator emitting I2C and SPI sensor packets and diagnosing signal drops via AI.',
      stack: ['Next.js', 'TypeScript', 'Recharts', 'Gemini API'],
      resume_bullet: 'Created an IoT telemetry simulator modeling I2C/SPI sensor packet loss with automated AI diagnostic triage.',
      match_score: 96,
      first_3_steps: [
        'Simulate temperature, humidity, and vibration sensor data streams with realistic noise.',
        'Graph real-time sensor waveforms with anomaly threshold triggers.',
        'Feed telemetry error codes into Gemini to generate hardware troubleshooting steps.',
      ],
      why_it_fits: 'The ultimate bridge project for ECE students: proves embedded understanding and software polish.',
    },
  },
  {
    branch: 'ECE',
    interest: 'WEB',
    level: 'beginner',
    blueprint: {
      project_name: 'Antenna Radiation Pattern & RF Path Loss Calculator',
      one_liner: 'Web-based RF propagation calculator computing Friis transmission equations with interactive plots.',
      what_youll_build_in_60_min: 'An engineering tool that calculates free-space path loss across cellular/WiFi frequencies with terrain adjustments.',
      stack: ['Next.js', 'Recharts', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Developed an RF path loss and link budget calculator with interactive distance vs. signal attenuation curves.',
      match_score: 91,
      first_3_steps: [
        'Implement Friis transmission and log-distance path loss mathematical formulas.',
        'Build dynamic sliders for frequency (2.4GHz, 5GHz, 28GHz) and transmitter power.',
        'Render link budget margin curves and maximum reliable communication radius.',
      ],
      why_it_fits: 'Validates core telecommunications coursework while showcasing clean frontend UI engineering.',
    },
  },
  {
    branch: 'ECE',
    interest: 'DATA',
    level: 'beginner',
    blueprint: {
      project_name: 'Semiconductor Wafer Defect Pattern Analyzer',
      one_liner: 'Statistical image defect classifier identifying manufacturing yield anomalies on silicon wafers.',
      what_youll_build_in_60_min: 'A dashboard that renders wafer defect maps, computes yield distributions, and explains defect patterns with AI.',
      stack: ['Next.js', 'HTML5 Canvas', 'Gemini API', 'TypeScript'],
      resume_bullet: 'Built a silicon wafer defect mapping portal identifying cluster anomalies and yield degradation trends.',
      match_score: 92,
      first_3_steps: [
        'Render circular silicon wafer grid with simulated defect coordinate points.',
        'Classify spatial defect clusters (donut, scratch, edge ring) using coordinate heuristics.',
        'Generate manufacturing root-cause reports using Gemini API.',
      ],
      why_it_fits: 'Highly prestigious for VLSI and semiconductor fabrication placement interviews.',
    },
  },
  {
    branch: 'ECE',
    interest: 'MOBILE',
    level: 'beginner',
    blueprint: {
      project_name: 'Bluetooth Low Energy (BLE) Beacon Signal Tracker',
      one_liner: 'Mobile web application modeling indoor positioning via BLE beacon RSSI trilateration.',
      what_youll_build_in_60_min: 'A simulator that computes 2D coordinates from 3 simulated BLE beacon RSSI readings with Kalman filter smoothing.',
      stack: ['Next.js', 'Canvas API', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Engineered an indoor positioning simulator using RSSI trilateration and distance approximation curves.',
      match_score: 88,
      first_3_steps: [
        'Model RSSI attenuation over distance based on path-loss exponent.',
        'Implement 3-point circle intersection trilateration algorithm on a 2D canvas.',
        'Display estimated location error ellipses under varying channel noise levels.',
      ],
      why_it_fits: 'Demonstrates wireless networking mathematics and mobile location-based systems.',
    },
  },

  // --- EEE (Electrical & Electronics) ---
  {
    branch: 'EEE',
    interest: 'AI',
    level: 'beginner',
    blueprint: {
      project_name: 'Smart Grid Load Forecasting & Peak Shaving AI',
      one_liner: 'AI energy management system that predicts household electrical load and schedules battery discharge.',
      what_youll_build_in_60_min: 'A dashboard modeling daily power consumption curves, predicting peak tariff hours, and optimizing battery storage.',
      stack: ['Next.js', 'Recharts', 'Gemini API', 'TypeScript'],
      resume_bullet: 'Developed an electrical load forecasting portal predicting peak tariff hours to optimize battery discharge scheduling.',
      match_score: 95,
      first_3_steps: [
        'Model residential 24-hour power load profiles across seasonal variations.',
        'Implement tariff threshold detection for peak vs. off-peak electricity pricing.',
        'Use Gemini to evaluate load shifting strategies and calculate cost savings.',
      ],
      why_it_fits: 'Strong alignment with power systems, renewable energy transition, and modern smart grids.',
    },
  },
  {
    branch: 'EEE',
    interest: 'EMBEDDED',
    level: 'beginner',
    blueprint: {
      project_name: 'Electric Vehicle Battery Management System (BMS) Monitor',
      one_liner: 'Virtual BMS dashboard tracking lithium-ion cell voltages, thermal runaway, and State-of-Charge.',
      what_youll_build_in_60_min: 'A real-time telemetry viewer monitoring 16 individual battery cell voltages with cell-balancing alerts.',
      stack: ['Next.js', 'TypeScript', 'Recharts', 'Tailwind CSS'],
      resume_bullet: 'Created a virtual EV Battery Management System dashboard monitoring cell voltage balance and thermal limits.',
      match_score: 96,
      first_3_steps: [
        'Simulate 16-series LiFePO4 battery pack voltages and internal resistance.',
        'Detect cell imbalance (>30mV divergence) and trigger passive balancing alerts.',
        'Generate health diagnostics report assessing State-of-Charge (SoC) and State-of-Health (SoH).',
      ],
      why_it_fits: 'EV engineering is one of the highest-growth hiring sectors for EEE graduates.',
    },
  },
  {
    branch: 'EEE',
    interest: 'WEB',
    level: 'beginner',
    blueprint: {
      project_name: 'Solar PV Rooftop Generation & ROI Estimator',
      one_liner: 'Interactive web tool calculating solar panel capacity, solar irradiance yield, and payback period.',
      what_youll_build_in_60_min: 'A solar calculator where users input rooftop area and location to compute annual kWh output and financial payback.',
      stack: ['Next.js', 'Tailwind CSS', 'Recharts', 'TypeScript'],
      resume_bullet: 'Engineered a rooftop solar PV estimator computing solar irradiance yield and capital payback timelines.',
      match_score: 91,
      first_3_steps: [
        'Calculate effective solar irradiance based on latitude and panel tilt angles.',
        'Compute panel count, inverter sizing, and estimated annual electrical output.',
        'Render payback cash-flow timeline chart factoring net-metering tariffs.',
      ],
      why_it_fits: 'Combines solar energy engineering with modern financial dashboard modeling.',
    },
  },
  {
    branch: 'EEE',
    interest: 'DATA',
    level: 'beginner',
    blueprint: {
      project_name: 'Industrial Transformer Thermal Health Analytics',
      one_liner: 'Predictive maintenance portal tracking transformer winding temperature and oil degradation.',
      what_youll_build_in_60_min: 'An industrial analytics dashboard visualizing IEEE thermal degradation models and calculating asset lifespan loss.',
      stack: ['Next.js', 'Recharts', 'Gemini API', 'TypeScript'],
      resume_bullet: 'Built a transformer predictive maintenance monitor calculating winding hot-spot temperatures and insulation aging.',
      match_score: 92,
      first_3_steps: [
        'Implement IEEE standard hot-spot temperature equations based on ambient temperature and load.',
        'Plot aging acceleration factor and insulation life expectancy loss curves.',
        'Generate maintenance action recommendations using Gemini API.',
      ],
      why_it_fits: 'Impresses core electrical engineering and utility sector interviewers.',
    },
  },
  {
    branch: 'EEE',
    interest: 'MOBILE',
    level: 'beginner',
    blueprint: {
      project_name: 'Home Energy Audit & Appliance Carbon Calculator',
      one_liner: 'Mobile web application allowing homeowners to audit energy consumption per appliance.',
      what_youll_build_in_60_min: 'A responsive mobile audit tool with appliance wattage presets that computes monthly kWh and carbon footprint.',
      stack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Gemini API'],
      resume_bullet: 'Developed a mobile home energy audit tool calculating appliance consumption and carbon footprint reductions.',
      match_score: 89,
      first_3_steps: [
        'Create interactive appliance catalog with typical wattage and daily usage sliders.',
        'Compute total monthly energy consumption and carbon emissions in kg CO2.',
        'Use AI to recommend efficiency retrofits (BLDC fans, inverter ACs) with projected savings.',
      ],
      why_it_fits: 'Highly practical consumer utility showing UI skills and environmental engineering awareness.',
    },
  },

  // --- MECH (Mechanical Engineering) ---
  {
    branch: 'MECH',
    interest: 'AI',
    level: 'beginner',
    blueprint: {
      project_name: 'Vibration Analysis & Bearing Fault Diagnosis AI',
      one_liner: 'AI system that diagnoses mechanical rotational bearing faults from vibration sensor data.',
      what_youll_build_in_60_min: 'A vibration analysis portal that computes peak frequencies and classifies bearing defects (inner/outer race fault).',
      stack: ['Next.js', 'Recharts', 'Gemini API', 'TypeScript'],
      resume_bullet: 'Developed an automated vibration analysis tool identifying rotational bearing defect frequencies via AI triage.',
      match_score: 96,
      first_3_steps: [
        'Simulate accelerometer time-domain vibration signals with defect impact spikes.',
        'Plot FFT frequency spectrum highlighting characteristic defect frequencies (BPFI, BPFO).',
        'Use Gemini API to classify fault severity and recommend mechanical maintenance.',
      ],
      why_it_fits: 'A standout project for mechanical students applying to automotive, aerospace, or manufacturing roles.',
    },
  },
  {
    branch: 'MECH',
    interest: 'EMBEDDED',
    level: 'beginner',
    blueprint: {
      project_name: '3D Printer G-Code Parser & Print Time Estimator',
      one_liner: 'Web application that parses CNC and 3D printing G-code files to calculate toolpaths and build duration.',
      what_youll_build_in_60_min: 'A toolpath visualizer that ingests .gcode files, calculates rapid travel vs. extrusion times, and plots layers.',
      stack: ['Next.js', 'Canvas API', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Created a G-code toolpath analyzer calculating 3D printing acceleration curves and filament consumption.',
      match_score: 94,
      first_3_steps: [
        'Parse G0/G1 linear movement coordinates and feed rates from uploaded G-code.',
        'Render 2D layer-by-layer toolpath preview on an HTML5 canvas.',
        'Compute total print duration factoring machine acceleration and cornering limits.',
      ],
      why_it_fits: 'Directly validates additive manufacturing and CNC machining knowledge.',
    },
  },
  {
    branch: 'MECH',
    interest: 'WEB',
    level: 'beginner',
    blueprint: {
      project_name: 'HVAC Duct Sizing & Airflow Pressure Loss Calculator',
      one_liner: 'Engineering web tool calculating duct dimensions and friction losses using the Darcy-Weisbach equation.',
      what_youll_build_in_60_min: 'A responsive HVAC design assistant calculating CFM airflows, velocity constraints, and static pressure requirements.',
      stack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Recharts'],
      resume_bullet: 'Built an HVAC duct sizing calculator computing Darcy-Weisbach friction losses and fan static pressure needs.',
      match_score: 90,
      first_3_steps: [
        'Implement equal friction method formulas for round and rectangular ductwork.',
        'Calculate Reynolds numbers, friction factor, and pressure drops across fittings.',
        'Generate complete duct schedule table with recommended sheet metal gauges.',
      ],
      why_it_fits: 'Valuable for building services, HVAC design, and MEP consulting firms.',
    },
  },
  {
    branch: 'MECH',
    interest: 'DATA',
    level: 'beginner',
    blueprint: {
      project_name: 'Automotive Fleet Fuel Economy & Telematics Analytics',
      one_liner: 'Data dashboard tracking commercial vehicle driving behavior, idle times, and fuel consumption.',
      what_youll_build_in_60_min: 'An analytics dashboard ingesting simulated vehicle speed and throttle telemetry to benchmark fuel efficiency.',
      stack: ['Next.js', 'Recharts', 'TypeScript', 'Gemini API'],
      resume_bullet: 'Engineered a fleet telematics dashboard analyzing vehicle driving profiles to optimize commercial fuel efficiency.',
      match_score: 92,
      first_3_steps: [
        'Generate vehicle speed, RPM, and brake telemetry logs.',
        'Calculate aggressive acceleration incidents, idle fuel wastage, and average km/L.',
        'Use AI to generate driver coaching reports and fleet route recommendations.',
      ],
      why_it_fits: 'Combines automotive engineering fundamentals with commercial fleet telematics.',
    },
  },
  {
    branch: 'MECH',
    interest: 'MOBILE',
    level: 'beginner',
    blueprint: {
      project_name: 'Mechanical Beam Deflection & Stress Calculator',
      one_liner: 'Mobile-friendly structural beam calculator computing shear force and bending moment diagrams.',
      what_youll_build_in_60_min: 'A mobile engineering app that allows users to place loads on cantilever or simply supported beams and view instant SFD/BMD curves.',
      stack: ['Next.js', 'Canvas API', 'Tailwind CSS', 'TypeScript'],
      resume_bullet: 'Developed a mobile mechanical beam calculator plotting shear force and bending moment diagrams in real time.',
      match_score: 91,
      first_3_steps: [
        'Implement beam boundary condition equations (simply supported, cantilever).',
        'Calculate reaction forces, maximum bending moments, and elastic deflection curves.',
        'Render dynamic Shear Force and Bending Moment Diagrams (SFD/BMD) on canvas.',
      ],
      why_it_fits: 'Proves mastery of core mechanics of materials in a sleek, modern format.',
    },
  },

  // --- CIVIL (Civil Engineering) ---
  {
    branch: 'CIVIL',
    interest: 'AI',
    level: 'beginner',
    blueprint: {
      project_name: 'Concrete Crack Severity & Damage Assessment AI',
      one_liner: 'AI image analysis tool estimating concrete surface crack width and structural risk levels.',
      what_youll_build_in_60_min: 'A web tool that accepts inspection photos or simulated crack dimensions and classifies structural damage severity.',
      stack: ['Next.js', 'Gemini API', 'Tailwind CSS', 'TypeScript'],
      resume_bullet: 'Created a structural concrete crack assessment tool utilizing Gemini API to classify damage levels per IS 456.',
      match_score: 95,
      first_3_steps: [
        'Build photo inspection upload interface with millimeter measurement scale guides.',
        'Extract crack orientation (transverse, longitudinal, diagonal) and crack width parameters.',
        'Query Gemini with Indian Standard (IS 456) structural criteria to recommend repair retrofits.',
      ],
      why_it_fits: 'Direct application of AI in structural health monitoring and civil infrastructure maintenance.',
    },
  },
  {
    branch: 'CIVIL',
    interest: 'WEB',
    level: 'beginner',
    blueprint: {
      project_name: 'RCC Column & Footing Sizing Assistant',
      one_liner: 'Structural engineering portal computing axial load capacities and concrete rebar schedules.',
      what_youll_build_in_60_min: 'A structural calculation engine that sizes reinforced concrete columns based on axial dead and live loads per IS 456.',
      stack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Canvas API'],
      resume_bullet: 'Engineered an RCC column sizing calculator generating longitudinal steel rebar schedules per IS 456 standards.',
      match_score: 93,
      first_3_steps: [
        'Calculate factored axial load Pu and minimum eccentricity per design codes.',
        'Compute required gross cross-sectional area and percentage of longitudinal steel.',
        'Render a graphical cross-section diagram showing rebar layout and lateral ties.',
      ],
      why_it_fits: 'Highly respected by structural design consultancies and infrastructure contractors.',
    },
  },
  {
    branch: 'CIVIL',
    interest: 'DATA',
    level: 'beginner',
    blueprint: {
      project_name: 'Rainwater Harvesting & Stormwater Runoff Estimator',
      one_liner: 'Hydrological runoff calculator estimating rooftop rainwater yield and aquifer recharge potential.',
      what_youll_build_in_60_min: 'An environmental dashboard that computes catchment runoff using the Rational Method and sizes storage tanks.',
      stack: ['Next.js', 'Recharts', 'TypeScript', 'Gemini API'],
      resume_bullet: 'Built a hydrological stormwater modeling portal calculating Rational Method runoff and optimal rainwater tank sizing.',
      match_score: 91,
      first_3_steps: [
        'Implement Rational Method equation: Q = C * I * A for catchment areas.',
        'Incorporate regional rainfall intensity data and surface runoff coefficients.',
        'Graph cumulative monthly water harvest vs. household domestic water demand.',
      ],
      why_it_fits: 'Combines environmental engineering, hydrology, and sustainability analytics.',
    },
  },
  {
    branch: 'CIVIL',
    interest: 'MOBILE',
    level: 'beginner',
    blueprint: {
      project_name: 'Construction Site Material Estimation & Costing App',
      one_liner: 'Mobile web utility estimating cement, sand, and aggregate quantities for concrete mixes.',
      what_youll_build_in_60_min: 'A mobile site calculator that takes slab or wall dimensions and computes required bags of cement, tons of sand, and cost.',
      stack: ['Next.js', 'Tailwind CSS', 'TypeScript'],
      resume_bullet: 'Developed a mobile construction material estimator calculating cement, sand, and aggregate ratios for M20/M25 concrete.',
      match_score: 92,
      first_3_steps: [
        'Implement wet-to-dry concrete volume multiplier (1.54 factor) for accurate material batching.',
        'Compute ingredient breakdown for nominal concrete mixes (M15, M20, M25).',
        'Display total bill of quantities (BOQ) with localized market price inputs.',
      ],
      why_it_fits: 'Essential daily tool for site engineers, construction supervisors, and project estimators.',
    },
  },
  {
    branch: 'CIVIL',
    interest: 'EMBEDDED',
    level: 'beginner',
    blueprint: {
      project_name: 'Geotechnical Soil Slope Stability & Settlement Monitor',
      one_liner: 'Virtual geotechnical telemetry monitor tracking slope inclinometer angles and pore water pressure.',
      what_youll_build_in_60_min: 'A geotechnical monitor that graphs soil pore water pressure and computes Bishop Factor of Safety for slope failure.',
      stack: ['Next.js', 'Recharts', 'TypeScript', 'Gemini API'],
      resume_bullet: 'Created a geotechnical slope stability monitor calculating Bishop Factor of Safety from pore water pressure data.',
      match_score: 90,
      first_3_steps: [
        'Model soil strata shear strength parameters (cohesion c and friction angle phi).',
        'Compute factor of safety against rotational slope sliding under heavy rainfall.',
        'Generate AI geotechnical risk advisory for foundation underpinning.',
      ],
      why_it_fits: 'Bridges soil mechanics theory with modern automated infrastructure safety instrumentation.',
    },
  },

  // --- Additional Specialized & Advanced Matrix Entries (Reaching 40+) ---
  {
    branch: 'CSE',
    interest: 'AI',
    level: 'advanced',
    blueprint: {
      project_name: 'Multi-Agent Code Refactoring & Security Linter',
      one_liner: 'Collaborative dual-agent LLM pipeline that performs automated static analysis and patches CVEs.',
      what_youll_build_in_60_min: 'A workflow where one model identifies injection vulnerabilities and a second model generates verified diffs.',
      stack: ['Next.js', 'Gemini API', 'Groq SDK', 'TypeScript'],
      resume_bullet: 'Architected a multi-agent automated code security linter detecting OWASP Top 10 vulnerabilities with automated AST diffs.',
      match_score: 98,
      first_3_steps: [
        'Configure dual-prompt pipeline: auditor agent and refactoring engineer agent.',
        'Scan code for SQL injection, SSRF, and unescaped HTML patterns.',
        'Generate unified diff patch and verify syntax validity automatically.',
      ],
      why_it_fits: 'Demonstrates cutting-edge multi-agent systems and application security engineering.',
    },
  },
  {
    branch: 'IT',
    interest: 'AI',
    level: 'intermediate',
    blueprint: {
      project_name: 'DevOps Incident Post-Mortem & Root-Cause Generator',
      one_liner: 'AI system that digests server crash logs and metrics to draft structured engineering post-mortems.',
      what_youll_build_in_60_min: 'A post-incident portal that ingests Prometheus metrics and error traces to output blameless root-cause analysis.',
      stack: ['Next.js', 'Gemini API', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Built an automated DevOps post-mortem generator transforming Prometheus crash alerts into structured root-cause reports.',
      match_score: 95,
      first_3_steps: [
        'Parse stack traces, HTTP error rates, and CPU utilization timeline spikes.',
        'Structure input into timeline chronological events format.',
        'Generate industry-standard blameless post-mortem report with action items.',
      ],
      why_it_fits: 'High demand in Site Reliability Engineering (SRE) and production operations roles.',
    },
  },
  {
    branch: 'ECE',
    interest: 'AI',
    level: 'intermediate',
    blueprint: {
      project_name: 'Edge AI TinyML Model Quantization Profiler',
      one_liner: 'Web benchmark utility comparing inference latency between INT8 quantized and FP32 neural weights.',
      what_youll_build_in_60_min: 'A profiling dashboard showing memory footprint reduction and accuracy trade-offs for microcontroller edge models.',
      stack: ['Next.js', 'Recharts', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Created a TinyML quantization benchmarking interface evaluating INT8 vs. FP32 memory and latency trade-offs on microcontrollers.',
      match_score: 94,
      first_3_steps: [
        'Model weight distribution matrices and simulate post-training INT8 quantization.',
        'Calculate flash memory and RAM savings across simulated ARM Cortex-M microcontrollers.',
        'Plot accuracy degradation curves against quantization bit-depth.',
      ],
      why_it_fits: 'Superb project for edge AI, embedded systems, and microcontroller firmware roles.',
    },
  },
  {
    branch: 'EEE',
    interest: 'AI',
    level: 'intermediate',
    blueprint: {
      project_name: 'Solar Inverter MPPT Tracker & Efficiency Optimizer',
      one_liner: 'Simulation portal benchmarking Maximum Power Point Tracking (MPPT) algorithms under partial shading.',
      what_youll_build_in_60_min: 'An interactive simulator showing P-V and I-V characteristic curves and testing perturb-and-observe MPPT algorithms.',
      stack: ['Next.js', 'Canvas API', 'Recharts', 'TypeScript'],
      resume_bullet: 'Developed an MPPT solar inverter simulator comparing Perturb & Observe algorithms against partial shading conditions.',
      match_score: 93,
      first_3_steps: [
        'Model non-linear diode equations for solar photovoltaic cells.',
        'Simulate partial shading conditions creating multiple local power peaks.',
        'Implement digital Perturb & Observe algorithm tracking the global maximum power point.',
      ],
      why_it_fits: 'Combines power electronics, mathematical modeling, and control system software.',
    },
  },
  {
    branch: 'MECH',
    interest: 'AI',
    level: 'intermediate',
    blueprint: {
      project_name: 'Finite Element Analysis (FEA) Stress Concentration AI',
      one_liner: 'Engineering web tool predicting stress concentration factors ($K_t$) for mechanical notches and holes.',
      what_youll_build_in_60_min: 'A structural calculation portal that calculates Peterson stress concentration factors and visualizes peak stress gradients.',
      stack: ['Next.js', 'Canvas API', 'Gemini API', 'TypeScript'],
      resume_bullet: 'Built a mechanical stress concentration calculator visualizing Peterson Kt factors and Von Mises yield margins.',
      match_score: 94,
      first_3_steps: [
        'Implement geometric notch formulas ($d/D$ and $r/d$ ratios) for shafts and stepped plates.',
        'Calculate theoretical stress concentration factor $K_t$ and fatigue notch factor $K_f$.',
        'Render color-coded 2D stress gradient contour map on HTML5 canvas.',
      ],
      why_it_fits: 'Directly applicable to machine design and mechanical structural integrity interviews.',
    },
  },
  {
    branch: 'CIVIL',
    interest: 'AI',
    level: 'intermediate',
    blueprint: {
      project_name: 'Building Energy Efficiency & Thermal Envelope Simulator',
      one_liner: 'Web application calculating U-values and thermal insulation performance for sustainable building design.',
      what_youll_build_in_60_min: 'A green building modeling tool that calculates composite wall thermal transmittance and cooling load reductions.',
      stack: ['Next.js', 'Recharts', 'Gemini API', 'TypeScript'],
      resume_bullet: 'Engineered a sustainable building thermal envelope simulator calculating overall U-values and HVAC energy savings.',
      match_score: 93,
      first_3_steps: [
        'Implement heat transfer formulas through composite multi-layer walls and glazing.',
        'Calculate overall heat transfer coefficient (U-value) for brick, AAC blocks, and insulation.',
        'Project annual air conditioning kWh energy savings and LEED green building points.',
      ],
      why_it_fits: 'High relevance for sustainable architecture, green building rating (LEED/GRIHA), and structural engineering.',
    },
  },
  {
    branch: 'CSE',
    interest: 'DATA',
    level: 'intermediate',
    blueprint: {
      project_name: 'Distributed Database Partitioning & Sharding Simulator',
      one_liner: 'Visual simulator demonstrating consistent hashing and partition rebalancing in distributed databases.',
      what_youll_build_in_60_min: 'An interactive simulator modeling consistent hash rings, node additions, and data partition redistribution.',
      stack: ['Next.js', 'Canvas API', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Created an interactive distributed systems simulator demonstrating consistent hashing and partition rebalancing.',
      match_score: 97,
      first_3_steps: [
        'Implement consistent hash ring algorithm with virtual nodes in TypeScript.',
        'Visualize key-to-node mapping on an interactive canvas ring.',
        'Simulate node addition/removal and calculate percentage of keys remapped.',
      ],
      why_it_fits: 'Essential discussion topic for system design interviews at high-tier tech companies.',
    },
  },
  {
    branch: 'IT',
    interest: 'DATA',
    level: 'intermediate',
    blueprint: {
      project_name: 'Data Lakehouse Parquet File Inspection & Query Engine',
      one_liner: 'Browser-based columnar data analyzer inspecting column metadata, row groups, and dictionary encodings.',
      what_youll_build_in_60_min: 'A developer utility that parses columnar metadata and benchmarks decompression speed across storage layouts.',
      stack: ['Next.js', 'TypeScript', 'Recharts', 'Tailwind CSS'],
      resume_bullet: 'Developed an in-browser columnar data profiler analyzing row-group compression ratios and projection query latency.',
      match_score: 94,
      first_3_steps: [
        'Build parser for simulated Parquet file footers and column chunk schemas.',
        'Visualize columnar storage compression savings compared to row-oriented JSON.',
        'Simulate column projection queries demonstrating reduced I/O overhead.',
      ],
      why_it_fits: 'Demonstrates modern big data lakehouse architecture concepts (Apache Iceberg, Parquet).',
    },
  },
  {
    branch: 'ECE',
    interest: 'WEB',
    level: 'intermediate',
    blueprint: {
      project_name: 'Digital Logic Gate Circuit Simulator & Waveform Viewer',
      one_liner: 'Web application simulating digital logic gate propagation delays and timing diagram waveforms.',
      what_youll_build_in_60_min: 'A digital circuit editor that models NAND/NOR gate delays, race conditions, and generates timing diagrams.',
      stack: ['Next.js', 'Canvas API', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Engineered a digital logic circuit simulator modeling propagation gate delays and multi-trace timing waveforms.',
      match_score: 93,
      first_3_steps: [
        'Implement event-driven digital logic simulation engine (AND, OR, NOT, XOR, Flip-Flops).',
        'Model nanosecond gate propagation delays and detect glitch hazard conditions.',
        'Render multi-channel digital oscilloscope timing diagrams on canvas.',
      ],
      why_it_fits: 'Perfect for demonstrating fundamental digital design and computer architecture skills.',
    },
  },
  {
    branch: 'MECH',
    interest: 'DATA',
    level: 'intermediate',
    blueprint: {
      project_name: 'Wind Turbine Power Curve & Capacity Factor Analytics',
      one_liner: 'Renewable energy portal analyzing aerodynamic Betz limit power generation curves across wind speeds.',
      what_youll_build_in_60_min: 'A wind energy dashboard plotting aerodynamic power curves, cut-in/cut-out speeds, and capacity factors.',
      stack: ['Next.js', 'Recharts', 'TypeScript', 'Tailwind CSS'],
      resume_bullet: 'Created a wind turbine aerodynamic performance portal modeling Betz limit power curves and capacity factor yield.',
      match_score: 93,
      first_3_steps: [
        'Calculate theoretical aerodynamic power using Betz limit: P = 0.5 * rho * A * v^3 * Cp.',
        'Graph real-world turbine power curves incorporating cut-in, rated, and cut-out wind speeds.',
        'Compute annual energy production (AEP) based on Weibull wind speed distributions.',
      ],
      why_it_fits: 'Bridges fluid dynamics, renewable wind energy, and data analytics.',
    },
  },
];

/**
 * Deterministic lookup function that finds the best matching static blueprint.
 * Fallback chain guarantees 100% availability even with zero network or AI keys.
 */
export function getStaticBlueprint(
  branch: Branch,
  interest: Interest,
  level: SkillLevel
): BlueprintPayload {
  // 1. Exact match (branch + interest + level)
  const exact = STATIC_BLUEPRINTS.find(
    (b) => b.branch === branch && b.interest === interest && b.level === level
  );
  if (exact) return exact.blueprint;

  // 2. Branch + Interest match (any level)
  const branchInterest = STATIC_BLUEPRINTS.find(
    (b) => b.branch === branch && b.interest === interest
  );
  if (branchInterest) return branchInterest.blueprint;

  // 3. Branch match (any interest)
  const branchMatch = STATIC_BLUEPRINTS.find((b) => b.branch === branch);
  if (branchMatch) return branchMatch.blueprint;

  // 4. Ultimate fallback to first verified blueprint
  return STATIC_BLUEPRINTS[0].blueprint;
}
