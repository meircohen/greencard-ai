import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { conversations, cases } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/messages/[conversationId]/read
 * Mark all messages in a conversation as read by the current user
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const db = getDb();
    const userId = session.user.id;
    const { conversationId } = await params;

    // Get the conversation
    const [conversation] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, conversationId));

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify user has access to this conversation
    const [caseData] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, conversation.caseId || ""));

    const userRole = session.user.role;
    const isClient = caseData?.userId === userId;
    const isAttorney = caseData?.attorneyId === userId;
    const isAdmin = userRole === "admin";

    if (!isClient && !isAttorney && !isAdmin) {
      return NextResponse.json(
        { error: "Not authorized to access this conversation" },
        { status: 403 }
      );
    }

    // In a full implementation, you would:
    // 1. Create a conversation_readers table to track who has read what
    // 2. Update the readAt timestamp for this user
    // For now, we just acknowledge the request

    return NextResponse.json({
      success: true,
      conversationId,
      readAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
