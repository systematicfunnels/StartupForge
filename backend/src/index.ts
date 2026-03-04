import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { projectsRouter } from './routes/projects.routes';
import { generateRouter } from './routes/generate.routes';
import { billingRouter } from './routes/billing.routes';
import { authRouter } from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import { AI_PROVIDERS, getProviderStatus } from './services/ai/openai.client';
import { stripeWebhook } from './controllers/billing.controller';

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ── Stripe webhook — MUST come before express.json() to preserve raw body ─────
// FIX #3/#4: Register webhook at top level with raw body parser
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook as any
);

// ── Body parser ───────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
}));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ai: {
      configured: AI_PROVIDERS,
      priority: Object.entries(AI_PROVIDERS).filter(([, v]) => v).map(([k]) => k),
    },
  });
});

// GET /health/ai — deep check (makes real test calls to each provider)
app.get('/health/ai', async (_req, res) => {
  try {
    const status = await getProviderStatus();
    res.json({ providers: status });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/generate', generateRouter);
app.use('/api/billing', billingRouter);

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`StartupForge API running on port ${PORT}`);
  logger.info(AI_PROVIDERS, 'AI providers active');
});

export default app;
