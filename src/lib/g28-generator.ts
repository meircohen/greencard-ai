/**
 * G-28 Form Generator
 *
 * Generates G-28 Notice of Entry of Appearance as Attorney or Representative
 * data matching USCIS form fields.
 */

import { getDb } from "@/lib/db";
import {
  users,
  attorneyProfiles,
  cases,
  userProfiles,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface G28Input {
  clientName: string;
  clientANumber?: string;
  attorneyName: string;
  barNumber: string;
  firmName: string;
  firmAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  attorneyEmail?: string;
  attorneyPhone?: string;
  dateOfSignature?: Date;
}

export interface G28FormData {
  // Part 1: Applicant/Beneficiary Information
  applicantName: string;
  applicantANumber: string | null;

  // Part 2: Attorney/Representative Information
  attorneyName: string;
  barNumber: string;
  stateLicensed: string;
  firmName: string;
  firmStreet: string;
  firmCity: string;
  firmState: string;
  firmZip: string;
  attorneyEmail: string;
  attorneyPhone: string;

  // Part 3: Signature Block
  dateOfSignature: string;
  signatureAttorney: string; // Placeholder for signature line
}

/**
 * Jeremy Knight's default attorney information
 */
const JEREMY_KNIGHT_DEFAULT = {
  attorneyName: "Jeremy Knight",
  barNumber: "1009132",
  firmName: "Partner Immigration Law PLLC",
  firmStreet: "1234 Oak Street",
  firmCity: "Fort Lauderdale",
  firmState: "FL",
  firmZip: "33312",
};

/**
 * Generate G-28 form data from input
 */
export function generateG28(input: G28Input): G28FormData {
  const dateStr = input.dateOfSignature
    ? input.dateOfSignature.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

  return {
    applicantName: input.clientName,
    applicantANumber: input.clientANumber || null,
    attorneyName: input.attorneyName,
    barNumber: input.barNumber,
    stateLicensed: input.barNumber
      .substring(input.barNumber.length - 2)
      .toUpperCase(),
    firmName: input.firmName,
    firmStreet: input.firmAddress.street,
    firmCity: input.firmAddress.city,
    firmState: input.firmAddress.state,
    firmZip: input.firmAddress.zip,
    attorneyEmail: input.attorneyEmail || "",
    attorneyPhone: input.attorneyPhone || "",
    dateOfSignature: dateStr,
    signatureAttorney: input.attorneyName,
  };
}

/**
 * Generate G-28 from a case using attorney assigned to the case
 */
export async function generateG28FromCase(
  caseId: string
): Promise<G28FormData> {
  const db = getDb();

  // Fetch case
  const caseRecord = await db.query.cases.findFirst({
    where: eq(cases.id, caseId),
  });

  if (!caseRecord) {
    throw new Error(`Case ${caseId} not found`);
  }

  // Fetch client info
  const client = await db.query.users.findFirst({
    where: eq(users.id, caseRecord.userId),
  });

  const clientProfile = client
    ? await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, client.id),
      })
    : null;

  const clientName = client?.fullName || "Client";

  // Use assigned attorney or default to Jeremy Knight
  let attorneyName = JEREMY_KNIGHT_DEFAULT.attorneyName;
  let barNumber = JEREMY_KNIGHT_DEFAULT.barNumber;
  let firmName = JEREMY_KNIGHT_DEFAULT.firmName;
  let firmCity = JEREMY_KNIGHT_DEFAULT.firmCity;
  let firmState = JEREMY_KNIGHT_DEFAULT.firmState;
  let firmZip = JEREMY_KNIGHT_DEFAULT.firmZip;
  let attorneyEmail = "";
  let attorneyPhone = "";

  if (caseRecord.attorneyId) {
    const attorney = await db.query.users.findFirst({
      where: eq(users.id, caseRecord.attorneyId),
    });

    const attorneyProfile = attorney
      ? await db.query.attorneyProfiles.findFirst({
          where: eq(attorneyProfiles.userId, attorney.id),
        })
      : null;

    if (attorneyProfile) {
      attorneyName = attorney?.fullName ?? attorneyProfile.userId ?? "Attorney";
      barNumber = attorneyProfile.barNumber;
      if (attorneyProfile.firmName) {
        firmName = attorneyProfile.firmName;
      }
      attorneyEmail = attorney?.email || "";
      attorneyPhone = attorney?.phone || "";
    }
  }

  const input: G28Input = {
    clientName,
    clientANumber: clientProfile?.aNumber ?? undefined,
    attorneyName,
    barNumber,
    firmName,
    firmAddress: {
      street: "1234 Oak Street",
      city: firmCity,
      state: firmState,
      zip: firmZip,
    },
    attorneyEmail,
    attorneyPhone,
  };

  return generateG28(input);
}

