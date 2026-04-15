"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const federalPovertyGuidelines: { [key: number]: number } = {
  2: 20440,
  3: 25770,
  4: 31200,
  5: 36630,
  6: 42060,
  7: 47490,
  8: 52920,
};

const stateMultipliers: { [key: string]: number } = {
  "Alaska": 1.25,
  "Hawaii": 1.15,
  "other": 1.0,
};

const stateOptions = [
  { value: "", label: "Select your state" },
  { value: "Alabama", label: "Alabama" },
  { value: "Alaska", label: "Alaska" },
  { value: "Arizona", label: "Arizona" },
  { value: "Arkansas", label: "Arkansas" },
  { value: "California", label: "California" },
  { value: "Colorado", label: "Colorado" },
  { value: "Connecticut", label: "Connecticut" },
  { value: "Delaware", label: "Delaware" },
  { value: "Florida", label: "Florida" },
  { value: "Georgia", label: "Georgia" },
  { value: "Hawaii", label: "Hawaii" },
  { value: "Idaho", label: "Idaho" },
  { value: "Illinois", label: "Illinois" },
  { value: "Indiana", label: "Indiana" },
  { value: "Iowa", label: "Iowa" },
  { value: "Kansas", label: "Kansas" },
  { value: "Kentucky", label: "Kentucky" },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Maine", label: "Maine" },
  { value: "Maryland", label: "Maryland" },
  { value: "Massachusetts", label: "Massachusetts" },
  { value: "Michigan", label: "Michigan" },
  { value: "Minnesota", label: "Minnesota" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Missouri", label: "Missouri" },
  { value: "Montana", label: "Montana" },
  { value: "Nebraska", label: "Nebraska" },
  { value: "Nevada", label: "Nevada" },
  { value: "New Hampshire", label: "New Hampshire" },
  { value: "New Jersey", label: "New Jersey" },
  { value: "New Mexico", label: "New Mexico" },
  { value: "New York", label: "New York" },
  { value: "North Carolina", label: "North Carolina" },
  { value: "North Dakota", label: "North Dakota" },
  { value: "Ohio", label: "Ohio" },
  { value: "Oklahoma", label: "Oklahoma" },
  { value: "Oregon", label: "Oregon" },
  { value: "Pennsylvania", label: "Pennsylvania" },
  { value: "Rhode Island", label: "Rhode Island" },
  { value: "South Carolina", label: "South Carolina" },
  { value: "South Dakota", label: "South Dakota" },
  { value: "Tennessee", label: "Tennessee" },
  { value: "Texas", label: "Texas" },
  { value: "Utah", label: "Utah" },
  { value: "Vermont", label: "Vermont" },
  { value: "Virginia", label: "Virginia" },
  { value: "Washington", label: "Washington" },
  { value: "West Virginia", label: "West Virginia" },
  { value: "Wisconsin", label: "Wisconsin" },
  { value: "Wyoming", label: "Wyoming" },
];

const employmentStatusOptions = [
  { value: "", label: "Select employment status" },
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Unemployed" },
];

interface FormData {
  householdSize: string;
  annualIncome: string;
  state: string;
  assetsValue: string;
  employmentStatus: string;
}

type EligibilityStatus = "green" | "yellow" | "red" | null;

export default function PublicChargeSimulator() {
  const [formData, setFormData] = useState<FormData>({
    householdSize: "4",
    annualIncome: "",
    state: "",
    assetsValue: "",
    employmentStatus: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculation = useMemo(() => {
    const householdSize = parseInt(formData.householdSize) || 4;
    const income = parseInt(formData.annualIncome) || 0;
    const assets = parseInt(formData.assetsValue) || 0;
    const state = formData.state || "other";

    let baseFPL = federalPovertyGuidelines[householdSize as keyof typeof federalPovertyGuidelines] || 52920;
    
    if (householdSize > 8) {
      const additionalMembers = householdSize - 8;
      baseFPL += additionalMembers * 5330;
    }

    const stateMultiplier = stateMultipliers[state] || stateMultipliers["other"];
    const adjustedFPL = baseFPL * stateMultiplier;

    const threshold125 = adjustedFPL * 1.25;
    const threshold100 = adjustedFPL * 1.0;

    let status: EligibilityStatus = null;
    let message = "";

    if (income >= threshold125) {
      status = "green";
      message = "You likely meet the financial requirements for I-864";
    } else if (income >= threshold100) {
      status = "yellow";
      message = "You may need a joint sponsor or have additional assets to supplement your income";
    } else {
      status = "red";
      message = "You will likely need a joint sponsor or must significantly increase income/assets";
    }

    const shortfall = Math.max(0, threshold125 - income);
    const assetsNeeded = shortfall * 3;
    const assetsCanCover = assets >= assetsNeeded && shortfall > 0;

    return {
      baseFPL,
      adjustedFPL,
      threshold100,
      threshold125,
      status,
      message,
      shortfall,
      assetsNeeded,
      assetsCanCover,
    };
  }, [formData]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-600">Financial Analysis</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Public Charge Financial Simulator</h1>
          <p className="text-slate-600 text-lg">
            Assess your financial eligibility for I-864 Affidavit of Support using 2025 Federal Poverty Guidelines
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: Input Form */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-6">Your Information</h2>

                <div className="space-y-6">
                  <Input
                    label="Household Size"
                    name="householdSize"
                    type="number"
                    value={formData.householdSize}
                    onChange={handleInputChange}
                    min="2"
                    max="20"
                    required
                  />

                  <Input
                    label="Annual Income (USD)"
                    name="annualIncome"
                    type="number"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    placeholder="75000"
                    required
                  />

                  <Select
                    label="State of Residence"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    options={stateOptions}
                    required
                  />

                  <Input
                    label="Total Assets Value (USD)"
                    name="assetsValue"
                    type="number"
                    value={formData.assetsValue}
                    onChange={handleInputChange}
                    placeholder="100000"
                  />

                  <Select
                    label="Employment Status"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    options={employmentStatusOptions}
                  />
                </div>
              </Card>
            </div>

            {/* Right Panel: Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Card */}
              {calculation.status && (
                <Card
                  className={`p-8 border-2 ${
                    calculation.status === "green"
                      ? "border-emerald-300 bg-emerald-50"
                      : calculation.status === "yellow"
                      ? "border-amber-300 bg-amber-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Badge
                      variant={calculation.status === "green" ? "green" : calculation.status === "yellow" ? "amber" : "red"}
                      size="md"
                      className="mt-1"
                    >
                      {calculation.status === "green"
                        ? "GREEN - Likely Eligible"
                        : calculation.status === "yellow"
                        ? "YELLOW - Conditional"
                        : "RED - Needs Support"}
                    </Badge>
                    <div className="flex-1">
                      <h3
                        className={`text-2xl font-bold mb-2 ${
                          calculation.status === "green"
                            ? "text-emerald-900"
                            : calculation.status === "yellow"
                            ? "text-amber-900"
                            : "text-red-900"
                        }`}
                      >
                        {calculation.status === "green"
                          ? "You Likely Meet Requirements"
                          : calculation.status === "yellow"
                          ? "You May Need Additional Support"
                          : "You Need a Joint Sponsor"}
                      </h3>
                      <p
                        className={
                          calculation.status === "green"
                            ? "text-emerald-800"
                            : calculation.status === "yellow"
                            ? "text-amber-800"
                            : "text-red-800"
                        }
                      >
                        {calculation.message}
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Thresholds Breakdown */}
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-6">Income Thresholds</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">100% Federal Poverty Line</p>
                      <p className="font-semibold text-slate-900">Minimum baseline requirement</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-mono font-bold text-slate-900">
                        ${calculation.threshold100.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div>
                      <p className="text-sm text-emerald-700 mb-1">125% Federal Poverty Line (I-864 Standard)</p>
                      <p className="font-semibold text-emerald-900">Standard requirement for most sponsors</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-mono font-bold text-emerald-900">
                        ${calculation.threshold125.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <p className="text-sm text-blue-700 mb-1">Your Annual Income</p>
                      <p className="font-semibold text-blue-900">The amount you entered</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-mono font-bold text-blue-900">
                        ${parseInt(formData.annualIncome || "0").toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Assets Analysis */}
              {calculation.shortfall > 0 && (
                <Card className="p-8 bg-purple-50 border border-purple-200">
                  <h3 className="text-xl font-bold mb-6 text-purple-900">Assets Analysis</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Income Shortfall</p>
                        <p className="font-semibold text-slate-900">Amount below 125% FPL threshold</p>
                      </div>
                      <p className="text-2xl font-mono font-bold text-purple-900">
                        ${calculation.shortfall.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Assets Needed (3x shortfall)</p>
                        <p className="text-xs text-slate-500">USCIS accepts assets at 3 times the shortfall</p>
                      </div>
                      <p className="text-2xl font-mono font-bold text-purple-900">
                        ${calculation.assetsNeeded.toLocaleString()}
                      </p>
                    </div>

                    {calculation.assetsCanCover ? (
                      <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-lg">
                        <p className="text-emerald-900 font-semibold">
                          Your assets can help cover the shortfall
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-amber-100 border border-amber-300 rounded-lg">
                        <p className="text-amber-900 font-semibold">
                          Your assets are insufficient. Consider a joint sponsor or increasing assets.
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Disclaimer */}
              <Card className="p-6 bg-amber-50 border border-amber-200">
                <div className="flex gap-4">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-2">Disclaimer</h4>
                    <p className="text-amber-800 text-sm">
                      This calculator provides estimates only and does not constitute legal or financial advice. Results are based on 2025 Federal Poverty Guidelines. Actual I-864 requirements may vary based on family composition, household income sources, and state regulations. Consult with an immigration attorney for personalized guidance.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Key Information */}
              <Card className="p-6 bg-blue-50 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-4">How I-864 Eligibility Works</h4>
                <ul className="space-y-3 text-sm text-blue-900">
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">1.</span>
                    <span>Your income must meet 125% of Federal Poverty Line for your household size in your state</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">2.</span>
                    <span>Alaska and Hawaii have 25% and 15% higher thresholds respectively</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">3.</span>
                    <span>Assets can be used to cover shortfalls at a 3:1 ratio (3x the shortfall)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">4.</span>
                    <span>A joint sponsor can help if your income is insufficient</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-blue-600">5.</span>
                    <span>You must be a US citizen or permanent resident to be a sponsor</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
