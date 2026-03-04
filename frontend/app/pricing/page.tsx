'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { billingApi } from '@/lib/api';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$12',
    period: '/mo',
    desc: 'For exploring ideas',
    color: '#94A3B8',
    highlight: false,
    features: [
      '10 blueprints/month',
      'Full 10-step analysis',
      'Markdown export',
      'Save up to 10 projects',
      'Email support',
    ],
    notIncluded: ['Regenerate sections', 'Priority queue'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    period: '/mo',
    desc: 'For serious builders',
    color: '#00D4FF',
    highlight: true,
    features: [
      '50 blueprints/month',
      'Full 10-step analysis',
      'Markdown export',
      'Unlimited saved projects',
      'Regenerate individual sections',
      'Priority generation queue',
      'Priority support',
    ],
    notIncluded: [],
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$79',
    period: '/mo',
    desc: 'For teams & agencies',
    color: '#A78BFA',
    highlight: false,
    features: [
      'Unlimited blueprints',
      'Full 10-step analysis',
      'Markdown export',
      'Unlimited saved projects',
      'Regenerate individual sections',
      'Priority generation queue',
      'Team workspace (coming soon)',
      'White-label export (coming soon)',
      'Dedicated support',
    ],
    notIncluded: [],
  },
];

const FAQ = [
  {
    q: 'What counts as one blueprint?',
    a: "One blueprint = one complete 10-step AI analysis for one startup idea. Regenerating individual sections doesn't use additional credits.",
  },
  {
    q: 'How good is the output quality?',
    a: 'All outputs are powered by GPT-4o (or Gemini/Groq fallback) with production-grade prompts. Each step feeds into the next, producing coherent, idea-specific blueprints — not generic templates.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from your dashboard at any time. Your access continues until the end of the billing period. No questions asked.',
  },
  {
    q: 'What if I need more than 50 blueprints?',
    a: 'The Agency plan includes unlimited blueprints. Contact us if you need a custom enterprise arrangement.',
  },
  {
    q: 'Is there a free trial?',
    a: 'New accounts get 10 free blueprints on the Starter plan — no credit card required. You only need to upgrade when you want more.',
  },
];

export default function PricingPage() {
  const { isSignedIn, getToken } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(planId: string) {
    if (!isSignedIn) {
      window.location.href = '/auth/signup';
      return;
    }
    try {
      setLoading(planId);
      const token = await getToken();
      const { url } = await billingApi.checkout(planId, token!);
      window.location.href = url;
    } catch (err: any) {
      alert(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D4FF]/8 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-mono mb-6">
            <Zap className="w-3 h-3" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl font-black text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            Start free. Scale when ready.
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Every plan includes the full 10-step blueprint. No hidden fees.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`card p-6 flex flex-col relative ${
                plan.highlight ? 'border-[#00D4FF]/30' : ''
              }`}
              style={plan.highlight ? { background: 'rgba(0,212,255,0.025)' } : {}}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-info font-mono text-[10px] px-3 py-1 font-bold">Most Popular</span>
                </div>
              )}

              {/* Plan info */}
              <div className="mb-6">
                <div
                  className="text-[11px] font-bold font-mono tracking-widest mb-2"
                  style={{ color: plan.color }}
                >
                  {plan.name.toUpperCase()}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {plan.price}
                  </span>
                  <span className="text-slate-500 text-sm pb-1.5 font-mono">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-500">{plan.desc}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-xs">
                    <Check
                      className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
                      style={{ color: plan.color }}
                    />
                    <span className={f.includes('coming soon') ? 'text-slate-600' : 'text-slate-300'}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  loading === plan.id ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'
                } ${
                  plan.highlight
                    ? 'bg-[#00D4FF] text-[#080B14] hover:bg-[#00BFE8]'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                {loading === plan.id ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current/20 border-t-current rounded-full animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    {isSignedIn ? `Upgrade to ${plan.name}` : `Start ${plan.name}`}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-slate-600 font-mono mb-16">
          Powered by Stripe · 7-day money-back guarantee · Cancel anytime · No contracts
        </p>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-white text-center mb-8" style={{ fontFamily: 'Syne, sans-serif' }}>
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQ.map(item => (
              <div key={item.q} className="card p-5">
                <div className="text-sm font-semibold text-white mb-2">{item.q}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-xs text-slate-600 font-mono mb-3">
            Questions?{' '}
            <a href="mailto:hello@startupforge.ai" className="text-[#00D4FF] hover:underline">
              hello@startupforge.ai
            </a>
          </p>
          {!isSignedIn && (
            <Link href="/auth/signup" className="btn-primary px-8 py-3">
              Start Free — 10 Blueprints Included
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
