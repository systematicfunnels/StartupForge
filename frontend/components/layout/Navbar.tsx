'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { LayoutDashboard, Plus, Zap } from 'lucide-react';

export function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#080B14]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#A78BFA] flex items-center justify-center text-sm">
            ⚡
          </div>
          <span className="font-bold text-sm text-white tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            StartupForge
          </span>
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-1">
          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/projects/new"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                New Project
              </Link>
              <div className="ml-2 pl-2 border-l border-white/10">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-7 h-7',
                    },
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <Link href="/pricing" className="btn-secondary text-xs px-4 py-2">
                Pricing
              </Link>
              <Link href="/auth/login" className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
