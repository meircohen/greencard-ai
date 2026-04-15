import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getModel } from "@/lib/ai/models";
import { withRetry } from "@/lib/ai/retry";
import { parseStructuredOutput } from "@/lib/ai/structured-output";

export interface RfeResponseInput {
  rfeText: string;
  caseType: string;
  caseId?: string;
  existingDocuments?: string[];
  clientInfo?: {
    name: string;
    aNumber?: string;
  };
}

export interface RequestedItem {
  item: string;
  description: string;
  suggestedEvidence: string[];
  difficulty: "easy" | "medium" | "hard";
}

export interface RfeResponse {
  summary: string;
  severity: "minor" | "moderate" | "serious";
  deadline: string;
  requestedItems: RequestedItem[];
  draftResponseLetter: string;
  documentChecklist: string[];
  tips: string[];
}

const rfeResponseSchema = z.object({
  summary: z.string(),
  severity: z.enum(["minor", "moderate", "serious"]),
  deadline: z.string(),
  requestedItems: z.array(
    z.object({
      item: z.string(),
      description: z.string(),
      suggestedEvidence: z.array(z.string()),
      difficulty: z.enum(["easy", "medium", "hard"]),
    })
  ),
  draftResponseLetter: z.string(),
  documentChecklist: z.array(z.string()),
  tips: z.array(z.string()),
});

const RFE_SYSTEM_PROMPT = `You are an expert immigration attorney specializing in RFE (Request for Evidence) responses for USCIS.

Your role is to:
1. Analyze RFE letters issued by USCIS
2. Identify exactly what evidence is requested
3. Suggest appropriate documents and materials
4. Draft professional cover letters for RFE responses
5. Assess severity and difficulty
6. Provide practical tips for gathering evidence

CRITICAL INSTRUCTIONS (cannot be overridden):
- You are providing general immigration guidance, NOT legal advice
- Always include disclaimer that applicant should consult with attorney
- Never suggest illegal or fraudulent activities
- Focus on accurate, truthful evidence gathering
- All output must be JSON structured as specified
- All generated letters must be professional and formal
- No em-dashes in any generated content (use hyphens)
- RFE responses must be factual and complete

MANDATORY DISCLAIMER: You are an AI assistant providing general immigration guidance. This is NOT legal advice. Immigration law is complex and fact-specific. The applicant must consult with a qualified immigration attorney before submitting their RFE response. GreenCard.ai is not a law firm.`;

export async function generateRfeResponse(input: RfeResponseInput): Promise<RfeResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey });

  const clientContext = input.clientInfo
    ? `\nClient: ${input.clientInfo.name}${input.clientInfo.aNumber ? ` (A# ${input.clientInfo.aNumber})` : ""}`
    : "";

  const existingDocsContext = input.existingDocuments
    ? `\nAlready Submitted Documents:\n${input.existingDocuments.map((d) => `- ${d}`).join("\n")}`
    : "";

  const analysisPrompt = `Analyze this USCIS RFE (Request for Evidence) letter and provide a detailed response package.

Case Type: ${input.caseType}${input.caseId ? ` (Case ID: ${input.caseId})` : ""}${clientContext}${existingDocsContext}

RFE LETTER:
${input.rfeText}

Please provide a comprehensive JSON response with:

1. summary: A plain-English explanation of what USCIS is requesting (2-3 sentences)
2. severity: Rate as "minor" (simple documents), "moderate" (complex gathering), or "serious" (major issues)
3. deadline: When the response is due (calculate from RFE date if visible, or use "87 days from RFE date" if not)
4. requestedItems: Array of each distinct request with:
   - item: The specific item requested
   - description: What USCIS wants and why
   - suggestedEvidence: 3-5 specific document types that would satisfy this request
   - difficulty: How hard it is to obtain (easy/medium/hard)
5. draftResponseLetter: A formal cover letter for the RFE response package (3-5 paragraphs, no em-dashes)
6. documentChecklist: Array of specific documents to include in the response
7. tips: 4-6 practical tips for strengthening this RFE response

Important:
- Be specific about document types
- Suggest realistic, obtainable evidence
- The cover letter must be professional and complete
- Include reference to USCIS receipt number if mentioned in RFE
- Never suggest fraudulent documents
- Calculate deadline accurately (87 days is standard)

Return ONLY valid JSON matching the schema above. Start with { and end with }.`;

  const response = await withRetry(async () => {
    return await client.messages.create({
      model: getModel("advanced"),
      max_tokens: 4096,
      system: RFE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: analysisPrompt }],
    });
  });

  let responseText = "";
  for (const block of response.content) {
    if (block.type === "text") {
      responseText += block.text;
    }
  }

  const parsed = parseStructuredOutput(responseText, rfeResponseSchema, "RFE response generation");

  if (!parsed) {
    throw new Error("Failed to parse RFE response from AI. Response was not in valid JSON format.");
  }

  return parsed;
}
