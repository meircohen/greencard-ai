import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { conversations, messages, cases, users } from "@/lib/db/schema";
import { eq, desc, and, or, sql } from "drizzle-orm";

interface ConversationWithLastMessage {
  id: string;
  caseId: string | null;
  subject: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  participantName: string;
  lastMessage: string | null;
  lastMessageTime: string | null;
}

interface CreateConversationRequest {
  caseId: string;
  subject: string;
  participantId?: string; // For direct messaging to another user
}

/**
 * GET /api/messages
 * List conversations for authenticated user
 * - For clients: show conversations related to their cases
 * - For attorneys: show conversations for cases they're assigned to
 */
export async function GET(request: NextRequest) {
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
    const userRole = session.user.role;

    let conversationList;

    if (userRole === "client") {
      // Clients see conversations related to their cases
      conversationList = await db
        .select({
          id: conversations.id,
          caseId: conversations.caseId,
          type: conversations.type,
          createdAt: conversations.createdAt,
          updatedAt: conversations.updatedAt,
          lastMessage: sql<string | null>`(
            SELECT content FROM messages
            WHERE conversation_id = conversations.id
            ORDER BY created_at DESC LIMIT 1
          )`,
          lastMessageTime: sql<string | null>`(
            SELECT created_at FROM messages
            WHERE conversation_id = conversations.id
            ORDER BY created_at DESC LIMIT 1
          )`,
        })
        .from(conversations)
        .where(eq(conversations.userId, userId))
        .orderBy(desc(conversations.updatedAt));
    } else {
      // Attorneys/admins see conversations for their assigned cases
      conversationList = await db
        .select({
          id: conversations.id,
          caseId: conversations.caseId,
          type: conversations.type,
          createdAt: conversations.createdAt,
          updatedAt: conversations.updatedAt,
          lastMessage: sql<string | null>`(
            SELECT content FROM messages
            WHERE conversation_id = conversations.id
            ORDER BY created_at DESC LIMIT 1
          )`,
          lastMessageTime: sql<string | null>`(
            SELECT created_at FROM messages
            WHERE conversation_id = conversations.id
            ORDER BY created_at DESC LIMIT 1
          )`,
        })
        .from(conversations)
        .innerJoin(cases, eq(conversations.caseId, cases.id))
        .where(eq(cases.attorneyId, userId))
        .orderBy(desc(conversations.updatedAt));
    }

    // Enrich with participant names
    const enriched: ConversationWithLastMessage[] = await Promise.all(
      conversationList.map(async (conv: any) => {
        // Get the case to find the other participant
        const [caseData] = conv.caseId
          ? await db
              .select()
              .from(cases)
              .where(eq(cases.id, conv.caseId))
          : [null];

        let participantName = "Unknown";
        if (caseData) {
          // Get the name of the other party (client if attorney, attorney if client)
          const otherParticipantId =
            userRole === "client" ? caseData.attorneyId : caseData.userId;
          if (otherParticipantId) {
            const [otherUser] = await db
              .select()
              .from(users)
              .where(eq(users.id, otherParticipantId));
            if (otherUser) {
              participantName = otherUser.fullName || otherUser.email;
            }
          }
        }

        return {
          id: conv.id,
          caseId: conv.caseId,
          subject: conv.type || "Conversation",
          type: conv.type,
          createdAt: conv.createdAt.toISOString(),
          updatedAt: conv.updatedAt.toISOString(),
          participantName,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime
            ? new Date(conv.lastMessageTime as string).toISOString()
            : null,
        };
      })
    );

    return NextResponse.json({ conversations: enriched });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * Create a new conversation
 * Body: { caseId, subject, participantId? }
 */
export async function POST(request: NextRequest) {
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
    const body = (await request.json()) as CreateConversationRequest;
    const { caseId, subject } = body;

    if (!caseId) {
      return NextResponse.json(
        { error: "caseId is required" },
        { status: 400 }
      );
    }

    // Verify user has access to this case
    const [caseData] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, caseId));

    if (!caseData) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    const userRole = session.user.role;
    const isClient = caseData.userId === userId;
    const isAttorney = caseData.attorneyId === userId;
    const isAdmin = userRole === "admin";

    if (!isClient && !isAttorney && !isAdmin) {
      return NextResponse.json(
        { error: "Not authorized to access this case" },
        { status: 403 }
      );
    }

    // Create conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        userId,
        caseId,
        type: "general",
        modelUsed: null,
        totalTokens: 0,
        messagesCount: 0,
      })
      .returning();

    return NextResponse.json(
      {
        conversation: {
          id: newConversation.id,
          caseId: newConversation.caseId,
          subject: subject || "Conversation",
          createdAt: newConversation.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
