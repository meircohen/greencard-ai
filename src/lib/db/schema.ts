import {
  pgTable,
  uuid,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
  integer,
  numeric,
  pgEnum,
  index,
  foreignKey,
  unique,
  serial,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = pgEnum('user_role', ['client', 'attorney', 'admin']);
export const caseStatusEnum = pgEnum('case_status', [
  'draft',
  'submitted',
  'processing',
  'approved',
  'denied',
  'abandoned',
  'completed',
]);
export const documentStatusEnum = pgEnum('document_status', [
  'uploaded',
  'processing',
  'extracted',
  'error',
  'archived',
]);
export const formStatusEnum = pgEnum('form_status', [
  'draft',
  'filled',
  'submitted',
  'approved',
  'rejected',
  'rfe',
]);
export const conversationTypeEnum = pgEnum('conversation_type', [
  'assessment',
  'case_review',
  'document_analysis',
  'strategy',
  'general',
]);
export const messageRoleEnum = pgEnum('message_role', ['user', 'assistant', 'system']);
export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'contacted',
  'interested',
  'negotiating',
  'closed_won',
  'closed_lost',
]);
export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free',
  'starter',
  'professional',
  'enterprise',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);
export const caseNoteVisibilityEnum = pgEnum('case_note_visibility', [
  'private',
  'client',
  'team',
  'public',
]);

// ============================================================================
// USERS & AUTH TABLES
// ============================================================================

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }),
    fullName: varchar('full_name', { length: 255 }),
    passwordHash: text('password_hash'),
    avatarUrl: text('avatar_url'),
    role: userRoleEnum('role').notNull().default('client'),
    emailVerified: boolean('email_verified').default(false),
    onboardingCompleted: boolean('onboarding_completed').default(false),
    locale: varchar('locale', { length: 10 }).default('en'),
    timezone: varchar('timezone', { length: 50 }).default('UTC'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
    createdAtIdx: index('idx_users_created_at').on(table.createdAt),
    roleIdx: index('idx_users_role').on(table.role),
  })
);

export const userProfiles = pgTable(
  'user_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    countryOfBirth: varchar('country_of_birth', { length: 100 }),
    nationality: varchar('nationality', { length: 100 }),
    currentStatus: varchar('current_status', { length: 50 }),
    dateOfBirth: timestamp('date_of_birth'),
    gender: varchar('gender', { length: 20 }),
    maritalStatus: varchar('marital_status', { length: 50 }),
    address: jsonb('address'),
    aNumber: varchar('a_number', { length: 20 }).unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_user_profiles_user_id').on(table.userId),
    aNumberIdx: index('idx_user_profiles_a_number').on(table.aNumber),
  })
);

export const attorneyProfiles = pgTable(
  'attorney_profiles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    barNumber: varchar('bar_number', { length: 50 }).notNull().unique(),
    barState: varchar('bar_state', { length: 2 }).notNull(),
    firmName: varchar('firm_name', { length: 255 }),
    specialties: text('specialties').array(),
    languages: text('languages').array(),
    bio: text('bio'),
    hourlyRate: numeric('hourly_rate', { precision: 10, scale: 2 }),
    photoUrl: text('photo_url'),
    verified: boolean('verified').default(false),
    stripeConnectId: varchar('stripe_connect_id', { length: 255 }),
    rating: numeric('rating', { precision: 3, scale: 2 }),
    reviewCount: integer('review_count').default(0),
    totalCases: integer('total_cases').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_attorney_profiles_user_id').on(table.userId),
    barNumberIdx: index('idx_attorney_profiles_bar_number').on(table.barNumber),
    verifiedIdx: index('idx_attorney_profiles_verified').on(table.verified),
  })
);

// ============================================================================
// CASES & DOCUMENTS TABLES
// ============================================================================

