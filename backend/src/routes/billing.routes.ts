import { Router } from 'express';
import { requireAuth, loadUser } from '../middleware/auth.middleware';
import { createCheckout, createPortal, stripeWebhook } from '../controllers/billing.controller';

export const billingRouter = Router();

// POST /api/billing/checkout — create Stripe checkout session
billingRouter.post('/checkout', requireAuth as any, loadUser as any, createCheckout as any);

// POST /api/billing/portal — open Stripe billing portal
billingRouter.post('/portal', requireAuth as any, loadUser as any, createPortal as any);
