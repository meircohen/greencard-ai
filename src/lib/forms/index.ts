/**
 * USCIS Form Registry and Utilities
 * Central export for all form definitions with validation and helper functions
 */

import i130FormDefinition from "./i-130";
import i485FormDefinition from "./i-485";
import i765FormDefinition from "./i-765";
import i864FormDefinition from "./i-864";
import n400FormDefinition from "./n-400";

// Re-export types for convenience
export type { FormDefinition, FormField, FormSection, ValidationRule, FieldType, RiskLevel } from "./i-130";
import type { FormField, FormDefinition } from "./i-130";

// Export all form definitions
export {
  i130FormDefinition,
  i485FormDefinition,
  i765FormDefinition,
  i864FormDefinition,
  n400FormDefinition,
};

/**
 * Registry of all available forms
 */
const formRegistry = new Map([
  ["I-130", i130FormDefinition],
  ["I-485", i485FormDefinition],
  ["I-765", i765FormDefinition],
  ["I-864", i864FormDefinition],
  ["N-400", n400FormDefinition],
]);

/**
 * Get a form definition by its form number
 * @param formNumber - The USCIS form number (e.g., "I-130", "I-485")
 * @returns The FormDefinition or null if not found
 */
export function getFormDefinition(formNumber: string) {
  return formRegistry.get(formNumber) || null;
}

/**
 * Get all registered form definitions
 * @returns Array of all FormDefinition objects
 */
export function getAllForms() {
  return Array.from(formRegistry.values());
}

/**
 * Get all form numbers
 * @returns Array of form numbers
 */
export function getAllFormNumbers() {
  return Array.from(formRegistry.keys());
}

/**
 * Validate a form field value
 * @param field - The FormField to validate
 * @param value - The value to validate
 * @returns Object with valid boolean and errors array
 */
export function validateField(field: FormField, value: string | boolean | null | undefined): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  if (field.required && (value === null || value === undefined || value === "")) {
    errors.push(`${field.label} is required`);
  }

  // Skip further validation if no value and not required
  if (!value && !field.required) {
    return { valid: true, errors: [] };
  }

  // Apply validation rules if present
  if (field.validationRules) {
    for (const rule of field.validationRules) {
      switch (rule.type) {
        case "required":
          if (!value) {
            errors.push(rule.message);
          }
          break;

        case "minLength":
          if (value && value.toString().length < rule.value) {
            errors.push(rule.message);
          }
          break;

        case "maxLength":
          if (value && value.toString().length > rule.value) {
            errors.push(rule.message);
          }
          break;

        case "pattern":
          if (value && !new RegExp(rule.value).test(value.toString())) {
            errors.push(rule.message);
          }
          break;

        case "custom":
          // Custom validation would be handled by the provided function
          if (typeof rule.value === "function" && !rule.value(value)) {
            errors.push(rule.message);
          }
          break;
      }
    }
  }

  // Type-specific validation
  switch (field.type) {
    case "date":
      if (value && typeof value === "string") {
        // Check if valid date format
        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!dateRegex.test(value)) {
          errors.push(`${field.label} must be in MM/DD/YYYY format`);
        } else {
          // Validate date is valid
          const [month, day, year] = value.split("/").map(Number);
          const date = new Date(year, month - 1, day);
          if (date.getMonth() !== month - 1) {
            errors.push(`${field.label} must be a valid date`);
          }
        }
      }
      break;

    case "ssn":
      if (value && typeof value === "string") {
        const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
        if (!ssnRegex.test(value)) {
          errors.push(`${field.label} must be in XXX-XX-XXXX format`);
        }
      }
      break;

    case "phone":
      if (value && typeof value === "string") {
        // Flexible phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
          errors.push(`${field.label} must be a valid phone number`);
        }
      }
      break;

    case "text":
      // Basic text validation
      if (value && typeof value !== "string") {
        errors.push(`${field.label} must be text`);
      }
      break;

    case "textarea":
      if (value && typeof value !== "string") {
        errors.push(`${field.label} must be text`);
      }
      break;

    case "select":
      if (value && typeof value === "string" && field.options) {
        const validOptions = field.options.map((opt) => opt.value);
        if (!validOptions.includes(value)) {
          errors.push(`${field.label} must be a valid option`);
        }
      }
      break;

    case "checkbox":
      if (value && typeof value !== "boolean") {
        errors.push(`${field.label} must be checked or unchecked`);
      }
      break;

    case "address":
      if (value && typeof value !== "string") {
        errors.push(`${field.label} must be text`);
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all fields in a form section
 * @param form - The FormDefinition to validate
 * @param data - Object containing field values
 * @returns Object with valid boolean and errors by field
 */
export function validateForm(form: FormDefinition, data: Record<string, string | boolean | null | undefined>) {
  const fieldErrors: Record<string, string[]> = {};
  let isValid = true;

  for (const section of form.sections) {
    for (const field of section.fields) {
      const value = data[field.id];
      const result = validateField(field, value);

      if (!result.valid) {
        fieldErrors[field.id] = result.errors;
        isValid = false;
      }
    }
  }

  return {
    valid: isValid,
    errors: fieldErrors,
  };
}

/**
 * Get fields marked as high RFE risk
 * @param form - The FormDefinition to analyze
 * @returns Array of high-risk fields
 */
export function getHighRiskFields(form: FormDefinition) {
  const highRiskFields: (FormField & { section: string; sectionTitle: string })[] = [];

  for (const section of form.sections) {
    for (const field of section.fields) {
      if (field.rfeRisk === "high") {
        highRiskFields.push({
          ...field,
          section: section.id,
          sectionTitle: section.title,
        });
      }
    }
  }

  return highRiskFields;
}

/**
 * Get form statistics
 * @returns Object with form count and field statistics
 */
export function getFormStats() {
  const allForms = getAllForms();
  let totalFields = 0;
  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let lowRiskCount = 0;

  for (const form of allForms) {
    totalFields += form.fieldCount;

    for (const section of form.sections) {
      for (const field of section.fields) {
        if (field.rfeRisk === "high") highRiskCount++;
        else if (field.rfeRisk === "medium") mediumRiskCount++;
        else lowRiskCount++;
      }
    }
  }

  return {
    formCount: allForms.length,
    totalFields,
    highRiskFields: highRiskCount,
    mediumRiskFields: mediumRiskCount,
    lowRiskFields: lowRiskCount,
    estimatedTotalTime: allForms.reduce((sum, form) => sum + form.estimatedTime, 0),
  };
}

/**
 * Search for fields across all forms
 * @param query - Search query (partial field label match)
 * @returns Array of matching fields with form information
 */
export function searchFields(query: string) {
  const lowerQuery = query.toLowerCase();
  const results: (FormField & { formNumber: string; formTitle: string; sectionTitle: string })[] = [];

  for (const form of getAllForms()) {
    for (const section of form.sections) {
      for (const field of section.fields) {
        if (field.label.toLowerCase().includes(lowerQuery)) {
          results.push({
            ...field,
            formNumber: form.formNumber,
            formTitle: form.title,
            sectionTitle: section.title,
          });
        }
      }
    }
  }

  return results;
}