export const cases = pgTable(
  'cases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    attorneyId: uuid('attorney_id').references(() => users.id, { onDelete: 'set null' }),
    caseType: varchar('case_type', { length: 100 }).notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    status: caseStatusEnum('status').notNull().default('draft'),
    priorityDate: timestamp('priority_date'),
    receiptNumber: varchar('receipt_number', { length: 50 }).unique(),
    serviceCenter: varchar('service_center', { length: 100 }),
    score: numeric('score', { precision: 5, scale: 2 }),
    assessment: jsonb('assessment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_cases_user_id').on(table.userId),
    attorneyIdIdx: index('idx_cases_attorney_id').on(table.attorneyId),
    statusIdx: index('idx_cases_status').on(table.status),
    createdAtIdx: index('idx_cases_created_at').on(table.createdAt),
  })
);

export const caseEvents = pgTable(
  'case_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    eventType: varchar('event_type', { length: 100 }).notNull(),
    eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
    description: text('description'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    caseIdIdx: index('idx_case_events_case_id').on(table.caseId),
    eventDateIdx: index('idx_case_events_event_date').on(table.eventDate),
  })
);

export const caseDocuments = pgTable(
  'case_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    documentType: varchar('document_type', { length: 100 }).notNull(),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileUrl: text('file_url').notNull(),
    fileSize: integer('file_size'),
    mimeType: varchar('mime_type', { length: 100 }),
    ocrText: text('ocr_text'),
    aiExtractedData: jsonb('ai_extracted_data'),
    status: documentStatusEnum('status').notNull().default('uploaded'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    caseIdIdx: index('idx_case_documents_case_id').on(table.caseId),
    statusIdx: index('idx_case_documents_status').on(table.status),
  })
);

export const caseForms = pgTable(
  'case_forms',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    formNumber: varchar('form_number', { length: 50 }).notNull(),
    status: formStatusEnum('status').notNull().default('draft'),
    formData: jsonb('form_data'),
    aiSuggestions: jsonb('ai_suggestions'),
    validationErrors: jsonb('validation_errors'),
    filedDate: timestamp('filed_date'),
    receiptNumber: varchar('receipt_number', { length: 50 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    caseIdIdx: index('idx_case_forms_case_id').on(table.caseId),
    formNumberIdx: index('idx_case_forms_form_number').on(table.formNumber),
    statusIdx: index('idx_case_forms_status').on(table.status),
  })
);

export const caseDeadlines = pgTable(
  'case_deadlines',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    deadlineType: varchar('deadline_type', { length: 100 }).notNull(),
    deadlineDate: timestamp('deadline_date', { withTimezone: true }).notNull(),
    description: text('description'),
    reminderSent: boolean('reminder_sent').default(false),
    completed: boolean('completed').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    caseIdIdx: index('idx_case_deadlines_case_id').on(table.caseId),
    deadlineDateIdx: index('idx_case_deadlines_deadline_date').on(table.deadlineDate),
  })
);

export const caseNotes = pgTable(
  'case_notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    caseId: uuid('case_id')
      .notNull()
      .references(() => cases.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    content: text('content').notNull(),
    isPrivileged: boolean('is_privileged').default(false),
    visibility: caseNoteVisibilityEnum('visibility').notNull().default('private'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    caseIdIdx: index('idx_case_notes_case_id').on(table.caseId),
    authorIdIdx: index('idx_case_notes_author_id').on(table.authorId),
  })
);

// ============================================================================
// AI & CONVERSATIONS TABLES
// ============================================================================

export const conversations = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    caseId: uuid('case_id').references(() => cases.id, { onDelete: 'set null' }),
    type: conversationTypeEnum('type').notNull().default('general'),
    modelUsed: varchar('model_used', { length: 100 }),
    totalTokens: integer('total_tokens').default(0),
    messagesCount: integer('messages_count').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_conversations_user_id').on(table.userId),
    caseIdIdx: index('idx_conversations_case_id').on(table.caseId),
    createdAtIdx: index('idx_conversations_created_at').on(table.createdAt),
  })
);

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    role: messageRoleEnum('role').notNull(),
    content: text('content').notNull(),
    tokensUsed: integer('tokens_used').default(0),
    model: varchar('model', { length: 100 }),
    latencyMs: integer('latency_ms'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    conversationIdIdx: index('idx_messages_conversation_id').on(table.conversationId),
    createdAtIdx: index('idx_messages_created_at').on(table.createdAt),
  })
);

