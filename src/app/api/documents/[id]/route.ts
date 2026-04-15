import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { caseDocuments, cases } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { deleteDocument } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = getDb();

    const document = await db
      .select()
      .from(caseDocuments)
      .where(eq(caseDocuments.id, id))
      .limit(1);

    if (document.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const caseRecord = await db
      .select()
      .from(cases)
      .where(eq(cases.id, document[0].caseId))
      .limit(1);

    if (caseRecord.length === 0 || caseRecord[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(document[0]);
  } catch (error) {
    console.error('Failed to fetch document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = getDb();

    const document = await db
      .select()
      .from(caseDocuments)
      .where(eq(caseDocuments.id, id))
      .limit(1);

    if (document.length === 0) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const caseRecord = await db
      .select()
      .from(cases)
      .where(eq(cases.id, document[0].caseId))
      .limit(1);

    if (caseRecord.length === 0 || caseRecord[0].userId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const fileUrl = document[0].fileUrl;
    const key = fileUrl.split('/').slice(-4).join('/');

    await deleteDocument(key);

    await db
      .delete(caseDocuments)
      .where(eq(caseDocuments.id, id));

    return NextResponse.json(
      { message: 'Document deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
