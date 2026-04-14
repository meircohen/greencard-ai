import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

const {
  users,
  userProfiles,
  attorneyProfiles,
  cases,
  caseEvents,
  caseDocuments,
  caseForms,
  caseDeadlines,
  conversations,
  messages,
  assessments,
  attorneyLeads,
  attorneyReviews,
  subscriptions,
} = schema;

const db = (() => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return drizzle(pool, { schema });
})();

const seed = async () => {
  console.log('Starting database seed...');

  try {
    // ========================================================================
    // CLEANUP
    // ========================================================================
    console.log('Cleaning up existing data...');
    // Delete in reverse dependency order
    const tableOrder = [
      'messages',
      'conversations',
      'assessments',
      'attorney_reviews',
      'attorney_leads',
      'payments',
      'subscriptions',
      'case_notes',
      'case_deadlines',
      'case_forms',
      'case_documents',
      'case_events',
      'cases',
      'attorney_profiles',
      'user_profiles',
      'users',
    ];

    for (const table of tableOrder) {
      try {
        // Use raw SQL to truncate
        await (db as any).execute(`TRUNCATE TABLE ${table} CASCADE;`);
        console.log(`  ✓ Truncated ${table}`);
      } catch (error) {
        // Table might not exist, skip
      }
    }

    // ========================================================================
    // USERS & PROFILES
    // ========================================================================
    console.log('Seeding users and profiles...');

    // Client 1
    const client1Id = '550e8400-e29b-41d4-a716-446655440000';
    await db.insert(users).values({
      id: client1Id,
      email: 'client1@example.com',
      phone: '+1-555-0101',
      fullName: 'Maria Garcia',
      role: 'client',
      emailVerified: true,
      onboardingCompleted: true,
      locale: 'en',
      timezone: 'America/Los_Angeles',
    });

    await db.insert(userProfiles).values({
      userId: client1Id,
      countryOfBirth: 'Mexico',
      nationality: 'Mexican',
      currentStatus: 'Visa holder',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'Female',
      maritalStatus: 'Married',
      address: {
        street: '123 Maple Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'United States',
      },
      aNumber: 'A123456789',
    });

    // Client 2
    const client2Id = '550e8400-e29b-41d4-a716-446655440001';
    await db.insert(users).values({
      id: client2Id,
      email: 'client2@example.com',
      phone: '+1-555-0102',
      fullName: 'Rajesh Patel',
      role: 'client',
      emailVerified: true,
      onboardingCompleted: true,
      locale: 'en',
      timezone: 'America/New_York',
    });

    await db.insert(userProfiles).values({
      userId: client2Id,
      countryOfBirth: 'India',
      nationality: 'Indian',
      currentStatus: 'H-1B visa holder',
      dateOfBirth: new Date('1988-07-22'),
      gender: 'Male',
      maritalStatus: 'Single',
      address: {
        street: '456 Oak Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
      },
      aNumber: 'A987654321',
    });

    // Client 3
    const client3Id = '550e8400-e29b-41d4-a716-446655440002';
    await db.insert(users).values({
      id: client3Id,
      email: 'client3@example.com',
      phone: '+1-555-0103',
      fullName: 'Sophia Zhang',
      role: 'client',
      emailVerified: true,
      onboardingCompleted: false,
      locale: 'en',
      timezone: 'America/Chicago',
    });

    await db.insert(userProfiles).values({
      userId: client3Id,
      countryOfBirth: 'China',
      nationality: 'Chinese',
      currentStatus: 'Student',
      dateOfBirth: new Date('1995-11-08'),
      gender: 'Female',
      maritalStatus: 'Single',
      address: {
        street: '789 Elm Road',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States',
      },
      aNumber: 'A555444333',
    });

    // Attorney 1
    const attorney1Id = '550e8400-e29b-41d4-a716-446655440010';
    await db.insert(users).values({
      id: attorney1Id,
      email: 'attorney1@example.com',
      phone: '+1-555-1001',
      fullName: 'James Mitchell',
      role: 'attorney',
      emailVerified: true,
      onboardingCompleted: true,
      locale: 'en',
      timezone: 'America/Los_Angeles',
    });

    await db.insert(attorneyProfiles).values({
      userId: attorney1Id,
      barNumber: 'CA123456',
      barState: 'CA',
      firmName: 'Mitchell Immigration Law',
      specialties: ['Family-Based Immigration', 'I-130', 'I-485'],
      languages: ['English', 'Spanish'],
      bio: 'Experienced immigration attorney with 15+ years in family-based cases.',
      hourlyRate: '250.00',
      verified: true,
      rating: '4.85',
      reviewCount: 42,
      totalCases: 156,
    });

    // Attorney 2
    const attorney2Id = '550e8400-e29b-41d4-a716-446655440011';
    await db.insert(users).values({
      id: attorney2Id,
      email: 'attorney2@example.com',
      phone: '+1-555-1002',
      fullName: 'Patricia Chen',
      role: 'attorney',
      emailVerified: true,
      onboardingCompleted: true,
      locale: 'en',
      timezone: 'America/New_York',
    });

    await db.insert(attorneyProfiles).values({
      userId: attorney2Id,
      barNumber: 'NY789012',
      barState: 'NY',
      firmName: 'Chen & Associates Immigration',
      specialties: ['Employment-Based Immigration', 'EB-2', 'EB-3', 'PERM'],
      languages: ['English', 'Mandarin', 'Cantonese'],
      bio: 'Specialist in employment-based green card applications and PERM labor certification.',
      hourlyRate: '300.00',
      verified: true,
      rating: '4.92',
      reviewCount: 68,
      totalCases: 234,
    });

    // Admin
    const adminId = '550e8400-e29b-41d4-a716-446655440020';
    await db.insert(users).values({
      id: adminId,
      email: 'admin@example.com',
      phone: '+1-555-2001',
      fullName: 'Admin User',
      role: 'admin',
      emailVerified: true,
      onboardingCompleted: true,
      locale: 'en',
      timezone: 'America/Los_Angeles',
    });

    console.log('✓ Created 5 users (3 clients, 2 attorneys, 1 admin)');

    // ========================================================================
    // CASES
    // ========================================================================
    console.log('Seeding cases...');

    // Case 1: Family-based (I-130 spouse)
    const case1Id = '650e8400-e29b-41d4-a716-446655440000';
    await db.insert(cases).values({
      id: case1Id,
      userId: client1Id,
      attorneyId: attorney1Id,
      caseType: 'I-130 Petition for Spouse',
      category: 'Family-Based',
      status: 'processing',
      priorityDate: new Date('2024-01-15'),
      receiptNumber: 'WAC2490012345',
      serviceCenter: 'NBC (Nebraska Service Center)',
      score: '92.50',
      assessment: {
        strengthScore: 92.5,
        riskFactors: ['age difference'],
        recommendations: ['Prepare additional evidence of relationship'],
      },
    });

    // Case 2: Employment-based (I-485 AOS)
    const case2Id = '650e8400-e29b-41d4-a716-446655440001';
    await db.insert(cases).values({
      id: case2Id,
      userId: client2Id,
      attorneyId: attorney2Id,
      caseType: 'I-485 Application to Register Permanent Residence or Adjust Status',
      category: 'Employment-Based',
      status: 'submitted',
      priorityDate: new Date('2023-06-20'),
      receiptNumber: 'EAC2490045678',
      serviceCenter: 'TSC (Texas Service Center)',
      score: '88.75',
      assessment: {
        strengthScore: 88.75,
        riskFactors: [],
        recommendations: ['Maintain current employment', 'Monitor visa bulletin'],
      },
    });

    // Case 3: Employment authorization (I-765 EAD)
    const case3Id = '650e8400-e29b-41d4-a716-446655440002';
    await db.insert(cases).values({
      id: case3Id,
      userId: client3Id,
      attorneyId: null,
      caseType: 'I-765 Application for Employment Authorization',
      category: 'Employment Authorization',
      status: 'draft',
      priorityDate: null,
      receiptNumber: null,
      serviceCenter: null,
      score: null,
      assessment: null,
    });

    // Case 4: Naturalization (N-400)
    const case4Id = '650e8400-e29b-41d4-a716-446655440003';
    await db.insert(cases).values({
      id: case4Id,
      userId: client1Id,
      attorneyId: attorney1Id,
      caseType: 'N-400 Application for Naturalization',
      category: 'Citizenship',
      status: 'approved',
      priorityDate: new Date('2023-09-10'),
      receiptNumber: 'WAC2390078901',
      serviceCenter: 'NBC (Nebraska Service Center)',
      score: '95.00',
      assessment: {
        strengthScore: 95.0,
        riskFactors: [],
        recommendations: ['Approved for oath ceremony'],
      },
    });

    console.log('✓ Created 4 cases (different types and statuses)');

    // ========================================================================
    // CASE EVENTS
    // ========================================================================
    console.log('Seeding case events...');

    const caseEvents1 = [
      {
        caseId: case1Id,
        eventType: 'Filed',
        eventDate: new Date('2024-01-15'),
        description: 'Petition filed with USCIS',
        metadata: { notes: 'Original filed by mail' },
      },
      {
        caseId: case1Id,
        eventType: 'Receipt',
        eventDate: new Date('2024-01-25'),
        description: 'Receipt notice received (WAC2490012345)',
        metadata: { receiptNumber: 'WAC2490012345' },
      },
      {
        caseId: case1Id,
        eventType: 'Biometrics',
        eventDate: new Date('2024-03-10'),
        description: 'Biometrics appointment completed',
        metadata: { location: 'Los Angeles ASC' },
      },
      {
        caseId: case1Id,
        eventType: 'Interview',
        eventDate: new Date('2024-04-20'),
        description: 'USCIS interview scheduled',
        metadata: { location: 'NBC Field Office' },
      },
    ];

    const caseEvents2 = [
      {
        caseId: case2Id,
        eventType: 'Filed',
        eventDate: new Date('2024-02-01'),
        description: 'I-485 application submitted',
        metadata: { combined: true },
      },
      {
        caseId: case2Id,
        eventType: 'Receipt',
        eventDate: new Date('2024-02-15'),
        description: 'Receipt notice received',
        metadata: { receiptNumber: 'EAC2490045678' },
      },
      {
        caseId: case2Id,
        eventType: 'RFE',
        eventDate: new Date('2024-03-25'),
        description: 'Request for Evidence issued - salary verification needed',
        metadata: { dueDate: '2024-04-24' },
      },
    ];

    const caseEvents3 = [
      {
        caseId: case4Id,
        eventType: 'Filed',
        eventDate: new Date('2023-09-10'),
        description: 'N-400 application filed',
        metadata: {},
      },
      {
        caseId: case4Id,
        eventType: 'Approved',
        eventDate: new Date('2024-02-28'),
        description: 'Application approved',
        metadata: { oathCeremonyDate: '2024-04-15' },
      },
    ];

    await db.insert(caseEvents).values([
      ...caseEvents1.map((e) => ({ id: Math.random().toString(), ...e } as any)),
      ...caseEvents2.map((e) => ({ id: Math.random().toString(), ...e } as any)),
      ...caseEvents3.map((e) => ({ id: Math.random().toString(), ...e } as any)),
    ]);

    console.log('✓ Created 10+ case events');

    // ========================================================================
    // CASE DOCUMENTS
    // ========================================================================
    console.log('Seeding case documents...');

    const caseDocumentsData = [
      {
        caseId: case1Id,
        documentType: 'Passport',
        fileName: 'maria_garcia_passport.pdf',
        fileUrl: 'https://storage.example.com/maria_garcia_passport.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        status: 'extracted' as const,
        ocrText: 'PASSPORT MARIA GARCIA...',
        aiExtractedData: {
          name: 'Maria Garcia',
          passportNumber: 'A12345678',
          dateOfBirth: '1985-03-15',
          expirationDate: '2035-03-14',
        },
      },
      {
        caseId: case1Id,
        documentType: 'Birth Certificate',
        fileName: 'maria_birth_certificate.pdf',
        fileUrl: 'https://storage.example.com/maria_birth_certificate.pdf',
        fileSize: 1048576,
        mimeType: 'application/pdf',
        status: 'extracted' as const,
        ocrText: 'BIRTH CERTIFICATE...',
        aiExtractedData: {
          name: 'Maria Garcia',
          dateOfBirth: '1985-03-15',
          birthPlace: 'Mexico City, Mexico',
        },
      },
      {
        caseId: case1Id,
        documentType: 'Marriage Certificate',
        fileName: 'marriage_certificate.pdf',
        fileUrl: 'https://storage.example.com/marriage_certificate.pdf',
        fileSize: 1024000,
        mimeType: 'application/pdf',
        status: 'extracted' as const,
      },
      {
        caseId: case1Id,
        documentType: 'Photos',
        fileName: 'couple_photos.zip',
        fileUrl: 'https://storage.example.com/couple_photos.zip',
        fileSize: 5242880,
        mimeType: 'application/zip',
        status: 'uploaded' as const,
      },
      {
        caseId: case2Id,
        documentType: 'I-140',
        fileName: 'i140_form.pdf',
        fileUrl: 'https://storage.example.com/i140_form.pdf',
        fileSize: 2097152,
        mimeType: 'application/pdf',
        status: 'extracted' as const,
      },
      {
        caseId: case2Id,
        documentType: 'Labor Certification',
        fileName: 'edt_perm.pdf',
        fileUrl: 'https://storage.example.com/edt_perm.pdf',
        fileSize: 3145728,
        mimeType: 'application/pdf',
        status: 'extracted' as const,
      },
      {
        caseId: case4Id,
        documentType: 'Tax Returns',
        fileName: 'tax_returns_2023.pdf',
        fileUrl: 'https://storage.example.com/tax_returns_2023.pdf',
        fileSize: 4194304,
        mimeType: 'application/pdf',
        status: 'extracted' as const,
      },
      {
        caseId: case4Id,
        documentType: 'Medical Exam',
        fileName: 'i693_medical_exam.pdf',
        fileUrl: 'https://storage.example.com/i693_medical_exam.pdf',
        fileSize: 2548576,
        mimeType: 'application/pdf',
        status: 'extracted' as const,
      },
    ];

    await db.insert(caseDocuments).values(
      caseDocumentsData.map((doc) => ({ id: Math.random().toString(), ...doc } as any))
    );

    console.log('✓ Created 8 case documents');

    // ========================================================================
    // CASE FORMS
    // ========================================================================
    console.log('Seeding case forms...');

    const caseFormsData = [
      {
        caseId: case1Id,
        formNumber: 'I-130',
        status: 'submitted' as const,
        formData: {
          petitionerName: 'Spouse Name',
          beneficiaryName: 'Maria Garcia',
          relationshipType: 'Spouse',
          dateOfMarriage: '2020-06-15',
        },
        aiSuggestions: {
          completeness: 95,
          issues: [],
          recommendations: ['Add photos of couple'],
        },
        filedDate: new Date('2024-01-15'),
        receiptNumber: 'WAC2490012345',
      },
      {
        caseId: case2Id,
        formNumber: 'I-485',
        status: 'filled' as const,
        formData: {
          applicantName: 'Rajesh Patel',
          dateOfBirth: '1988-07-22',
          countryOfBirth: 'India',
          currentStatus: 'H-1B',
          employerName: 'Tech Company Inc.',
        },
        validationErrors: null,
        aiSuggestions: null,
      },
      {
        caseId: case3Id,
        formNumber: 'I-765',
        status: 'draft' as const,
        formData: {
          applicantName: 'Sophia Zhang',
          category: 'Family-based adjustment applicant',
        },
        aiSuggestions: null,
        validationErrors: {
          missingFields: ['date_of_last_entry', 'employment_details'],
        },
      },
      {
        caseId: case4Id,
        formNumber: 'N-400',
        status: 'approved' as const,
        formData: {
          applicantName: 'Maria Garcia',
          dateOfBirth: '1985-03-15',
          lawfulPermanentResidentSince: '2019-01-10',
          physicalPresence: 5,
          absencesDays: 45,
        },
        filedDate: new Date('2023-09-10'),
        receiptNumber: 'WAC2390078901',
      },
    ];

    await db.insert(caseForms).values(
      caseFormsData.map((form) => ({ id: Math.random().toString(), ...form } as any))
    );

    console.log('✓ Created 4 case forms');

    // ========================================================================
    // CASE DEADLINES
    // ========================================================================
    console.log('Seeding case deadlines...');

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    const deadlinesData = [
      {
        caseId: case1Id,
        deadlineType: 'Interview Preparation',
        deadlineDate: new Date('2024-04-15'),
        description: 'Complete preparation before interview on April 20',
        completed: false,
      },
      {
        caseId: case1Id,
        deadlineType: 'Document Submission',
        deadlineDate: new Date('2024-05-01'),
        description: 'Submit additional documents if requested',
        completed: false,
      },
      {
        caseId: case2Id,
        deadlineType: 'RFE Response',
        deadlineDate: new Date('2024-04-24'),
        description: 'Submit salary verification and employment letter',
        completed: false,
        reminderSent: true,
      },
      {
        caseId: case2Id,
        deadlineType: 'Medical Exam',
        deadlineDate: futureDate,
        description: 'Complete I-693 medical examination',
        completed: false,
      },
      {
        caseId: case3Id,
        deadlineType: 'Application Submission',
        deadlineDate: futureDate,
        description: 'File I-765 application with supporting documents',
        completed: false,
      },
      {
        caseId: case4Id,
        deadlineType: 'Oath Ceremony',
        deadlineDate: new Date('2024-04-15'),
        description: 'Attend naturalization oath ceremony',
        completed: true,
        reminderSent: true,
      },
    ];

    await db.insert(caseDeadlines).values(
      deadlinesData.map((deadline) => ({ id: Math.random().toString(), ...deadline } as any))
    );

    console.log('✓ Created 6 case deadlines');

    // ========================================================================
    // CONVERSATIONS & MESSAGES
    // ========================================================================
    console.log('Seeding conversations and messages...');

    // Conversation 1
    const conv1Id = '750e8400-e29b-41d4-a716-446655440000';
    await db.insert(conversations).values({
      id: conv1Id,
      userId: client1Id,
      caseId: case1Id,
      type: 'case_review',
      modelUsed: 'claude-3-5-sonnet',
      totalTokens: 3500,
      messagesCount: 6,
    });

    const conv1Messages = [
      {
        conversationId: conv1Id,
        role: 'user' as const,
        content: 'What documents do I need for my I-130 petition?',
        tokensUsed: 25,
        model: 'claude-3-5-sonnet',
        latencyMs: 1200,
      },
      {
        conversationId: conv1Id,
        role: 'assistant' as const,
        content:
          'For your I-130 petition, you will need: 1) Completed I-130 form, 2) Valid passport, 3) Birth certificate, 4) Marriage certificate, 5) Photos, 6) Police clearance certificate.',
        tokensUsed: 85,
        model: 'claude-3-5-sonnet',
        latencyMs: 1500,
      },
      {
        conversationId: conv1Id,
        role: 'user' as const,
        content: 'Do I need to translate my Mexican documents?',
        tokensUsed: 20,
        model: 'claude-3-5-sonnet',
        latencyMs: 1100,
      },
      {
        conversationId: conv1Id,
        role: 'assistant' as const,
        content:
          'Yes, all documents issued in Mexico must be accompanied by certified English translations. Use a USCIS-recognized translator for best results.',
        tokensUsed: 65,
        model: 'claude-3-5-sonnet',
        latencyMs: 1300,
      },
      {
        conversationId: conv1Id,
        role: 'user' as const,
        content: 'When should I expect a response from USCIS?',
        tokensUsed: 18,
        model: 'claude-3-5-sonnet',
        latencyMs: 950,
      },
      {
        conversationId: conv1Id,
        role: 'assistant' as const,
        content:
          'Processing times vary by service center. NBC typically processes I-130 petitions in 6-12 months. You can track your case using your receipt number WAC2490012345.',
        tokensUsed: 75,
        model: 'claude-3-5-sonnet',
        latencyMs: 1400,
      },
    ];

    await db.insert(messages).values(
      conv1Messages.map((msg) => ({ id: Math.random().toString(), ...msg } as any))
    );

    // Conversation 2
    const conv2Id = '750e8400-e29b-41d4-a716-446655440001';
    await db.insert(conversations).values({
      id: conv2Id,
      userId: client2Id,
      caseId: case2Id,
      type: 'assessment',
      modelUsed: 'claude-3-5-sonnet',
      totalTokens: 2800,
      messagesCount: 5,
    });

    const conv2Messages = [
      {
        conversationId: conv2Id,
        role: 'user' as const,
        content: 'What should I do about the RFE I received?',
        tokensUsed: 22,
        model: 'claude-3-5-sonnet',
        latencyMs: 1100,
      },
      {
        conversationId: conv2Id,
        role: 'assistant' as const,
        content:
          'You have 87 days from the date of the RFE to respond. You need to provide: 1) Current salary verification letter, 2) Recent pay stubs, 3) Employer letter confirming employment and duties.',
        tokensUsed: 72,
        model: 'claude-3-5-sonnet',
        latencyMs: 1350,
      },
      {
        conversationId: conv2Id,
        role: 'user' as const,
        content: 'My company is going through restructuring. Will this affect my case?',
        tokensUsed: 28,
        model: 'claude-3-5-sonnet',
        latencyMs: 1200,
      },
      {
        conversationId: conv2Id,
        role: 'assistant' as const,
        content:
          'Restructuring can impact your case. Document that your position and duties remain unchanged. Keep records of internal communications and your offer letter. Notify your attorney immediately.',
        tokensUsed: 68,
        model: 'claude-3-5-sonnet',
        latencyMs: 1400,
      },
      {
        conversationId: conv2Id,
        role: 'user' as const,
        content: 'Should I start looking for alternative employment?',
        tokensUsed: 20,
        model: 'claude-3-5-sonnet',
        latencyMs: 1050,
      },
    ];

    await db.insert(messages).values(
      conv2Messages.map((msg) => ({ id: Math.random().toString(), ...msg } as any))
    );

    // Conversation 3
    const conv3Id = '750e8400-e29b-41d4-a716-446655440002';
    await db.insert(conversations).values({
      id: conv3Id,
      userId: client3Id,
      caseId: null,
      type: 'general',
      modelUsed: 'claude-3-5-sonnet',
      totalTokens: 2100,
      messagesCount: 4,
    });

    const conv3Messages = [
      {
        conversationId: conv3Id,
        role: 'user' as const,
        content: 'I am a student, what are my green card options?',
        tokensUsed: 24,
        model: 'claude-3-5-sonnet',
        latencyMs: 1180,
      },
      {
        conversationId: conv3Id,
        role: 'assistant' as const,
        content:
          'As an international student, your main options include: 1) Employment-based (EB-3 skilled worker), 2) Family-based sponsorship, 3) Diversity visa lottery, 4) Marriage to US citizen/permanent resident.',
        tokensUsed: 85,
        model: 'claude-3-5-sonnet',
        latencyMs: 1420,
      },
      {
        conversationId: conv3Id,
        role: 'user' as const,
        content: 'Which option is fastest?',
        tokensUsed: 15,
        model: 'claude-3-5-sonnet',
        latencyMs: 980,
      },
      {
        conversationId: conv3Id,
        role: 'assistant' as const,
        content:
          'Marriage to a US citizen (immediate relative) is typically the fastest path, followed by sponsorship by a US employer through employment-based green card.',
        tokensUsed: 62,
        model: 'claude-3-5-sonnet',
        latencyMs: 1300,
      },
    ];

    await db.insert(messages).values(
      conv3Messages.map((msg) => ({ id: Math.random().toString(), ...msg } as any))
    );

    console.log('✓ Created 3 conversations with 13 messages');

    // ========================================================================
    // ASSESSMENTS
    // ========================================================================
    console.log('Seeding assessments...');

    const assessmentsData = [
      {
        userId: client1Id,
        caseId: case1Id,
        conversationId: conv1Id,
        score: '92.50',
        category: 'Family-Based Immigration',
        eligiblePaths: [
          {
            path: 'I-130 Spousal Petition',
            probability: 95,
            estimatedTimeline: '12-18 months',
          },
          {
            path: 'Direct Consular Filing',
            probability: 85,
            estimatedTimeline: '8-12 months',
          },
        ],
        dataPoints: {
          relationshipProof: 'Strong',
          financialSupport: 'Excellent',
          background: 'Clear',
          healthStatus: 'Good',
          english: 'Basic',
        },
      },
      {
        userId: client2Id,
        caseId: case2Id,
        conversationId: conv2Id,
        score: '88.75',
        category: 'Employment-Based Immigration',
        eligiblePaths: [
          {
            path: 'EB-3 Skilled Worker',
            probability: 92,
            estimatedTimeline: '2-4 years',
          },
          {
            path: 'EB-2 PERM Labor Certification',
            probability: 78,
            estimatedTimeline: '3-5 years',
          },
        ],
        dataPoints: {
          education: 'Master Degree',
          experience: '8+ years',
          jobOffer: 'Confirmed',
          laborCert: 'Pending',
          prevImmigration: 'H-1B history',
        },
      },
    ];

    await db.insert(assessments).values(
      assessmentsData.map((assessment) => ({
        id: Math.random().toString(),
        ...assessment,
      } as any))
    );

    console.log('✓ Created 2 assessments');

    // ========================================================================
    // ATTORNEY LEADS
    // ========================================================================
    console.log('Seeding attorney leads...');

    const leadsData = [
      {
        userId: client1Id,
        attorneyId: attorney1Id,
        caseType: 'I-130',
        status: 'closed_won' as const,
        leadFee: '500.00',
        paid: true,
        stripePaymentId: 'pi_test_001',
      },
      {
        userId: client2Id,
        attorneyId: attorney2Id,
        caseType: 'I-485',
        status: 'interested' as const,
        leadFee: '750.00',
        paid: false,
      },
      {
        userId: client3Id,
        attorneyId: attorney1Id,
        caseType: 'I-765',
        status: 'new' as const,
        leadFee: '300.00',
        paid: false,
      },
    ];

    await db.insert(attorneyLeads).values(
      leadsData.map((lead) => ({ id: Math.random().toString(), ...lead } as any))
    );

    console.log('✓ Created 3 attorney leads');

    // ========================================================================
    // ATTORNEY REVIEWS
    // ========================================================================
    console.log('Seeding attorney reviews...');

    const reviewsData = [
      {
        userId: client1Id,
        attorneyId: attorney1Id,
        rating: 5,
        reviewText:
          'James was excellent! Very responsive and helped me navigate the entire process smoothly.',
        verified: true,
        published: true,
      },
      {
        userId: client2Id,
        attorneyId: attorney2Id,
        rating: 5,
        reviewText:
          'Patricia is a true expert in employment-based immigration. Highly recommended!',
        verified: true,
        published: true,
      },
      {
        userId: client1Id,
        attorneyId: attorney2Id,
        rating: 4,
        reviewText: 'Great knowledge and professional service, highly recommend.',
        verified: true,
        published: true,
      },
      {
        userId: client2Id,
        attorneyId: attorney1Id,
        rating: 5,
        reviewText: 'Very thorough and caring attorney, got approved quickly!',
        verified: false,
        published: false,
      },
      {
        userId: client3Id,
        attorneyId: attorney1Id,
        rating: 4,
        reviewText: 'Good guidance, though case is still pending.',
        verified: false,
        published: false,
      },
    ];

    await db.insert(attorneyReviews).values(
      reviewsData.map((review) => ({ id: Math.random().toString(), ...review } as any))
    );

    console.log('✓ Created 5 attorney reviews');

    // ========================================================================
    // SUBSCRIPTIONS
    // ========================================================================
    console.log('Seeding subscriptions...');

    const subscriptionsData = [
      {
        userId: client1Id,
        stripeSubscriptionId: 'sub_test_001',
        plan: 'professional' as const,
        status: 'active',
        currentPeriodStart: new Date('2024-03-14'),
        currentPeriodEnd: new Date('2024-04-14'),
      },
      {
        userId: client2Id,
        stripeSubscriptionId: 'sub_test_002',
        plan: 'professional' as const,
        status: 'active',
        currentPeriodStart: new Date('2024-03-01'),
        currentPeriodEnd: new Date('2024-04-01'),
      },
      {
        userId: client3Id,
        plan: 'starter' as const,
        status: 'active',
        currentPeriodStart: new Date('2024-03-20'),
        currentPeriodEnd: new Date('2024-04-20'),
      },
    ];

    await db.insert(subscriptions).values(
      subscriptionsData.map((sub) => ({ id: Math.random().toString(), ...sub } as any))
    );

    console.log('✓ Created 3 subscriptions');

    console.log('\n✓ Database seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
};

seed();
