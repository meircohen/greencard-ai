import { NextRequest, NextResponse } from "next/server";
import { processingTimes, getProcessingTime } from "@/lib/uscis-data";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const formNumber = searchParams.get("form");

    let data: Record<string, unknown>;

    if (formNumber) {
      const time = getProcessingTime(formNumber);
      if (!time) {
        return NextResponse.json(
          {
            error: `Processing time not found for form ${formNumber}`,
          },
          { status: 404 }
        );
      }
      data = { [formNumber]: time };
    } else {
      data = processingTimes;
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
        error: "Failed to fetch processing times",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
