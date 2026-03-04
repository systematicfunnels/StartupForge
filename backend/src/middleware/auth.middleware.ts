import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth, RequireAuthProp } from '@clerk/clerk-sdk-node';
import { prisma } from '../db/prisma.client';
import { AppError } from '../utils/errors';

// FIX #5: Include all fields billing controller needs
export type AuthRequest = RequireAuthProp<Request> & {
  user?: {
    id: string;
    clerkId: string;
    email: string;
    plan: string;
    creditsUsed: number;
    creditsLimit: number;
    stripeCustomerId: string | null;
  };
};

// Clerk JWT verification
export const requireAuth = ClerkExpressRequireAuth();

// Load DB user and attach to request
export async function loadUser(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const clerkId = req.auth.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) throw new AppError('User not found. Please sign in again.', 404);

    req.user = {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      plan: user.plan,
      creditsUsed: user.creditsUsed,
      creditsLimit: user.creditsLimit,
      stripeCustomerId: user.stripeCustomerId,
    };

    next();
  } catch (err) {
    next(err);
  }
}

// Enforce credit limits (agency plan is unlimited)
export function requireCredits(req: AuthRequest, _res: Response, next: NextFunction) {
  if (!req.user) return next(new AppError('Unauthorized', 401));
  if (req.user.plan === 'agency') return next();
  if (req.user.creditsUsed >= req.user.creditsLimit) {
    return next(new AppError('Credit limit reached. Please upgrade your plan.', 402));
  }
  next();
}
