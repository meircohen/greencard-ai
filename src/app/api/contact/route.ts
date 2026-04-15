import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail, contactConfirmationEmail, contactNotificationEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  caseType: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    const ticketId = `TICKET-${Date.now()}`;

    // Send confirmation email to user (non-blocking)
    const confirmation = contactConfirmationEmail(validatedData.name, ticketId);
    sendEmail({ ...confirmation, to: validatedData.email }).catch(() => {});

    // Send notification email to team (non-blocking)
    const teamEmail = process.env.CONTACT_EMAIL || "hello@greencard.ai";
    const notification = contactNotificationEmail(
      validatedData.name,
      validatedData.email,
      validatedData.phone,
      validatedData.caseType || "",
      validatedData.message,
      ticketId
    );
    sendEmail({ ...notification, to: teamEmail }).catch(() => {});

    return NextResponse.json(
      {
        success: true,
        ticketId,
        message: "Your message has been received. We will contact you soon.",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
