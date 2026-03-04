import { Router } from 'express';
import { requireAuth, loadUser, AuthRequest } from '../middleware/auth.middleware';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';
import {
  listProjects,
  getProject,
  createProject,
  deleteProject,
  exportProject,
} from '../controllers/projects.controller';

export const projectsRouter = Router();

// All project routes require authentication
projectsRouter.use(requireAuth as any, loadUser as any, apiRateLimiter);

projectsRouter.get('/', listProjects as any);
projectsRouter.post('/', createProject as any);
projectsRouter.get('/:id', getProject as any);
projectsRouter.delete('/:id', deleteProject as any);
projectsRouter.get('/:id/export', exportProject as any);
