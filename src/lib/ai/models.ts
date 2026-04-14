/**
 * Centralized AI model configuration.
 *
 * All Claude model IDs in one place so we can update them globally
 * and route different tasks to the appropriate model tier.
 */

export const MODELS = {
  /** Fast, cheap model for simple tasks: validation, Q&A, classification */
  fast: "claude-haiku-4-5-20251001" as const,
  /** Balanced model for most tasks: chat, form fill, interview prep */
  standard: "claude-sonnet-4-6" as const,
  /** Most capable model for complex reasoning: document review, assessment */
  advanced: "claude-sonnet-4-6" as const,
} as const;

export type ModelTier = keyof typeof MODELS;

/**
 * Pick a model based on the task complexity.
 * Routes can call `getModel("fast")` instead of hardcoding model strings.
 */
export function getModel(tier: ModelTier = "standard"): string {
  return MODELS[tier];
}

/** Map chat modes to the appropriate model tier. */
export function getModelForMode(mode?: string): string {
  switch (mode) {
    case "intake":
    case "form-fill":
      return MODELS.standard;
    case "assessment":
    case "document-review":
      return MODELS.advanced;
    case "interview-prep":
      return MODELS.standard;
    default:
      return MODELS.standard;
  }
}
