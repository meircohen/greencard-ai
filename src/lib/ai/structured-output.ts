import { z } from "zod";
import { logger } from "@/lib/logger";

/**
 * Structured output parsing and validation for AI responses.
 *
 * The AI is instructed to return JSON. This module extracts and validates
 * that JSON against a Zod schema, with fallback handling for malformed output.
 */

/**
 * Extract JSON from AI response text.
 * Handles: raw JSON, JSON in code blocks, JSON embedded in prose.
 */
export function extractJson(text: string): unknown | null {
  // 1. Try code-block-wrapped JSON
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch { /* continue */ }
  }

  // 2. Try raw JSON (entire text)
  const trimmed = text.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch { /* continue */ }
  }

  // 3. Find the largest JSON object/array in the text
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch { /* continue */ }
  }

  return null;
}

/**
 * Parse and validate an AI response against a Zod schema.
 * Returns typed, validated data or null with logged warnings.
 */
export function parseStructuredOutput<T>(
  responseText: string,
  schema: z.ZodSchema<T>,
  context?: string
): T | null {
  const raw = extractJson(responseText);

  if (raw === null) {
    logger.warn(
      { context, textLength: responseText.length },
      "Failed to extract JSON from AI response"
    );
    return null;
  }

  const result = schema.safeParse(raw);

  if (!result.success) {
    logger.warn(
      {
        context,
        errors: result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
      },
      "AI response JSON failed schema validation"
    );
    return null;
  }

  return result.data;
}

// ============================================================================
// Shared Zod schemas for AI structured outputs
// ============================================================================

export const assessmentOutputSchema = z.object({
  eligiblePaths: z.array(
    z.object({
      visaType: z.string(),
      probability: z.number().min(0).max(100),
      estimatedCost: z.number().min(0),
      estimatedTimeline: z.string(),
      keyRisks: z.array(z.string()),
      keyStrengths: z.array(z.string()),
    })
  ),
  recommendedPath: z.object({
    visaType: z.string(),
    rationale: z.string(),
    nextSteps: z.array(z.string()),
  }),
  overallScore: z.number().min(0).max(100),
  warnings: z.array(z.string()),
  dataUsed: z.array(z.string()),
});

export type AssessmentOutput = z.infer<typeof assessmentOutputSchema>;

export const documentReviewSchema = z.object({
  documentType: z.string(),
  completeness: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      field: z.string(),
      severity: z.enum(["error", "warning", "info"]),
      message: z.string(),
      suggestion: z.string().optional(),
    })
  ),
  summary: z.string(),
});

export type DocumentReviewOutput = z.infer<typeof documentReviewSchema>;
