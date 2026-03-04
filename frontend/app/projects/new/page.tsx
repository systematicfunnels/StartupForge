'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/Navbar';
import { projectsApi, generateApi } from '@/lib/api';
import { ArrowRight, Lightbulb, Users, AlertTriangle } from 'lucide-react';

const EXAMPLES = [
  { idea: 'AI tool that automatically writes and schedules LinkedIn posts based on your expertise', audience: 'Founders and consultants', problem: 'Maintaining consistent LinkedIn presence takes too much time' },
  { idea: 'SaaS that turns Notion docs into beautiful client-facing websites', audience: 'Freelancers and agencies', problem: 'Building a client portal requires too much dev work' },
  { idea: 'App that helps remote teams run async standup meetings with AI summaries', audience: 'Remote startup teams', problem: 'Live standups waste time across timezones' },
];

export default function NewProjectPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [form, setForm] = useState({ idea: '', targetAudience: '', problem: '', title: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function fillExample(ex: typeof EXAMPLES[0]) {
    setForm({ idea: ex.idea, targetAudience: ex.audience, problem: ex.problem, title: '' });
  }

  async function handleSubmit() {
    if (!form.idea.trim() || form.idea.trim().length < 10) {
      setError('Please describe your idea in at least 10 characters.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = await getToken();

      // 1. Create project
      const { project } = await projectsApi.create(form, token!);

      // 2. Kick off generation
      await generateApi.start(project.id, token!);

      // 3. Navigate to project page
      router.push(`/projects/${project.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create project. Please try again.');
      setLoading(false);
    }
  }

  const charCount = form.idea.length;
  const charWarning = charCount > 1800;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            Describe your startup idea
          </h1>
          <p className="text-sm text-slate-400">
            Be specific. The more detail you provide, the more actionable your blueprint will be.
          </p>
        </div>

        {/* Example ideas */}
        <div className="mb-8">
          <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            Try an example
          </div>
          <div className="space-y-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                onClick={() => fillExample(ex)}
                className="w-full text-left card p-3 hover:border-white/15 transition-colors"
              >
                <p className="text-xs text-slate-300 truncate">{ex.idea}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="card p-6 space-y-5">
          {/* Project name */}
          <div>
            <label className="label">Project Name (optional)</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. AI Meeting Summarizer (auto-generated if blank)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={100}
            />
          </div>

          {/* Idea */}
          <div>
            <label className="label">
              Startup Idea <span className="text-red-400">*</span>
            </label>
            <textarea
              className="input resize-none h-28"
              placeholder="Describe your startup idea in detail. What does it do? How does it work?"
              value={form.idea}
              onChange={(e) => setForm({ ...form, idea: e.target.value })}
              maxLength={2000}
            />
            <div className={`text-xs mt-1 text-right ${charWarning ? 'text-amber-400' : 'text-slate-600'}`}>
              {charCount}/2000
            </div>
          </div>

          {/* Target audience */}
          <div>
            <label className="label flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Target Audience
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Indie hackers, startup founders, SMB owners..."
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              maxLength={200}
            />
          </div>

          {/* Problem */}
          <div>
            <label className="label flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Problem Being Solved
            </label>
            <textarea
              className="input resize-none h-20"
              placeholder="What specific pain point does this solve? Why is it a problem worth solving?"
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
              maxLength={500}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || !form.idea.trim()}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#080B14]/30 border-t-[#080B14] rounded-full animate-spin" />
                Creating project...
              </>
            ) : (
              <>
                Generate Blueprint
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-xs text-slate-600 text-center">
            This will use 1 credit from your plan
          </p>
        </div>
      </div>
    </div>
  );
}
