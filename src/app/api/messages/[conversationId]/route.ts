import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { conversations, messages, cases, users, notifications } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { sendEmail, newMessageEmail } from "@/lib/email";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "attorney" | "admin";
  content: string;
  createdAt: string;
}

interface SendMessageRequest {
  content: string;
}

/**
 * GET /api/messages/[conversationId]
 * Fetch messages in a conversation with pagination
 * Query params: ?page=1&limit=50
 */
export async function GET(
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

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Fetch messages in chronological order
    const messageList = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    // Reverse to get chronological order
    messageList.reverse();

    // Enrich with sender information
    const enriched: Message[] = await Promise.all(
      messageList.map(async (msg: any) => {
        // Since the schema doesn't have senderId in messages, we'll use role as a workaround
        // In a real implementation, you'd add a senderId column
        const [sender] = await db
          .select()
          .from(users)
          .where(eq(users.id, conversation.userId));

        return {
          id: msg.id,
          conversationId: msg.conversationId,
          senderId: conversation.userId, // Placeholder - should be actual sender
          senderName: sender?.fullName || "Unknown",
          senderRole: sender?.role || "client",
          content: msg.content,
          createdAt: msg.createdAt.toISOString(),
        };
      })
    );

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        caseId: conversation.caseId,
        createdAt: conversation.createdAt.toISOString(),
      },
      messages: enriched,
      pagination: {
        page,
        limit,
        total: messageList.length,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages/[conversationId]
 * Send a message in a conversation
 * Body: { content }
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
    const body = (await request.json()) as SendMessageRequest;
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

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

    // Create message
    const [newMessage] = await db
      .insert(messages)
      .values({
        conversationId,
        role: "user", // In a real implementation, distinguish by actual user role
        content,
      })
      .returning();

    // Update conversation metadata
    await db
      .update(conversations)
      .set({
        messagesCount: (conversation.messagesCount || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(conversations.id, conversationId));

    // Create notification for other participants and send email
    if (caseData) {
      const recipientId =
        userId === caseData.userId ? caseData.attorneyId : caseData.userId;

      if (recipientId) {
        const [sender] = await db
          .select()
          .from(users)
          .where(eq(users.id, userId));

        const [recipient] = await db
          .select()
          .from(users)
          .where(eq(users.id, recipientId));

        await db
          .insert(notifications)
          .values({
            userId: recipientId,
            caseId: caseData.id,
            type: "case_status_update",
            title: `New message from ${sender?.fullName || "Unknown"}`,
            message: content.substring(0, 100),
            metadata: {
              conversationId,
              messageId: newMessage.id,
              senderName: sender?.fullName,
              senderRole: userRole,
            },
          });

        // Send email notification (non-blocking)
        if (recipient) {
          const emailPayload = newMessageEmail(
            recipient.fullName || "User",
            sender?.fullName || "Unknown",
            content
          );
          emailPayload.to = recipient.email;
          sendEmail(emailPayload).catch(err => console.error("Message email failed:", err));
        }
      }
    }

    return NextResponse.json(
      {
        message: {
          id: newMessage.id,
          conversationId: newMessage.conversationId,
          content: newMessage.content,
          createdAt: newMessage.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
