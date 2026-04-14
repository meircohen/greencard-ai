import { z } from "zod";

// ============================================================================
// Auth Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["applicant", "attorney", "agent"]),
    barNumber: z.string().optional(),
    barState: z.string().optional(),
    firmName: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "attorney" || data.role === "agent") {
        return data.barNumber && data.barState;
      }
      return true;
    },
    {
      message: "Bar number and state are required for attorneys/agents",
      path: ["barNumber"],
    }
  );

export type SignupInput = z.infer<typeof signupSchema>;

// ============================================================================
// Chat Schemas
// ============================================================================

export const chatMessageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().min(1, "Message cannot be empty"),
    })
  ),
  userData: z
    .object({
      userId: z.string().optional(),
      caseType: z.string().optional(),
      category: z.string().optional(),
    })
    .optional(),
  conversationId: z.string().optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// ============================================================================
// Assessment Schemas
// ============================================================================

export const assessmentSchema = z.object({
  intakeData: z.record(z.string(), z.any()),
  conversationHistory: z.string().optional(),
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;

// ============================================================================
// Form & Document Schemas
// ============================================================================

export const formFillSchema = z.object({
  action: z.enum(["fill", "analyze", "generate"]),
  formNumber: z.string().regex(/^I-\d{3}[A-Z]?$/, "Invalid form number"),
  formData: z.record(z.string(), z.any()).optional(),
  documents: z.array(z.string()).optional(),
  caseData: z
    .object({
      caseType: z.string().optional(),
      petitionerInfo: z.record(z.string(), z.any()).optional(),
      beneficiaryInfo: z.record(z.string(), z.any()).optional(),
    })
    .optional(),
});

export type FormFillInput = z.infer<typeof formFillSchema>;

export const ocrSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File must be under 10MB")
    .refine(
      (file) =>
        [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/tiff",
        ].includes(file.type),
      "File must be PDF, JPEG, PNG, or TIFF"
    ),
});

export type OCRInput = z.infer<typeof ocrSchema>;

// ============================================================================
// Case Schemas
// ============================================================================

export const caseCreateSchema = z.object({
  caseType: z.enum([
    "EB1A",
    "EB1B",
    "EB2",
    "EB3",
    "EB5",
    "F1",
    "H1B",
    "L1",
    "O1",
    "CR1",
    "IR1",
    "F2A",
    "F2B",
  ]),
  category: z.enum([
    "employment",
    "family",
    "humanitarian",
    "diversity",
    "special",
  ]),
  description: z.string().optional(),
});

export type CaseCreateInput = z.infer<typeof caseCreateSchema>;

export const caseUpdateSchema = z.object({
  status: z
    .enum([
      "pending",
      "in_progress",
      "approved",
      "denied",
      "rfe",
      "appealed",
    ])
    .optional(),
  priority_date: z.string().datetime().optional(),
  receipt_number: z.string().optional(),
  service_center: z
    .enum(["USCIS", "NVC", "CONSULATE", "USCIS_LOCAL"])
    .optional(),
});

export type CaseUpdateInput = z.infer<typeof caseUpdateSchema>;

// ============================================================================
// Contact & Notification Schemas
// ============================================================================

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  type: z.enum(["support", "feedback", "inquiry", "complaint"]),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const notificationSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  type: z.enum([
    "visa_bulletin_update",
    "processing_time_update",
    "status_change",
    "document_request",
    "appointment_reminder",
    "case_approved",
    "case_denied",
  ]),
  title: z.string().min(1),
  description: z.string(),
  actionUrl: z.string().url("Invalid URL").optional(),
});

export type NotificationInput = z.infer<typeof notificationSchema>;

// ============================================================================
// Billing & Subscription Schemas
// ============================================================================

export const billingSchema = z.object({
  planId: z.enum(["free", "starter", "pro", "enterprise"]),
  userId: z.string().uuid("Invalid user ID"),
});

export type BillingInput = z.infer<typeof billingSchema>;

// ============================================================================
// Helper function to validate and parse input
// ============================================================================

export function validate<T>(
  schema: z.ZodSchema,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as T };
  }
  return { success: false, errors: result.error };
}