export const assessments = pgTable(
  'assessments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    caseId: uuid('case_id').references(() => cases.id, { onDelete: 'set null' }),
    conversationId: uuid('conversation_id').references(() => conversations.id, {
      onDelete: 'set null',
    }),
    score: numeric('score', { precision: 5, scale: 2 }),
    category: varchar('category', { length: 100 }),
    eligiblePaths: jsonb('eligible_paths'),
    dataPoints: jsonb('data_points'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_assessments_user_id').on(table.userId),
    caseIdIdx: index('idx_assessments_case_id').on(table.caseId),
    categoryIdx: index('idx_assessments_category').on(table.category),
  })
);

// ============================================================================
// MARKETPLACE & BILLING TABLES
// ============================================================================

export const attorneyLeads = pgTable(
  'attorney_leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    attorneyId: uuid('attorney_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    caseType: varchar('case_type', { length: 100 }).notNull(),
    status: leadStatusEnum('status').notNull().default('new'),
    leadFee: numeric('lead_fee', { precision: 10, scale: 2 }),
    paid: boolean('paid').default(false),
    stripePaymentId: varchar('stripe_payment_id', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_attorney_leads_user_id').on(table.userId),
    attorneyIdIdx: index('idx_attorney_leads_attorney_id').on(table.attorneyId),
    statusIdx: index('idx_attorney_leads_status').on(table.status),
  })
);

export const attorneyReviews = pgTable(
  'attorney_reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    attorneyId: uuid('attorney_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    reviewText: text('review_text'),
    verified: boolean('verified').default(false),
    published: boolean('published').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    attorneyIdIdx: index('idx_attorney_reviews_attorney_id').on(table.attorneyId),
    userIdIdx: index('idx_attorney_reviews_user_id').on(table.userId),
  })
);

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique(),
    plan: subscriptionPlanEnum('plan').notNull().default('free'),
    status: varchar('status', { length: 50 }).notNull(),
    currentPeriodStart: timestamp('current_period_start', { withTimezone: true }),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_subscriptions_user_id').on(table.userId),
    planIdx: index('idx_subscriptions_plan').on(table.plan),
  })
);

export const payments = pgTable(
  'payments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    stripePaymentId: varchar('stripe_payment_id', { length: 255 }).unique(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).default('USD'),
    status: paymentStatusEnum('status').notNull().default('pending'),
    description: text('description'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_payments_user_id').on(table.userId),
    statusIdx: index('idx_payments_status').on(table.status),
    createdAtIdx: index('idx_payments_created_at').on(table.createdAt),
  })
);

// ============================================================================
// SECURITY & SESSION TABLES
// ============================================================================

export const mfaSettings = pgTable(
  'mfa_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    secret: text('secret').notNull(), // Encrypted TOTP secret
    enabled: boolean('enabled').notNull().default(false),
    backupCodes: jsonb('backup_codes').$type<string[]>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_mfa_settings_user_id').on(table.userId),
  })
);

export const revokedTokens = pgTable(
  'revoked_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    jti: varchar('jti', { length: 255 }).notNull().unique(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => ({
    jtiIdx: index('idx_revoked_tokens_jti').on(table.jti),
    expiresAtIdx: index('idx_revoked_tokens_expires_at').on(table.expiresAt),
  })
);

export const userRevocations = pgTable(
  'user_revocations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    revokedAt: timestamp('revoked_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('idx_user_revocations_user_id').on(table.userId),
  })
);

