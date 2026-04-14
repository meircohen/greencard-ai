import { NextRequest, NextResponse } from "next/server";
import { visaBulletin } from "@/lib/uscis-data";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    return NextResponse.json(visaBulletin, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // 24 hours
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Failed to fetch visa bulletin",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
