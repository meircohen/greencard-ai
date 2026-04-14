import { NextRequest, NextResponse } from "next/server";
import { formFees, getFormFee } from "@/lib/uscis-data";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const formNumber = searchParams.get("form");

    let data: Record<string, unknown>;

    if (formNumber) {
      const fee = getFormFee(formNumber);
      if (fee === null) {
        return NextResponse.json(
          {
            error: `Fee not found for form ${formNumber}`,
          },
          { status: 404 }
        );
      }
      data = { [formNumber]: fee };
    } else {
      data = formFees;
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // 24 hours
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch form fees",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
