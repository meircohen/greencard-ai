export const approvalRates = {
  EB1A: { approved: 0.94, denied: 0.04, rfe: 0.02 },
  EB1B: { approved: 0.92, denied: 0.05, rfe: 0.03 },
  EB2: { approved: 0.78, denied: 0.15, rfe: 0.07 },
  EB3: { approved: 0.71, denied: 0.22, rfe: 0.07 },
  EB5: { approved: 0.85, denied: 0.10, rfe: 0.05 },
  F1: { approved: 0.96, denied: 0.02, rfe: 0.02 },
  H1B: { approved: 0.88, denied: 0.08, rfe: 0.04 },
  L1: { approved: 0.91, denied: 0.05, rfe: 0.04 },
  O1: { approved: 0.76, denied: 0.18, rfe: 0.06 },
  CR1: { approved: 0.93, denied: 0.04, rfe: 0.03 },
  IR1: { approved: 0.92, denied: 0.05, rfe: 0.03 },
  F2A: { approved: 0.89, denied: 0.08, rfe: 0.03 },
  F2B: { approved: 0.67, denied: 0.28, rfe: 0.05 },
};

export const processingTimes = {
  "I-130": { weeks: 18, range: "12-24" },
  "I-140": { weeks: 22, range: "15-30" },
  "I-485": { weeks: 24, range: "18-36" },
  "I-765": { weeks: 3, range: "2-5" },
  "I-131": { weeks: 2, range: "1-4" },
  "I-539": { weeks: 8, range: "6-12" },
  "I-129F": { weeks: 20, range: "15-28" },
  "I-129": { weeks: 10, range: "7-15" },
  "N-400": { weeks: 12, range: "10-16" },
  "I-864": { weeks: 0, range: "Same day filing" },
};

export const formFees = {
  "I-130": 435,
  "I-140": 715,
  "I-485": 640,
  "I-765": 130,
  "I-131": 575,
  "I-539": 555,
  "I-129F": 535,
  "I-129": 715,
  "N-400": 640,
  "I-90": 455,
  "I-131A": 85,
  "I-864": 0,
  "I-693": 0,
};

export const casePackageCosts = {
  baseFiling: {
    withoutAttorney: 200,
    withAttorney: 2500,
  },
  documents: {
    translation: 300,
    certification: 150,
    medical: 400,
  },
  biometric: 85,
  security: 50,
};

export const visaBulletin = {
  lastUpdated: "2026-04-14",
  employmentBased: {
    EB1: "Current",
    EB2: "2023-06-01",
    EB3: "2021-09-01",
    EB4: "Current",
    EB5: "2022-01-01",
  },
  familyBased: {
    F1: "2016-03-01",
    F2A: "Current",
    F2B: "2016-07-08",
    F3: "2012-10-01",
    F4: "2010-12-01",
  },
  immediateRelatives: "Current",
};

export const judgeData = {
  approvalRatesByJudge: {
    "Judge Johnson": { approved: 0.89, total: 450 },
    "Judge Smith": { approved: 0.76, total: 380 },
    "Judge Williams": { approved: 0.82, total: 420 },
    "Judge Brown": { approved: 0.71, total: 390 },
  },
  courtStats: {
    NYC: { avgProcessing: 24, approvalRate: 0.8 },
    LA: { avgProcessing: 28, approvalRate: 0.78 },
    Chicago: { avgProcessing: 20, approvalRate: 0.82 },
    Miami: { avgProcessing: 26, approvalRate: 0.75 },
  },
};

export const courtStats = {
  NYICE: { avgProcessing: 24, approvalRate: 0.8, caseLoad: 2500 },
  LAICE: { avgProcessing: 28, approvalRate: 0.78, caseLoad: 2100 },
  ChicagoICE: { avgProcessing: 20, approvalRate: 0.82, caseLoad: 1800 },
  MiamiICE: { avgProcessing: 26, approvalRate: 0.75, caseLoad: 2200 },
};

export const povertyGuidelines2026 = {
  "100%": {
    1: 15060,
    2: 20440,
    3: 25820,
    4: 31200,
    5: 37580,
    6: 43960,
    7: 50340,
    8: 56720,
  },
  "200%": {
    1: 30120,
    2: 40880,
    3: 51640,
    4: 62400,
    5: 75160,
    6: 87920,
    7: 100680,
    8: 113440,
  },
  "300%": {
    1: 45180,
    2: 61320,
    3: 77460,
    4: 93600,
    5: 112740,
    6: 131880,
    7: 151020,
    8: 170160,
  },
};

export function getApprovalRate(
  caseType: string,
  outcome: "approved" | "denied" | "rfe" = "approved"
): number {
  const rates = approvalRates[caseType as keyof typeof approvalRates];
  if (!rates) return 0;
  return rates[outcome] || 0;
}

export function getProcessingTime(
  formNumber: string
): { weeks: number; range: string } | null {
  return processingTimes[formNumber as keyof typeof processingTimes] || null;
}

export function getFormFee(formNumber: string): number | null {
  return formFees[formNumber as keyof typeof formFees] || null;
}

export function getMinimumIncome(
  householdSize: number,
  percentage: 100 | 200 | 300 = 100
): number | null {
  const guidelines = povertyGuidelines2026[
    `${percentage}%` as keyof typeof povertyGuidelines2026
  ];
  if (!guidelines) return null;
  return guidelines[householdSize as keyof typeof guidelines] || null;
}

export function calculateTotalCost(
  forms: string[],
  withAttorney: boolean,
  documentCount: number = 0
): number {
  let total = withAttorney
    ? casePackageCosts.baseFiling.withAttorney
    : casePackageCosts.baseFiling.withoutAttorney;

  forms.forEach((form) => {
    const fee = getFormFee(form);
    if (fee) total += fee;
  });

  if (documentCount > 0) {
    total += casePackageCosts.documents.translation * Math.min(documentCount, 3);
  }

  total += casePackageCosts.biometric;

  return total;
}
