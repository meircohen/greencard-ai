import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { notifications, notificationTypeEnum } from "@/lib/db/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const actorId = request.headers.get("x-user-id");
    if (!actorId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
    const type = searchParams.get("type");
    const unreadOnly = searchParams.get("unread") === "true";

    const offset = (page - 1) * limit;

    const whereConditions = [eq(notifications.userId, actorId)];
    if (type) {
      whereConditions.push(eq(notifications.type, type as any));
    }
    if (unreadOnly) {
      whereConditions.push(eq(notifications.read, false));
    }

    const data = await getDb().query.notifications.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: [desc(notifications.createdAt)],
      limit,
      offset,
    });

    const countResult = await getDb()
      .select({ count: notifications.id })
      .from(notifications)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = countResult.length > 0 ? countResult.length : 0;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const actorId = request.headers.get("x-user-id");
    const actorRole = request.headers.get("x-user-role");

    if (!actorId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (actorRole !== "admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, caseId, type, title, message, metadata } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields: userId, type, title, message" },
        { status: 400 }
      );
    }

    const newNotification = await getDb().insert(notifications).values({
      userId,
      caseId: caseId || null,
      type,
      title,
      message,
      metadata: metadata || null,
      read: false,
    }).returning();

    return NextResponse.json(
      {
        success: true,
        data: newNotification[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const actorId = request.headers.get("x-user-id");
    if (!actorId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, read } = body;

    if (!notificationId || typeof read !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: notificationId, read" },
        { status: 400 }
      );
    }

    const notification = await getDb().query.notifications.findFirst({
      where: eq(notifications.id, notificationId),
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    if (notification.userId !== actorId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const updated = await getDb()
      .update(notifications)
      .set({
        read,
        readAt: read ? new Date() : null,
      })
      .where(eq(notifications.id, notificationId))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated[0],
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
