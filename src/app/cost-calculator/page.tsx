"use client";

import React, { useState, useMemo } from "react";
import { DollarSign, Users } from "lucide-react";

interface FeeStructure {
  name: string;
  fees: { [key: string]: number };
  attorneyFee: number;
}

const feeData: { [key: string]: FeeStructure } = {
  "Spouse of US Citizen": {
    name: "Spouse of US Citizen",
    fees: {
      "I-130 Petition": 535,
      "I-485 Adjustment": 1225,
      "Biometrics": 85,
      "Medical Exam": 350,
      "Photos": 30,
      "Translation": 150,
    },
    attorneyFee: 3500,
  },
  "Parent of US Citizen": {
    name: "Parent of US Citizen",
    fees: {
      "I-130 Petition": 535,
      "I-485 Adjustment": 1225,
      "Biometrics": 85,
      "Medical Exam": 350,
      "Photos": 30,
      "Translation": 150,
    },
    attorneyFee: 3500,
  },
  "EB-1A": {
    name: "EB-1A (Extraordinary Ability)",
    fees: {
      "I-140 Petition": 700,
      "I-485 Adjustment": 1225,
      "Premium Processing": 2805,
      "Expert Letters": 3000,
      "Medical Exam": 350,
    },
    attorneyFee: 10000,
  },
  "NIW": {
    name: "NIW (National Interest Waiver)",
    fees: {
      "I-140 Petition": 700,
      "I-485 Adjustment": 1225,
      "Premium Processing": 2805,
      "Expert Letters": 3000,
      "Medical Exam": 350,
    },
    attorneyFee: 8000,
  },
  "H-1B": {
    name: "H-1B Work Visa",
    fees: {
      "I-129 Petition": 460,
      "ACWIA Fee": 1500,
      "Fraud Prevention": 500,
      "Asylum Surcharge": 600,
      "Premium Processing": 2805,
    },
    attorneyFee: 3000,
  },
  "Naturalization": {
    name: "Naturalization (N-400)",
    fees: {
      "N-400 Application": 710,
      "Biometrics": 85,
      "Photos": 30,
    },
    attorneyFee: 1500,
  },
  "Asylum": {
    name: "Asylum",
    fees: {
      "I-589 Application": 0,
      "Translation": 500,
      "Evidence Documentation": 200,
    },
    attorneyFee: 5000,
  },
  "DACA": {
    name: "DACA (Deferred Action)",
    fees: {
      "I-821D Form": 410,
      "Biometrics": 85,
      "Photos": 30,
    },
    attorneyFee: 1000,
  },
};

const povertyGuidelines: { [key: number]: number } = {
  2: 24650,
  3: 31075,
  4: 37500,
  5: 43925,
  6: 50350,
  7: 56775,
  8: 63200,
};

const CostDisplay: React.FC<{ amount: number }> = ({ amount }) => (
  <span className="font-mono font-semibold">${amount.toLocaleString()}</span>
);

export default function CostCalculator() {
  const [caseType, setCaseType] = useState("Spouse of US Citizen");
  const [filingMethod, setFilingMethod] = useState<"self" | "attorney">("attorney");
  const [householdSize, setHouseholdSize] = useState(4);

  const caseData = feeData[caseType];

  const calculation = useMemo(() => {
    let subtotal = Object.values(caseData.fees).reduce((a, b) => a + b, 0);
    const attorneyFee = filingMethod === "attorney" ? caseData.attorneyFee : 0;
    const total = subtotal + attorneyFee;

    return {
      subtotal,
      attorneyFee,
      total,
    };
  }, [caseType, filingMethod, caseData]);

  const incomeRequirement = povertyGuidelines[householdSize as keyof typeof povertyGuidelines] || 63200;

  return (
    <div className="min-h-screen bg-midnight text-primary">
      {/* Page Header */}
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-400">Financial Planning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Immigration Cost Calculator</h1>
          <p className="text-secondary text-lg">
            Estimate total costs for your immigration case, including government fees and attorney services
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel: Configuration */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Configure Your Case</h2>

              {/* Case Type */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-secondary">Case Type</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-primary focus:border-green-500/50 focus:outline-none transition-colors"
                >
                  {Object.keys(feeData).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filing Method */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-secondary">Filing Method</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilingMethod("self")}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      filingMethod === "self"
                        ? "bg-green-500/20 text-green-300 border border-green-500/50"
                        : "bg-white/5 text-secondary border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    Self-File
                  </button>
                  <button
                    onClick={() => setFilingMethod("attorney")}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      filingMethod === "attorney"
                        ? "bg-green-500/20 text-green-300 border border-green-500/50"
                        : "bg-white/5 text-secondary border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    With Attorney
                  </button>
                </div>
              </div>

              {/* Household Size */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-secondary flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Household Size (for I-864)
                </label>
                <div className="flex gap-3">
                  {[2, 3, 4, 5, 6, 7, 8].map((size) => (
                    <button
                      key={size}
                      onClick={() => setHouseholdSize(size)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        householdSize === size
                          ? "bg-green-500/20 text-green-300 border border-green-500/50"
                          : "bg-white/5 text-secondary border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Income Requirement Info Box */}
              <div className="mt-8 p-6 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-3">
                <h3 className="font-semibold text-blue-300">I-864 Income Requirement</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-secondary text-sm">For household size {householdSize}:</span>
                  <span className="text-2xl font-mono font-bold text-blue-300">
                    ${incomeRequirement.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-blue-200/70">
                  Affidavit of Support minimum income requirement for your household size. Your household income must be at least 100% of federal poverty guidelines (125% for sponsors with income less than the poverty line).
                </p>
              </div>
            </div>

            {/* Right Panel: Cost Breakdown */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Cost Breakdown</h2>

                {/* Fees List */}
                <div className="space-y-3 p-6 rounded-lg bg-white/5 border border-white/10">
                  {Object.entries(caseData.fees).map(([feeName, amount]) => (
                    <div key={feeName} className="flex justify-between items-center py-2 border-b border-white/5 last:border-b-0">
                      <span className="text-secondary">{feeName}</span>
                      <CostDisplay amount={amount} />
                    </div>
                  ))}

                  {/* Subtotal */}
                  <div className="flex justify-between items-center py-3 mt-4 pt-4 border-t border-white/10 font-medium">
                    <span>Government Fees Subtotal</span>
                    <CostDisplay amount={calculation.subtotal} />
                  </div>

                  {/* Attorney Fee */}
                  {filingMethod === "attorney" && (
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-secondary">Attorney Services</span>
                      <CostDisplay amount={calculation.attorneyFee} />
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="p-6 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 space-y-2">
                  <p className="text-secondary text-sm">Total Estimated Cost</p>
                  <div className="text-4xl font-bold text-green-300 font-mono">
                    ${calculation.total.toLocaleString()}
                  </div>
                  <p className="text-xs text-green-200/70">
                    {filingMethod === "attorney"
                      ? "Including attorney services and all government fees"
                      : "Government fees only. Consider consulting an attorney."}
                  </p>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-xs text-amber-200">
                    <strong>Disclaimer:</strong> This is an estimate based on current USCIS fee schedules as of April 2026. Actual costs may vary. Attorney fees are approximate and should be verified directly with your attorney. This calculator is for informational purposes only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
