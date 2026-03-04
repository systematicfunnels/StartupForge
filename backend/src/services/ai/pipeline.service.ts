import { prisma } from '../../db/prisma.client';
import { callAI } from './openai.client';
import { PROMPT_MAP, STEP_NAMES, StepContext } from './prompts/all-prompts';
import { logger } from '../../utils/logger';
import { AppError } from '../../utils/errors';

const TOTAL_STEPS = 10;
const STEP_DELAY_MS = 400; // Small delay to avoid burst rate limits

/**
 * Run the full 10-step AI generation pipeline for a project.
 * - Each step builds on previous outputs
 * - Each step is saved immediately (partial failure recovery)
 * - Skips steps that already have outputs (idempotent)
 */
export async function runPipeline(
  projectId: string,
  userId: string,
  onProgress?: (step: number, stepName: string) => void
): Promise<void> {
  const project = await prisma.project.findUnique({
    where: { id: projectId, userId },
    include: { outputs: true },
  });

  if (!project) throw new AppError('Project not found', 404);
  if (project.status === 'done') throw new AppError('Blueprint already generated', 409);

  // Mark as generating
  await prisma.project.update({
    where: { id: projectId },
    data: { status: 'generating', generationStep: 0 },
  });

  const context: StepContext = {
    idea: project.idea,
    targetAudience: project.targetAudience ?? '',
    problem: project.problem ?? '',
    previousOutputs: {},
  };

  // Load any existing outputs (for resume support)
  for (const output of project.outputs) {
    context.previousOutputs[STEP_NAMES[output.step]] = output.rawText;
  }

  try {
    for (let step = 1; step <= TOTAL_STEPS; step++) {
      const stepName = STEP_NAMES[step];

      // Skip if already generated
      const existing = project.outputs.find((o) => o.step === step);
      if (existing) {
        onProgress?.(step, stepName);
        continue;
      }

      onProgress?.(step, stepName);

      const promptFn = PROMPT_MAP[step];
      const { system, user } = promptFn(context);

      // Call AI
      const result = await callAI({
        userId,
        projectId,
        step,
        systemPrompt: system,
        userPrompt: user,
        maxTokens: 1200,
      });

      // Parse JSON from AI response
      let parsed: unknown;
      try {
        const cleaned = result.text.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch {
        // If JSON parse fails, store as text content
        parsed = { raw: result.text };
      }

      // Save output
      await prisma.aiOutput.upsert({
        where: { projectId_step: { projectId, step } },
        update: {
          content: parsed as any,
          rawText: result.text,
          tokensUsed: result.tokensIn + result.tokensOut,
        },
        create: {
          projectId,
          step,
          stepName,
          content: parsed as any,
          rawText: result.text,
          tokensUsed: result.tokensIn + result.tokensOut,
          model: result.model,
        },
      });

      // Update project progress
      await prisma.project.update({
        where: { id: projectId },
        data: { generationStep: step },
      });

      // Feed output into next step's context
      context.previousOutputs[stepName] = result.text;

      // Brief pause between steps
      if (step < TOTAL_STEPS) {
        await sleep(STEP_DELAY_MS);
      }
    }

    // Mark complete and increment user credit usage
    await Promise.all([
      prisma.project.update({
        where: { id: projectId },
        data: { status: 'done', generationStep: TOTAL_STEPS },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { creditsUsed: { increment: 1 } },
      }),
    ]);

    logger.info({ projectId }, 'Blueprint generation complete');
  } catch (err: any) {
    logger.error({ projectId, error: err.message }, 'Pipeline failed');

    await prisma.project.update({
      where: { id: projectId },
      data: { status: 'failed' },
    });

    throw err;
  }
}

/**
 * Re-run a single step without re-running the full pipeline.
 * Used for "regenerate section" feature.
 */
export async function runSingleStep(
  projectId: string,
  userId: string,
  step: number
): Promise<void> {
  if (step < 1 || step > TOTAL_STEPS) throw new AppError('Invalid step number', 400);

  const project = await prisma.project.findUnique({
    where: { id: projectId, userId },
    include: { outputs: true },
  });

  if (!project) throw new AppError('Project not found', 404);

  const context: StepContext = {
    idea: project.idea,
    targetAudience: project.targetAudience ?? '',
    problem: project.problem ?? '',
    previousOutputs: {},
  };

  for (const output of project.outputs) {
    context.previousOutputs[STEP_NAMES[output.step]] = output.rawText;
  }

  const { system, user } = PROMPT_MAP[step](context);

  const result = await callAI({
    userId,
    projectId,
    step,
    systemPrompt: system,
    userPrompt: user,
    maxTokens: 1200,
  });

  let parsed: unknown;
  try {
    const cleaned = result.text.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    parsed = { raw: result.text };
  }

  await prisma.aiOutput.upsert({
    where: { projectId_step: { projectId, step } },
    update: { content: parsed as any, rawText: result.text, tokensUsed: result.tokensIn + result.tokensOut },
    create: {
      projectId,
      step,
      stepName: STEP_NAMES[step],
      content: parsed as any,
      rawText: result.text,
      tokensUsed: result.tokensIn + result.tokensOut,
      model: result.model,
    },
  });
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
