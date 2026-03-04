import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { prisma } from '../db/prisma.client';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/errors';

// Called on first login — syncs Clerk user to our DB
export async function syncUser(req: Request & { auth?: { userId?: string } }, res: Response, next: NextFunction) {
  try {
    const clerkId = req.auth?.userId;
    if (!clerkId) throw new AppError('Unauthorized', 401);

    const clerkUser = await clerkClient.users.getUser(clerkId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) throw new AppError('No email found on Clerk user', 400);

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: {
        email,
        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
      },
      create: {
        clerkId,
        email,
        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
        plan: 'starter',
        creditsUsed: 0,
        creditsLimit: 10,
      },
    });

    res.json({ user: { id: user.id, email: user.email, plan: user.plan } });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}
