'use client';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Plus, FolderOpen, Trash2, ArrowRight,
  AlertCircle, Sparkles, TrendingUp, CreditCard,
  CheckCircle2, Loader2, XCircle
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { projectsApi, authApi, billingApi } from '@/lib/api';
import { Project, User, PLAN_LABELS } from '@/types';

const STATUS_CFG: Record<string, { badge: string; label: string; dotClass: string }> = {
  done:       { badge: 'badge-success', label: 'Complete',      dotClass: 'bg-emerald-400' },
  generating: { badge: 'badge-warning', label: 'Generating...', dotClass: 'bg-amber-400 animate-pulse' },
  pending:    { badge: 'badge-muted',   label: 'Pending',       dotClass: 'bg-slate-600' },
  failed:     { badge: 'badge-error',   label: 'Failed',        dotClass: 'bg-red-400' },
};

function DashboardPageInner() {
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const upgraded = searchParams.get('upgraded') === 'true';

  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const token = await getToken();
      await authApi.sync(token!).catch(() => {}); // idempotent, ignore errors
      const [projData, userData] = await Promise.all([
        projectsApi.list(token!),
        authApi.me(token!),
      ]);
      setProjects(projData.projects ?? []);
      setUser(userData.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this project permanently?')) return;
    try {
      setDeletingId(id);
      const token = await getToken();
      await projectsApi.delete(id, token!);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  async function handlePortal() {
    try {
      setPortalLoading(true);
      const token = await getToken();
      const { url } = await billingApi.portal(token!);
      window.location.href = url;
    } catch (err: any) {
      alert(err.message || 'Could not open billing portal');
    } finally {
      setPortalLoading(false);
    }
  }

  const isAgency = user?.plan === 'agency';
  const creditsLeft = user && !isAgency ? Math.max(0, user.creditsLimit - user.creditsUsed) : null;
  const creditPct = user && !isAgency ? Math.min(100, (user.creditsUsed / user.creditsLimit) * 100) : 0;
  const completed = projects.filter(p => p.status === 'done').length;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-10">

        {/* Upgrade success banner */}
        {upgraded && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6 fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-300 font-medium">Plan upgraded! Your credits have been refreshed.</p>
          </div>
        )}

        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Dashboard
            </h1>
            {user && (
              <p className="text-xs text-slate-500 mt-0.5 font-mono">{user.email}</p>
            )}
          </div>
          <Link href="/projects/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            New Blueprint
          </Link>
        </div>

        {/* Stats grid */}
        {user && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {/* Plan */}
            <div className="card p-4">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Plan</div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{PLAN_LABELS[user.plan]}</span>
                <span className={user.plan === 'agency' ? 'badge-purple' : user.plan === 'pro' ? 'badge-info' : 'badge-muted'}>
                  {user.plan}
                </span>
              </div>
            </div>

            {/* Credits */}
            <div className="card p-4">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Credits</div>
              <div className="font-bold text-white text-sm mb-2">
                {isAgency ? '∞ Unlimited' : `${user.creditsUsed} / ${user.creditsLimit}`}
              </div>
              {!isAgency && (
                <div className="w-full bg-white/5 rounded-full h-1">
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{
                      width: `${creditPct}%`,
                      background: creditPct > 80 ? '#F87171' : '#00D4FF',
                    }}
                  />
                </div>
              )}
            </div>

            {/* Projects */}
            <div className="card p-4">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Projects</div>
              <div className="font-bold text-white text-sm">{projects.length}</div>
            </div>

            {/* Completed */}
            <div className="card p-4">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">Completed</div>
              <div className="font-bold text-white text-sm">{completed}</div>
            </div>
          </div>
        )}

        {/* Low credits warning */}
        {creditsLeft !== null && creditsLeft <= 2 && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-sm text-amber-300">
                {creditsLeft === 0
                  ? 'All credits used. Upgrade to generate more blueprints.'
                  : `Only ${creditsLeft} credit${creditsLeft !== 1 ? 's' : ''} left this month.`}
              </p>
            </div>
            <Link href="/pricing" className="btn-secondary text-xs flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Upgrade
            </Link>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 mb-6">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-[72px] rounded-xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="card p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center text-2xl mx-auto mb-5">
              🚀
            </div>
            <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              No blueprints yet
            </h3>
            <p className="text-xs text-slate-500 mb-6 max-w-xs mx-auto leading-relaxed">
              Enter your startup idea and get a complete 10-section blueprint in about 60 seconds.
            </p>
            <Link href="/projects/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Create Your First Blueprint
            </Link>
          </div>
        )}

        {/* Projects list */}
        {!loading && projects.length > 0 && (
          <div className="space-y-2">
            {projects.map(project => {
              const cfg = STATUS_CFG[project.status] || STATUS_CFG.pending;
              return (
                <div key={project.id} className="card-hover p-4 flex items-center gap-4 group">
                  {/* Icon */}
                  <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                    {project.status === 'done'       && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {project.status === 'generating' && <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />}
                    {project.status === 'failed'     && <XCircle className="w-4 h-4 text-red-400" />}
                    {project.status === 'pending'    && <FolderOpen className="w-4 h-4 text-slate-500" />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dotClass}`} />
                      <h3 className="font-semibold text-sm text-white truncate">{project.title}</h3>
                      <span className={`${cfg.badge} flex-shrink-0 text-[10px]`}>{cfg.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 truncate font-mono">{project.idea}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {project.status === 'generating' && (
                      <span className="text-xs text-amber-400 font-mono hidden sm:block">
                        {project.generationStep}/10
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={deletingId === project.id}
                      className="btn-danger px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <Link href={`/projects/${project.id}`} className="btn-secondary text-xs px-4 py-1.5">
                      Open <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Billing section */}
        {user && (
          <div className="mt-10 pt-8 border-t border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white mb-1">Subscription</div>
                <div className="text-xs text-slate-500 font-mono">
                  {PLAN_LABELS[user.plan]} ·{' '}
                  {isAgency ? 'Unlimited analyses' : `${user.creditsLimit} analyses/month`}
                </div>
              </div>
              <div className="flex gap-2">
                {user.plan !== 'agency' && (
                  <Link href="/pricing" className="btn-primary text-xs px-4 py-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {user.plan === 'starter' ? 'Upgrade Plan' : 'View Plans'}
                  </Link>
                )}
                {user.plan !== 'starter' && (
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {portalLoading ? 'Loading...' : 'Manage Billing'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardPageInner />
    </Suspense>
  );
}
