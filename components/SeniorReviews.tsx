'use client';

import React, { useState } from 'react';

type ReviewCategory =
  | 'all'
  | 'non-it'
  | 'non-engg'
  | 'career-gap'
  | 'top-mnc'
  | 'women-in-tech';

interface SeniorStory {
  id: string;
  name: string;
  degree: string;
  college: string;
  role: string;
  company: string;
  quote: string;
  category: ReviewCategory[];
  avatarInitial: string;
}

const SENIOR_STORIES: SeniorStory[] = [
  {
    id: '1',
    name: 'Sayak Dutta',
    degree: 'Computer Science Engineering (CSE)',
    college: 'IIT Guwahati',
    role: 'Software Engineer',
    company: 'Google',
    quote: 'Bite-sized training and IIT alumni mentorship helped me learn advanced system design and scalable workflows effortlessly.',
    category: ['all', 'top-mnc'],
    avatarInitial: 'S',
  },
  {
    id: '2',
    name: 'Deepak Kumar',
    degree: 'Chemical Engineering (CHE)',
    college: 'SASTRA Deemed University',
    role: 'Assistant Manager SDE',
    company: 'Jio',
    quote: 'Coming from a core Chemical background, NxtWave CCBP 4.0 gave me deep programming fundamentals and a dream career in tech.',
    category: ['all', 'non-it', 'top-mnc'],
    avatarInitial: 'D',
  },
  {
    id: '3',
    name: 'Jaya Prathyusha',
    degree: 'Computer Science Engineering (CSE)',
    college: 'Vellore Institute of Technology',
    role: 'Senior Tech Associate',
    company: 'Bank of America',
    quote: 'CCBP 4.0 will be my first choice to master any modern technical skill. The practical exposure stands out in campus drives.',
    category: ['all', 'top-mnc', 'women-in-tech'],
    avatarInitial: 'J',
  },
  {
    id: '4',
    name: 'Maddineni Bhargava',
    degree: 'Electrical Engineering (EE)',
    college: 'IIT Madras',
    role: 'Machine Learning Engineer (Intern)',
    company: 'Microsoft',
    quote: 'I have not seen any other platform provide such rigorous mentorship and real-world GenAI architecture projects.',
    category: ['all', 'non-it', 'top-mnc'],
    avatarInitial: 'M',
  },
  {
    id: '5',
    name: 'Nikhil',
    degree: 'Electronics & Communication (ECE)',
    college: 'IIITDM Jabalpur',
    role: 'Software Developer',
    company: 'Samsung',
    quote: 'After joining CCBP 4.0, I became exceptionally strong at full-stack programming and cracked technical rounds in record time.',
    category: ['all', 'non-it', 'top-mnc'],
    avatarInitial: 'N',
  },
  {
    id: '6',
    name: 'Sai Deepak',
    degree: 'Electrical & Electronics (EEE)',
    college: 'BVC College of Engineering',
    role: 'Tech Analyst',
    company: 'Deloitte',
    quote: 'The placement cell and interview preparation sessions supported me relentlessly until I held my official offer letter.',
    category: ['all', 'non-it', 'top-mnc'],
    avatarInitial: 'S',
  },
  {
    id: '7',
    name: 'Meghna Barnwl',
    degree: 'Mathematics & Computing',
    college: 'IIT Guwahati',
    role: 'Software Development Engineer (Intern)',
    company: 'Flipkart',
    quote: 'Trainers transformed how I approach complex problem solving and debugging. The live projects gave me immense confidence.',
    category: ['all', 'top-mnc', 'women-in-tech'],
    avatarInitial: 'M',
  },
  {
    id: '8',
    name: 'Bharadhwaj',
    degree: 'Computer Science',
    college: 'IIT Bhubaneswar',
    role: 'Software Development Engineer 1',
    company: 'Amazon',
    quote: 'CCBP 4.0 courses are structured with absolute engineering discipline. The curated problem sets match top tech interviews.',
    category: ['all', 'top-mnc'],
    avatarInitial: 'B',
  },
  {
    id: '9',
    name: 'Sravan Tangudu',
    degree: 'Mechanical Engineering (ME)',
    college: 'Raghu Institute of Technology',
    role: 'Associate Software Engineer',
    company: 'Bosch',
    quote: 'I had zero coding confidence as a Mechanical student. CCBP 4.0 trained me from scratch to land a top tech role at Bosch.',
    category: ['all', 'non-it', 'career-gap'],
    avatarInitial: 'S',
  },
  {
    id: '10',
    name: 'Kanduri Sai Shri Vidya',
    degree: 'Information Technology',
    college: 'GRIET Hyderabad',
    role: 'Software Engineer 1',
    company: 'Infosys & Product Startup',
    quote: 'Two internships, an Infosys campus offer, and another product role in hand. Structured learning turned scattered effort into offers.',
    category: ['all', 'women-in-tech', 'top-mnc'],
    avatarInitial: 'K',
  },
  {
    id: '11',
    name: 'Gunturi Rithwik Varma',
    degree: 'Chemical Engineering',
    college: 'JNTU Kakinada',
    role: 'Software Engineer 1',
    company: 'Cognizant',
    quote: 'From a non-IT background to cracking software roles with zero prior coding knowledge. The step-by-step roadmap was my lifeline.',
    category: ['all', 'non-it'],
    avatarInitial: 'G',
  },
  {
    id: '12',
    name: 'Shobha',
    degree: 'B.Sc Computer Applications',
    college: 'Govt Degree College',
    role: 'Full Stack Developer',
    company: 'Tech Mahindra',
    quote: 'First girl in my village to graduate and get an IT job. NxtWave gave me the skills to financially support my family.',
    category: ['all', 'non-engg', 'women-in-tech'],
    avatarInitial: 'S',
  },
];

