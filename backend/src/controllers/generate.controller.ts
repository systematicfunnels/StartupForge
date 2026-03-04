import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma.client';
import { runPipeline, runSingleStep } from '../services/ai/pipeline.service';
import { STEP_LABELS } from '../services/ai/prompts/all-prompts';
import { NotFoundError, AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';
import { verifyToken } from '@clerk/clerk-sdk-node';

// ─── Start full pipeline (returns immediately, runs in background) ─────────────
export async function startGeneration(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: req.user!.id },
    });

    if (!project) throw new NotFoundError('Project');
    if (project.status === 'generating') throw new AppError('Generation already in progress', 409);
    if (project.status === 'done') throw new AppError('Blueprint already generated. Use regenerate to refresh sections.', 409);

    // Check credits
    if (req.user!.plan !== 'agency' && req.user!.creditsUsed >= req.user!.creditsLimit) {
      throw new AppError('Credit limit reached. Please upgrade your plan.', 402);
    }

    // Run pipeline in background — don't await
    runPipeline(projectId, req.user!.id).catch((err) => {
      logger.error({ projectId, error: err.message }, 'Background pipeline error');
    });

    res.json({ message: 'Generation started', projectId });
  } catch (err) {
    next(err);
  }
}

// ─── SSE status stream ─────────────────────────────────────────────────────────
// FIX #20/#21: EventSource can't send Authorization header.
// We accept token as query param and verify it manually here.
// The route does NOT use requireAuth middleware.
export async function getStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId } = req.params;
    const token = req.query.token as string;

    // Verify token from query param
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    let userId: string;
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      userId = payload.sub;
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Look up DB user
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verify project belongs to this user
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: user.id },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // ── SSE setup ──────────────────────────────────────────────────────────────
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
    res.flushHeaders();

    const sendEvent = (data: object) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Poll DB every 1.5 seconds
    const interval = setInterval(async () => {
      try {
        const current = await prisma.project.findUnique({
          where: { id: projectId },
          select: { status: true, generationStep: true },
        });

        if (!current) {
          clearInterval(interval);
          sendEvent({ type: 'error', message: 'Project not found' });
          return res.end();
        }

        sendEvent({
          type: 'progress',
          step: current.generationStep,
          totalSteps: 10,
          stepLabel: STEP_LABELS[current.generationStep] ?? 'Starting...',
          status: current.status,
          percent: Math.round((current.generationStep / 10) * 100),
        });

        if (current.status === 'done' || current.status === 'failed') {
          clearInterval(interval);
          sendEvent({ type: 'complete', status: current.status });
          res.end();
        }
      } catch {
        clearInterval(interval);
        res.end();
      }
    }, 1500);

    // Clean up on client disconnect
    req.on('close', () => clearInterval(interval));
  } catch (err) {
    next(err);
  }
}

// ─── Regenerate a single step ──────────────────────────────────────────────────
export async function regenerateStep(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { projectId, stepNumber } = req.params;
    const step = parseInt(stepNumber, 10);

    if (isNaN(step) || step < 1 || step > 10) {
      throw new ValidationError('Step must be a number between 1 and 10');
    }

    await runSingleStep(projectId, req.user!.id, step);
    res.json({ message: `Step ${step} regenerated successfully`, step });
  } catch (err) {
    next(err);
  }
}
