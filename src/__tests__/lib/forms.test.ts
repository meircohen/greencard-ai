import { describe, it, expect } from "vitest";
import {
  getFormDefinition,
  getAllForms,
  validateField,
  validateForm,
  getHighRiskFields,
  getFormStats,
  searchFields,
} from "@/lib/forms";
import type { FormField, FormDefinition } from "@/lib/forms";

describe("USCIS Form Registry", () => {
  describe("getFormDefinition", () => {
    it("should return I-130 form definition", () => {
      const form = getFormDefinition("I-130");
      expect(form).toBeDefined();
      expect(form?.formNumber).toBe("I-130");
      expect(form?.title).toContain("Petition for Alien Relative");
    });

    it("should return I-485 form definition", () => {
      const form = getFormDefinition("I-485");
      expect(form).toBeDefined();
      expect(form?.formNumber).toBe("I-485");
      expect(form?.title).toContain("Register Permanent Residence");
    });

    it("should return I-765 form definition", () => {
      const form = getFormDefinition("I-765");
      expect(form).toBeDefined();
      expect(form?.formNumber).toBe("I-765");
      expect(form?.title).toContain("Employment Authorization");
    });

    it("should return I-864 form definition", () => {
      const form = getFormDefinition("I-864");
      expect(form).toBeDefined();
      expect(form?.formNumber).toBe("I-864");
      expect(form?.title).toContain("Affidavit of Support");
    });

    it("should return N-400 form definition", () => {
      const form = getFormDefinition("N-400");
      expect(form).toBeDefined();
      expect(form?.formNumber).toBe("N-400");
      expect(form?.title).toContain("Application for Naturalization");
    });

    it("should return null for invalid form number", () => {
      const form = getFormDefinition("X-999");
      expect(form).toBeNull();
    });
  });

  describe("getAllForms", () => {
    it("should return all registered forms", () => {
      const forms = getAllForms();
      expect(forms).toHaveLength(5);
      expect(forms.map((f) => f.formNumber)).toEqual([
        "I-130",
        "I-485",
        "I-765",
        "I-864",
        "N-400",
      ]);
    });

    it("should return forms with required properties", () => {
      const forms = getAllForms();
      for (const form of forms) {
        expect(form.id).toBeDefined();
        expect(form.formNumber).toBeDefined();
        expect(form.title).toBeDefined();
        expect(form.description).toBeDefined();
        expect(form.sections).toBeDefined();
        expect(Array.isArray(form.sections)).toBe(true);
        expect(form.fieldCount).toBeGreaterThan(0);
        expect(form.estimatedTime).toBeGreaterThan(0);
      }
    });
  });

  describe("Form Structure", () => {
    it("I-130 should have all required parts with sufficient fields", () => {
      const form = getFormDefinition("I-130");
      expect(form?.sections).toHaveLength(4);
      expect(form?.fieldCount).toBeGreaterThanOrEqual(60);

      const sectionIds = form?.sections.map((s) => s.id);
      expect(sectionIds).toContain("part1");
      expect(sectionIds).toContain("part2");
      expect(sectionIds).toContain("part3");
      expect(sectionIds).toContain("part4");
    });

    it("I-485 should have all required parts with sufficient fields", () => {
      const form = getFormDefinition("I-485");
      expect(form?.sections.length).toBeGreaterThanOrEqual(7);
      expect(form?.fieldCount).toBeGreaterThanOrEqual(70);
    });

    it("I-765 should have eligibility category field", () => {
      const form = getFormDefinition("I-765");
      const allFields = form?.sections.flatMap((s) => s.fields) || [];
      const categoryField = allFields.find((f) => f.id === "i765_eligibility_category");
      expect(categoryField).toBeDefined();
      expect(categoryField?.type).toBe("select");
      expect(categoryField?.options?.length).toBeGreaterThan(0);
    });

    it("I-864 should have income and household fields", () => {
      const form = getFormDefinition("I-864");
      const allFields = form?.sections.flatMap((s) => s.fields) || [];
      const incomeField = allFields.find((f) => f.id === "i864_annual_income");
      const householdField = allFields.find((f) => f.id === "i864_household_size");
      expect(incomeField).toBeDefined();
      expect(householdField).toBeDefined();
    });

    it("N-400 should have moral character questions", () => {
      const form = getFormDefinition("N-400");
      const allFields = form?.sections.flatMap((s) => s.fields) || [];
      const moralCharacterFields = allFields.filter(
        (f) => f.section === "moral_character"
      );
      expect(moralCharacterFields.length).toBeGreaterThanOrEqual(15);
    });

    it("I-130 should have petitioner and beneficiary sections", () => {
      const form = getFormDefinition("I-130");
      const allFields = form?.sections.flatMap((s) => s.fields) || [];
      const petitionerFields = allFields.filter(
        (f) => f.id.includes("petitioner")
      );
      const beneficiaryFields = allFields.filter(
        (f) => f.id.includes("beneficiary")
      );
      expect(petitionerFields.length).toBeGreaterThan(20);
      expect(beneficiaryFields.length).toBeGreaterThan(20);
    });
  });

  describe("validateField", () => {
    it("should reject empty required field", () => {
      const field: FormField = {
        id: "test_required",
        label: "Required Field",
        type: "text",
        required: true,
        section: "test",
        validationRules: [
          {
            type: "required",
            message: "This field is required",
          },
        ],
        rfeRisk: "low",
      };

      const result = validateField(field, "");
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it("should accept non-empty value for required field", () => {
      const field: FormField = {
        id: "test_required",
        label: "Required Field",
        type: "text",
        required: true,
        section: "test",
        rfeRisk: "low",
      };

      const result = validateField(field, "valid value");
      expect(result.valid).toBe(true);
    });

    it("should validate date format", () => {
      const field: FormField = {
        id: "test_date",
        label: "Date Field",
        type: "date",
        required: true,
        section: "test",
        rfeRisk: "low",
      };

      const validResult = validateField(field, "01/15/1990");
      expect(validResult.valid).toBe(true);

      const invalidResult = validateField(field, "01-15-1990");
      expect(invalidResult.valid).toBe(false);
    });

    it("should validate SSN format", () => {
      const field: FormField = {
        id: "test_ssn",
        label: "SSN",
        type: "ssn",
        required: true,
        section: "test",
        rfeRisk: "low",
      };

      const validResult = validateField(field, "123-45-6789");
      expect(validResult.valid).toBe(true);

      const invalidResult = validateField(field, "123456789");
      expect(invalidResult.valid).toBe(false);
    });

    it("should validate phone format", () => {
      const field: FormField = {
        id: "test_phone",
        label: "Phone",
        type: "phone",
        required: true,
        section: "test",
        rfeRisk: "low",
      };

      const validResults = [
        "555-123-4567",
        "+1 (555) 123-4567",
        "5551234567",
      ];
      for (const phone of validResults) {
        const result = validateField(field, phone);
        expect(result.valid).toBe(true);
      }
    });

    it("should validate select field options", () => {
      const field: FormField = {
        id: "test_select",
        label: "Select Field",
        type: "select",
        required: true,
        section: "test",
        options: [
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
        ],
        rfeRisk: "low",
      };

      const validResult = validateField(field, "option1");
      expect(validResult.valid).toBe(true);

      const invalidResult = validateField(field, "invalid");
      expect(invalidResult.valid).toBe(false);
    });
  });

  describe("validateForm", () => {
    it("should validate entire form data", () => {
      const form = getFormDefinition("I-130");
      const testData = {
        i130_petitioner_name_first: "John",
        i130_petitioner_name_last: "Doe",
        i130_petitioner_date_of_birth: "01/15/1980",
      };

      const result = validateForm(form, testData);
      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("errors");
      expect(typeof result.valid).toBe("boolean");
    });
  });

  describe("Form Field Types", () => {
    it("all forms should have fields with valid types", () => {
      const validTypes = [
        "text",
        "date",
        "select",
        "checkbox",
        "textarea",
        "ssn",
        "phone",
        "address",
      ];
      const forms = getAllForms();

      for (const form of forms) {
        for (const section of form.sections) {
          for (const field of section.fields) {
            expect(validTypes).toContain(field.type);
          }
        }
      }
    });

    it("all fields should have required RFE risk level", () => {
      const validRiskLevels = ["low", "medium", "high"];
      const forms = getAllForms();

      for (const form of forms) {
        for (const section of form.sections) {
          for (const field of section.fields) {
            expect(validRiskLevels).toContain(field.rfeRisk);
          }
        }
      }
    });

    it("all fields should have required properties", () => {
      const forms = getAllForms();

      for (const form of forms) {
        for (const section of form.sections) {
          for (const field of section.fields) {
            expect(field.id).toBeDefined();
            expect(field.label).toBeDefined();
            expect(field.type).toBeDefined();
            expect(typeof field.required).toBe("boolean");
            expect(field.section).toBeDefined();
            expect(field.rfeRisk).toBeDefined();
          }
        }
      }
    });
  });

  describe("getHighRiskFields", () => {
    it("should return high-risk fields from I-130", () => {
      const form = getFormDefinition("I-130");
      const highRiskFields = getHighRiskFields(form!);
      expect(highRiskFields.length).toBeGreaterThan(0);
      expect(highRiskFields.every((f) => f.rfeRisk === "high")).toBe(true);
    });

    it("should include section information in results", () => {
      const form = getFormDefinition("I-130");
      const highRiskFields = getHighRiskFields(form!);
      if (highRiskFields.length > 0) {
        expect(highRiskFields[0]).toHaveProperty("section");
        expect(highRiskFields[0]).toHaveProperty("sectionTitle");
      }
    });
  });

  describe("getFormStats", () => {
    it("should return form statistics", () => {
      const stats = getFormStats();
      expect(stats.formCount).toBe(5);
      expect(stats.totalFields).toBeGreaterThan(0);
      expect(stats.highRiskFields).toBeGreaterThan(0);
      expect(stats.estimatedTotalTime).toBeGreaterThan(0);
    });

    it("should count risk levels correctly", () => {
      const stats = getFormStats();
      const total =
        stats.highRiskFields +
        stats.mediumRiskFields +
        stats.lowRiskFields;
      expect(total).toBe(stats.totalFields);
    });
  });

  describe("searchFields", () => {
    it("should find fields by label", () => {
      const results = searchFields("name");
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.every((f) => f.label.toLowerCase().includes("name"))
      ).toBe(true);
    });

    it("should return empty array for non-matching query", () => {
      const results = searchFields("nonexistentfield12345");
      expect(results).toEqual([]);
    });

    it("search results should include form information", () => {
      const results = searchFields("date of birth");
      if (results.length > 0) {
        expect(results[0]).toHaveProperty("formNumber");
        expect(results[0]).toHaveProperty("formTitle");
        expect(results[0]).toHaveProperty("sectionTitle");
      }
    });

    it("should be case-insensitive", () => {
      const resultsLower = searchFields("address");
      const resultsUpper = searchFields("ADDRESS");
      expect(resultsLower.length).toBe(resultsUpper.length);
    });
  });

  describe("Form Completeness", () => {
    it("N-400 should have eligibility section", () => {
      const form = getFormDefinition("N-400");
      const hasCitizenshipYears = form?.sections
        .flatMap((s) => s.fields)
        .some((f) => f.id === "n400_citizenship_years");
      expect(hasCitizenshipYears).toBe(true);
    });

    it("I-864 should have sections for all financial info", () => {
      const form = getFormDefinition("I-864");
      const sectionIds = form?.sections.map((s) => s.id);
      expect(sectionIds).toContain("sponsor_info");
      expect(sectionIds).toContain("household");
      expect(sectionIds).toContain("income");
      expect(sectionIds).toContain("assets");
      expect(sectionIds).toContain("taxes");
    });

    it("all forms should have declaration or signature section", () => {
      const forms = getAllForms();
      for (const form of forms) {
        const hasDeclaration = form.sections.some(
          (s) => s.id === "declaration" || s.id === "part4"
        );
        expect(hasDeclaration).toBe(true);
      }
    });
  });
});
