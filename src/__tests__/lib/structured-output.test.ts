import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  extractJson,
  parseStructuredOutput,
  assessmentOutputSchema,
} from "@/lib/ai/structured-output";

describe("Structured output parsing", () => {
  describe("extractJson", () => {
    it("extracts raw JSON object", () => {
      const result = extractJson('{"key": "value"}');
      expect(result).toEqual({ key: "value" });
    });

    it("extracts JSON from code block", () => {
      const text = 'Here is the result:\n```json\n{"score": 85}\n```\nDone.';
      const result = extractJson(text);
      expect(result).toEqual({ score: 85 });
    });

    it("extracts JSON from code block without language tag", () => {
      const text = '```\n{"data": [1, 2, 3]}\n```';
      const result = extractJson(text);
      expect(result).toEqual({ data: [1, 2, 3] });
    });

    it("extracts JSON embedded in prose", () => {
      const text = 'The assessment is: {"overallScore": 72, "warnings": []} and that is all.';
      const result = extractJson(text);
      expect(result).toEqual({ overallScore: 72, warnings: [] });
    });

    it("extracts JSON array", () => {
      const result = extractJson('[1, 2, 3]');
      expect(result).toEqual([1, 2, 3]);
    });

    it("returns null for non-JSON text", () => {
      expect(extractJson("Just some plain text")).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(extractJson("")).toBeNull();
    });

    it("returns null for malformed JSON", () => {
      expect(extractJson("{bad json}")).toBeNull();
    });
  });

  describe("parseStructuredOutput", () => {
    const simpleSchema = z.object({
      name: z.string(),
      age: z.number(),
    });

    it("parses valid JSON matching schema", () => {
      const result = parseStructuredOutput(
        '{"name": "John", "age": 30}',
        simpleSchema
      );
      expect(result).toEqual({ name: "John", age: 30 });
    });

    it("returns null for JSON that doesn't match schema", () => {
      const result = parseStructuredOutput(
        '{"name": "John", "age": "thirty"}',
        simpleSchema,
        "test"
      );
      expect(result).toBeNull();
    });

    it("returns null for non-JSON text", () => {
      const result = parseStructuredOutput("not json", simpleSchema);
      expect(result).toBeNull();
    });

    it("extracts and validates from code block", () => {
      const text = '```json\n{"name": "Jane", "age": 25}\n```';
      const result = parseStructuredOutput(text, simpleSchema);
      expect(result).toEqual({ name: "Jane", age: 25 });
    });
  });

  describe("assessmentOutputSchema", () => {
    const validAssessment = {
      eligiblePaths: [
        {
          visaType: "EB1A",
          probability: 75,
          estimatedCost: 5000,
          estimatedTimeline: "12-18 months",
          keyRisks: ["Limited publications"],
          keyStrengths: ["Strong citations"],
        },
      ],
      recommendedPath: {
        visaType: "EB1A",
        rationale: "Best fit for profile",
        nextSteps: ["Gather evidence", "File I-140"],
      },
      overallScore: 75,
      warnings: [],
      dataUsed: ["approval_rates", "processing_times"],
    };

    it("accepts valid assessment", () => {
      const result = assessmentOutputSchema.safeParse(validAssessment);
      expect(result.success).toBe(true);
    });

    it("rejects score over 100", () => {
      const result = assessmentOutputSchema.safeParse({
        ...validAssessment,
        overallScore: 150,
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative probability", () => {
      const result = assessmentOutputSchema.safeParse({
        ...validAssessment,
        eligiblePaths: [{ ...validAssessment.eligiblePaths[0], probability: -5 }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing required fields", () => {
      const result = assessmentOutputSchema.safeParse({
        eligiblePaths: [],
        overallScore: 50,
      });
      expect(result.success).toBe(false);
    });
  });
});
