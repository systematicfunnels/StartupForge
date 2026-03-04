/**
 * AI Prompt Templates — 10-step startup blueprint generation
 * Each prompt takes the idea context + previous outputs to build
 * a coherent, compounding blueprint.
 */

export interface IdeaContext {
  idea: string;
  targetAudience: string;
  problem: string;
}

export interface StepContext extends IdeaContext {
  previousOutputs: Record<string, string>; // stepName → text
}

const SYSTEM_BASE = `You are a senior startup advisor, product architect, and technical strategist.
Your outputs must be:
- Practical and specific to the given idea
- Realistic (no generic advice or billion-dollar predictions)
- Structured with clear sections using markdown
- Actionable — include real numbers, names, and next steps
- Concise — avoid filler, get to the point

Respond ONLY in valid JSON format with the structure specified.`;

// ─── Step 1: Idea Validation ─────────────────────────────────────────────────
export function step1Prompt(ctx: IdeaContext) {
  return {
    system: SYSTEM_BASE,
    user: `Analyze this startup idea and return a JSON object with exactly these keys:
{
  "summary": "2-sentence summary of the idea",
  "marketDemand": "assessment of demand (low/medium/high) with 2-3 sentences of evidence",
  "targetMarketSize": "realistic TAM estimate with reasoning",
  "topCompetitors": [{"name": "...", "weakness": "..."}, ...] (3 competitors),
  "mainRisks": ["risk1", "risk2", "risk3"],
  "improvementSuggestions": ["suggestion1", "suggestion2"],
  "viabilityScore": 7,
  "verdict": "Go / No-Go / Pivot — with one sentence reason"
}

IDEA: ${ctx.idea}
TARGET AUDIENCE: ${ctx.targetAudience}
PROBLEM: ${ctx.problem}`,
  };
}

// ─── Step 2: Product Strategy ─────────────────────────────────────────────────
export function step2Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Based on the validated idea below, define the product strategy.
Return JSON with exactly these keys:
{
  "primaryPersona": {"name": "...", "role": "...", "painPoint": "...", "goal": "..."},
  "secondaryPersona": {"name": "...", "role": "...", "painPoint": "...", "goal": "..."},
  "positioningStatement": "For [audience] who [problem], [product] is a [category] that [benefit], unlike [competitor] which [weakness].",
  "pricingStrategy": {"model": "...", "tiers": [{"name": "...", "price": "...", "features": [...]}]},
  "northStarMetric": "one metric that defines success",
  "keyUseCases": ["usecase1", "usecase2", "usecase3"],
  "unfairAdvantage": "what makes this hard to replicate"
}

IDEA VALIDATION: ${ctx.previousOutputs['idea_validation'] ?? 'N/A'}
IDEA: ${ctx.idea}
TARGET AUDIENCE: ${ctx.targetAudience}`,
  };
}

// ─── Step 3: MVP Scope ────────────────────────────────────────────────────────
export function step3Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Define the smallest possible MVP for this product.
Return JSON with exactly these keys:
{
  "mvpDescription": "one paragraph describing the MVP",
  "coreFeatures": [{"feature": "...", "why": "...", "complexity": "low|medium|high"}],
  "excludedFeatures": ["feature1 — why excluded", "feature2 — why excluded"],
  "userFlow": ["step1", "step2", "step3", "step4", "step5"],
  "buildTimeEstimate": "X weeks for a solo developer",
  "techComplexityScore": 6,
  "successCriteria": ["criterion1", "criterion2"]
}

STRATEGY: ${ctx.previousOutputs['product_strategy'] ?? 'N/A'}
IDEA: ${ctx.idea}`,
  };
}

// ─── Step 4: System Architecture ──────────────────────────────────────────────
export function step4Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Design the system architecture for this MVP.
Return JSON with exactly these keys:
{
  "recommendedStack": {
    "frontend": "...",
    "backend": "...",
    "database": "...",
    "auth": "...",
    "hosting": "...",
    "aiIntegration": "..."
  },
  "architecturePattern": "e.g. Monolith, Microservices, Serverless",
  "components": [{"name": "...", "role": "...", "tech": "..."}],
  "dataFlow": "describe how data flows from user to database",
  "scalingStrategy": "how this scales from 100 to 10,000 users",
  "estimatedMonthlyCost": {"at100Users": "$X", "at1000Users": "$X"},
  "tradeoffs": ["tradeoff1", "tradeoff2"]
}

MVP SCOPE: ${ctx.previousOutputs['mvp_scope'] ?? 'N/A'}
IDEA: ${ctx.idea}`,
  };
}

// ─── Step 5: Database Design ──────────────────────────────────────────────────
export function step5Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Design the database schema for this product.
Return JSON with exactly these keys:
{
  "tables": [
    {
      "name": "table_name",
      "purpose": "...",
      "columns": [{"name": "...", "type": "...", "constraints": "..."}],
      "indexes": ["index1", "index2"]
    }
  ],
  "relationships": ["table_a.col → table_b.col (one-to-many)", ...],
  "keyDesignDecisions": ["decision1", "decision2"],
  "prismaSchemaSnippet": "paste key Prisma model definitions here"
}

ARCHITECTURE: ${ctx.previousOutputs['system_architecture'] ?? 'N/A'}
MVP SCOPE: ${ctx.previousOutputs['mvp_scope'] ?? 'N/A'}`,
  };
}

// ─── Step 6: Backend API Plan ─────────────────────────────────────────────────
export function step6Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Design the backend API structure for this product.
Return JSON with exactly these keys:
{
  "baseUrl": "/api/v1",
  "authStrategy": "describe JWT / session / OAuth approach",
  "endpoints": [
    {
      "method": "GET|POST|PUT|DELETE",
      "path": "/resource/:id",
      "description": "...",
      "auth": true,
      "requestBody": "...",
      "responseShape": "..."
    }
  ],
  "folderStructure": "paste the backend folder tree",
  "keyServices": [{"name": "...", "responsibility": "..."}],
  "middlewareList": ["auth", "rateLimit", "validate", "..."],
  "errorHandlingStrategy": "describe approach"
}

