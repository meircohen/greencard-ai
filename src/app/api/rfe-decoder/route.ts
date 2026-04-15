import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { safeErrorResponse } from "@/lib/errors";
import { getModel } from "@/lib/ai/models";
import { withRetry } from "@/lib/ai/retry";
import { parseStructuredOutput } from "@/lib/ai/structured-output";

const rfeRequestSchema = z.object({
  rfeText: z.string().min(50, "RFE text must be at least 50 characters").max(20000),
  formNumber: z.string().max(20).optional(),
  caseType: z.string().max(50).optional(),
});

const rfeResponseSchema = z.object({
  summary: z.string(),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  deadlineDays: z.number().min(0).max(365),
  issues: z.array(
    z.object({
      category: z.string(),
      description: z.string(),
      severity: z.enum(["minor", "moderate", "serious"]),
      suggestedEvidence: z.array(z.string()),
      sampleLanguage: z.string(),
    })
  ),
  responseStrategy: z.object({
    overview: z.string(),
    steps: z.array(z.string()),
    documentsNeeded: z.array(z.string()),
    estimatedPrepTime: z.string(),
  }),
  warnings: z.array(z.string()),
});

export type RfeDecoderOutput = z.infer<typeof rfeResponseSchema>;

const RFE_SYSTEM_PROMPT = `You are an expert immigration attorney AI assistant specializing in analyzing USCIS Requests for Evidence (RFEs). Your role is to:

1. Parse and understand the specific deficiencies USCIS has identified
2. Categorize each issue by type (documentation, eligibility, financial, medical, etc.)
3. Assess severity and urgency
4. Recommend specific evidence and response strategies
5. Provide sample response language for each issue

IMPORTANT RULES:
- You are NOT providing legal advice. Always recommend consulting an attorney.
- Be specific about what evidence to gather
- Reference relevant USCIS policy memos and regulations where applicable
- Flag any issues that could indicate deeper eligibility problems
- Note the typical RFE response deadline (usually 87 days from date of RFE)

Return your analysis as valid JSON matching the requested schema.`;

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const raw = await request.json();
    const parsed = rfeRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const { rfeText, formNumber, caseType } = parsed.data;

    const client = new Anthropic({ apiKey });

    const userPrompt = `Analyze the following USCIS Request for Evidence (RFE) and provide a structured analysis with response strategy.

${formNumber ? `Form: ${formNumber}` : ""}
${caseType ? `Case Type: ${caseType}` : ""}

RFE TEXT:
${rfeText}

Provide your analysis as JSON with this structure:
{
  "summary": "Brief summary of what USCIS is requesting",
  "urgency": "low|medium|high|critical",
  "deadlineDays": 87,
  "issues": [
    {
      "category": "category name",
      "description": "what's being asked",
      "severity": "minor|moderate|serious",
      "suggestedEvidence": ["list of evidence to submit"],
      "sampleLanguage": "draft response language for this issue"
    }
  ],
  "responseStrategy": {
    "overview": "overall approach",
    "steps": ["ordered steps to prepare response"],
    "documentsNeeded": ["complete document list"],
    "estimatedPrepTime": "estimated preparation time"
  },
  "warnings": ["any concerns or red flags"]
}`;

    const response = await withRetry(() =>
      client.messages.create({
        model: getModel("advanced"),
        max_tokens: 4096,
        system: RFE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
      })
    );

    let responseText = "";
    for (const block of response.content) {
      if (block.type === "text") responseText += block.text;
    }

    const validated = parseStructuredOutput(responseText, rfeResponseSchema, "rfe-decoder");

    const result = validated ?? {
      summary: "Unable to parse RFE analysis. Please try again or consult an attorney.",
      urgency: "high" as const,
      deadlineDays: 87,
      issues: [],
      responseStrategy: {
        overview: "Analysis could not be completed",
        steps: ["Consult with an immigration attorney immediately"],
        documentsNeeded: [],
        estimatedPrepTime: "Unknown",
      },
      warnings: ["Automated analysis failed. Professional review strongly recommended."],
    };

    return NextResponse.json({
      analysis: result,
      usage: {
        inputTokens: response.usage?.input_tokens || 0,
        outputTokens: response.usage?.output_tokens || 0,
      },
    });
  } catch (error) {
    return safeErrorResponse(error, "RFE analysis failed. Please try again.");
  }
}
