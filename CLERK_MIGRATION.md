# Clerk Authentication Migration Plan

This document provides a step-by-step plan to migrate from custom JWT authentication to Clerk, the industry-leading authentication platform.

## Why Migrate to Clerk?

Based on security audits, Clerk addresses the following critical concerns:
- **Security**: Professional OAuth2/SAML support, built-in MFA, password management
- **Compliance**: GDPR, HIPAA, SOC 2 Type II certified
- **User Management**: Clerk handles user lifecycle, password resets, email verification
- **Scalability**: Eliminates the need to maintain custom auth infrastructure
- **Developer Experience**: Managed dashboard, webhooks, management APIs

## Current Architecture

The app currently uses:
- Custom JWT tokens stored in `src/lib/auth.ts`
- Database-backed user table with password hashing
- Custom session management in `src/lib/session.ts`
- MFA implemented in `src/lib/mfa.ts`
- Custom email verification in auth endpoints

## Migration Timeline

| Phase | Duration | Effort |
|-------|----------|--------|
| Setup & Configuration | 1 day | Small |
| Implement New Auth | 2-3 days | Medium |
| User Data Migration | 1-2 days | Medium |
| Testing & QA | 2-3 days | Medium |
| Cleanup & Deprecation | 1 day | Small |
| **Total** | **7-10 days** | **Medium-Large** |

## Step-by-Step Migration Plan

### Phase 1: Setup & Configuration (Day 1)

#### 1.1 Create Clerk Account
- Go to https://clerk.com and create an account
- Create a new application
- Choose your deployment environment (development, staging, production)

#### 1.2 Get API Keys
- Navigate to API Keys section in Clerk dashboard
- Copy the following to your `.env.local`:
  ```env
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
  CLERK_SECRET_KEY=your_secret_key
  ```
- Note: These differ from your current `NEXTAUTH_SECRET`

#### 1.3 Install Dependencies
```bash
npm install @clerk/nextjs
```

#### 1.4 Configure Environment Variables
Update `.env.local` with Clerk keys (see 1.2)

### Phase 2: Implement Clerk Auth (Days 2-3)

#### 2.1 Update `src/app/layout.tsx`

Replace the root layout with Clerk's provider:

```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

#### 2.2 Update Middleware (`src/middleware.ts`)

Replace custom JWT verification with Clerk's middleware:

```ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/pricing",
    "/about",
    "/sign-in",
    "/sign-up",
    "/reset-password",
  ],
  
  // Routes that require authentication
  // All other routes will be protected by default
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(/.*)"],
};
```

#### 2.3 Create Sign-In Page (`src/app/sign-in/[[...sign-in]]/page.tsx`)

```tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

#### 2.4 Create Sign-Up Page (`src/app/sign-up/[[...sign-up]]/page.tsx`)

```tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp />
    </div>
  );
}
```

#### 2.5 Update API Auth Endpoints

Replace custom auth endpoints to use Clerk:

**Old approach** (`/api/auth/login/route.ts`):
```ts
// Custom JWT creation and verification
```

**New approach**:
```ts
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // User is authenticated via Clerk
  // Process request...
}
```

#### 2.6 Update API Routes to Use Clerk Auth

Replace all custom auth checks with Clerk's `auth()`:

```ts
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = session.userId;
  const userEmail = session.user?.primaryEmailAddress?.emailAddress;
  
  // Continue with authenticated request
}
```

#### 2.7 Remove Deprecated Auth Code

Files to remove or deprecate:
- `src/lib/auth.ts` (custom JWT implementation)
- `src/lib/session.ts` (custom session management)
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/signup/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/api/auth/reset-password/route.ts`

Keep for reference during transition:
- `src/lib/auth-helpers.ts` (may have utility functions)
- `src/lib/mfa.ts` (Clerk provides MFA, so this can be removed after migration)

### Phase 3: User Data Migration (Days 3-4)

#### 3.1 Map Clerk User IDs to Existing Users

Update your database schema to add Clerk user ID:

```sql
ALTER TABLE users ADD COLUMN clerk_id VARCHAR(255) UNIQUE;
```

#### 3.2 Create Migration Script

`scripts/migrate-to-clerk.ts`:

```ts
import { clerkClient } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

