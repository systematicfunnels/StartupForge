import { Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../middleware/auth.middleware';
import { prisma } from '../db/prisma.client';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
if (!process.env.STRIPE_WEBHOOK_SECRET) throw new Error('STRIPE_WEBHOOK_SECRET is not set');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

const PLAN_PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  pro: process.env.STRIPE_PRICE_PRO!,
  agency: process.env.STRIPE_PRICE_AGENCY!,
};

const PLAN_CREDITS: Record<string, number> = {
  starter: 10,
  pro: 50,
  agency: 999999,
};

// ─── Create checkout session ───────────────────────────────────────────────────
export async function createCheckout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { plan } = req.body;

    if (!plan || !PLAN_PRICE_IDS[plan]) {
      throw new AppError('Invalid plan. Must be: starter, pro, or agency', 400);
    }

    const priceId = PLAN_PRICE_IDS[plan];
    if (!priceId) throw new AppError(`Stripe price ID for plan "${plan}" is not configured`, 500);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: { userId: req.user!.id, plan },
      ...(req.user!.stripeCustomerId
        ? { customer: req.user!.stripeCustomerId as string }
        : { customer_email: req.user!.email as string }
      ),
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

// ─── Customer portal ───────────────────────────────────────────────────────────
export async function createPortal(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });

    if (!user?.stripeCustomerId) {
      throw new AppError('No active subscription found', 400);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

// ─── Stripe webhook handler ────────────────────────────────────────────────────
export async function stripeWebhook(req: any, res: Response, next: NextFunction) {
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    logger.error('Stripe webhook signature verification failed');
    return res.status(400).json({ error: 'Webhook signature invalid' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, plan } = session.metadata ?? {};
        if (!userId || !plan) break;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: plan as any,
            stripeCustomerId: session.customer as string,
            creditsUsed: 0,
            creditsLimit: PLAN_CREDITS[plan] ?? 10,
          },
        });

        await prisma.subscription.upsert({
          where: { userId },
          update: { plan: plan as any, status: 'active', stripeSubId: session.subscription as string, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
          create: {
            userId,
            stripeSubId: session.subscription as string,
            plan: plan as any,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const subscription = await prisma.subscription.findUnique({ where: { stripeSubId: sub.id } });
        if (subscription) {
          await prisma.user.update({
            where: { id: subscription.userId },
            data: { plan: 'starter', creditsLimit: 10, creditsUsed: 0 },
          });
          await prisma.subscription.update({
            where: { stripeSubId: sub.id },
            data: { status: 'canceled' },
          });
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}
