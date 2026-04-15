import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { safeErrorResponse } from "@/lib/errors";

/**
 * Form data save/load API for case forms.
 * Stores form field values as JSON, keyed by caseId + formNumber.
 *
 * In production this hits the caseForms table via Drizzle.
 * For now we use an in-memory store so the UI can function end-to-end.
 */

const formStore = new Map<string, { formNumber: string; formData: Record<string, unknown>; status: string; updatedAt: string }>();

const saveSchema = z.object({
  formNumber: z.string().min(1).max(20),
  formData: z.record(z.string(), z.unknown()),
  status: z.enum(["draft", "filled", "submitted"]).optional(),
});

// GET /api/forms/[caseId]?formNumber=I-485
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
): Promise<Response> {
  try {
    const { caseId } = await params;
    const formNumber = request.nextUrl.searchParams.get("formNumber");

    if (!formNumber) {
      return NextResponse.json({ error: "formNumber query parameter is required" }, { status: 400 });
    }

    const key = `${caseId}:${formNumber}`;
    const stored = formStore.get(key);

    if (!stored) {
      return NextResponse.json({
        caseId,
        formNumber,
        formData: {},
        status: "draft",
        updatedAt: null,
      });
    }

    return NextResponse.json({ caseId, ...stored });
  } catch (error) {
    return safeErrorResponse(error, "Failed to load form data");
  }
}

// PUT /api/forms/[caseId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ caseId: string }> }
): Promise<Response> {
  try {
    const { caseId } = await params;
    const raw = await request.json();
    const parsed = saveSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const { formNumber, formData, status } = parsed.data;
    const key = `${caseId}:${formNumber}`;
    const existing = formStore.get(key);

    const record = {
      formNumber,
      formData: { ...(existing?.formData || {}), ...formData },
      status: status || existing?.status || "draft",
      updatedAt: new Date().toISOString(),
    };

    formStore.set(key, record);

    return NextResponse.json({ caseId, ...record, saved: true });
  } catch (error) {
    return safeErrorResponse(error, "Failed to save form data");
  }
}
