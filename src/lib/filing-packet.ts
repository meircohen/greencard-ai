/**
 * Filing Packet Generator
 *
 * Generates complete filing packets for USCIS submissions including
 * cover letters, fee calculations, checklists, and mailing addresses.
 */

import { getDb } from "@/lib/db";
import { cases, caseForms, caseDocuments, users, userProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { formFees } from "@/lib/uscis-data";
import { getLockboxAddress, formatAddressForEnvelope } from "@/lib/uscis-addresses";

export interface FilingPacket {
  caseId: string;
  caseType: string;
  clientName: string;
  aNumber?: string;
  coverLetter: string;
  filingFee: {
    amount: number;
    payableTo: string;
    forms: Array<{ form: string; amount: number }>;
  };
  mailingAddress: {
    name: string;
    attention?: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    formatted: string;
  };
  formOrder: Array<{
    formNumber: string;
    title: string;
    status: string;
  }>;
  documentChecklist: Array<{
    name: string;
    included: boolean;
    required: boolean;
  }>;
  generatedAt: string;
  notes: string[];
}

interface CaseWithClient {
  id: string;
  caseType: string;
  userId: string;
  attorneyId?: string;
  status: string;
  category: string;
}

interface FormMetadata {
  [key: string]: {
    title: string;
    order: number;
    requiredDocuments: string[];
  };
}

const formMetadata: FormMetadata = {
  "I-130": {
    title: "Petition for Alien Relative",
    order: 1,
    requiredDocuments: [
      "Birth Certificate",
      "Passport Copy",
      "Marriage Certificate (if applicable)",
      "Divorce Decrees (if applicable)",
      "Police Certificates",
    ],
  },
  "I-140": {
    title: "Immigrant Petition for Alien Worker",
    order: 2,
    requiredDocuments: [
      "Labor Certification",
      "Credentials Documentation",
      "Job Offer Letter",
      "Educational Diplomas",
      "Employment History",
    ],
  },
  "I-485": {
    title: "Application to Register Permanent Residence or Adjust Status",
    order: 3,
    requiredDocuments: [
      "Medical Examination (I-693)",
      "Birth Certificate",
      "Passport",
      "Police Clearance",
      "Financial Documents (I-864)",
      "Employment History",
    ],
  },
  "I-765": {
    title: "Application for Employment Authorization",
    order: 4,
    requiredDocuments: ["Passport Copy", "Biographical Information"],
  },
  "I-131": {
    title: "Application for Travel Document",
    order: 5,
    requiredDocuments: ["Passport Copy", "Biographical Information"],
  },
  "I-864": {
    title: "Affidavit of Support",
    order: 6,
    requiredDocuments: [
      "Tax Returns (3 years)",
      "W-2 Forms",
      "Pay Stubs",
      "Bank Statements",
    ],
  },
  "N-400": {
    title: "Application for Naturalization",
    order: 7,
    requiredDocuments: [
      "Permanent Resident Card",
      "Passport",
      "Birth Certificate",
      "Marriage Certificate",
      "Divorce Decrees",
    ],
  },
  "G-28": {
    title: "Notice of Entry of Appearance as Attorney or Representative",
    order: 0,
    requiredDocuments: [],
  },
};

function generateCoverLetter(
  caseType: string,
  clientName: string,
  aNumber: string | undefined,
  formNumbers: string[],
  generatedDate: Date
): string {
  const dateStr = generatedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formList = formNumbers
    .map((f) => `${f} - ${formMetadata[f]?.title || "Unknown Form"}`)
    .join("\n");

  return `RE: USCIS Filing Packet for ${clientName}
Case Type: ${caseType}${aNumber ? `\nA-Number: ${aNumber}` : ""}

Dear USCIS Officer,

Please find enclosed the filing packet for the above-referenced case. This
packet contains all required forms, supporting documents, and fees for
processing by USCIS.

The following forms are included in order of submission:

${formList}

All documents are organized according to USCIS requirements and are submitted
concurrently with this letter. Copies are retained for our records.

If you have any questions or require additional information, please contact
our office. We request receipt confirmation upon arrival.

Respectfully submitted,

Partner Immigration Law PLLC
Fort Lauderdale, Florida`;
}

export async function generateFilingPacket(
  caseId: string
): Promise<FilingPacket> {
  const db = getDb();

  // Fetch case
  const caseRecord = await db.query.cases.findFirst({
    where: eq(cases.id, caseId),
  });

  if (!caseRecord) {
    throw new Error(`Case ${caseId} not found`);
  }

  // Fetch forms for this case
  const forms = await db.query.caseForms.findMany({
    where: eq(caseForms.caseId, caseId),
  });

  // Fetch documents for this case
  const documents = await db.query.caseDocuments.findMany({
    where: eq(caseDocuments.caseId, caseId),
  });

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
  const aNumber = clientProfile?.aNumber || undefined;

  // Get form numbers
  const formNumbers = forms.map((f) => f.formNumber);

  // Calculate filing fees
  const feeBreakdown = formNumbers.map((formNum) => ({
    form: formNum,
    amount: formFees[formNum as keyof typeof formFees] || 0,
  }));

  const totalFee = feeBreakdown.reduce((sum, f) => sum + f.amount, 0);

  // Determine primary form for address routing
  const primaryForm = formNumbers[0] || "I-485";
  const mailingAddressRaw = getLockboxAddress(primaryForm);

  if (!mailingAddressRaw) {
    throw new Error(`No mailing address configured for form ${primaryForm}`);
  }

  const mailingAddress = {
    ...mailingAddressRaw,
    formatted: formatAddressForEnvelope(mailingAddressRaw),
  };

  // Generate form order
  const formOrder = formNumbers
    .map((formNum) => ({
      formNumber: formNum,
      title: formMetadata[formNum]?.title || "Unknown Form",
      status: forms.find((f) => f.formNumber === formNum)?.status || "draft",
    }))
    .sort((a, b) => {
      const orderA = formMetadata[a.formNumber]?.order || 999;
      const orderB = formMetadata[b.formNumber]?.order || 999;
      return orderA - orderB;
    });

  // Generate document checklist
  const requiredDocs = new Set<string>();
  formNumbers.forEach((formNum) => {
    const docs = formMetadata[formNum]?.requiredDocuments || [];
    docs.forEach((doc) => requiredDocs.add(doc));
  });

  const documentNames = documents.map((d) => d.documentType);

  const documentChecklist = Array.from(requiredDocs).map((docName) => ({
    name: docName,
    included: documentNames.includes(docName),
    required: true,
  }));

  // Add any uploaded documents not in required list
  documentNames.forEach((docName) => {
    if (!requiredDocs.has(docName)) {
      documentChecklist.push({
        name: docName,
        included: true,
        required: false,
      });
    }
  });

  const generatedDate = new Date();

  // Generate cover letter
  const coverLetter = generateCoverLetter(
    caseRecord.caseType,
    clientName,
    aNumber,
    formNumbers,
    generatedDate
  );

  // Compile notes
  const notes: string[] = [];
  if (documents.length === 0) {
    notes.push("WARNING: No documents uploaded yet. Review before mailing.");
  }
  if (forms.some((f) => f.status === "draft")) {
    notes.push("WARNING: Some forms are still in draft status.");
  }
  notes.push("Verify all forms are complete and signed before mailing.");
  notes.push("Keep copies of all submitted documents for records.");

  return {
    caseId,
    caseType: caseRecord.caseType,
    clientName,
    aNumber,
    coverLetter,
    filingFee: {
      amount: totalFee,
      payableTo: "USCIS",
      forms: feeBreakdown,
    },
    mailingAddress: {
      name: mailingAddress.name,
      attention: mailingAddress.attention,
      line1: mailingAddress.line1,
      line2: mailingAddress.line2,
      city: mailingAddress.city,
      state: mailingAddress.state,
      zip: mailingAddress.zip,
      formatted: mailingAddress.formatted,
    },
    formOrder,
    documentChecklist,
    generatedAt: generatedDate.toISOString(),
    notes,
  };
}
