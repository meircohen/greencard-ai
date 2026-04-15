import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { safeErrorResponse } from "@/lib/errors";
import { logger } from "@/lib/logger";

/**
 * Form data save/load API for case forms.
 * Uses Drizzle/Neon when DATABASE_URL is set, falls back to in-memory.
 */

// In-memory fallback for dev without DB
const formStore = new Map<string, { formNumber: string; formData: Record<string, unknown>; status: string; updatedAt: string }>();

async function getDbOrNull() {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { getDb } = await import("@/lib/db/index");
    return getDb();
  } catch {
    return null;
  }
}

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

    const db = await getDbOrNull();

    if (db) {
      const { caseForms } = await import("@/lib/db/schema");
      const rows = await db
        .select()
        .from(caseForms)
        .where(and(eq(caseForms.caseId, caseId), eq(caseForms.formNumber, formNumber)))
        .limit(1);

      if (rows.length === 0) {
        return NextResponse.json({ caseId, formNumber, formData: {}, status: "draft", updatedAt: null });
      }

      const row = rows[0];
      return NextResponse.json({
        caseId,
        formNumber: row.formNumber,
        formData: row.formData || {},
        status: row.status,
        updatedAt: row.updatedAt?.toISOString() || null,
      });
    }

    // Fallback: in-memory
    const key = `${caseId}:${formNumber}`;
    const stored = formStore.get(key);

    if (!stored) {
      return NextResponse.json({ caseId, formNumber, formData: {}, status: "draft", updatedAt: null });
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
    const db = await getDbOrNull();

    if (db) {
      const { caseForms } = await import("@/lib/db/schema");

      // Upsert: check if form exists for this case
      const existing = await db
        .select()
        .from(caseForms)
        .where(and(eq(caseForms.caseId, caseId), eq(caseForms.formNumber, formNumber)))
        .limit(1);

      const mergedData = { ...(existing[0]?.formData as Record<string, unknown> || {}), ...formData };
      const newStatus = status || existing[0]?.status || "draft";
      const now = new Date();

      if (existing.length > 0) {
        await db
          .update(caseForms)
          .set({ formData: mergedData, status: newStatus, updatedAt: now })
          .where(eq(caseForms.id, existing[0].id));
      } else {
        await db.insert(caseForms).values({
          caseId,
          formNumber,
          formData: mergedData,
          status: newStatus,
          updatedAt: now,
        });
      }

      logger.info({ caseId, formNumber }, "Form data saved to database");
      return NextResponse.json({ caseId, formNumber, formData: mergedData, status: newStatus, updatedAt: now.toISOString(), saved: true });
    }

    // Fallback: in-memory
    const key = `${caseId}:${formNumber}`;
    const existingMem = formStore.get(key);

    const record = {
      formNumber,
      formData: { ...(existingMem?.formData || {}), ...formData },
      status: status || existingMem?.status || "draft",
      updatedAt: new Date().toISOString(),
    };

    formStore.set(key, record);

    return NextResponse.json({ caseId, ...record, saved: true });
  } catch (error) {
    return safeErrorResponse(error, "Failed to save form data");
  }
}
