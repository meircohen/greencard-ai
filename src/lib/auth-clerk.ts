/**
 * CLERK AUTH MIGRATION SCAFFOLD
 *
 * This file shows the integration pattern for migrating from custom JWT auth to Clerk.
 * The actual implementation requires Clerk API keys and configuration.
 *
 * MIGRATION STEPS:
 * 1. npm install @clerk/nextjs
 * 2. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to .env.local
 * 3. Wrap app in ClerkProvider in src/app/layout.tsx
 * 4. Replace custom JWT middleware with Clerk's auth() middleware
 * 5. Replace login/signup pages with Clerk's hosted auth
 * 6. Migrate user data from custom users table to Clerk
 *
 * See CLERK_MIGRATION.md for detailed step-by-step instructions.
 */

import { AuthUser, Session } from "./auth";

/**
 * Get current authenticated user from Clerk
 * TODO: Implement with Clerk SDK
 * @returns Current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Implementation pattern (after Clerk setup):
  // import { auth } from "@clerk/nextjs/server";
  // const session = await auth();
  // if (!session?.userId) return null;
  // return {
  //   id: session.userId,
  //   email: session.user?.emailAddresses[0]?.emailAddress || "",
  //   name: session.user?.fullName || "",
  //   role: await getUserRoleFromClerkMetadata(session.userId),
  // };
}

/**
 * Sign in user with Clerk
 * TODO: Implement with Clerk SDK
 * @param email User email
 * @param password User password
 * @returns Session data
 */
export async function signIn(
  email: string,
  password: string
): Promise<Session> {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Implementation pattern (after Clerk setup):
  // import { signIn as clerkSignIn } from "@clerk/nextjs/actions";
  // const result = await clerkSignIn({
  //   identifier: email,
  //   password,
  //   strategy: "password",
  // });
  // if (!result?.createdSessionId) throw new Error("Sign in failed");
  // return getSessionFromClerk(result.createdSessionId);
}

/**
 * Sign out current user
 * TODO: Implement with Clerk SDK
 */
export async function signOut(): Promise<void> {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Implementation pattern (after Clerk setup):
  // import { signOut as clerkSignOut } from "@clerk/nextjs/actions";
  // await clerkSignOut({ redirectUrl: "/" });
}

/**
 * Middleware to protect routes with Clerk auth
 * TODO: Use in middleware.ts instead of custom JWT verification
 * 
 * Usage in middleware.ts:
 * import { auth } from "@clerk/nextjs/server";
 * 
 * export async function middleware(request: NextRequest) {
 *   const session = await auth();
 *   if (!session?.userId) {
 *     return NextResponse.redirect(new URL("/sign-in", request.url));
 *   }
 *   return NextResponse.next();
 * }
 */
export function clerkAuthMiddleware() {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Will be used as:
  // import { auth } from "@clerk/nextjs/server";
  // const session = await auth();
  // if (!session) throw new Error("Unauthorized");
}

/**
 * Migrate user data from custom users table to Clerk
 * TODO: Run after Clerk is set up
 * This function should:
 * 1. Read all users from the custom users table
 * 2. Create corresponding users in Clerk via their Management API
 * 3. Map custom user IDs to Clerk user IDs in the database
 * 4. Preserve user roles and metadata in Clerk's user_metadata
 */
export async function migrateUsersToClerk(): Promise<{
  success: number;
  failed: number;
  errors: Array<{ email: string; error: string }>;
}> {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Implementation pattern:
  // const svix = new Svix(process.env.CLERK_API_KEY);
  // const users = await getAllUsersFromDatabase();
  // for (const user of users) {
  //   try {
  //     const clerkUser = await svix.users.create({
  //       email_address: [user.email],
  //       first_name: user.firstName,
  //       last_name: user.lastName,
  //       password_digest: user.passwordHash, // If supported
  //       public_metadata: { role: user.role },
  //     });
  //     // Store mapping of old ID to new Clerk ID
  //   } catch (error) {
  //     // Handle error
  //   }
  // }
}

/**
 * Get user role from Clerk metadata
 * TODO: Implement with Clerk's user metadata
 */
export async function getUserRoleFromClerkMetadata(
  userId: string
): Promise<"client" | "attorney" | "admin"> {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Implementation pattern:
  // import { users } from "@clerk/nextjs/server";
  // const user = await users.getUser(userId);
  // return user?.publicMetadata?.role || "client";
}

/**
 * Update user role in Clerk metadata
 * TODO: Implement with Clerk's user metadata
 */
export async function updateUserRoleInClerk(
  userId: string,
  role: "client" | "attorney" | "admin"
): Promise<void> {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Implementation pattern:
  // import { clerkClient } from "@clerk/nextjs/server";
  // await clerkClient.users.updateUser(userId, {
  //   publicMetadata: { role },
  // });
}

/**
 * Verify JWT token (for backward compatibility during migration)
 * TODO: Keep this until all clients are migrated to Clerk
 */
export async function verifyClerkToken(token: string): Promise<AuthUser | null> {
  throw new Error(
    "Clerk not configured yet. Please complete the migration steps in CLERK_MIGRATION.md"
  );

  // Implementation pattern:
  // import { verifyToken } from "@clerk/backend";
  // try {
  //   const decoded = await verifyToken(token);
  //   return {
  //     id: decoded.sub,
  //     email: decoded.email,
  //     name: decoded.name,
  //     role: decoded.role,
  //   };
  // } catch {
  //   return null;
  // }
}
