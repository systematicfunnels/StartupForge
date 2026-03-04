import 'dotenv/config';
/**
 * ============================================================
 * Multi-Provider AI Client — automatic fallback
 * ============================================================
 * Priority order:
 *   1. OpenAI GPT-4o            — best quality (paid)
 *   2. Google Gemini 1.5 Flash  — FREE: 1,500 req/day, no CC needed
 *   3. Groq llama-3.3-70b       — FREE: 14,400 req/day, ultra-fast
 *
 * Get free keys:
 *   Gemini → https://aistudio.google.com/app/apikey
 *   Groq   → https://console.groq.com/keys
 *
 * Set in .env (any combination works — at least one required):
 *   OPENAI_API_KEY=sk-...
 *   GEMINI_API_KEY=AIza...
 *   GROQ_API_KEY=gsk_...
 * ============================================================
 */

import { prisma } from '../../db/prisma.client';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/errors';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface AICallOptions {
  userId: string;
  projectId: string;
  step: number;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface AICallResult {
  text: string;
  tokensIn: number;
  tokensOut: number;
  costUsd: number;
  provider: string;
  model: string;
}

interface RawResult {
  text: string;
  model: string;
  tokensIn: number;
  tokensOut: number;
}

// ── Startup: validate at least one key exists ─────────────────────────────────
export const AI_PROVIDERS = {
  openai: !!process.env.OPENAI_API_KEY,
  gemini: !!process.env.GEMINI_API_KEY,
  groq:   !!process.env.GROQ_API_KEY,
};

if (!Object.values(AI_PROVIDERS).some(Boolean)) {
  throw new Error(
    '\n[AI Config] No AI provider configured. Set at least one key in .env:\n' +
    '  OPENAI_API_KEY  → https://platform.openai.com/api-keys (paid)\n' +
    '  GEMINI_API_KEY  → https://aistudio.google.com/app/apikey (FREE)\n' +
    '  GROQ_API_KEY    → https://console.groq.com/keys (FREE)\n'
  );
}

logger.info(AI_PROVIDERS, '[AI] Configured providers');