export default function SeniorReviews() {
  const [activeTab, setActiveTab] = useState<ReviewCategory>('all');

  const filteredStories = SENIOR_STORIES.filter((story) =>
    story.category.includes(activeTab)
  );

  return (
    <section id="reviews" className="py-16 border-t border-neutral-200 dark:border-neutral-800 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
            PROVEN PLACEMENT TRACK RECORD
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Success with CCBP 4.0
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-2">
            Our seniors share their authentic placement success, interview breakthroughs, and career transformations.
          </p>

          {/* Aggregate Trust Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 p-4 bg-white dark:bg-[#111622] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div>
              <span className="block text-2xl font-black text-blue-600 dark:text-blue-400">2,500+</span>
              <span className="text-xs text-neutral-500 font-medium">Hiring Companies</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-neutral-900 dark:text-white">₹38 LPA</span>
              <span className="text-xs text-neutral-500 font-medium">Highest Package</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-neutral-900 dark:text-white">3,000+</span>
              <span className="text-xs text-neutral-500 font-medium">Colleges Represented</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-black text-amber-500">4.7</span>
                <span className="text-amber-500 text-sm">★</span>
              </div>
              <span className="text-xs text-neutral-500 font-medium">13,211+ Google Reviews</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'non-it', label: 'Non-IT Branch to IT Job' },
            { id: 'non-engg', label: 'Non-Engineering Degree' },
            { id: 'career-gap', label: 'Career Gap / Fresh Start' },
            { id: 'top-mnc', label: 'Placed in Top MNCs' },
            { id: 'women-in-tech', label: 'Women in Tech' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ReviewCategory)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-[#121620] border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
            >
              <div>
                {/* Header: Student Info & Placed Company */}
                <div className="flex items-start justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-3.5 mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm border border-blue-200 dark:border-blue-800">
                      {story.avatarInitial}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                        {story.name}
                      </h4>
                      <p className="text-[11px] text-neutral-500 leading-tight mt-0.5">
                        {story.degree}
                      </p>
                      <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        {story.college}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-400 block uppercase">
                      Placed At
                    </span>
                    <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                      {story.company}
                    </span>
                  </div>
                </div>

                {/* Outcome Badge */}
                <div className="inline-block bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/50 mb-3">
                  Role: {story.role}
                </div>

                {/* Quote */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              {/* Verified Tag */}
              <div className="pt-3.5 mt-3.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified Placement Offer
                </span>
                <span className="font-mono text-[10px]">CCBP 4.0 Alumni</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
