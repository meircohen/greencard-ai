import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  type: z.enum(["general", "attorney", "support"]),
});

type ContactForm = z.infer<typeof contactSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate with Zod
    const validatedData = contactSchema.parse(body);

    // TODO: Send email using Resend
    // const response = await resend.emails.send({
    //   from: "contact@greencard.ai",
    //   to: validatedData.email,
    //   subject: "We received your message",
    //   html: `<p>Thank you for contacting GreenCard.ai</p>`,
    // });

    const ticketId = `TICKET-${Date.now()}`;

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
