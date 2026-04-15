import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { caseDocuments, cases, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { uploadDocument } from '@/lib/storage';
import { sendEmail, documentUploadConfirmEmail } from '@/lib/email';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.heic'];

const MAGIC_BYTES: Record<string, Buffer> = {
  pdf: Buffer.from([0x25, 0x50, 0x44, 0x46]),
  jpeg: Buffer.from([0xff, 0xd8, 0xff]),
  png: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  heic: Buffer.from([0x66, 0x74, 0x79, 0x70]),
};

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === 'application/pdf') {
    return buffer.subarray(0, 4).equals(MAGIC_BYTES.pdf);
  } else if (mimeType === 'image/jpeg') {
    return buffer.subarray(0, 3).equals(MAGIC_BYTES.jpeg);
  } else if (mimeType === 'image/png') {
    return buffer.subarray(0, 4).equals(MAGIC_BYTES.png);
  } else if (mimeType === 'image/heic') {
    return buffer.subarray(0, 4).equals(MAGIC_BYTES.heic);
  }
  return false;
}

function getExtensionFromFilename(filename: string): string {
  const match = filename.match(/\.[a-z0-9]+$/i);
  return match ? match[0].toLowerCase() : '';
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const caseId = formData.get('caseId') as string | null;
    const documentType = formData.get('documentType') as string | null;

    if (!file || !caseId || !documentType) {
      return NextResponse.json(
        { error: 'Missing required fields: file, caseId, documentType' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Allowed types: PDF, JPEG, PNG, HEIC' },
        { status: 400 }
      );
    }

    const fileExtension = getExtensionFromFilename(file.name);
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'File extension not allowed' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    if (!validateMagicBytes(fileBuffer, file.type)) {
      return NextResponse.json(
        { error: 'File content does not match declared file type' },
        { status: 400 }
      );
    }

    const db = getDb();
    const userCase = await db
      .select()
      .from(cases)
      .where(eq(cases.id, caseId))
      .limit(1);

    if (userCase.length === 0 || userCase[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Case not found or access denied' },
        { status: 404 }
      );
    }

    const uploadResult = await uploadDocument(
      fileBuffer,
      caseId,
      documentType,
      file.name
    );

    const newDocument = await db
      .insert(caseDocuments)
      .values({
        caseId,
        documentType,
        fileName: file.name,
        fileUrl: uploadResult.url,
        fileSize: file.size,
        mimeType: file.type,
        status: 'uploaded',
      })
      .returning();

    // Send confirmation email (non-blocking)
    try {
      const [caseUser] = await db
        .select({ email: users.email, fullName: users.fullName })
        .from(users)
        .where(eq(users.id, userId));

      if (caseUser) {
        const emailPayload = documentUploadConfirmEmail(
          caseUser.fullName || "User",
          file.name
        );
        emailPayload.to = caseUser.email;
        sendEmail(emailPayload).catch(err => console.error("Document upload email failed:", err));
      }
    } catch (emailError) {
      console.error("Failed to send document upload email:", emailError);
    }

    return NextResponse.json(newDocument[0], { status: 201 });
  } catch (error) {
    console.error('Document upload failed:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
