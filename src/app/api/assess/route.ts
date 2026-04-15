import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ASSESSMENT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import * as uscisData from "@/lib/uscis-data";
import { z } from "zod";
import { safeErrorResponse } from "@/lib/errors";
import { getModel } from "@/lib/ai/models";
import { withRetry } from "@/lib/ai/retry";
import { parseStructuredOutput, assessmentOutputSchema } from "@/lib/ai/structured-output";
import { cacheGet, cacheSet } from "@/lib/cache";
import crypto from "crypto";

const assessSchema = z.object({
  intakeData: z.record(z.string(), z.unknown()).refine((v) => Object.keys(v).length > 0, {
    message: "intakeData must not be empty",
  }),
  conversationHistory: z.string().max(50000).optional(),
});

/** Generate a cache key from intake data for assessment caching. */
function assessmentCacheKey(intakeData: Record<string, unknown>): string {
  const hash = crypto.createHash("sha256").update(JSON.stringify(intakeData)).digest("hex").slice(0, 16);
  return `assessment:${hash}`;
}

function buildAssessmentPrompt(intakeData: Record<string, unknown>): string {
  const uscisDataContext = `
AVAILABLE USCIS DATA FOR THIS ASSESSMENT:

Approval Rates:
${JSON.stringify(uscisData.approvalRates, null, 2)}

Processing Times (in weeks):
${JSON.stringify(uscisData.processingTimes, null, 2)}

Form Fees:
${JSON.stringify(uscisData.formFees, null, 2)}

Case Package Costs:
${JSON.stringify(uscisData.casePackageCosts, null, 2)}

Visa Bulletin Status (${uscisData.visaBulletin.lastUpdated}):
${JSON.stringify(uscisData.visaBulletin, null, 2)}

Poverty Guidelines 2026:
${JSON.stringify(uscisData.povertyGuidelines2026, null, 2)}

Court Statistics:
${JSON.stringify(uscisData.courtStats, null, 2)}
`;

  const applicantContext = `
APPLICANT INTAKE DATA:
${JSON.stringify(intakeData, null, 2)}
`;

  return (
    ASSESSMENT_SYSTEM_PROMPT +
    "\n\n" +
    uscisDataContext +
    "\n\n" +
    applicantContext +
    `

Based on the intake data provided and the USCIS data above, provide a comprehensive case assessment in JSON format with the following structure:

{
  "eligiblePaths": [
    {
      "visaType": "string (e.g., 'EB2')",
      "probability": "number 0-100 based on approval rates",
      "estimatedCost": "number in USD",
      "estimatedTimeline": "string (e.g., '18-24 months')",
      "keyRisks": ["string array of potential issues"],
      "keyStrengths": ["string array of positive factors"]
    }
  ],
  "recommendedPath": {
    "visaType": "string",
    "rationale": "string explaining why this is best",
    "nextSteps": ["array of specific next steps"]
  },
  "overallScore": "number 0-100",
  "warnings": ["array of any warnings or concerns"],
  "dataUsed": ["array of which USCIS data points were used"]
}

Base your probability estimates on the historical approval rates provided. Adjust based on the specific facts of the case.
`
  );
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const raw = await request.json();
    const parsed = assessSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // Check cache first (assessments for the same intake data are idempotent)
    const cacheKey = assessmentCacheKey(body.intakeData);
    const cached = cacheGet<{ assessment: unknown; usage: { inputTokens: number; outputTokens: number } }>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = buildAssessmentPrompt(body.intakeData);

    const response = await withRetry(() =>
      client.messages.create({
        model: getModel("advanced"),
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content:
              "Please provide a comprehensive assessment of this applicant's immigration case based on the intake data and USCIS data provided above. Return the assessment as valid JSON.",
          },
        ],
      })
    );

    // Extract text from response
    let responseText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        responseText += block.text;
      }
    }

    // Parse and validate against schema
    const validated = parseStructuredOutput(responseText, assessmentOutputSchema, "assessment");

    const assessment = validated ?? {
      eligiblePaths: [],
      recommendedPath: {
        visaType: "Unable to determine",
        rationale: "Assessment parsing failed",
        nextSteps: ["Consult with an immigration attorney"],
      },
      overallScore: 0,
      warnings: ["Assessment could not be properly parsed"],
      dataUsed: [],
    };

    const usage = response.usage || { input_tokens: 0, output_tokens: 0 };

    const result = {
      assessment,
      usage: {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
      },
    };

    // Cache for 1 hour (assessments are expensive)
    cacheSet(cacheKey, result, 3600);

    return NextResponse.json(result);
  } catch (error) {
    return safeErrorResponse(error, "Assessment failed. Please try again.");
  }
}
