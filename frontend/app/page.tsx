import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { ArrowRight, Zap, Shield, Clock, TrendingUp } from 'lucide-react';

const steps = [
  { n: '01', title: 'Enter Your Idea', desc: 'Describe your startup idea, target audience, and the problem you solve.' },
  { n: '02', title: 'AI Generates Blueprint', desc: '10 sequential AI analyses build your complete startup plan in ~60 seconds.' },
  { n: '03', title: 'Export & Build', desc: 'Download your blueprint as PDF or Markdown and start building.' },
];

const features = [
  { icon: '🔍', title: 'Idea Validation', desc: 'Market demand, competition, TAM estimate, and viability score.' },
  { icon: '🎯', title: 'Product Strategy', desc: 'User personas, positioning, pricing tiers, and north star metric.' },
  { icon: '📦', title: 'MVP Scope', desc: 'Core feature list, user flow, and a 14-day build roadmap.' },
  { icon: '🏗️', title: 'System Architecture', desc: 'Tech stack, component diagram, and cost estimates.' },
  { icon: '🗄️', title: 'Database Design', desc: 'Full schema with tables, relationships, and Prisma models.' },
  { icon: '⚡', title: 'Backend API Plan', desc: 'Every endpoint, middleware stack, and folder structure.' },
  { icon: '🎨', title: 'Frontend Structure', desc: 'Pages, components, state management approach.' },
  { icon: '🚀', title: 'DevOps Plan', desc: 'CI/CD pipeline, hosting config, monitoring setup.' },
  { icon: '📣', title: 'Launch Strategy', desc: 'Pre-launch checklist, first 100 users plan, launch platforms.' },
  { icon: '📈', title: 'Growth Engine', desc: 'Viral loops, 90-day plan, and revenue projections.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00D4FF]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs mb-8">
            <Zap className="w-3 h-3" />
            Full startup blueprint in ~60 seconds
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Turn any startup idea into a{' '}
            <span className="gradient-text">complete blueprint</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI Startup Builder runs 10 sequential analyses on your idea — validation, MVP scope, architecture, database, backend, frontend, DevOps, launch plan, and growth strategy.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/signup" className="btn-primary flex items-center gap-2 px-6 py-3 text-sm">
              Build Your Blueprint
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="btn-secondary px-6 py-3 text-sm">
              View Pricing
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-xs text-slate-600 mt-8">
            No credit card required · 10 free analyses · Cancel anytime
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-white text-center mb-12" style={{ fontFamily: 'Syne, sans-serif' }}>
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.n} className="card p-6">
              <div className="text-3xl font-black text-white/10 mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
                {step.n}
              </div>
              <h3 className="font-bold text-white mb-2 text-sm">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-white/5">
        <h2 className="text-2xl font-bold text-white text-center mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          10 sections. Every section matters.
        </h2>
        <p className="text-slate-500 text-sm text-center mb-12">
          Each step builds on the previous — the result is a coherent, customized startup plan.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card p-4 hover:border-white/10 transition-colors group">
              <div className="text-xl mb-2">{f.icon}</div>
              <div className="text-xs font-bold text-white mb-1">{f.title}</div>
              <div className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-500 transition-colors">
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-3 gap-8 text-center">
          {[
            { n: '~60s', label: 'Average generation time' },
            { n: '10', label: 'AI-powered analyses' },
            { n: '100%', label: 'Customized to your idea' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-black gradient-text mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                {stat.n}
              </div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="card p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 to-[#A78BFA]/5 pointer-events-none" />
          <h2 className="text-3xl font-bold text-white mb-4 relative" style={{ fontFamily: 'Syne, sans-serif' }}>
            Ready to build your startup?
          </h2>
          <p className="text-slate-400 text-sm mb-8 relative">
            Start with 10 free analyses. No credit card required.
          </p>
          <Link href="/auth/signup" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm relative">
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-slate-600">
          <span>© 2025 AI Startup Builder</span>
          <div className="flex gap-6">
            <Link href="/pricing" className="hover:text-slate-400 transition-colors">Pricing</Link>
            <a href="mailto:hello@aistartupbuilder.com" className="hover:text-slate-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
