import { NextRequest, NextResponse } from "next/server";
import { getDb } from "./db";
import { cases } from "./db/schema";
import { eq, and } from "drizzle-orm";

/**
 * Authorization enforcement helpers.
 *
 * Middleware already sets x-user-id and x-user-role headers on authenticated
 * requests, but individual route handlers still need to:
 *  1. Assert the user exists (requireSession)
 *  2. Assert the user has the right role (requireRole)
 *  3. Assert the user owns or is assigned to a resource (assertOwnership)
 */

export type UserRole = "client" | "attorney" | "admin";

export interface RequestActor {
  id: string;
  role: UserRole;
}

/** Extract the authenticated actor from middleware-injected headers. */
export function getActor(request: NextRequest): RequestActor | null {
  const id = request.headers.get("x-user-id");
  const role = request.headers.get("x-user-role") as UserRole | null;
  if (!id || !role) return null;
  return { id, role };
}

/** Return 401 if no session. */
export function requireSession(request: NextRequest): RequestActor | NextResponse {
  const actor = getActor(request);
  if (!actor) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return actor;
}

/** Return 403 if actor role is not in the allowed set. */
export function requireRole(
  actor: RequestActor,
  allowed: UserRole[]
): NextResponse | null {
  if (!allowed.includes(actor.role)) {
    return NextResponse.json(
      { error: "You do not have permission to perform this action" },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Assert the current actor owns (or is assigned to) a case.
 * Admins bypass the check. Attorneys pass if they are the assigned attorney.
 * Clients pass only if they are the case owner.
 */
export async function assertCaseAccess(
  actor: RequestActor,
  caseId: string
): Promise<NextResponse | null> {
  if (actor.role === "admin") return null;

  const db = getDb();
  const [row] = await db
    .select({ userId: cases.userId, attorneyId: cases.attorneyId })
    .from(cases)
    .where(eq(cases.id, caseId))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const isOwner = row.userId === actor.id;
  const isAssignedAttorney = actor.role === "attorney" && row.attorneyId === actor.id;

  if (!isOwner && !isAssignedAttorney) {
    return NextResponse.json(
      { error: "You do not have access to this case" },
      { status: 403 }
    );
  }

  return null;
}

/**
 * Generic ownership check: the resource's userId field must match the actor,
 * unless the actor is admin.
 */
export function assertOwnership(
  actor: RequestActor,
  resourceUserId: string
): NextResponse | null {
  if (actor.role === "admin") return null;
  if (actor.id !== resourceUserId) {
    return NextResponse.json(
      { error: "You do not have access to this resource" },
      { status: 403 }
    );
  }
  return null;
}
