import { Anthropic } from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, UPLOAD_TIER } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/errors";
import { audit, getClientInfo } from "@/lib/audit";
import { getModel } from "@/lib/ai/models";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Magic bytes for file type verification (don't trust browser MIME)
const MAGIC_BYTES: Record<string, number[]> = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/gif": [0x47, 0x49, 0x46],
  "image/webp": [0x52, 0x49, 0x46, 0x46], // RIFF header
  "application/pdf": [0x25, 0x50, 0x44, 0x46], // %PDF
};

function detectFileType(buffer: ArrayBuffer): string | null {
  const bytes = new Uint8Array(buffer);
  for (const [mime, magic] of Object.entries(MAGIC_BYTES)) {
    if (magic.every((byte, i) => bytes[i] === byte)) {
      return mime;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication (middleware sets this header)
    const actorId = request.headers.get("x-user-id");
    if (!actorId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Rate limit: 10 uploads per 5 minutes
    const rl = rateLimit(`upload:${actorId}`, UPLOAD_TIER.limit, UPLOAD_TIER.window);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait a few minutes." },
        { status: 429, headers: { "Retry-After": String(UPLOAD_TIER.window) } }
      );
    }

    // Verify API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OCR service is not configured" },
        { status: 503 }
      );
    }

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

    // Read file buffer
    const buffer = await file.arrayBuffer();

    // Verify file type via magic bytes (don't trust browser MIME)
    const detectedType = detectFileType(buffer);
    const supportedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const isPdf = detectedType === "application/pdf";
    const isImage = detectedType !== null && supportedImageTypes.includes(detectedType);

    if (!isImage && !isPdf) {
      return NextResponse.json(
        { error: "Unsupported file format. Use JPEG, PNG, GIF, WebP, or PDF." },
        { status: 400 }
      );
    }

    const client = new Anthropic({ apiKey });
    const base64 = Buffer.from(buffer).toString("base64");

    let response;

    if (isPdf) {
      // Use document type for PDFs
      response = await client.messages.create({
        model: getModel("standard"),
        max_tokens: 4096,
        system: `You are an expert document OCR system for immigration documents.
Extract: all text, document type, key fields (names, dates, numbers, addresses), validity status.
Respond with valid JSON only: {"documentType": "", "extractedText": "", "fields": {}, "confidence": 0-100, "suggestions": []}`,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "document",
                source: {
                  type: "base64",
                  media_type: "application/pdf",
                  data: base64,
                },
              },
              {
                type: "text",
                text: "Extract all document information from this immigration document. Return valid JSON.",
              },
            ],
          },
        ],
      });
    } else {
      // Use image type for images
      const mediaType = detectedType as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

      response = await client.messages.create({
        model: getModel("standard"),
        max_tokens: 2048,
        system: `You are an expert document OCR system for immigration documents.
Extract: all text, document type, key fields (names, dates, numbers, addresses), validity status.
Respond with valid JSON only: {"documentType": "", "extractedText": "", "fields": {}, "confidence": 0-100, "suggestions": []}`,
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
                text: "Extract all document information from this immigration document. Return valid JSON.",
              },
            ],
          },
        ],
      });
    }

    // Parse response
    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json(
        { error: "Unexpected response from OCR service" },
        { status: 502 }
      );
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

    const clientInfo = getClientInfo(request.headers);
    audit({
      action: "document.uploaded",
      userId: actorId,
      ip: clientInfo.ip,
      metadata: {
        fileType: detectedType,
        fileSize: file.size,
        documentType: parsedData.documentType,
      },
    });

    return NextResponse.json(parsedData);
  } catch (error) {
    return safeErrorResponse(error, "OCR processing failed. Please try again.");
  }
}