DATABASE: ${ctx.previousOutputs['database_design'] ?? 'N/A'}
ARCHITECTURE: ${ctx.previousOutputs['system_architecture'] ?? 'N/A'}`,
  };
}

// ─── Step 7: Frontend Structure ───────────────────────────────────────────────
export function step7Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Design the frontend UI structure for this product.
Return JSON with exactly these keys:
{
  "pages": [
    {
      "path": "/dashboard",
      "name": "Dashboard",
      "purpose": "...",
      "keyComponents": ["ComponentA", "ComponentB"],
      "dataNeeded": ["api endpoint or state"]
    }
  ],
  "componentHierarchy": "describe component tree",
  "stateManagement": "approach and why",
  "keyUXDecisions": ["decision1", "decision2"],
  "folderStructure": "paste frontend folder tree",
  "designSystem": "recommended component library and styling approach"
}

BACKEND: ${ctx.previousOutputs['backend_api'] ?? 'N/A'}
MVP SCOPE: ${ctx.previousOutputs['mvp_scope'] ?? 'N/A'}`,
  };
}

// ─── Step 8: DevOps Plan ──────────────────────────────────────────────────────
export function step8Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Design the DevOps and deployment strategy for this product.
Return JSON with exactly these keys:
{
  "hostingPlan": {
    "frontend": "provider and approach",
    "backend": "provider and approach",
    "database": "provider and approach"
  },
  "ciCdPipeline": ["step1: ...", "step2: ...", "step3: ..."],
  "environmentVariables": [{"name": "VAR_NAME", "purpose": "..."}],
  "monitoringStack": ["tool1 — what it monitors", "tool2 — ..."],
  "deploymentChecklist": ["item1", "item2", "item3"],
  "estimatedSetupTime": "X hours",
  "costPerMonth": "$X at MVP scale"
}

ARCHITECTURE: ${ctx.previousOutputs['system_architecture'] ?? 'N/A'}`,
  };
}

// ─── Step 9: Launch Strategy ──────────────────────────────────────────────────
export function step9Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Create a go-to-market launch strategy for this product.
Return JSON with exactly these keys:
{
  "launchPhases": [
    {"phase": "Pre-launch", "duration": "2 weeks", "actions": ["action1", "action2"]},
    {"phase": "Launch Day", "duration": "1 day", "actions": ["action1", "action2"]},
    {"phase": "Post-launch", "duration": "4 weeks", "actions": ["action1", "action2"]}
  ],
  "earlyAdopterChannels": [{"channel": "...", "approach": "...", "expectedReach": "..."}],
  "launchPlatforms": ["ProductHunt", "..."],
  "first100UsersStrategy": "describe exactly how to get first 100 users",
  "keyMetricsToTrack": ["metric1", "metric2", "metric3"],
  "launchChecklist": ["item1", "item2", "item3", "item4", "item5"]
}

PRODUCT STRATEGY: ${ctx.previousOutputs['product_strategy'] ?? 'N/A'}
TARGET AUDIENCE: ${ctx.targetAudience}
IDEA: ${ctx.idea}`,
  };
}

// ─── Step 10: Growth Strategy ─────────────────────────────────────────────────
export function step10Prompt(ctx: StepContext) {
  return {
    system: SYSTEM_BASE,
    user: `Design the growth strategy for this product.
Return JSON with exactly these keys:
{
  "growthModel": "PLG|SLG|Community|Content — explain choice",
  "viralLoops": [{"loop": "...", "mechanism": "...", "estimatedK": 0.3}],
  "acquisitionChannels": [{"channel": "...", "tactics": [...], "estimatedCAC": "$X"}],
  "retentionTactics": ["tactic1 — why it works", "tactic2", "tactic3"],
  "revenueProjection": {
    "month3": {"users": 0, "mrr": "$0"},
    "month6": {"users": 0, "mrr": "$0"},
    "month12": {"users": 0, "mrr": "$0"}
  },
  "ninetyDayPlan": [
    {"month": 1, "focus": "...", "goals": ["goal1", "goal2"]},
    {"month": 2, "focus": "...", "goals": ["goal1", "goal2"]},
    {"month": 3, "focus": "...", "goals": ["goal1", "goal2"]}
  ],
  "keyHiringNeeds": ["role1 — when to hire", "role2"]
}

LAUNCH STRATEGY: ${ctx.previousOutputs['launch_strategy'] ?? 'N/A'}
PRODUCT STRATEGY: ${ctx.previousOutputs['product_strategy'] ?? 'N/A'}
IDEA: ${ctx.idea}`,
  };
}

// ─── Step registry ────────────────────────────────────────────────────────────
export const STEP_NAMES: Record<number, string> = {
  1: 'idea_validation',
  2: 'product_strategy',
  3: 'mvp_scope',
  4: 'system_architecture',
  5: 'database_design',
  6: 'backend_api',
  7: 'frontend_structure',
  8: 'devops_plan',
  9: 'launch_strategy',
  10: 'growth_strategy',
};

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

export type PromptFn = (ctx: StepContext) => { system: string; user: string };

export const PROMPT_MAP: Record<number, PromptFn> = {
  1: step1Prompt,
  2: step2Prompt,
  3: step3Prompt,
  4: step4Prompt,
  5: step5Prompt,
  6: step6Prompt,
  7: step7Prompt,
  8: step8Prompt,
  9: step9Prompt,
  10: step10Prompt,
};
