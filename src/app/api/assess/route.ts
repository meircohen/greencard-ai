import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ASSESSMENT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import * as uscisData from "@/lib/uscis-data";

interface AssessmentRequest {
  intakeData: Record<string, unknown>;
  conversationHistory?: string;
}

interface AssessmentResult {
  eligiblePaths: Array<{
    visaType: string;
    probability: number;
    estimatedCost: number;
    estimatedTimeline: string;
    keyRisks: string[];
    keyStrengths: string[];
  }>;
  recommendedPath: {
    visaType: string;
    rationale: string;
    nextSteps: string[];
  };
  overallScore: number;
  warnings: string[];
  dataUsed: string[];
}

function extractJsonFromText(text: string): Record<string, unknown> | null {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch {
      // Continue to next attempt
    }
  }

  // Try to find JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // Continue to fallback
    }
  }

  return null;
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

    const body: AssessmentRequest = await request.json();

    if (!body.intakeData || typeof body.intakeData !== "object") {
      return NextResponse.json(
        { error: "intakeData object is required" },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });

    const systemPrompt = buildAssessmentPrompt(body.intakeData);

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content:
            "Please provide a comprehensive assessment of this applicant's immigration case based on the intake data and USCIS data provided above. Return the assessment as valid JSON.",
        },
      ],
    });

    // Extract text from response
    let responseText = "";
    for (const block of response.content) {
      if (block.type === "text") {
        responseText += block.text;
      }
    }

    // Parse JSON from response
    let assessment = extractJsonFromText(responseText);

    if (!assessment) {
      // Fallback parsing if JSON extraction fails
      assessment = {
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
    }

    const usage = response.usage || { input_tokens: 0, output_tokens: 0 };

    return NextResponse.json({
      assessment,
      usage: {
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Assessment failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