export const rateLimitBuckets = pgTable(
  'rate_limit_buckets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 255 }).notNull().unique(),
    tokens: integer('tokens').notNull(),
    lastRefill: timestamp('last_refill', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => ({
    keyIdx: index('idx_rate_limit_buckets_key').on(table.key),
    expiresAtIdx: index('idx_rate_limit_buckets_expires_at').on(table.expiresAt),
  })
);

export const processedWebhookEvents = pgTable(
  'processed_webhook_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: varchar('event_id', { length: 255 }).notNull().unique(),
    processedAt: timestamp('processed_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  },
  (table) => ({
    eventIdIdx: index('idx_processed_webhook_events_event_id').on(table.eventId),
  })
);

export const auditEvents = pgTable(
  'audit_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    action: varchar('action', { length: 100 }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    targetId: varchar('target_id', { length: 255 }),
    ip: varchar('ip', { length: 45 }),
    userAgent: text('user_agent'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    actionIdx: index('idx_audit_events_action').on(table.action),
    userIdIdx: index('idx_audit_events_user_id').on(table.userId),
    createdAtIdx: index('idx_audit_events_created_at').on(table.createdAt),
  })
);

export type AuditEvent = typeof auditEvents.$inferSelect;
export type NewAuditEvent = typeof auditEvents.$inferInsert;

// Type exports for new tables
export type MfaSetting = typeof mfaSettings.$inferSelect;
export type RevokedToken = typeof revokedTokens.$inferSelect;
export type RateLimitBucket = typeof rateLimitBuckets.$inferSelect;

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  attorneyProfile: one(attorneyProfiles),
  cases: many(cases),
  conversations: many(conversations),
  assessments: many(assessments),
  leads: many(attorneyLeads),
  reviews: many(attorneyReviews),
  subscriptions: many(subscriptions),
  payments: many(payments),
  caseNotes: many(caseNotes),
}));

export const casesRelations = relations(cases, ({ one, many }) => ({
  client: one(users, {
    fields: [cases.userId],
    references: [users.id],
  }),
  attorney: one(users, {
    fields: [cases.attorneyId],
    references: [users.id],
  }),
  events: many(caseEvents),
  documents: many(caseDocuments),
  forms: many(caseForms),
  deadlines: many(caseDeadlines),
  notes: many(caseNotes),
  assessments: many(assessments),
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users),
  case: one(cases),
  messages: many(messages),
  assessments: many(assessments),
}));

// ============================================================================
// TYPE EXPORTS FOR SELECT/INSERT
// ============================================================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserProfile = typeof userProfiles.$inferSelect;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type AttorneyProfile = typeof attorneyProfiles.$inferSelect;
export type NewAttorneyProfile = typeof attorneyProfiles.$inferInsert;

export type Case = typeof cases.$inferSelect;
export type NewCase = typeof cases.$inferInsert;

export type CaseEvent = typeof caseEvents.$inferSelect;
export type NewCaseEvent = typeof caseEvents.$inferInsert;

export type CaseDocument = typeof caseDocuments.$inferSelect;
export type NewCaseDocument = typeof caseDocuments.$inferInsert;

export type CaseForm = typeof caseForms.$inferSelect;
export type NewCaseForm = typeof caseForms.$inferInsert;

export type CaseDeadline = typeof caseDeadlines.$inferSelect;
export type NewCaseDeadline = typeof caseDeadlines.$inferInsert;

export type CaseNote = typeof caseNotes.$inferSelect;
export type NewCaseNote = typeof caseNotes.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Assessment = typeof assessments.$inferSelect;
export type NewAssessment = typeof assessments.$inferInsert;

export type AttorneyLead = typeof attorneyLeads.$inferSelect;
export type NewAttorneyLead = typeof attorneyLeads.$inferInsert;

export type AttorneyReview = typeof attorneyReviews.$inferSelect;
export type NewAttorneyReview = typeof attorneyReviews.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