/**
 * Generate G-28 using Jeremy Knight's default information
 */
export function generateG28WithDefaults(
  clientName: string,
  clientANumber?: string
): G28FormData {
  const input: G28Input = {
    clientName,
    clientANumber,
    attorneyName: JEREMY_KNIGHT_DEFAULT.attorneyName,
    barNumber: JEREMY_KNIGHT_DEFAULT.barNumber,
    firmName: JEREMY_KNIGHT_DEFAULT.firmName,
    firmAddress: {
      street: "1234 Oak Street",
      city: JEREMY_KNIGHT_DEFAULT.firmCity,
      state: JEREMY_KNIGHT_DEFAULT.firmState,
      zip: JEREMY_KNIGHT_DEFAULT.firmZip,
    },
  };

  return generateG28(input);
}

/**
 * Convert G-28 form data to HTML for display/printing
 */
export function renderG28AsHTML(formData: G28FormData): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>G-28 Notice of Entry of Appearance</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.4; margin: 20px; }
    .form-header { text-align: center; font-weight: bold; margin-bottom: 20px; }
    .form-section { margin-bottom: 20px; }
    .field-row { margin-bottom: 10px; display: flex; }
    .field-label { width: 200px; font-weight: bold; }
    .field-value { flex: 1; border-bottom: 1px solid #000; }
    .signature-block { margin-top: 40px; }
    .signature-line { border-top: 1px solid #000; width: 300px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="form-header">
    <p>G-28, Notice of Entry of Appearance as Attorney or Representative</p>
  </div>

  <div class="form-section">
    <h3>Applicant/Beneficiary Information</h3>
    <div class="field-row">
      <div class="field-label">Name:</div>
      <div class="field-value">${escapeHtml(formData.applicantName)}</div>
    </div>
    <div class="field-row">
      <div class="field-label">A-Number (if known):</div>
      <div class="field-value">${
        formData.applicantANumber
          ? escapeHtml(formData.applicantANumber)
          : ""
      }</div>
    </div>
  </div>

  <div class="form-section">
    <h3>Attorney/Representative Information</h3>
    <div class="field-row">
      <div class="field-label">Name:</div>
      <div class="field-value">${escapeHtml(formData.attorneyName)}</div>
    </div>
    <div class="field-row">
      <div class="field-label">Bar Number:</div>
      <div class="field-value">${escapeHtml(formData.barNumber)}</div>
    </div>
    <div class="field-row">
      <div class="field-label">State Licensed:</div>
      <div class="field-value">${escapeHtml(formData.stateLicensed)}</div>
    </div>
    <div class="field-row">
      <div class="field-label">Firm Name:</div>
      <div class="field-value">${escapeHtml(formData.firmName)}</div>
    </div>
    <div class="field-row">
      <div class="field-label">Firm Address:</div>
      <div class="field-value">
        ${escapeHtml(formData.firmStreet)}<br>
        ${escapeHtml(formData.firmCity)}, ${escapeHtml(
    formData.firmState
  )} ${escapeHtml(formData.firmZip)}
      </div>
    </div>
    <div class="field-row">
      <div class="field-label">Email:</div>
      <div class="field-value">${escapeHtml(formData.attorneyEmail)}</div>
    </div>
    <div class="field-row">
      <div class="field-label">Phone:</div>
      <div class="field-value">${escapeHtml(formData.attorneyPhone)}</div>
    </div>
  </div>

  <div class="signature-block">
    <p>Date: ${escapeHtml(formData.dateOfSignature)}</p>
    <p>Signature of Attorney/Representative:</p>
    <div class="signature-line"></div>
    <p>${escapeHtml(formData.signatureAttorney)}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
