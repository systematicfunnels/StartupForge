import { Router } from 'express';
import { requireAuth, loadUser } from '../middleware/auth.middleware';
import { syncUser, getMe } from '../controllers/auth.controller';

export const authRouter = Router();

// POST /api/auth/sync — upserts Clerk user into our DB on first login
authRouter.post('/sync', requireAuth as any, syncUser as any);

// GET /api/auth/me — returns current DB user
authRouter.get('/me', requireAuth as any, loadUser as any, getMe as any);
