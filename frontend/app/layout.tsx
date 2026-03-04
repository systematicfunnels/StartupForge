import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

export const metadata: Metadata = {
  title: 'StartupForge — AI Startup Blueprint Generator',
  description: 'Enter your startup idea and get a complete 10-section blueprint powered by GPT-4o. Idea validation, MVP scope, architecture, launch strategy and more — in ~60 seconds.',
  openGraph: {
    title: 'StartupForge — AI Startup Blueprint Generator',
    description: 'Complete startup blueprint in 60 seconds.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" data-scroll-behavior="smooth">
        <head>
          {/* Fonts preloaded in globals.css via @import */}
        </head>
        <body
          className="bg-[#080B14] text-slate-200 antialiased"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
