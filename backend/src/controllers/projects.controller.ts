import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma.client';
import { AppError, NotFoundError, ValidationError } from '../utils/errors';
import { generateMarkdownExport } from '../services/export.service';
import { STEP_LABELS } from '../services/ai/prompts/all-prompts';

// ─── List projects ─────────────────────────────────────────────────────────────
export async function listProjects(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, title: true, idea: true, status: true,
        generationStep: true, createdAt: true, updatedAt: true,
        _count: { select: { outputs: true } },
      },
    });

    res.json({ projects });
  } catch (err) {
    next(err);
  }
}

// ─── Get single project with all outputs ──────────────────────────────────────
export async function getProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id, userId: req.user!.id },
      include: {
        outputs: { orderBy: { step: 'asc' } },
      },
    });

    if (!project) throw new NotFoundError('Project');

    res.json({ project });
  } catch (err) {
    next(err);
  }
}

// ─── Create project ────────────────────────────────────────────────────────────
export async function createProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { idea, targetAudience, problem, title } = req.body;

    if (!idea || typeof idea !== 'string') {
      throw new ValidationError('idea is required and must be a string');
    }
    if (idea.trim().length < 10) {
      throw new ValidationError('idea must be at least 10 characters');
    }
    if (idea.length > 2000) {
      throw new ValidationError('idea must be under 2000 characters');
    }

    const project = await prisma.project.create({
      data: {
        userId: req.user!.id,
        title: (title?.trim() || idea.slice(0, 60)) as string,
        idea: idea.trim(),
        targetAudience: targetAudience?.trim() || '',
        problem: problem?.trim() || '',
        status: 'pending',
      },
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
}

// ─── Delete project ────────────────────────────────────────────────────────────
export async function deleteProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id, userId: req.user!.id },
    });

    if (!project) throw new NotFoundError('Project');

    await prisma.project.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// ─── Export blueprint ──────────────────────────────────────────────────────────
export async function exportProject(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const format = (req.query.format as string) || 'markdown';

    const project = await prisma.project.findUnique({
      where: { id, userId: req.user!.id },
      include: { outputs: { orderBy: { step: 'asc' } } },
    });

    if (!project) throw new NotFoundError('Project');
    if (project.status !== 'done') {
      throw new AppError('Blueprint is not fully generated yet', 400);
    }

    if (format === 'markdown') {
      const markdown = generateMarkdownExport(project as any, STEP_LABELS);
      res.setHeader('Content-Type', 'text/markdown');
      res.setHeader('Content-Disposition', `attachment; filename="${project.title.replace(/\s+/g, '-')}-blueprint.md"`);
      return res.send(markdown);
    }

    throw new AppError('Invalid export format. Use: markdown', 400);
  } catch (err) {
    next(err);
  }
}
