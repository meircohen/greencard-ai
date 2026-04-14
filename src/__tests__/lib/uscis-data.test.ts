import { describe, it, expect } from "vitest";
import {
  getFormFee,
  getProcessingTime,
  getApprovalRate,
  getMinimumIncome,
  calculateTotalCost,
  visaBulletin,
  approvalRates,
  processingTimes,
  formFees,
} from "@/lib/uscis-data";

/**
 * USCIS Data Module Tests
 * Tests data retrieval functions for forms, fees, processing times, and eligibility
 */

describe("USCIS Data Module", () => {
  describe("getFormFee()", () => {
    it("should return correct fee for I-130", () => {
      const fee = getFormFee("I-130");
      expect(fee).toBe(435);
    });

    it("should return correct fee for I-140", () => {
      const fee = getFormFee("I-140");
      expect(fee).toBe(715);
    });

    it("should return correct fee for I-485", () => {
      const fee = getFormFee("I-485");
      expect(fee).toBe(640);
    });

    it("should return correct fee for various forms", () => {
      // I-130 family petition
      expect(getFormFee("I-130")).toBe(435);
      // I-140 employment petition
      expect(getFormFee("I-140")).toBe(715);
    });

    it("should return null for unknown form number", () => {
      const fee = getFormFee("I-999");
      expect(fee).toBeNull();
    });

    it("should have all form fees documented", () => {
      expect(Object.keys(formFees).length).toBeGreaterThan(5);
      Object.values(formFees).forEach((fee) => {
        expect(typeof fee).toBe("number");
        expect(fee).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("getProcessingTime()", () => {
    it("should return correct processing time for I-130", () => {
      const time = getProcessingTime("I-130");
      expect(time).not.toBeNull();
      expect(time?.weeks).toBe(18);
      expect(time?.range).toBe("12-24");
    });

    it("should return correct processing time for I-140", () => {
      const time = getProcessingTime("I-140");
      expect(time?.weeks).toBe(22);
    });

    it("should return null for unknown form", () => {
      const time = getProcessingTime("I-999");
      expect(time).toBeNull();
    });

    it("should return data structure with weeks and range", () => {
      const time = getProcessingTime("I-485");
      expect(time).toHaveProperty("weeks");
      expect(time).toHaveProperty("range");
      expect(typeof time?.weeks).toBe("number");
      expect(typeof time?.range).toBe("string");
    });

    it("should have all processing times documented", () => {
      expect(Object.keys(processingTimes).length).toBeGreaterThan(5);
      Object.values(processingTimes).forEach((time) => {
        expect(time.weeks).toBeGreaterThanOrEqual(0);
        expect(time.range).toBeTruthy();
      });
    });
  });

  describe("getApprovalRate()", () => {
    it("should return approval rate for EB1A", () => {
      const rate = getApprovalRate("EB1A", "approved");
      expect(rate).toBe(0.94);
    });

    it("should return denial rate for EB2", () => {
      const rate = getApprovalRate("EB2", "denied");
      expect(rate).toBe(0.15);
    });

    it("should return RFE rate for EB3", () => {
      const rate = getApprovalRate("EB3", "rfe");
      expect(rate).toBe(0.07);
    });

    it("should default to approved outcome", () => {
      const rate = getApprovalRate("H1B");
      expect(rate).toBe(approvalRates["H1B"].approved);
    });

    it("should return 0 for unknown category", () => {
      const rate = getApprovalRate("UNKNOWN", "approved");
      expect(rate).toBe(0);
    });

    it("should have valid probabilities for all categories", () => {
      Object.values(approvalRates).forEach((rates) => {
        const total = rates.approved + rates.denied + rates.rfe;
        expect(total).toBeCloseTo(1, 2);
      });
    });

    it("should cover major visa categories", () => {
      expect(approvalRates).toHaveProperty("EB1A");
      expect(approvalRates).toHaveProperty("EB2");
      expect(approvalRates).toHaveProperty("EB3");
      expect(approvalRates).toHaveProperty("H1B");
      expect(approvalRates).toHaveProperty("F1");
    });
  });

  describe("getMinimumIncome()", () => {
    it("should return correct 100% poverty line for household size 1", () => {
      const income = getMinimumIncome(1, 100);
      expect(income).toBe(15060);
    });

    it("should return correct 200% poverty line for household size 4", () => {
      const income = getMinimumIncome(4, 200);
      expect(income).toBe(62400);
    });

    it("should return correct 300% poverty line for household size 8", () => {
      const income = getMinimumIncome(8, 300);
      expect(income).toBe(170160);
    });

    it("should default to 100% when percentage not specified", () => {
      const income = getMinimumIncome(2);
      expect(income).toBe(20440);
    });

    it("should return null for invalid household size", () => {
      const income = getMinimumIncome(99);
      expect(income).toBeNull();
    });

    it("should return null for invalid percentage", () => {
      const income = getMinimumIncome(2, 150 as any);
      expect(income).toBeNull();
    });

    it("should show poverty line increases with household size", () => {
      const size1 = getMinimumIncome(1, 100);
      const size2 = getMinimumIncome(2, 100);
      const size4 = getMinimumIncome(4, 100);

      expect(size1).toBeLessThan(size2!);
      expect(size2).toBeLessThan(size4!);
    });

    it("should show 200% threshold higher than 100%", () => {
      const line100 = getMinimumIncome(3, 100);
      const line200 = getMinimumIncome(3, 200);

      expect(line200).toBe(2 * line100!);
    });
  });

  describe("calculateTotalCost()", () => {
    it("should calculate cost for single form without attorney", () => {
      const cost = calculateTotalCost(["I-130"], false);
      expect(cost).toBe(435 + 200 + 85); // form fee + base filing + biometric
    });

    it("should include attorney fee in total", () => {
      const costWithout = calculateTotalCost(["I-130"], false);
      const costWith = calculateTotalCost(["I-130"], true);

      expect(costWith).toBeGreaterThan(costWithout);
    });

    it("should sum multiple form fees", () => {
      const cost = calculateTotalCost(["I-130", "I-485"], false);
      const expectedForms = 435 + 640; // I-130 + I-485

      expect(cost).toBeGreaterThanOrEqual(expectedForms);
    });

    it("should include document translation costs", () => {
      const cost = calculateTotalCost(["I-130"], false, 2);
      expect(cost).toBeGreaterThan(
        calculateTotalCost(["I-130"], false, 0)
      );
    });

    it("should include biometric fee", () => {
      const cost = calculateTotalCost(["I-130"], false);
      expect(cost).toBeGreaterThan(435); // Has biometric fee added
    });

    it("should handle realistic immigration case scenarios", () => {
      // EB-2 case: I-140 + I-485 + I-864
      const eb2Cost = calculateTotalCost(["I-140", "I-485", "I-864"], true, 3);

      expect(eb2Cost).toBeGreaterThan(2500); // At least attorney fee
      expect(typeof eb2Cost).toBe("number");
    });
  });

  describe("Visa Bulletin", () => {
    it("should have current date", () => {
      expect(visaBulletin.lastUpdated).toBe("2026-04-14");
    });

    it("should include employment-based visa categories", () => {
      expect(visaBulletin.employmentBased).toHaveProperty("EB1");
      expect(visaBulletin.employmentBased).toHaveProperty("EB2");
      expect(visaBulletin.employmentBased).toHaveProperty("EB3");
    });

    it("should include family-based visa categories", () => {
      expect(visaBulletin.familyBased).toHaveProperty("F1");
      expect(visaBulletin.familyBased).toHaveProperty("F2A");
    });

    it("should show reasonable visa availability dates", () => {
      // EB-1 should be "Current" or recent date
      const eb1 = visaBulletin.employmentBased.EB1;
      expect(
        eb1 === "Current" || /^\d{4}-\d{2}-\d{2}$/.test(eb1)
      ).toBe(true);
    });

    it("should indicate immediate relatives status", () => {
      expect(visaBulletin.immediateRelatives).toBe("Current");
    });
  });

  describe("Data Consistency", () => {
    it("should have no negative fees", () => {
      Object.values(formFees).forEach((fee) => {
        expect(fee).toBeGreaterThanOrEqual(0);
      });
    });

    it("should have valid processing time ranges", () => {
      Object.values(processingTimes).forEach((time) => {
        expect(time.weeks).toBeGreaterThanOrEqual(0);
        expect(time.range).toMatch(/^\d+[-–]\d+|\w+\s+\w+$/);
      });
    });

    it("should have fees for common forms", () => {
      // Verify that main immigration forms have defined fees
      const mainForms = ["I-130", "I-140", "I-485", "I-864"];
      mainForms.forEach((form) => {
        expect(formFees).toHaveProperty(form);
      });
    });
  });
});
