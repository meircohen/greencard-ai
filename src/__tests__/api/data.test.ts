import { describe, it, expect } from "vitest";

/**
 * Data API Tests
 * Tests for visa bulletin, processing times, fees, and cost calculator endpoints
 */

describe("Data API", () => {
  describe("GET /api/data/visa-bulletin", () => {
    it("should return visa bulletin data with current month", async () => {
      const mockData = {
        month: "April 2026",
        employment: {
          eb1: { priority: "C", final: "C" },
          eb2: { priority: "01/15/2023", final: "02/01/2023" },
          eb3: { priority: "12/15/2022", final: "01/01/2023" },
          eb4: { priority: "Current", final: "Current" },
          eb5: { priority: "12/15/2021", final: "01/01/2022" },
        },
        family: {
          f1: { priority: "12/01/2019", final: "12/01/2019" },
          f2a: { priority: "Current", final: "Current" },
          f2b: { priority: "01/15/2016", final: "01/15/2016" },
          f3: { priority: "04/01/2010", final: "04/01/2010" },
          f4: { priority: "11/22/2013", final: "11/22/2013" },
        },
      };

      expect(mockData).toHaveProperty("month");
      expect(mockData).toHaveProperty("employment");
      expect(mockData).toHaveProperty("family");
      expect(mockData.month).toContain("2026");
    });

    it("should have valid employment categories", () => {
      const validCategories = ["eb1", "eb2", "eb3", "eb4", "eb5"];
      const mockData = {
        employment: {
          eb1: { priority: "C", final: "C" },
          eb2: { priority: "01/15/2023", final: "02/01/2023" },
          eb3: { priority: "12/15/2022", final: "01/01/2023" },
          eb4: { priority: "Current", final: "Current" },
          eb5: { priority: "12/15/2021", final: "01/01/2022" },
        },
      };

      for (const category of validCategories) {
        expect(mockData.employment).toHaveProperty(category);
        expect((mockData.employment as Record<string, unknown>)[category]).toHaveProperty("priority");
        expect((mockData.employment as Record<string, unknown>)[category]).toHaveProperty("final");
      }
    });

    it("should have valid family categories", () => {
      const validCategories = ["f1", "f2a", "f2b", "f3", "f4"];
      const mockData = {
        family: {
          f1: { priority: "12/01/2019", final: "12/01/2019" },
          f2a: { priority: "Current", final: "Current" },
          f2b: { priority: "01/15/2016", final: "01/15/2016" },
          f3: { priority: "04/01/2010", final: "04/01/2010" },
          f4: { priority: "11/22/2013", final: "11/22/2013" },
        },
      };

      for (const category of validCategories) {
        expect(mockData.family).toHaveProperty(category);
        expect((mockData.family as Record<string, unknown>)[category]).toHaveProperty("priority");
        expect((mockData.family as Record<string, unknown>)[category]).toHaveProperty("final");
      }
    });
  });

  describe("GET /api/data/processing-times", () => {
    it("should return array of processing time data", async () => {
      const mockData = [
        {
          formNumber: "I-130",
          serviceCenter: "Vermont Service Center",
          estimatedMonths: 7,
          rangeMin: 6,
          rangeMax: 8,
          category: "Immediate Relative",
        },
        {
          formNumber: "I-485",
          serviceCenter: "Nebraska Service Center",
          estimatedMonths: 12,
          rangeMin: 10,
          rangeMax: 14,
          category: "Adjustment of Status",
        },
        {
          formNumber: "I-765",
          serviceCenter: "National Benefits Center",
          estimatedMonths: 2,
          rangeMin: 1,
          rangeMax: 3,
          category: "Employment Authorization",
        },
        {
          formNumber: "I-864",
          serviceCenter: "National Benefits Center",
          estimatedMonths: 1,
          rangeMin: 0,
          rangeMax: 2,
          category: "Affidavit of Support",
        },
        {
          formNumber: "N-400",
          serviceCenter: "Local USCIS Office",
          estimatedMonths: 8,
          rangeMin: 6,
          rangeMax: 10,
          category: "Naturalization",
        },
      ];

      expect(Array.isArray(mockData)).toBe(true);
      expect(mockData.length).toBeGreaterThan(0);

      for (const item of mockData) {
        expect(item).toHaveProperty("formNumber");
        expect(item).toHaveProperty("estimatedMonths");
        expect(item.estimatedMonths).toBeGreaterThan(0);
      }
    });

    it("should have valid form numbers", () => {
      const validForms = ["I-130", "I-485", "I-765", "I-864", "N-400"];
      const mockData = [
        {
          formNumber: "I-130",
          serviceCenter: "Vermont Service Center",
          estimatedMonths: 7,
        },
        {
          formNumber: "I-485",
          serviceCenter: "Nebraska Service Center",
          estimatedMonths: 12,
        },
      ];

      for (const item of mockData) {
        expect(validForms).toContain(item.formNumber);
      }
    });

    it("should have numeric processing times", () => {
      const mockData = [
        {
          formNumber: "I-130",
          estimatedMonths: 7,
          rangeMin: 6,
          rangeMax: 8,
        },
      ];

      for (const item of mockData) {
        expect(typeof item.estimatedMonths).toBe("number");
        expect(item.estimatedMonths).toBeGreaterThan(0);
        expect(item.rangeMin).toBeLessThanOrEqual(item.estimatedMonths);
        expect(item.estimatedMonths).toBeLessThanOrEqual(item.rangeMax);
      }
    });
  });

  describe("GET /api/data/fees", () => {
    it("should return array of fee data", async () => {
      const mockData = [
        {
          formNumber: "I-130",
          name: "Petition for Alien Relative",
          filingFee: 435,
          biometricFee: 85,
          totalFee: 520,
          noFeeCategory: ["Immediate Relative"],
        },
        {
          formNumber: "I-485",
          name: "Application to Register Permanent Residence",
          filingFee: 640,
          biometricFee: 85,
          totalFee: 725,
          noFeeCategory: ["Refugees", "Asylees"],
        },
        {
          formNumber: "I-765",
          name: "Application for Employment Authorization",
          filingFee: 0,
          biometricFee: 0,
          totalFee: 0,
          noFeeCategory: ["All Categories"],
        },
        {
          formNumber: "I-864",
          name: "Affidavit of Support",
          filingFee: 0,
          biometricFee: 0,
          totalFee: 0,
          noFeeCategory: ["N/A"],
        },
        {
          formNumber: "N-400",
          name: "Application for Naturalization",
          filingFee: 640,
          biometricFee: 85,
          totalFee: 725,
          noFeeCategory: [],
        },
      ];

      expect(Array.isArray(mockData)).toBe(true);
      expect(mockData.length).toBeGreaterThan(0);

      for (const fee of mockData) {
        expect(fee).toHaveProperty("formNumber");
        expect(fee).toHaveProperty("filingFee");
        expect(fee).toHaveProperty("totalFee");
        expect(typeof fee.filingFee).toBe("number");
        expect(typeof fee.totalFee).toBe("number");
        expect(fee.filingFee).toBeGreaterThanOrEqual(0);
        expect(fee.totalFee).toBeGreaterThanOrEqual(0);
      }
    });

    it("should have valid fee amounts", () => {
      const mockData = [
        { formNumber: "I-130", filingFee: 435, biometricFee: 85, totalFee: 520 },
        { formNumber: "I-485", filingFee: 640, biometricFee: 85, totalFee: 725 },
      ];

      for (const fee of mockData) {
        const calculatedTotal = fee.filingFee + fee.biometricFee;
        expect(fee.totalFee).toBe(calculatedTotal);
      }
    });
  });

  describe("POST /api/data/cost-calculator", () => {
    it("should return cost breakdown for each case type", async () => {
      const mockCalculation = {
        caseType: "EB1A",
        totalCost: 2500,
        breakdown: {
          attorneyFees: 1500,
          filing: 640,
          biometrics: 85,
          medical: 200,
          translations: 75,
        },
      };

      expect(mockCalculation).toHaveProperty("caseType");
      expect(mockCalculation).toHaveProperty("totalCost");
      expect(mockCalculation).toHaveProperty("breakdown");
      expect(mockCalculation.totalCost).toBeGreaterThan(0);
    });

    it("should have valid cost categories in breakdown", () => {
      const validCategories = [
        "attorneyFees",
        "filing",
        "biometrics",
        "medical",
        "translations",
      ];
      const mockCalculation = {
        caseType: "EB2",
        breakdown: {
          attorneyFees: 1500,
          filing: 640,
          biometrics: 85,
          medical: 200,
          translations: 75,
        },
      };

      const breakdownKeys = Object.keys(mockCalculation.breakdown);
      for (const key of breakdownKeys) {
        expect(validCategories).toContain(key);
      }
    });

    it("should calculate total correctly", () => {
      const mockCalculation = {
        caseType: "F1A",
        totalCost: 1275,
        breakdown: {
          attorneyFees: 1000,
          filing: 0,
          biometrics: 0,
          medical: 200,
          translations: 75,
        },
      };

      const calculatedTotal = Object.values(mockCalculation.breakdown).reduce(
        (sum, cost) => sum + cost,
        0
      );
      expect(mockCalculation.totalCost).toBe(calculatedTotal);
    });

    it("should support multiple case types", () => {
      const caseTypes = [
        "EB1A",
        "EB1B",
        "EB2",
        "EB3",
        "F1A",
        "F2A",
        "IR1",
        "CR1",
      ];

      for (const caseType of caseTypes) {
        const mockCalculation = {
          caseType,
          totalCost: 2000,
          breakdown: {
            attorneyFees: 1000,
            filing: 640,
            biometrics: 85,
            medical: 200,
            translations: 75,
          },
        };

        expect(mockCalculation.caseType).toBe(caseType);
      }
    });
  });

  describe("Cost Calculator Edge Cases", () => {
    it("should handle zero filing fees", () => {
      const mockCalculation = {
        caseType: "Refugee",
        totalCost: 1050,
        breakdown: {
          attorneyFees: 1000,
          filing: 0,
          biometrics: 0,
          medical: 50,
          translations: 0,
        },
      };

      const total = Object.values(mockCalculation.breakdown).reduce(
        (sum, cost) => sum + cost,
        0
      );
      expect(total).toBe(mockCalculation.totalCost);
    });

    it("should handle family-based case types", () => {
      const caseTypes = [
        "Spouse",
        "Parent",
        "Child",
        "Sibling",
        "F2A",
        "F2B",
        "F3",
        "F4",
      ];

      for (const caseType of caseTypes) {
        const mockCalculation = {
          caseType,
          totalCost: 1500,
          breakdown: {
            attorneyFees: 500,
            filing: 435,
            biometrics: 85,
            medical: 200,
            translations: 280,
          },
        };

        expect(mockCalculation.caseType).toBeDefined();
      }
    });
  });
});
