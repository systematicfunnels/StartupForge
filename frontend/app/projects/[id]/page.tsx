'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Download, RefreshCw, ArrowLeft, ChevronDown, ChevronRight,
  AlertTriangle, CheckCircle2, Loader2, Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { projectsApi, generateApi } from '@/lib/api';
import { Project, AiOutput, STEP_LABELS, STEP_ICONS, GenerationProgress } from '@/types';

const STEP_COLORS: Record<number, string> = {
  1: '#00D4FF', 2: '#A78BFA', 3: '#34D399', 4: '#F59E0B', 5: '#F87171',
  6: '#60A5FA', 7: '#C084FC', 8: '#2DD4BF', 9: '#FB923C', 10: '#4ADE80',
};

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { getToken } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [progress, setProgress] = useState<GenerationProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [regenStep, setRegenStep] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const loadProject = useCallback(async () => {
    try {
      const token = await getToken();
      const { project: p } = await projectsApi.get(id, token!);
      setProject(p);
      // Auto-select first completed step
      if (p.outputs?.length) {
        setActiveStep(s => s === 1 ? (p.outputs![0].step) : s);
      }
      return p;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  // Start progress tracking (SSE + polling fallback)
  useEffect(() => {
    if (!project || (project.status !== 'generating' && project.status !== 'pending')) return;

    let cancelled = false;

    // Polling fallback — reliable even when SSE can't send auth header
    pollRef.current = setInterval(async () => {
      if (cancelled) return;
      try {
        const token = await getToken();
        const { project: p } = await projectsApi.get(id, token!);
        setProject(p);
        if (p.outputs?.length) {
          setProgress({
            type: 'progress',
            step: p.generationStep,
            stepLabel: STEP_LABELS[p.generationStep] || 'Generating...',
            percent: Math.round((p.generationStep / 10) * 100),
            status: p.status,
          });
        }
        if (p.status === 'done' || p.status === 'failed') {
          clearInterval(pollRef.current!);
          setProgress(null);
        }
      } catch {}
    }, 2500);

    // SSE for faster updates (when available)
    async function connectSSE() {
      const token = await getToken();
      if (cancelled) return;
      const es = new EventSource(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/generate/${id}/status?token=${encodeURIComponent(token!)}`
      );
      esRef.current = es;

      es.onmessage = (event) => {
        try {
          const data: GenerationProgress = JSON.parse(event.data);
          setProgress(data);
          if (data.type === 'complete') {
            es.close();
            loadProject();
          }
        } catch {}
      };

      es.onerror = () => { es.close(); };
    }

    connectSSE();

    return () => {
      cancelled = true;
      clearInterval(pollRef.current!);
      esRef.current?.close();
    };
  }, [project?.status, id, getToken, loadProject]);

  useEffect(() => { loadProject(); }, [loadProject]);

  async function handleExport() {
    if (!project) return;
    try {
      setExporting(true);
      const token = await getToken();
      const res = await projectsApi.exportMarkdown(id, token!);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-blueprint.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setExporting(false);
    }
  }

  async function handleRegen(step: number) {
    try {
      setRegenStep(step);
      const token = await getToken();
      await generateApi.regenerateStep(id, step, token!);
      await loadProject();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRegenStep(null);
    }
  }

  const outputs = project?.outputs ?? [];
  const activeOutput = outputs.find(o => o.step === activeStep);
  const isGenerating = project?.status === 'generating' || project?.status === 'pending';
  const isDone = project?.status === 'done';
  const isFailed = project?.status === 'failed';
  const currentStep = progress?.step ?? project?.generationStep ?? 0;

  // ── Loading skeleton
  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="skeleton h-8 w-72 rounded-lg mb-8" />
        <div className="grid grid-cols-4 gap-5">
          <div className="skeleton h-[520px] rounded-xl" />
          <div className="col-span-3 skeleton h-[520px] rounded-xl" />
        </div>
      </div>
    </div>
  );

  // ── Error state
  if (error || !project) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-5 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-6">{error || 'Project not found'}</p>
        <Link href="/dashboard" className="btn-secondary">← Back to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="btn-ghost p-2">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-white truncate" style={{ fontFamily: 'Syne, sans-serif' }}>
              {project.title}
            </h1>
            <p className="text-xs text-slate-500 font-mono truncate mt-0.5 max-w-xl">{project.idea}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isDone && (
              <button onClick={handleExport} disabled={exporting} className="btn-secondary text-xs">
                <Download className="w-3.5 h-3.5" />
                {exporting ? 'Exporting...' : 'Export .md'}
              </button>
            )}
          </div>
        </div>

        {/* Generation progress bar */}
        {isGenerating && (
          <div className="card p-5 mb-6 border-amber-500/20" style={{ background: 'rgba(251,191,36,0.03)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span className="text-sm font-semibold text-amber-300">Generating Blueprint</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {currentStep}/10 · {progress?.percent ?? Math.round((currentStep / 10) * 100)}%
              </span>
            </div>
            {/* Step bars */}
            <div className="grid grid-cols-10 gap-1.5 mb-3">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(step => (
                <div
                  key={step}
                  title={STEP_LABELS[step]}
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ background: step <= currentStep ? STEP_COLORS[step] : 'rgba(255,255,255,0.07)' }}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {progress?.stepLabel || STEP_LABELS[currentStep] || 'Initializing...'}
            </p>
          </div>
        )}

        {/* Done banner */}
        {isDone && outputs.length === 10 && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 mb-6 fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-300">Blueprint complete — all 10 sections generated.</p>
            <button onClick={handleExport} disabled={exporting} className="ml-auto btn-ghost text-xs text-emerald-400 hover:text-emerald-300 flex-shrink-0">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        )}

        {/* Failed banner */}
        {isFailed && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">Generation failed. You can regenerate individual sections below.</p>
          </div>
        )}

        {/* Initial generating — no outputs yet */}
        {outputs.length === 0 && isGenerating && (
          <div className="card p-20 text-center">
            <div className="relative inline-flex mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#00D4FF]/10 border border-[#00D4FF]/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-[#00D4FF] glow-pulse" />
              </div>
            </div>
            <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
              Building your blueprint
            </h3>
            <p className="text-sm text-slate-400 font-mono mb-1">
              {progress?.stepLabel || 'Initializing AI pipeline...'}
            </p>
            <p className="text-xs text-slate-600 font-mono">~60 seconds · sections appear as they complete</p>
          </div>
        )}

        {/* Main layout — sidebar + content */}
        {outputs.length > 0 && (
          <div className="grid grid-cols-4 gap-5">
            {/* Sidebar */}
            <div className="col-span-1">
              <div className="card p-2 sticky top-20">
                <div className="text-[10px] text-slate-600 font-mono px-2 py-1.5 mb-0.5 uppercase tracking-widest">
                  Sections
                </div>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(step => {
                  const output = outputs.find(o => o.step === step);
                  const isActive = activeStep === step;
                  const color = STEP_COLORS[step];

                  return (
                    <button
                      key={step}
                      onClick={() => output && setActiveStep(step)}
                      disabled={!output}
                      className={`w-full text-left px-2.5 py-2.5 rounded-lg flex items-center gap-2 transition-all mb-0.5 ${
                        isActive
                          ? 'bg-white/8 text-white'
                          : output
                          ? 'text-slate-500 hover:bg-white/4 hover:text-slate-300'
                          : 'text-slate-700 cursor-not-allowed opacity-40'
                      }`}
                    >
                      <span className="text-sm flex-shrink-0">{STEP_ICONS[step]}</span>
                      <span className="text-[11px] font-mono truncate flex-1">{STEP_LABELS[step]}</span>
                      {output ? (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: isActive ? color : '#34D399' }}
                        />
                      ) : isGenerating && step === currentStep + 1 ? (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400 animate-pulse" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="col-span-3 min-w-0">
              {activeOutput ? (
                <div className="card p-6 fade-in" key={activeOutput.step}>
                  <div className="flex items-start justify-between mb-6 pb-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          background: `${STEP_COLORS[activeOutput.step]}15`,
                          border: `1px solid ${STEP_COLORS[activeOutput.step]}25`,
                        }}
                      >
                        {STEP_ICONS[activeOutput.step]}
                      </div>
                      <div>
                        <h2 className="font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                          {STEP_LABELS[activeOutput.step]}
                        </h2>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {activeOutput.tokensUsed.toLocaleString()} tokens · {activeOutput.model}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRegen(activeOutput.step)}
                      disabled={regenStep === activeOutput.step}
                      className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${regenStep === activeOutput.step ? 'animate-spin' : ''}`} />
                      {regenStep === activeOutput.step ? 'Regenerating...' : 'Regenerate'}
                    </button>
                  </div>
                  <BlueprintContent
                    content={activeOutput.content}
                    accentColor={STEP_COLORS[activeOutput.step]}
                  />
                </div>
              ) : (
                <div className="card p-16 text-center">
                  <p className="text-sm text-slate-500">Select a section from the sidebar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Blueprint content renderer ───────────────────────────────────────────────
function BlueprintContent({ content, accentColor }: { content: Record<string, unknown>; accentColor: string }) {
  if (!content || typeof content !== 'object') {
    return <pre className="text-xs text-slate-400 whitespace-pre-wrap">{String(content)}</pre>;
  }
  if ('raw' in content) {
    return <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">{String((content as any).raw)}</pre>;
  }
  return (
    <div className="space-y-3">
      {Object.entries(content).map(([key, value]) => (
        <BlueprintField key={key} fieldKey={key} value={value} accentColor={accentColor} />
      ))}
    </div>
  );
}

function BlueprintField({ fieldKey, value, accentColor }: { fieldKey: string; value: unknown; accentColor: string }) {
  const [open, setOpen] = useState(true);
  if (value === null || value === undefined || value === '') return null;

  const label = fieldKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .replace(/_/g, ' ');

  const isComplex = typeof value === 'object' && value !== null;

  return (
    <div className="border border-white/[0.06] rounded-lg overflow-hidden">
      {isComplex ? (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
          >
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest font-mono">{label}</span>
            {open
              ? <ChevronDown className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
              : <ChevronRight className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
            }
          </button>
          {open && (
            <div className="px-4 py-4">
              <ValueRenderer value={value} accentColor={accentColor} />
            </div>
          )}
        </>
      ) : (
        <div className="px-4 py-3">
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1.5">{label}</div>
          <div className="text-sm text-slate-200 leading-relaxed">{String(value)}</div>
        </div>
      )}
    </div>
  );
}

function ValueRenderer({ value, accentColor }: { value: unknown; accentColor: string }) {
  if (Array.isArray(value)) {
    return (
      <ul className="space-y-2.5">
        {value.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="flex-shrink-0 mt-[5px] w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
            {typeof item === 'object' && item !== null ? (
              <div className="text-xs text-slate-400 space-y-1 flex-1">
                {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-slate-300 font-semibold">
                      {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:{' '}
                    </span>
                    <span>{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-300 leading-relaxed">{String(item)}</span>
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="grid gap-3">
        {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
          <div key={k} className="pl-3 border-l-2" style={{ borderColor: `${accentColor}35` }}>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-0.5">
              {k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace(/_/g, ' ')}
            </div>
            {Array.isArray(v) ? (
              <ul className="space-y-0.5">
                {v.map((i, idx) => (
                  <li key={idx} className="text-xs text-slate-300">
                    · {typeof i === 'object' ? JSON.stringify(i) : String(i)}
                  </li>
                ))}
              </ul>
            ) : typeof v === 'object' && v !== null ? (
              <div className="text-xs text-slate-400 space-y-0.5">
                {Object.entries(v as Record<string, unknown>).map(([kk, vv]) => (
                  <div key={kk}>
                    <span className="text-slate-500">{kk}: </span>
                    {String(vv)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-200">{String(v ?? '')}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <span className="text-sm text-slate-200 leading-relaxed">{String(value)}</span>;
}
