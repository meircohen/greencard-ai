/**
 * PDF Generator Utility
 *
 * Generates professional PDFs from form data using pdf-lib.
 * Supports immigration forms, G-28 appearance notices, and filing packets.
 */

import { PDFDocument, PDFPage, rgb } from "pdf-lib";
import { G28FormData } from "./g28-generator";
import { FilingPacket } from "./filing-packet";

const PAGE_WIDTH = 612; // 8.5 inches
const PAGE_HEIGHT = 792; // 11 inches
const MARGIN = 40;
const LINE_HEIGHT = 15;
const HEADING_SIZE = 18;
const SUBHEADING_SIZE = 14;
const BODY_SIZE = 11;

interface FormField {
  label: string;
  value: string | null;
  type?: "text" | "checkbox" | "date";
}

interface FormDefinition {
  title: string;
  fields: FormField[];
}

/**
 * Helper: Draw text with word wrapping
 * Simple wrapping based on estimated character count
 */
function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  bold: boolean = false
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;
  // Estimate: approximately 2 characters per 10 pixels at fontSize 11
  const charsPerLine = Math.floor((maxWidth / fontSize) * 2.2);

  for (const word of words) {
    const testLine = line + (line ? " " : "") + word;

    if (testLine.length > charsPerLine && line) {
      page.drawText(line, {
        x,
        y: currentY,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      line = word;
      currentY -= LINE_HEIGHT;
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line, {
      x,
      y: currentY,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    currentY -= LINE_HEIGHT;
  }

  return currentY;
}

/**
 * Helper: Draw a horizontal line
 */
function drawHorizontalLine(
  page: PDFPage,
  x1: number,
  x2: number,
  y: number,
  color = rgb(0, 0, 0)
) {
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    color,
    thickness: 1,
  });
}

/**
 * Helper: Draw form field (label and value line)
 */
function drawFormField(
  page: PDFPage,
  label: string,
  value: string | null,
  x: number,
  y: number,
  fieldWidth: number
): number {
  const labelX = x;
  const valueX = x + 150;
  const valueWidth = fieldWidth - 150;

  // Label
  page.drawText(label, {
    x: labelX,
    y,
    size: BODY_SIZE,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Value
  if (value) {
    drawWrappedText(page, value, valueX, y, valueWidth, BODY_SIZE);
  }

  // Underline
  drawHorizontalLine(page, valueX, valueX + valueWidth, y - 2);

  return y - LINE_HEIGHT - 5;
}

/**
 * Generate a PDF for any immigration form
 */
export async function generateFormPdf(
  formData: FormDefinition,
  formNumber: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  let y = PAGE_HEIGHT - MARGIN;

  // Header
  page.drawText("UNITED STATES IMMIGRATION FORM", {
    x: MARGIN,
    y,
    size: 12,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 20;

  // Form number and title
  page.drawText(formNumber, {
    x: MARGIN,
    y,
    size: HEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 25;

  page.drawText(formData.title, {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 25;

  // Draft watermark (simple version without rotation)
  page.drawText("DRAFT", {
    x: PAGE_WIDTH / 2 - 30,
    y: PAGE_HEIGHT / 2,
    size: 48,
    color: rgb(0.8, 0.8, 0.8),
    opacity: 0.2,
  });

  // Divider
  y -= 10;
  drawHorizontalLine(page, MARGIN, PAGE_WIDTH - MARGIN, y);
  y -= 20;

  // Form fields
  const fieldWidth = PAGE_WIDTH - 2 * MARGIN;

  for (const field of formData.fields) {
    // Check if we need a new page
    if (y < MARGIN + 50) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = PAGE_HEIGHT - MARGIN;

      // Add page number
      page.drawText(`${pdfDoc.getPageCount()}`, {
        x: PAGE_WIDTH / 2 - 10,
        y: MARGIN - 20,
        size: 10,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    y = drawFormField(page, field.label, field.value || "", MARGIN, y, fieldWidth);
  }

  // Footer with generation info
  if (page) {
    page.drawText(
      `Generated: ${new Date().toLocaleDateString()} | Page ${pdfDoc.getPageCount()}`,
      {
        x: MARGIN,
        y: MARGIN - 20,
        size: 9,
        color: rgb(0.5, 0.5, 0.5),
      }
    );
  }

  return pdfDoc.save();
}

/**
 * Generate G-28 Notice of Entry of Appearance PDF
 */
export async function generateG28Pdf(formData: G28FormData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  let y = PAGE_HEIGHT - MARGIN;

  // USCIS Form Header
  page.drawText("USCIS", {
    x: MARGIN,
    y,
    size: 14,
    color: rgb(0, 0, 0),
  });
  y -= 25;

  // Form title
  page.drawText("G-28, Notice of Entry of Appearance as Attorney or Representative", {
    x: MARGIN,
    y,
    size: HEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // Divider
  drawHorizontalLine(page, MARGIN, PAGE_WIDTH - MARGIN, y);
  y -= 20;

  const fieldWidth = PAGE_WIDTH - 2 * MARGIN;

  // Part 1: Applicant/Beneficiary Information
  page.drawText("PART 1: Applicant/Beneficiary Information", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  y = drawFormField(page, "Full Name:", formData.applicantName, MARGIN, y, fieldWidth);
  y = drawFormField(
    page,
    "A-Number (if known):",
    formData.applicantANumber || "",
    MARGIN,
    y,
    fieldWidth
  );

  y -= 15;

  // Part 2: Attorney/Representative Information
  page.drawText("PART 2: Attorney/Representative Information", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  y = drawFormField(page, "Name:", formData.attorneyName, MARGIN, y, fieldWidth);
  y = drawFormField(page, "State Bar Number:", formData.barNumber, MARGIN, y, fieldWidth);
  y = drawFormField(page, "State Licensed:", formData.stateLicensed, MARGIN, y, fieldWidth);

  y -= 15;

  // Firm information
  page.drawText("Firm Information", {
    x: MARGIN,
    y,
    size: 11,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 18;

  y = drawFormField(page, "Firm Name:", formData.firmName, MARGIN, y, fieldWidth);

  const firmAddress = `${formData.firmStreet}, ${formData.firmCity}, ${formData.firmState} ${formData.firmZip}`;
  y = drawFormField(page, "Address:", firmAddress, MARGIN, y, fieldWidth);

  y = drawFormField(page, "Email:", formData.attorneyEmail, MARGIN, y, fieldWidth);
  y = drawFormField(page, "Phone:", formData.attorneyPhone, MARGIN, y, fieldWidth);

  y -= 20;

  // Part 3: Signature Block
  page.drawText("PART 3: Signature Block", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(`Date: ${formData.dateOfSignature}`, {
    x: MARGIN,
    y,
    size: BODY_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  page.drawText("Signature of Attorney/Representative:", {
    x: MARGIN,
    y,
    size: BODY_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  // Signature line
  drawHorizontalLine(page, MARGIN, MARGIN + 250, y);
  y -= 15;

  page.drawText(formData.signatureAttorney, {
    x: MARGIN,
    y,
    size: BODY_SIZE,
    color: rgb(0, 0, 0),
  });

  // Footer
  page.drawText("This form must be signed by the attorney or representative", {
    x: MARGIN,
    y: MARGIN - 40,
    size: 9,
    color: rgb(0.5, 0.5, 0.5),
  });

  page.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
    x: PAGE_WIDTH - MARGIN - 200,
    y: MARGIN - 40,
    size: 9,
    color: rgb(0.5, 0.5, 0.5),
  });

  return pdfDoc.save();
}

/**
 * Generate Filing Packet Cover Sheet and Checklist PDF
 */
export async function generateFilingPacketPdf(
  packetData: FilingPacket
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  let y = PAGE_HEIGHT - MARGIN;

  // Cover Letter
  page.drawText("USCIS FILING PACKET", {
    x: MARGIN,
    y,
    size: HEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  page.drawText("Cover Letter & Checklist", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 25;

  // Case information
  drawHorizontalLine(page, MARGIN, PAGE_WIDTH - MARGIN, y);
  y -= 20;

  const fieldWidth = PAGE_WIDTH - 2 * MARGIN;

  y = drawFormField(page, "Client Name:", packetData.clientName, MARGIN, y, fieldWidth);
  y = drawFormField(page, "Case Type:", packetData.caseType, MARGIN, y, fieldWidth);
  if (packetData.aNumber) {
    y = drawFormField(page, "A-Number:", packetData.aNumber, MARGIN, y, fieldWidth);
  }
  y = drawFormField(
    page,
    "Generated Date:",
    new Date(packetData.generatedAt).toLocaleDateString(),
    MARGIN,
    y,
    fieldWidth
  );

  y -= 15;

  // Mailing Address Section
  page.drawText("Mailing Address for Filing", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  const addressLines = packetData.mailingAddress.formatted.split("\n");
  for (const line of addressLines) {
    page.drawText(line, {
      x: MARGIN,
      y,
      size: BODY_SIZE,
      color: rgb(0, 0, 0),
    });
    y -= LINE_HEIGHT;
  }

  y -= 15;

  // Fee Information
  page.drawText("Filing Fees", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  for (const fee of packetData.filingFee.forms) {
    page.drawText(
      `${fee.form}: $${fee.amount.toFixed(2)}`,
      {
        x: MARGIN + 20,
        y,
        size: BODY_SIZE,
        color: rgb(0, 0, 0),
      }
    );
    y -= LINE_HEIGHT;
  }

  y -= 5;
  drawHorizontalLine(page, MARGIN, PAGE_WIDTH - MARGIN - 200, y);
  y -= 15;

  page.drawText(
    `Total Fee (Payable to: ${packetData.filingFee.payableTo}): $${packetData.filingFee.amount.toFixed(2)}`,
    {
      x: MARGIN,
      y,
      size: 12,
      color: rgb(0, 0, 0),
    }
  );
  y -= 25;

  // Document Checklist
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;

  page.drawText("Document Checklist", {
    x: MARGIN,
    y,
    size: HEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 30;

  page.drawText("Forms to be submitted:", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  for (const form of packetData.formOrder) {
    const status = form.status === "draft" ? " (DRAFT)" : "";
    page.drawText(`[ ] ${form.formNumber} - ${form.title}${status}`, {
      x: MARGIN + 20,
      y,
      size: BODY_SIZE,
      color: form.status === "draft" ? rgb(0.7, 0, 0) : rgb(0, 0, 0),
    });
    y -= LINE_HEIGHT;
  }

  y -= 15;

  page.drawText("Required Documents:", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  for (const doc of packetData.documentChecklist) {
    const checkmark = doc.included ? "[X]" : "[ ]";
    const color = doc.included ? rgb(0, 0.5, 0) : rgb(0.5, 0.5, 0.5);
    page.drawText(`${checkmark} ${doc.name}`, {
      x: MARGIN + 20,
      y,
      size: BODY_SIZE,
      color,
    });
    y -= LINE_HEIGHT;
  }

  y -= 15;

  // Important Notes
  page.drawText("Important Notes:", {
    x: MARGIN,
    y,
    size: SUBHEADING_SIZE,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  for (const note of packetData.notes) {
    y = drawWrappedText(page, `- ${note}`, MARGIN + 20, y, fieldWidth - 20, BODY_SIZE);
    y -= 5;
  }

  // Footer
  page.drawText(
    `Generated: ${new Date().toLocaleDateString()} | Page 2 of 2`,
    {
      x: MARGIN,
      y: MARGIN - 20,
      size: 9,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  return pdfDoc.save();
}
