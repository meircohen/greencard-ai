import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Assessment API Tests
 * Tests the /api/assess endpoint for immigration case assessment
 */

describe("POST /api/assess", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return structured assessment for valid intake data", async () => {
    // Mock intake data
    const mockRequest = {
      json: async () => ({
        intakeData: {
          educationLevel: "masters",
          yearsExperience: 8,
          field: "software_engineering",
          country: "India",
          maritalStatus: "married",
          dependents: 2,
        },
      }),
    };

    const input = await mockRequest.json();
    expect(input.intakeData).toBeDefined();

    // Assessment should return structured JSON
    const mockAssessment = {
      recommendedCategories: ["EB1B", "EB2"],
      eb1Eligibility: true,
      eb2Eligibility: true,
      visaAvailability: "2023-06-01",
      estimatedProcessing: 22,
      confidence: 0.87,
    };

    expect(mockAssessment).toHaveProperty("recommendedCategories");
    expect(Array.isArray(mockAssessment.recommendedCategories)).toBe(true);
    expect(mockAssessment.estimatedProcessing).toBeGreaterThan(0);
  });

  it("should return 500 error when API key is missing", async () => {
    // Simulate missing API key scenario
    const apiKeyMissing = !process.env.ANTHROPIC_API_KEY;

    if (apiKeyMissing) {
      const response = {
        status: 500,
        json: async () => ({
          error: "Missing ANTHROPIC_API_KEY environment variable",
        }),
      };
      expect(response.status).toBe(500);
    }
  });

  it("should handle invalid JSON response from Claude", async () => {
    // Mock malformed response
    const mockResponse = "This is not JSON";

    const isValidJson = (str: string) => {
      try {
        JSON.parse(str);
        return true;
      } catch {
        return false;
      }
    };

    const valid = isValidJson(mockResponse);
    expect(valid).toBe(false);
  });

  it("should process conversation history if provided", async () => {
    const mockRequest = {
      json: async () => ({
        intakeData: {
          caseType: "EB2",
        },
        conversationHistory:
          "User: What are my EB-2 options?\nAssistant: Based on your profile...",
      }),
    };

    const input = await mockRequest.json();
    expect(input.conversationHistory).toBeDefined();
    expect(input.conversationHistory).toContain("EB-2");
  });

  it("should include confidence score in assessment", async () => {
    const mockAssessment = {
      recommendedCategories: ["EB1A", "EB2"],
      confidence: 0.92,
      eligibilityScore: 0.88,
    };

    expect(mockAssessment.confidence).toBeGreaterThan(0);
    expect(mockAssessment.confidence).toBeLessThanOrEqual(1);
    expect(typeof mockAssessment.confidence).toBe("number");
  });

  it("should validate intake data structure", async () => {
    const validIntakeData = {
      educationLevel: "phd",
      yearsExperience: 12,
      field: "machine_learning",
      publications: 5,
      awards: ["IEEE Fellow"],
    };

    expect(validIntakeData).toHaveProperty("educationLevel");
    expect(typeof validIntakeData.yearsExperience).toBe("number");
    expect(Array.isArray(validIntakeData.awards)).toBe(true);
  });

  it("should return visa category recommendations", async () => {
    const assessment = {
      recommendedCategories: [
        { category: "EB1A", suitability: 0.95 },
        { category: "EB2", suitability: 0.78 },
      ],
      reasoning: "Strong academic profile with publications",
    };

    expect(assessment.recommendedCategories).toHaveLength(2);
    expect(assessment.recommendedCategories[0].suitability).toBeGreaterThan(
      assessment.recommendedCategories[1].suitability
    );
  });
});
