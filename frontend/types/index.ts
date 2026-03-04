export type Plan = 'starter' | 'pro' | 'agency';
export type ProjectStatus = 'pending' | 'generating' | 'done' | 'failed';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  name?: string;
  plan: Plan;
  creditsUsed: number;
  creditsLimit: number;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  idea: string;
  targetAudience?: string;
  problem?: string;
  status: ProjectStatus;
  generationStep: number;
  createdAt: string;
  updatedAt: string;
  outputs?: AiOutput[];
  _count?: { outputs: number };
}

export interface AiOutput {
  id: string;
  projectId: string;
  step: number;
  stepName: string;
  content: Record<string, unknown>;
  rawText: string;
  tokensUsed: number;
  model: string;
  createdAt: string;
}

export interface GenerationProgress {
  type: 'progress' | 'complete' | 'error';
  step?: number;
  totalSteps?: number;
  stepLabel?: string;
  status?: ProjectStatus;
  percent?: number;
  message?: string;
}

export const STEP_LABELS: Record<number, string> = {
  1: 'Idea Validation',
  2: 'Product Strategy',
  3: 'MVP Scope',
  4: 'System Architecture',
  5: 'Database Design',
  6: 'Backend API Plan',
  7: 'Frontend Structure',
  8: 'DevOps Plan',
  9: 'Launch Strategy',
  10: 'Growth Engine',
};

export const STEP_ICONS: Record<number, string> = {
  1: '🔍', 2: '🎯', 3: '📦', 4: '🏗️', 5: '🗄️',
  6: '⚡', 7: '🎨', 8: '🚀', 9: '📣', 10: '📈',
};

export const PLAN_LABELS: Record<Plan, string> = {
  starter: 'Starter',
  pro: 'Pro',
  agency: 'Agency',
};

export const PLAN_LIMITS: Record<Plan, number> = {
  starter: 10,
  pro: 50,
  agency: 999999,
};
