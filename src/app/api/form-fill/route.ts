import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { FORM_FILL_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { safeErrorResponse } from "@/lib/errors";

const formFillSchema = z.object({
  action: z.enum(["auto-fill", "validate", "suggest"]),
  formNumber: z.string().min(1).max(20),
  formData: z.record(z.string(), z.unknown()).optional(),
  documents: z.array(z.object({
    type: z.string().max(100),
    extractedText: z.string().max(100000),
  })).max(20).optional(),
  caseData: z.record(z.string(), z.unknown()).optional(),
});

interface ValidationIssue {
  field: string;
  severity: "error" | "warning" | "info";
  message: string;
  rfeRisk: boolean;
}

interface FormFillResponse {
  formData?: Record<string, unknown>;
  validation?: {
    isValid: boolean;
    issues: ValidationIssue[];
    completeness: number;
  };
  suggestions?: Array<{
    field: string;
    suggestion: string;
    reasoning: string;
  }>;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

const I130_FIELD_DEFINITIONS = {
  section1_petition: {
    fields: [
      { name: "petitionerFirstName", label: "Petitioner First Name" },
      { name: "petitionerLastName", label: "Petitioner Last Name" },
      { name: "petitionerDOB", label: "Date of Birth (MM/DD/YYYY)" },
      { name: "petitionerCountryOfBirth", label: "Country of Birth" },
      { name: "petitionerCurrentAddress", label: "Current Address" },
      { name: "petitionerPhoneNumber", label: "Phone Number" },
      { name: "petitionerEmail", label: "Email Address" },
      { name: "petitionerSSN", label: "Social Security Number" },
    ],
  },
  section2_beneficiary: {
    fields: [
      { name: "beneficiaryFirstName", label: "Beneficiary First Name" },
      { name: "beneficiaryLastName", label: "Beneficiary Last Name" },
      { name: "beneficiaryDOB", label: "Date of Birth (MM/DD/YYYY)" },
      { name: "beneficiaryGender", label: "Gender" },
      { name: "beneficiaryCountryOfBirth", label: "Country of Birth" },
      { name: "beneficiaryCurrentAddress", label: "Current Address" },
      {
        name: "beneficiaryForeignAddress",
        label: "Foreign Address (if applicable)",
      },
      { name: "beneficiaryPhone", label: "Phone Number" },
    ],
  },
  section3_relationship: {
    fields: [
      {
        name: "relationshipToApplicant",
        label: "Relationship (spouse/parent/child/sibling)",
      },
      { name: "relationshipStartDate", label: "Date Relationship Began" },
      {
        name: "relationshipDocumentation",
        label: "Supporting Documentation Attached",
      },
      {
        name: "previousMarriages",
        label: "Any Previous Marriages? (YES/NO)",
      },
      {
        name: "petitionerChildrenBeneficiary",
        label: "Does Petitioner Have Children with Beneficiary?",
      },
    ],
  },
  section4_processing: {
    fields: [
      {
        name: "intentionToEstablishResidence",
        label: "Beneficiary Will Establish Residence in US",
      },
      {
        name: "uscisOfficeJurisdiction",
        label: "USCIS Office Having Jurisdiction",
      },
      { name: "feeEnclosed", label: "Check/Money Order Enclosed (YES/NO)" },
      { name: "feeAmount", label: "Fee Amount in USD" },
      {
        name: "signatureDate",
        label: "Signature Date (MM/DD/YYYY)",
      },
    ],
  },
};

const FORM_DEFINITIONS: Record<
  string,
  { sections: Record<string, { fields: Array<{ name: string; label: string }> }> }
> = {
  "I-130": { sections: I130_FIELD_DEFINITIONS },
};

async function performAutoFill(
  formNumber: string,
  caseData?: Record<string, unknown>,
  documents?: Array<{ type: string; extractedText: string }>
): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const client = new Anthropic({ apiKey });

  const formDef = FORM_DEFINITIONS[formNumber];
  if (!formDef) {
    throw new Error(`Form ${formNumber} is not yet supported`);
  }

  const fieldsToFill = Object.values(formDef.sections)
    .flatMap((section) => section.fields)
    .map((field) => field.name);

  const prompt = `You are a form filling expert. Given the following case data and documents, fill out the ${formNumber} form fields.

Case Data:
${JSON.stringify(caseData || {}, null, 2)}

Documents:
${documents ? documents.map((d) => `${d.type}:\n${d.extractedText}`).join("\n\n") : "None"}

Required Fields:
${fieldsToFill.join(", ")}

Fill out all fields following these rules:
- Use UPPERCASE for names
- Use MM/DD/YYYY for dates
- Use N/A for unknown/non-applicable fields
- Use YES/NO for boolean fields
- Be thorough and accurate

Return the filled form as a JSON object with field names as keys.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: FORM_FILL_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText += block.text;
    }
  }

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return {};
}

async function performValidation(
  formNumber: string,
  formData: Record<string, unknown>
): Promise<{ isValid: boolean; issues: ValidationIssue[]; completeness: number }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const client = new Anthropic({ apiKey });

  const formDef = FORM_DEFINITIONS[formNumber];
  const requiredFields = Object.values(formDef?.sections || {})
    .flatMap((section) => section.fields)
    .map((field) => field.name);

  const prompt = `Validate the following form submission for ${formNumber}.

Form Data:
${JSON.stringify(formData, null, 2)}

Required Fields:
${requiredFields.join(", ")}

Check for:
1. Missing or empty required fields
2. Incorrect date formats (should be MM/DD/YYYY)
3. Inconsistent information
4. Potential RFE (Request for Evidence) triggers
5. USCIS compliance issues

Return a JSON object with:
{
  "issues": [
    {
      "field": "field name",
      "severity": "error|warning|info",
      "message": "description",
      "rfeRisk": true/false
    }
  ],
  "completeness": 0-100
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: FORM_FILL_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText += block.text;
    }
  }

  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const result = JSON.parse(jsonMatch[0]);
    return {
      isValid: result.issues.filter((i: ValidationIssue) => i.severity === "error")
        .length === 0,
      issues: result.issues || [],
      completeness: result.completeness || 0,
    };
  }

  return { isValid: false, issues: [], completeness: 0 };
}

