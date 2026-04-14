import { NextRequest, NextResponse } from "next/server";

const mockCaseDetails: Record<string, any> = {
  "case-001": {
    id: "case-001",
    userId: "user-1",
    caseType: "EB-2",
    category: "Employment-Based",
    status: "In Progress",
    createdAt: "2024-01-15",
    lastUpdated: "2024-04-10",
    events: [
      {
        id: "evt-1",
        date: "2024-04-10",
        type: "Document Upload",
        description: "I-140 petition uploaded",
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "I-140 Petition",
        uploadedAt: "2024-04-10",
        status: "Submitted",
      },
    ],
  },
  "case-002": {
    id: "case-002",
    userId: "user-1",
    caseType: "Family-Based",
    category: "Spousal Sponsorship",
    status: "In Progress",
    events: [],
    documents: [],
  },
  "case-003": {
    id: "case-003",
    userId: "user-1",
    caseType: "EB-1A",
    category: "Employment-Based",
    status: "Pending Review",
    events: [],
    documents: [],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseData = mockCaseDetails[id];
    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    return NextResponse.json(caseData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch case" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseData = mockCaseDetails[id];
    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const body = await request.json();
    const updated = {
      ...caseData,
      ...body,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update case" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const caseData = mockCaseDetails[id];
    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Case archived successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete case" },
      { status: 500 }
    );
  }
}