// ── Cost table (USD per 1K tokens) ────────────────────────────────────────────
const COSTS: Record<string, { in: number; out: number }> = {
  'gpt-4o':                    { in: 0.005,   out: 0.015   },
  'gpt-4o-mini':               { in: 0.00015, out: 0.0006  },
  'gemini-1.5-flash':          { in: 0,       out: 0       }, // free tier
  'llama-3.3-70b-versatile':   { in: 0,       out: 0       }, // free tier
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider 1: OpenAI
// ─────────────────────────────────────────────────────────────────────────────
async function tryOpenAI(sys: string, user: string, maxTokens: number): Promise<RawResult> {
  const { default: OpenAI } = await import('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = 'gpt-4o';

  const res = await client.chat.completions.create({
    model,
    max_tokens: maxTokens,
    temperature: 0.7,
    messages: [
      { role: 'system', content: sys  },
      { role: 'user',   content: user },
    ],
  });

  const text = res.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenAI returned empty response');

  return {
    text,
    model,
    tokensIn:  res.usage?.prompt_tokens     ?? 0,
    tokensOut: res.usage?.completion_tokens ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 2: Google Gemini Flash (FREE tier)
// 1,500 requests/day · 1,000,000 tokens/minute · No credit card
// Key: https://aistudio.google.com/app/apikey
// ─────────────────────────────────────────────────────────────────────────────
async function tryGemini(sys: string, user: string, maxTokens: number): Promise<RawResult> {
  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: sys }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(`Gemini ${res.status}: ${err?.error?.message ?? 'Unknown error'}`);
  }

  const data = await res.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error('Gemini returned empty response');

  return {
    text,
    model,
    tokensIn:  data?.usageMetadata?.promptTokenCount     ?? 0,
    tokensOut: data?.usageMetadata?.candidatesTokenCount ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider 3: Groq — Llama 3.3 70B (FREE tier)
// 14,400 requests/day · 500,000 tokens/day · No credit card
// Key: https://console.groq.com/keys
// ─────────────────────────────────────────────────────────────────────────────
async function tryGroq(sys: string, user: string, maxTokens: number): Promise<RawResult> {
  const model = 'llama-3.3-70b-versatile';

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0.7,
      messages: [
        { role: 'system', content: sys  },
        { role: 'user',   content: user },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(`Groq ${res.status}: ${err?.error?.message ?? 'Unknown error'}`);
  }

  const data = await res.json() as any;
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('Groq returned empty response');

  return {
    text,
    model,
    tokensIn:  data?.usage?.prompt_tokens     ?? 0,
    tokensOut: data?.usage?.completion_tokens ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// callAI — tries providers in priority order, falls back automatically
// ─────────────────────────────────────────────────────────────────────────────
export async function callAI(opts: AICallOptions): Promise<AICallResult> {
  const { userId, projectId, step, systemPrompt, userPrompt, maxTokens = 1500 } = opts;

  // Build ordered provider chain based on what's configured
  const chain: Array<{ name: string; fn: () => Promise<RawResult> }> = [];
  if (AI_PROVIDERS.openai) chain.push({ name: 'openai', fn: () => tryOpenAI(systemPrompt, userPrompt, maxTokens) });
  if (AI_PROVIDERS.gemini) chain.push({ name: 'gemini', fn: () => tryGemini(systemPrompt, userPrompt, maxTokens) });
  if (AI_PROVIDERS.groq)   chain.push({ name: 'groq',   fn: () => tryGroq(systemPrompt, userPrompt, maxTokens) });

  const errors: string[] = [];

  for (const { name, fn } of chain) {
    try {
      logger.info({ step }, `[AI] Calling ${name}`);
      const raw = await fn();

      const costRate = COSTS[raw.model] ?? { in: 0, out: 0 };
      const costUsd = (raw.tokensIn / 1000) * costRate.in + (raw.tokensOut / 1000) * costRate.out;

      // Fire-and-forget usage log
      prisma.aiUsageLog
        .create({ data: { userId, projectId, step, tokensIn: raw.tokensIn, tokensOut: raw.tokensOut, costUsd, model: raw.model } })
        .catch((e: Error) => logger.error({ error: e.message }, '[AI] Failed to log usage'));

      logger.info({ model: raw.model, step, tokensIn: raw.tokensIn, tokensOut: raw.tokensOut }, `[AI] Success via ${name}`);

      return { text: raw.text, tokensIn: raw.tokensIn, tokensOut: raw.tokensOut, costUsd, provider: name, model: raw.model };

    } catch (err: any) {
      const msg = err?.message ?? String(err);
      errors.push(`${name}: ${msg}`);
      logger.warn({ error: msg, step }, `[AI] ${name} failed, trying next provider`);
    }
  }

  // All providers exhausted
  throw new AppError(
    `All AI providers failed at step ${step}.\n` + errors.join('\n'),
    502
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Health check endpoint helper
// ─────────────────────────────────────────────────────────────────────────────
export async function getProviderStatus(): Promise<Record<string, string>> {
  const status: Record<string, string> = {};

  const ping = 'Reply with exactly: OK';

  if (AI_PROVIDERS.openai) {
    await tryOpenAI('Test', ping, 5).then(() => { status.openai = 'ok'; }).catch(e => { status.openai = `error: ${e.message}`; });
  } else {
    status.openai = 'not configured';
  }

  if (AI_PROVIDERS.gemini) {
    await tryGemini('Test', ping, 5).then(() => { status.gemini = 'ok'; }).catch(e => { status.gemini = `error: ${e.message}`; });
  } else {
    status.gemini = 'not configured';
  }

  if (AI_PROVIDERS.groq) {
    await tryGroq('Test', ping, 5).then(() => { status.groq = 'ok'; }).catch(e => { status.groq = `error: ${e.message}`; });
  } else {
    status.groq = 'not configured';
  }

  return status;
}