async function performSuggestions(
  formNumber: string,
  formData: Record<string, unknown>,
  caseData?: Record<string, unknown>
): Promise<Array<{ field: string; suggestion: string; reasoning: string }>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not configured");

  const client = new Anthropic({ apiKey });

  const prompt = `You are an immigration form expert. Review this ${formNumber} form submission and provide improvement suggestions.

Form Data:
${JSON.stringify(formData, null, 2)}

Case Data:
${JSON.stringify(caseData || {}, null, 2)}

For weak or incomplete answers, provide:
1. Specific improvement suggestions
2. Why the improvement matters
3. How it affects the application

Return a JSON array of objects with:
{
  "field": "field name",
  "suggestion": "improved answer",
  "reasoning": "why this matters"
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: FORM_FILL_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText += block.text;
    }
  }

  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return [];
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const raw = await request.json();
    const parsed = formFillSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }
    const body = parsed.data;

    const result: FormFillResponse = {
      usage: { inputTokens: 0, outputTokens: 0 },
    };

    if (body.action === "auto-fill") {
      result.formData = await performAutoFill(
        body.formNumber,
        body.caseData,
        body.documents
      );
    } else if (body.action === "validate") {
      if (!body.formData) {
        return NextResponse.json(
          { error: "formData is required for validation" },
          { status: 400 }
        );
      }
      result.validation = await performValidation(
        body.formNumber,
        body.formData
      );
    } else if (body.action === "suggest") {
      if (!body.formData) {
        return NextResponse.json(
          { error: "formData is required for suggestions" },
          { status: 400 }
        );
      }
      result.suggestions = await performSuggestions(
        body.formNumber,
        body.formData,
        body.caseData
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return safeErrorResponse(error, "Form fill operation failed. Please try again.");
  }
}
