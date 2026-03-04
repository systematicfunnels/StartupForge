import { Router } from 'express';
import { requireAuth, loadUser } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimit.middleware';
import { startGeneration, getStatus, regenerateStep } from '../controllers/generate.controller';

export const generateRouter = Router();

// POST /api/generate/:projectId/start — requires auth
generateRouter.post('/:projectId/start', requireAuth as any, loadUser as any, aiRateLimiter, startGeneration as any);

// GET /api/generate/:projectId/status — NO requireAuth here (SSE can't send headers)
// Auth is handled inside getStatus via ?token= query param
generateRouter.get('/:projectId/status', getStatus as any);

// POST /api/generate/:projectId/step/:stepNumber — requires auth
generateRouter.post('/:projectId/step/:stepNumber', requireAuth as any, loadUser as any, aiRateLimiter, regenerateStep as any);
