import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { INTERVIEW_PREP_PROMPT } from "@/lib/ai/prompts";

interface InterviewPrepRequest {
  caseType: string;
  caseData?: Record<string, unknown>;
  interviewType?: string;
}

interface InterviewQuestion {
  question: string;
  suggestedAnswer: string;
  tips: string[];
  difficulty: "easy" | "moderate" | "hard";
}

interface InterviewPrepResponse {
  questions: InterviewQuestion[];
  summary: string;
  tips: string[];
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

async function generateInterviewQuestions(
  caseType: string,
  caseData?: Record<string, unknown>,
  interviewType?: string
): Promise<{ questions: InterviewQuestion[]; summary: string; tips: string[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const client = new Anthropic({ apiKey });

  const caseContext = caseData
    ? `Case Data:\n${JSON.stringify(caseData, null, 2)}\n\n`
    : "";

  const interviewTypeStr = interviewType
    ? `Interview Type: ${interviewType}\n\n`
    : "";

  const prompt = `Generate interview preparation materials for a ${caseType} immigration case.

${interviewTypeStr}${caseContext}
Based on the case type and data provided, generate 8-10 likely interview questions that USCIS officers would ask. For each question, provide:
1. The question itself (realistic and based on actual USCIS interviews)
2. A suggested truthful answer (2-3 sentences)
3. Tips for delivering the answer effectively
4. Difficulty level (easy, moderate, or hard)

Also provide:
- A summary of key topics the interview will likely cover
- 3-4 overall tips for interview success

Return a JSON object with:
{
  "questions": [
    {
      "question": "string",
      "suggestedAnswer": "string",
      "tips": ["tip1", "tip2"],
      "difficulty": "easy|moderate|hard"
    }
  ],
  "summary": "string describing key topics",
  "tips": ["tip1", "tip2", "tip3"]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: INTERVIEW_PREP_PROMPT,
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

  throw new Error("Failed to parse interview prep response");
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body: InterviewPrepRequest = await request.json();

    if (!body.caseType) {
      return NextResponse.json(
        { error: "caseType is required" },
        { status: 400 }
      );
    }

    const {
      questions,
      summary,
      tips,
    } = await generateInterviewQuestions(
      body.caseType,
      body.caseData,
      body.interviewType
    );

    // Estimate token usage
    const inputTokenCount = Math.ceil(
      (body.caseType.length + JSON.stringify(body.caseData || {}).length) / 4
    );
    const outputTokenCount = Math.ceil(
      (JSON.stringify(questions).length + summary.length) / 4
    );

    const response: InterviewPrepResponse = {
      questions,
      summary,
      tips,
      usage: {
        inputTokens: inputTokenCount,
        outputTokens: outputTokenCount,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Interview prep generation failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
