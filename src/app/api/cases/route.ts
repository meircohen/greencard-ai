import { NextRequest, NextResponse } from "next/server";

const mockCases = [
  {
    id: "case-001",
    userId: "user-1",
    caseType: "EB-2",
    category: "Employment-Based",
    status: "In Progress",
    createdAt: "2024-01-15",
    lastUpdated: "2024-04-10",
  },
  {
    id: "case-002",
    userId: "user-1",
    caseType: "Family-Based",
    category: "Spousal Sponsorship",
    status: "In Progress",
    createdAt: "2024-02-20",
    lastUpdated: "2024-04-08",
  },
  {
    id: "case-003",
    userId: "user-1",
    caseType: "EB-1A",
    category: "Employment-Based",
    status: "Pending Review",
    createdAt: "2024-03-10",
    lastUpdated: "2024-04-05",
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const startIndex = (page - 1) * limit;
    const paginatedCases = mockCases.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      cases: paginatedCases,
      total: mockCases.length,
      page,
      limit,
      pages: Math.ceil(mockCases.length / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseType, category } = body;

    if (!caseType || !category) {
      return NextResponse.json(
        { error: "caseType and category are required" },
        { status: 400 }
      );
    }

    const newCase = {
      id: `case-${Date.now()}`,
      userId: "user-1",
      caseType,
      category,
      status: "Pending Review",
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
