import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/lib/store";

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "deadline",
    title: "RFE Response Due Soon",
    description: "Your RFE response for EB-2 case is due in 5 days",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/cases/123",
  },
  {
    id: "2",
    type: "case_update",
    title: "Case Status Updated",
    description: "Your I-140 petition has been approved",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/cases/456",
  },
  {
    id: "3",
    type: "document",
    title: "New Document Required",
    description: "Medical examination results needed for your application",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/cases/789",
  },
  {
    id: "4",
    type: "billing",
    title: "Payment Received",
    description: "Your subscription payment has been processed successfully",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Visa Bulletin Updated",
    description: "June 2025 visa bulletin is now available",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

interface CreateNotificationRequest {
  userId: string;
  type: "case_update" | "deadline" | "document" | "billing" | "system";
  title: string;
  description: string;
  actionUrl?: string;
}

// GET - List notifications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate pagination params
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedNotifications = mockNotifications.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedNotifications,
      pagination: {
        page,
        limit,
        total: mockNotifications.length,
        totalPages: Math.ceil(mockNotifications.length / limit),
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

// POST - Create notification
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateNotificationRequest;

    // Validate required fields
    if (!body.userId || !body.type || !body.title || !body.description) {
      return NextResponse.json(
        {
          error: "Missing required fields: userId, type, title, description",
        },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes = [
      "case_update",
      "deadline",
      "document",
      "billing",
      "system",
    ];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          error: `Invalid notification type. Must be one of: ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Create new notification
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type: body.type,
      title: body.title,
      description: body.description,
      timestamp: new Date(),
      read: false,
      actionUrl: body.actionUrl,
    };

    // In a real application, this would be saved to a database
    // For now, we just add it to our mock array
    mockNotifications.unshift(newNotification);

    return NextResponse.json(
      {
        success: true,
        data: newNotification,
        message: "Notification created successfully",
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
