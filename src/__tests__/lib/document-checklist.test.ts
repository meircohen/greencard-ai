import { describe, it, expect } from "vitest";
import {
  i485Checklist,
  i130Checklist,
  eb1aChecklist,
  getChecklist,
  getAllChecklists,
} from "@/lib/forms/document-checklist";

describe("Document Checklist", () => {
  describe("i485Checklist", () => {
    it("has required fields", () => {
      const required = i485Checklist.items.filter((i) => i.required);
      expect(required.length).toBeGreaterThan(5);
    });

    it("includes medical examination", () => {
      const medical = i485Checklist.items.find((i) => i.id === "i485_i693");
      expect(medical).toBeDefined();
      expect(medical!.required).toBe(true);
      expect(medical!.category).toBe("medical");
    });

    it("includes I-864 affidavit of support", () => {
      const i864 = i485Checklist.items.find((i) => i.id === "i485_i864");
      expect(i864).toBeDefined();
      expect(i864!.rfeRisk).toBe("high");
    });

    it("has unique IDs", () => {
      const ids = i485Checklist.items.map((i) => i.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all items have valid categories", () => {
      const validCategories = ["identity", "financial", "legal", "medical", "evidence", "forms"];
      for (const item of i485Checklist.items) {
        expect(validCategories).toContain(item.category);
      }
    });
  });

  describe("i130Checklist", () => {
    it("includes bona fide marriage evidence", () => {
      const bonaFide = i130Checklist.items.find((i) => i.id === "i130_bona_fide");
      expect(bonaFide).toBeDefined();
      expect(bonaFide!.rfeRisk).toBe("high");
    });
  });

  describe("eb1aChecklist", () => {
    it("includes expert recommendation letters", () => {
      const letters = eb1aChecklist.items.find((i) => i.id === "eb1a_expert_letters");
      expect(letters).toBeDefined();
      expect(letters!.required).toBe(true);
    });

    it("includes petition letter", () => {
      const letter = eb1aChecklist.items.find((i) => i.id === "eb1a_evidence_letter");
      expect(letter).toBeDefined();
      expect(letter!.category).toBe("evidence");
    });
  });

  describe("getChecklist", () => {
    it("returns I-485 checklist", () => {
      expect(getChecklist("I-485")).toBe(i485Checklist);
    });

    it("returns I-130 checklist", () => {
      expect(getChecklist("I-130")).toBe(i130Checklist);
    });

    it("returns EB-1A checklist via I-140", () => {
      expect(getChecklist("I-140")).toBe(eb1aChecklist);
    });

    it("returns EB-1A by name", () => {
      expect(getChecklist("EB1A")).toBe(eb1aChecklist);
    });

    it("handles case insensitivity", () => {
      expect(getChecklist("i-485")).toBe(i485Checklist);
    });

    it("returns null for unknown form", () => {
      expect(getChecklist("Z-999")).toBeNull();
    });
  });

  describe("getAllChecklists", () => {
    it("returns all 3 checklists", () => {
      const all = getAllChecklists();
      expect(all).toHaveLength(3);
    });
  });
});
