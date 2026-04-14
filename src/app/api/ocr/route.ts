import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum 10MB allowed." },
        { status: 400 }
      );
    }

    // Validate file type
    const supportedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!supportedMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file format. Use JPEG, PNG, GIF, or WebP." },
        { status: 400 }
      );
    }

    // Read file as base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    // Determine media type
    let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" =
      "image/jpeg";
    if (file.type === "image/png") mediaType = "image/png";
    else if (file.type === "image/gif") mediaType = "image/gif";
    else if (file.type === "image/webp") mediaType = "image/webp";

    // Call Claude API with vision
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: `You are an expert document OCR system for immigration documents.
Extract: all text, document type, key fields (names, dates, numbers, addresses), validity status.
Respond with valid JSON only: {documentType, extractedText, fields: {}, confidence: 0-100, suggestions: []}`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: "Extract all document information. Return valid JSON.",
            },
          ],
        },
      ],
    });

    // Parse response
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    let parsedData;
    try {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      parsedData = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : {
            documentType: "unknown",
            extractedText: content.text,
            fields: {},
            confidence: 50,
            suggestions: [],
          };
    } catch {
      parsedData = {
        documentType: "unknown",
        extractedText: content.text,
        fields: {},
        confidence: 50,
        suggestions: [],
      };
    }

    return NextResponse.json(parsedData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `OCR failed: ${message}` },
      { status: 500 }
    );
  }
}
