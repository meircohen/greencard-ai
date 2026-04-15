import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateRfeResponse, type RfeResponse } from "@/lib/rfe-response";
import { safeErrorResponse } from "@/lib/errors";
import { withRetry } from "@/lib/ai/retry";

const rfeRequestSchema = z.object({
  rfeText: z.string().min(50).max(50000),
  caseType: z.string().min(2).max(100),
  caseId: z.string().optional(),
  existingDocuments: z.array(z.string()).optional(),
  clientInfo: z
    .object({
      name: z.string().optional(),
      aNumber: z.string().optional(),
    })
    .optional(),
});

interface RfeResponseWithUsage {
  response: RfeResponse;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const raw = await request.json();
    const parsed = rfeRequestSchema.safeParse(raw);

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || "Invalid request format";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const input = parsed.data;

    const response = await withRetry(async () => {
      return await generateRfeResponse({
        rfeText: input.rfeText,
        caseType: input.caseType,
        caseId: input.caseId,
        existingDocuments: input.existingDocuments,
        clientInfo: input.clientInfo
          ? { ...input.clientInfo, name: input.clientInfo.name || "Applicant" }
          : undefined,
      });
    });

    const result: RfeResponseWithUsage = {
      response,
      usage: {
        inputTokens: Math.ceil(input.rfeText.length / 4),
        outputTokens: Math.ceil(JSON.stringify(response).length / 4),
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    return safeErrorResponse(
      error,
      "RFE response generation failed. Please check your input and try again."
    );
  }
}
