import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  chatMessageSchema,
  contactSchema,
  validate,
} from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should accept valid login credentials", () => {
      const validData = {
        email: "user@example.com",
        password: "securePassword123",
      };

      const result = validate<{ email: string; password: string }>(loginSchema, validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe("user@example.com");
      }
    });

    it("should reject invalid email format", () => {
      const invalidData = {
        email: "invalid-email",
        password: "securePassword123",
      };

      const result = validate(loginSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject password shorter than 8 characters", () => {
      const invalidData = {
        email: "user@example.com",
        password: "short",
      };

      const result = validate(loginSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing email", () => {
      const invalidData = {
        password: "securePassword123",
      };

      const result = validate(loginSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing password", () => {
      const invalidData = {
        email: "user@example.com",
      };

      const result = validate(loginSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("signupSchema", () => {
    it("should accept valid signup data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "securePassword123",
        confirmPassword: "securePassword123",
        role: "applicant",
      };

      const result = validate(signupSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should reject non-matching passwords", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "securePassword123",
        confirmPassword: "differentPassword123",
        role: "applicant",
      };

      const result = validate(signupSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept attorney role with bar number and state", () => {
      const validData = {
        name: "Jane Attorney",
        email: "jane@example.com",
        password: "securePassword123",
        confirmPassword: "securePassword123",
        role: "attorney",
        barNumber: "123456",
        barState: "CA",
      };

      const result = validate(signupSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should reject attorney role without bar number", () => {
      const invalidData = {
        name: "Jane Attorney",
        email: "jane@example.com",
        password: "securePassword123",
        confirmPassword: "securePassword123",
        role: "attorney",
        barState: "CA",
      };

      const result = validate(signupSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject short name", () => {
      const invalidData = {
        name: "J",
        email: "john@example.com",
        password: "securePassword123",
        confirmPassword: "securePassword123",
        role: "applicant",
      };

      const result = validate(signupSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "short",
        confirmPassword: "short",
        role: "applicant",
      };

      const result = validate(signupSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("chatMessageSchema", () => {
    it("should accept valid chat messages", () => {
      const validData = {
        messages: [
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there!" },
        ],
      };

      const result = validate(chatMessageSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should reject empty message content", () => {
      const invalidData = {
        messages: [{ role: "user", content: "" }],
      };

      const result = validate(chatMessageSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid role", () => {
      const invalidData = {
        messages: [{ role: "invalid", content: "Hello" }],
      };

      const result = validate(chatMessageSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept optional userData", () => {
      const validData = {
        messages: [{ role: "user", content: "Hello" }],
        userData: {
          userId: "user123",
          caseType: "EB1A",
        },
      };

      const result = validate(chatMessageSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should reject non-array messages", () => {
      const invalidData = {
        messages: { role: "user", content: "Hello" },
      };

      const result = validate(chatMessageSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("contactSchema", () => {
    it("should accept valid contact data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "555-123-4567",
        message: "This is a detailed message about my inquiry",
        type: "support",
      };

      const result = validate(contactSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should reject message shorter than 10 characters", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        message: "short",
        type: "support",
      };

      const result = validate(contactSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        name: "John Doe",
        email: "not-an-email",
        message: "This is a detailed message about my inquiry",
        type: "support",
      };

      const result = validate(contactSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject short name", () => {
      const invalidData = {
        name: "J",
        email: "john@example.com",
        message: "This is a detailed message about my inquiry",
        type: "support",
      };

      const result = validate(contactSchema, invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept optional phone number", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        message: "This is a detailed message about my inquiry",
        type: "feedback",
      };

      const result = validate(contactSchema, validData);
      expect(result.success).toBe(true);
    });

    it("should accept valid contact types", () => {
      const types = ["support", "feedback", "inquiry", "complaint"];

      for (const type of types) {
        const validData = {
          name: "John Doe",
          email: "john@example.com",
          message: "This is a detailed message about my inquiry",
          type,
        };

        const result = validate(contactSchema, validData);
        expect(result.success).toBe(true);
      }
    });

    it("should reject invalid contact type", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        message: "This is a detailed message about my inquiry",
        type: "invalid",
      };

      const result = validate(contactSchema, invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("Email Validation", () => {
    it("should accept various valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "john.doe@example.co.uk",
        "test+tag@example.org",
        "name_123@test-domain.com",
      ];

      for (const email of validEmails) {
        const result = validate(loginSchema, {
          email,
          password: "password123",
        });
        expect(result.success).toBe(true);
      }
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "plainaddress",
        "@nodomain.com",
        "missing@domain",
        "spaces in@email.com",
      ];

      for (const email of invalidEmails) {
        const result = validate(loginSchema, {
          email,
          password: "password123",
        });
        expect(result.success).toBe(false);
      }
    });
  });

  describe("Password Validation", () => {
    it("should accept passwords 8 characters or longer", () => {
      const validPasswords = [
        "12345678",
        "myPassword123",
        "VerySecurePassword!@#",
        "a".repeat(50),
      ];

      for (const password of validPasswords) {
        const result = validate(loginSchema, {
          email: "user@example.com",
          password,
        });
        expect(result.success).toBe(true);
      }
    });

    it("should reject passwords shorter than 8 characters", () => {
      const invalidPasswords = ["", "1", "short", "1234567"];

      for (const password of invalidPasswords) {
        const result = validate(loginSchema, {
          email: "user@example.com",
          password,
        });
        expect(result.success).toBe(false);
      }
    });
  });

  describe("Role Validation", () => {
    it("should accept applicant role without additional requirements", () => {
      const result = validate(signupSchema, {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password123",
        role: "applicant",
      });

      expect(result.success).toBe(true);
    });

    it("should accept agent role with bar requirements", () => {
      const result = validate(signupSchema, {
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password123",
        confirmPassword: "password123",
        role: "agent",
        barNumber: "123456",
        barState: "NY",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("validate helper function", () => {
    it("should return success true for valid data", () => {
      const result = validate(loginSchema, {
        email: "user@example.com",
        password: "password123",
      });

      expect(result.success).toBe(true);
      expect("data" in result).toBe(true);
    });

    it("should return success false for invalid data", () => {
      const result = validate(loginSchema, {
        email: "invalid",
        password: "short",
      });

      expect(result.success).toBe(false);
      expect("errors" in result).toBe(true);
    });
  });
});