async function migrateUsers() {
  const db = getDb();
  
  // Get all users from database
  const allUsers = await db.select().from(users);
  
  let successful = 0;
  let failed = 0;
  
  for (const user of allUsers) {
    try {
      // Create user in Clerk
      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [user.email],
        firstName: user.fullName?.split(" ")[0] || "User",
        lastName: user.fullName?.split(" ").slice(1).join(" ") || "",
        publicMetadata: {
          role: user.role,
          migratedAt: new Date().toISOString(),
        },
      });
      
      // Update database with Clerk ID
      await db
        .update(users)
        .set({ clerkId: clerkUser.id })
        .where(eq(users.id, user.id));
      
      successful++;
      console.log(`Migrated user: ${user.email}`);
    } catch (error) {
      failed++;
      console.error(`Failed to migrate ${user.email}:`, error);
    }
  }
  
  console.log(`Migration complete: ${successful} successful, ${failed} failed`);
}

migrateUsers().catch(console.error);
```

Run migration:
```bash
npx tsx scripts/migrate-to-clerk.ts
```

#### 3.3 Update User Queries

Update database queries to use `clerk_id`:

```ts
// Old: SELECT * FROM users WHERE id = ?
// New: SELECT * FROM users WHERE clerk_id = ?

import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUserFromDb() {
  const session = await auth();
  if (!session?.userId) return null;
  
  const db = getDb();
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, session.userId))
    .limit(1);
  
  return user;
}
```

### Phase 4: Testing & QA (Days 4-6)

#### 4.1 Test Authentication Flows

- [ ] Sign up with email
- [ ] Sign in with email
- [ ] Password reset
- [ ] Email verification
- [ ] MFA (if enabled)
- [ ] Session persistence
- [ ] Logout

#### 4.2 Test Protected Routes

- [ ] Authenticated endpoints reject unauthenticated requests
- [ ] User data is correctly associated with Clerk ID
- [ ] Role-based access control works
- [ ] User profile endpoints work

#### 4.3 Test Data Integrity

- [ ] All users migrated successfully
- [ ] User data is consistent between Clerk and database
- [ ] No data loss during migration

### Phase 5: Cleanup & Deprecation (Day 7)

#### 5.1 Remove Old Auth Code

```bash
rm src/lib/auth.ts
rm src/lib/session.ts
rm src/lib/mfa.ts
rm src/app/api/auth/
```

#### 5.2 Update TypeScript Interfaces

Replace `AuthUser` interface with Clerk's types:

```ts
// Old: custom AuthUser interface
// New: use Clerk's types from @clerk/nextjs/server

import type { User } from "@clerk/nextjs/server";
```

#### 5.3 Update Documentation

- Update README with Clerk setup instructions
- Update developer guides
- Add Clerk configuration to deployment docs

#### 5.4 Monitor for Issues

- Monitor Clerk dashboard for errors
- Check application logs for auth-related issues
- Verify email delivery (Clerk manages emails)

## Post-Migration Features

After migration, you can take advantage of:

### 1. Built-in MFA
No need for custom MFA implementation:
```tsx
<UserButton 
  appearance={{ elements: { userButtonTrigger: "..." } }}
/>
```

### 2. OAuth Integration
Add social login easily:
- Google
- GitHub
- Microsoft
- Apple
- Facebook
- LinkedIn

### 3. Webhook Events
React to auth events:
```ts
// user.created, user.updated, user.deleted, session.created, etc.
export async function POST(request: Request) {
  const event = await validateWebhook(request);
  
  if (event.type === "user.created") {
    // Create user record in your database
  }
}
```

### 4. User Management API
Programmatically manage users:
```ts
import { clerkClient } from "@clerk/nextjs/server";

// Create user
await clerkClient.users.createUser({ emailAddress: ["user@example.com"] });

// Update user
await clerkClient.users.updateUser(userId, { firstName: "John" });

// Delete user
await clerkClient.users.deleteUser(userId);
```

## Troubleshooting

### Issue: "Clerk not configured"
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set
- Restart dev server after adding env variables

### Issue: Users not migrating
- Check Clerk API is accessible
- Verify Clerk credentials are correct
- Check for duplicate email addresses (Clerk requires unique emails)

### Issue: Session not persisting
- Verify `ClerkProvider` wraps the entire app
- Check middleware configuration
- Clear browser cookies and cache

## Rollback Plan

If issues occur:

1. **Revert Environment Variables**: Remove Clerk keys, restore `NEXTAUTH_SECRET`
2. **Revert Code**: Git checkout custom auth files
3. **Database Restore**: Restore from backup before migration
4. **DNS/Deploy**: Rollback deployment to previous version

The rollback can be completed in under 30 minutes with proper backups.

## References

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk API Reference](https://clerk.com/docs/reference/backend-api)
- [Clerk Security](https://clerk.com/docs/security/overview)

## Questions?

For migration support:
- Clerk Support: support@clerk.com
- Clerk Community: https://discord.gg/b5rXCzdzqf
