import { NextRequest, NextResponse } from "next/server";
import {
  calculateTotalCost,
  getMinimumIncome,
  povertyGuidelines2026,
} from "@/lib/uscis-data";

interface CostBreakdown {
  description: string;
  amount: number;
}

interface CostCalculatorResponse {
  caseType: string;
  withAttorney: boolean;
  householdSize: number;
  totalEstimatedCost: number;
  breakdown: CostBreakdown[];
  i864Requirement: {
    householdSize: number;
    minimumIncomeRequired: number;
    percentOfPoverty: string;
  };
}

function mapCaseTypeToForms(caseType: string): string[] {
  const caseFormMap: Record<string, string[]> = {
    EB1: ["I-140", "I-485", "I-765", "I-131"],
    EB2: ["I-140", "I-485", "I-765", "I-131"],
    EB3: ["I-140", "I-485", "I-765", "I-131"],
    F1: ["I-539"],
    H1B: ["I-129"],
    L1: ["I-129"],
    IR1: ["I-130", "I-485", "I-765", "I-131"],
    CR1: ["I-130", "I-485", "I-765", "I-131"],
    F2A: ["I-130", "I-485", "I-765", "I-131"],
  };

  return caseFormMap[caseType] || ["I-130", "I-485"];
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const caseType = searchParams.get("caseType") || "IR1";
    const withAttorney = searchParams.get("withAttorney") === "true";
    const householdSizeStr = searchParams.get("householdSize");
    const householdSize = householdSizeStr ? parseInt(householdSizeStr, 10) : 2;

    if (isNaN(householdSize) || householdSize < 1 || householdSize > 8) {
      return NextResponse.json(
        {
          error: "householdSize must be a number between 1 and 8",
        },
        { status: 400 }
      );
    }

    // Get forms required for this case type
    const forms = mapCaseTypeToForms(caseType);

    // Calculate total cost
    const totalCost = calculateTotalCost(forms, withAttorney, forms.length);

    // Build cost breakdown
    const breakdown: CostBreakdown[] = [
      {
        description: withAttorney
          ? "Attorney and Legal Services"
          : "Form Preparation and Filing Support",
        amount: withAttorney ? 2500 : 200,
      },
    ];

    forms.forEach((form) => {
      const fee = require("@/lib/uscis-data").getFormFee(form);
      if (fee) {
        breakdown.push({
          description: `Form ${form} Filing Fee`,
          amount: fee,
        });
      }
    });

    if (forms.length > 0) {
      breakdown.push({
        description: "Document Translation and Certification",
        amount: 300,
      });
    }

    breakdown.push({
      description: "Biometric Services Fee",
      amount: 85,
    });

    // Calculate I-864 requirement
    const minimumIncome = getMinimumIncome(householdSize, 100);
    const minimum200Percent = getMinimumIncome(householdSize, 200);

    const response: CostCalculatorResponse = {
      caseType,
      withAttorney,
      householdSize,
      totalEstimatedCost: totalCost,
      breakdown,
      i864Requirement: {
        householdSize,
        minimumIncomeRequired: minimumIncome || 15060,
        percentOfPoverty: "100% poverty guideline",
      },
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // 24 hours
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: "Cost calculation failed",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
