/**
 * PDF Generation API Endpoint
 *
 * Generates PDFs for forms, G-28 notices, and filing packets.
 * GET /api/cases/[id]/pdf?type=form&formNumber=I-485
 * GET /api/cases/[id]/pdf?type=g28
 * GET /api/cases/[id]/pdf?type=packet
 */

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cases, caseForms } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { generateFormPdf, generateG28Pdf, generateFilingPacketPdf } from "@/lib/pdf-generator";
import { generateG28FromCase } from "@/lib/g28-generator";
import { generateFilingPacket } from "@/lib/filing-packet";

/**
 * Helper: fetch a case with ownership check
 */
async function getCaseForActor(caseId: string, actorId: string, actorRole: string | null) {
  const db = getDb();

  if (actorRole === "admin") {
    return db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });
  }

  return db.query.cases.findFirst({
    where: and(
      eq(cases.id, caseId),
      or(
        eq(cases.userId, actorId),
        eq(cases.attorneyId, actorId)
      )
    ),
  });
}

/**
 * Form field definitions for common immigration forms
 */
const formDefinitions: Record<string, { title: string; fields: Array<{ label: string; key: string }> }> = {
  "I-485": {
    title: "Application to Register Permanent Residence or Adjust Status",
    fields: [
      { label: "Full Name", key: "fullName" },
      { label: "Date of Birth", key: "dateOfBirth" },
      { label: "Place of Birth", key: "placeOfBirth" },
      { label: "Passport Number", key: "passportNumber" },
      { label: "Country of Citizenship", key: "citizenship" },
      { label: "Current Address", key: "address" },
      { label: "Phone Number", key: "phone" },
      { label: "Email Address", key: "email" },
      { label: "Immigration Category", key: "category" },
      { label: "A-Number", key: "aNumber" },
    ],
  },
  "I-130": {
    title: "Petition for Alien Relative",
    fields: [
      { label: "Petitioner Name", key: "petitionerName" },
      { label: "Beneficiary Name", key: "beneficiaryName" },
      { label: "Relationship", key: "relationship" },
      { label: "Date of Birth", key: "dateOfBirth" },
      { label: "Country of Birth", key: "placeOfBirth" },
      { label: "Immigration Status", key: "immigrationStatus" },
    ],
  },
  "I-140": {
    title: "Immigrant Petition for Alien Worker",
    fields: [
      { label: "Employer Name", key: "employerName" },
      { label: "Worker Name", key: "workerName" },
      { label: "Job Title", key: "jobTitle" },
      { label: "Work Experience Years", key: "experience" },
      { label: "Education Level", key: "education" },
    ],
  },
  "I-765": {
    title: "Application for Employment Authorization",
    fields: [
      { label: "Full Name", key: "fullName" },
      { label: "Date of Birth", key: "dateOfBirth" },
      { label: "Country of Citizenship", key: "citizenship" },
      { label: "Current Address", key: "address" },
      { label: "Employment Category", key: "category" },
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const actorId = request.headers.get("x-user-id");
    const actorRole = request.headers.get("x-user-role");

    // Authentication check
    if (!actorId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Authorization check
    const caseData = await getCaseForActor(caseId, actorId, actorRole);
    if (!caseData) {
      return NextResponse.json({ error: "Case not found or access denied" }, { status: 404 });
    }

    const db = getDb();
    const type = request.nextUrl.searchParams.get("type") || "form";
    const formNumber = request.nextUrl.searchParams.get("formNumber") || "I-485";

    let pdfBytes: Uint8Array;
    let filename: string;

    // Generate appropriate PDF based on type
    if (type === "form") {
      // Fetch case form data
      const form = await db.query.caseForms.findFirst({
        where: eq(caseForms.caseId, caseId),
      });

      if (!form) {
        return NextResponse.json(
          { error: "No form data found for this case" },
          { status: 404 }
        );
      }

      // Get form definition
      const formDef = formDefinitions[formNumber] || formDefinitions["I-485"];

      // Parse form data (stored as JSON in DB)
      const formDataObj = form.formData as Record<string, any> || {};

      // Build form fields from definition and data
      const fields = formDef.fields.map((field) => ({
        label: field.label,
        value: formDataObj[field.key] || null,
      }));

      pdfBytes = await generateFormPdf(
        {
          title: formDef.title,
          fields,
        },
        formNumber
      );

      filename = `${formNumber.replace("-", "_")}_draft.pdf`;
    } else if (type === "g28") {
      // Generate G-28 form
      const g28Data = await generateG28FromCase(caseId);
      pdfBytes = await generateG28Pdf(g28Data);
      filename = "G_28_Notice_of_Appearance.pdf";
    } else if (type === "packet") {
      // Generate filing packet
      const packetData = await generateFilingPacket(caseId);
      pdfBytes = await generateFilingPacketPdf(packetData);
      filename = "Filing_Packet_Checklist.pdf";
    } else {
      return NextResponse.json(
        { error: "Invalid PDF type. Use 'form', 'g28', or 'packet'" },
        { status: 400 }
      );
    }

    // Return PDF with proper headers
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate PDF",
      },
      { status: 500 }
    );
  }
}
