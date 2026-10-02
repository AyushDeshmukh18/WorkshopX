import type { Metadata } from 'next';
import './globals.css';
import NxtWaveHeader from '@/components/NxtWaveHeader';
import NxtWaveFooter from '@/components/NxtWaveFooter';

export const metadata: Metadata = {
  title: 'NxtWave CCBP 4.0 | Build Your First AI Project in 60 Minutes',
  description:
    'A live 60-minute technical workshop by NxtWave (WEF Technology Pioneer 2024 & NSDC Partner). Build, deploy, and evaluate a verified AI application for your placement resume.',
  openGraph: {
    title: 'NxtWave CCBP 4.0 — Build Your First AI Project in 60 Minutes',
    description:
      'Live engineering workshop for B.Tech/BE students. Build and deploy a real AI project for campus placements with IITian mentors.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased bg-[#fbfaf7] dark:bg-[#0b0f17] text-neutral-900 dark:text-neutral-100 selection:bg-blue-100 dark:selection:bg-blue-950 selection:text-blue-900 dark:selection:text-blue-200">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:text-xs focus:font-mono focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Global NxtWave Navigation Bar */}
        <NxtWaveHeader />

        {/* Main Content Landmark */}
        <main id="main-content" className="flex-1 focus:outline-none">
          {children}
        </main>

        {/* Global NxtWave Footer */}
        <NxtWaveFooter />
      </body>
    </html>
  );
}
