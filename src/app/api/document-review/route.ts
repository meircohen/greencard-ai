import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DOCUMENT_REVIEW_PROMPT } from "@/lib/ai/prompts";

interface DocumentReviewRequest {
  documentType: string;
  extractedText: string;
  caseData?: Record<string, unknown>;
}

interface ReviewIssue {
  category: string;
  severity: "critical" | "warning" | "info";
  message: string;
}

interface DocumentReview {
  status: "approved" | "approved_with_conditions" | "rejected";
  issues: ReviewIssue[];
  suggestions: string[];
  confidence: number;
  documentDescription: string;
}

async function reviewDocument(
  documentType: string,
  extractedText: string,
  caseData?: Record<string, unknown>
): Promise<DocumentReview> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const client = new Anthropic({ apiKey });

  const caseContext = caseData
    ? `Case Context:\n${JSON.stringify(caseData, null, 2)}\n\n`
    : "";

  const prompt = `Review the following ${documentType} document for immigration purposes.

${caseContext}Document Content:
${extractedText}

Evaluate based on:
1. COMPLETENESS - Are all required sections/information present?
2. LEGIBILITY - Is the document clear and readable?
3. EXPIRATION - Is the document current and valid?
4. AUTHENTICITY - Does it appear genuine?
5. CONSISTENCY - Does it match other case information?
6. COMPLIANCE - Does it meet USCIS requirements?
7. TRANSLATION - If foreign language, is there a certified translation?

Return a JSON object with:
{
  "status": "approved|approved_with_conditions|rejected",
  "issues": [
    {
      "category": "completeness|legibility|expiration|authenticity|consistency|compliance|translation",
      "severity": "critical|warning|info",
      "message": "specific issue"
    }
  ],
  "suggestions": ["array of actionable fixes"],
  "confidence": 0-100,
  "documentDescription": "brief description of what the document is"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: DOCUMENT_REVIEW_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText += block.text;
    }
  }

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error("Failed to parse review response");
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: DocumentReviewRequest = await request.json();

    if (!body.documentType || !body.extractedText) {
      return NextResponse.json(
        { error: "documentType and extractedText are required" },
        { status: 400 }
      );
    }

    const review = await reviewDocument(
      body.documentType,
      body.extractedText,
      body.caseData
    );

    // Determine usage stats (approximation)
    const inputTokenCount = Math.ceil(
      (body.extractedText.length + JSON.stringify(body.caseData || {}).length) / 4
    );
    const outputTokenCount = Math.ceil(JSON.stringify(review).length / 4);

    return NextResponse.json({
      review,
      usage: {
        inputTokens: inputTokenCount,
        outputTokens: outputTokenCount,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Document review failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
