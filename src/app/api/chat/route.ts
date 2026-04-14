import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { INTAKE_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import * as uscisData from "@/lib/uscis-data";
import { safeErrorResponse } from "@/lib/errors";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000, "Message too long"),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(50, "Too many messages"),
  userData: z.record(z.string(), z.unknown()).optional(),
  conversationId: z.string().max(100, "ID too long").optional(),
  mode: z.enum(["intake", "assessment", "form-fill", "interview-prep"]).optional(),
});

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /system\s*:\s*/i,
  /\bact\s+as\b/i,
  /\badmin\s+override\b/i,
  /\bdev\s+mode\b/i,
  /\bjailbreak\b/i,
  /\bDAN\b/,
  /do\s+anything\s+now/i,
];

function sanitizeMessage(content: string): string {
  // Truncate overly long messages (Zod enforces 4000 but defense in depth)
  const truncated = content.slice(0, 4000);
  // Strip null bytes and control characters (keep newlines/tabs)
  return truncated.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "");
}

function containsInjection(content: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(content));
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

    // Parse and validate request body
    const raw = await request.json();
    const parsed = chatRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }
    const body = parsed.data;

    // Get client identifier (simplified)
    const clientId =
      body.conversationId ||
      request.headers.get("x-forwarded-for") ||
      "unknown";

    // Sanitize all user messages and flag injection attempts
    const sanitizedMessages = body.messages.map((msg) => ({
      ...msg,
      content: sanitizeMessage(msg.content),
    }));

    // Log injection attempts (don't block, the system prompt handles it)
    const lastUserMsg = sanitizedMessages.filter((m) => m.role === "user").pop();
    if (lastUserMsg && containsInjection(lastUserMsg.content)) {
      console.warn(
        `[prompt-injection] Potential injection detected from ${clientId}: ${lastUserMsg.content.slice(0, 100)}`
      );
    }

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

    // Prepare messages for Claude (using sanitized input)
    const messages = sanitizedMessages.map((msg) => ({
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
    return safeErrorResponse(error, "Chat service encountered an error. Please try again.");
  }
}

export async function OPTIONS(request: NextRequest): Promise<Response> {
  return NextResponse.json({}, { status: 200 });
}
