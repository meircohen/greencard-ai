import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { INTAKE_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import * as uscisData from "@/lib/uscis-data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequestBody {
  messages: Message[];
  userData?: Record<string, unknown>;
  conversationId?: string;
  mode?: "intake" | "assessment" | "form-fill" | "interview-prep";
}

// Rate limit placeholder - implement with Redis in production
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(clientId);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(clientId, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (limit.count < 30) {
    limit.count++;
    return true;
  }

  return false;
}

function buildContextualSystemPrompt(
  mode: string = "intake",
  userData?: Record<string, unknown>
): string {
  const basePrompt = INTAKE_SYSTEM_PROMPT;

  const uscisContext = `

CURRENT USCIS DATA CONTEXT (as of ${uscisData.visaBulletin.lastUpdated}):

VISA BULLETIN STATUS:
- EB1 (Extraordinary Ability): ${uscisData.visaBulletin.employmentBased.EB1}
- EB2 (Advanced Degree/Exceptional Ability): ${uscisData.visaBulletin.employmentBased.EB2}
- EB3 (Skilled Workers): ${uscisData.visaBulletin.employmentBased.EB3}
- EB5 (Investors): ${uscisData.visaBulletin.employmentBased.EB5}
- Family-Based F1: ${uscisData.visaBulletin.familyBased.F1}
- Family-Based F2A: ${uscisData.visaBulletin.familyBased.F2A}
- Immediate Relatives: ${uscisData.visaBulletin.immediateRelatives}

TYPICAL PROCESSING TIMES:
- I-130 (Petition for Family Member): ${uscisData.processingTimes["I-130"].range} weeks
- I-140 (Immigrant Worker Petition): ${uscisData.processingTimes["I-140"].range} weeks
- I-485 (Adjustment of Status): ${uscisData.processingTimes["I-485"].range} weeks
- I-765 (Work Authorization): ${uscisData.processingTimes["I-765"].range} days

ESTIMATED APPROVAL RATES:
- EB1 (Extraordinary Ability): ${Math.round(uscisData.getApprovalRate("EB1A", "approved") * 100)}%
- EB2 (Advanced Degree): ${Math.round(uscisData.getApprovalRate("EB2", "approved") * 100)}%
- F1 Student Visa: ${Math.round(uscisData.getApprovalRate("F1", "approved") * 100)}%
- H1B (Specialty Occupation): ${Math.round(uscisData.getApprovalRate("H1B", "approved") * 100)}%

FILING FEES:
- I-130: $${uscisData.getFormFee("I-130")}
- I-140: $${uscisData.getFormFee("I-140")}
- I-485 (Adjustment): $${uscisData.getFormFee("I-485")}
- I-129 (Work Visa): $${uscisData.getFormFee("I-129")}

Use this data to provide informed guidance to users.`;

  return basePrompt + uscisContext;
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

    // Parse request body
    const body: ChatRequestBody = await request.json();

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    // Get client identifier (simplified)
    const clientId =
      body.conversationId ||
      request.headers.get("x-forwarded-for") ||
      "unknown";

    // Rate limiting check
    if (!checkRateLimit(clientId)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Maximum 30 requests per minute." },
        { status: 429 }
      );
    }

    const client = new Anthropic({ apiKey });

    // Build contextual system prompt
    const systemPrompt = buildContextualSystemPrompt(body.mode, body.userData);

    // Prepare messages for Claude
    const messages = body.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await client.messages.create({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2048,
            system: systemPrompt,
            messages: messages,
            stream: true,
          });

          let fullResponse = "";

          for await (const event of response) {
            if (
              event.type === "content_block_delta" &&
              event.delta?.type === "text_delta"
            ) {
              const text = event.delta.text || "";
              fullResponse += text;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "text", text })}\n\n`)
              );
            } else if (event.type === "message_stop") {
              // Final stats
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "done",
                  })}\n\n`
                )
              );
            } else if (event.type === "message_start" && event.message?.usage) {
              // Could track initial usage if needed
            }
          }

          controller.close();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: errorMessage,
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Internal server error",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest): Promise<Response> {
  return NextResponse.json({}, { status: 200 });
}
