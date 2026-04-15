/**
 * Database seed script for development.
 * Creates sample users, cases, and data for testing.
 *
 * Usage: npx tsx scripts/seed.ts
 * Requires DATABASE_URL in .env.local
 */

import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import * as schema from "../src/lib/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not set. Copy .env.example to .env.local and fill in your Neon URL.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });
  const db = drizzle(pool, { schema });

  console.log("Seeding database...");

  // Create demo users
  const passwordHash = await bcrypt.hash("demo123!", 12);

  const [demoUser] = await db
    .insert(schema.users)
    .values({
      email: "demo@greencard.ai",
      fullName: "Demo User",
      passwordHash,
      role: "client",
      emailVerified: true,
      onboardingCompleted: true,
      locale: "en",
    })
    .onConflictDoNothing({ target: schema.users.email })
    .returning();

  const [attorneyUser] = await db
    .insert(schema.users)
    .values({
      email: "attorney@greencard.ai",
      fullName: "Sarah Chen, Esq.",
      passwordHash,
      role: "attorney",
      emailVerified: true,
      onboardingCompleted: true,
    })
    .onConflictDoNothing({ target: schema.users.email })
    .returning();

  const [adminUser] = await db
    .insert(schema.users)
    .values({
      email: "admin@greencard.ai",
      fullName: "Admin User",
      passwordHash,
      role: "admin",
      emailVerified: true,
      onboardingCompleted: true,
    })
    .onConflictDoNothing({ target: schema.users.email })
    .returning();

  console.log("Created users:", { demoUser: demoUser?.id, attorneyUser: attorneyUser?.id, adminUser: adminUser?.id });

  if (!demoUser || !attorneyUser) {
    console.log("Users already exist (seeded previously). Skipping rest.");
    await pool.end();
    return;
  }

  // Create user profile
  await db.insert(schema.userProfiles).values({
    userId: demoUser.id,
    countryOfBirth: "India",
    nationality: "Indian",
    currentStatus: "H-1B",
    gender: "Male",
    maritalStatus: "Married",
  });

  // Create attorney profile
  await db.insert(schema.attorneyProfiles).values({
    userId: attorneyUser.id,
    barNumber: "CA-123456",
    barState: "CA",
    firmName: "Chen Immigration Law",
    specialties: ["EB-1A", "EB-2 NIW", "Family-Based", "H-1B"],
    languages: ["English", "Mandarin", "Spanish"],
    bio: "15+ years experience in employment and family-based immigration. Former USCIS adjudicator.",
    hourlyRate: "350.00",
    verified: true,
    rating: "4.90",
    reviewCount: 127,
    totalCases: 2340,
  });

  // Create sample cases
  const [case1] = await db
    .insert(schema.cases)
    .values({
      userId: demoUser.id,
      attorneyId: attorneyUser.id,
      caseType: "EB-2 NIW",
      category: "employment",
      status: "processing",
      receiptNumber: "LIN2401234567",
      serviceCenter: "Lincoln, Nebraska",
      score: "78.50",
    })
    .returning();

  const [case2] = await db
    .insert(schema.cases)
    .values({
      userId: demoUser.id,
      caseType: "I-130 Spouse",
      category: "family",
      status: "draft",
    })
    .returning();

  console.log("Created cases:", { case1: case1.id, case2: case2.id });

  // Add case events
  await db.insert(schema.caseEvents).values([
    {
      caseId: case1.id,
      eventType: "filed",
      eventDate: new Date("2024-01-15"),
      description: "Petition submitted to USCIS",
    },
    {
      caseId: case1.id,
      eventType: "receipt",
      eventDate: new Date("2024-01-22"),
      description: "Receipt notice received (I-797)",
    },
    {
      caseId: case1.id,
      eventType: "biometrics",
      eventDate: new Date("2024-03-10"),
      description: "Biometrics appointment completed",
    },
  ]);

  // Add case documents
  await db.insert(schema.caseDocuments).values([
    {
      caseId: case1.id,
      documentType: "Birth Certificate",
      fileName: "birth_certificate.pdf",
      fileUrl: "/uploads/birth_certificate.pdf",
      fileSize: 245000,
      mimeType: "application/pdf",
      status: "extracted",
    },
    {
      caseId: case1.id,
      documentType: "Passport",
      fileName: "passport_scan.pdf",
      fileUrl: "/uploads/passport_scan.pdf",
      fileSize: 1200000,
      mimeType: "application/pdf",
      status: "extracted",
    },
  ]);

  // Add a case form (I-485 draft)
  await db.insert(schema.caseForms).values({
    caseId: case1.id,
    formNumber: "I-485",
    status: "draft",
    formData: {
      i485_name_first: "Demo",
      i485_name_last: "User",
      i485_country_of_birth: "India",
      i485_country_of_citizenship: "India",
      i485_application_type: "employment",
    },
  });

  // Add deadlines
  await db.insert(schema.caseDeadlines).values([
    {
      caseId: case1.id,
      deadlineType: "RFE Response",
      deadlineDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      description: "Respond to Request for Evidence",
      reminderSent: false,
      completed: false,
    },
  ]);

  // Create a subscription
  await db.insert(schema.subscriptions).values({
    userId: demoUser.id,
    plan: "professional",
    status: "active",
    currentPeriodStart: new Date(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  console.log("Seed complete! Demo credentials:");
  console.log("  Client:   demo@greencard.ai / demo123!");
  console.log("  Attorney: attorney@greencard.ai / demo123!");
  console.log("  Admin:    admin@greencard.ai / demo123!");

  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
