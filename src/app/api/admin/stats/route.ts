import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  users,
  cases,
  payments,
  subscriptions,
  attorneyProfiles,
  auditEvents,
} from "@/lib/db/schema";
import { eq, count, sql, desc, gte, and } from "drizzle-orm";

interface AdminStats {
  totalUsers: number;
  totalCases: number;
  totalAttorneys: number;
  mrr: string;
  recentActivity: Array<{
    id: string;
    action: string;
    userName: string;
    userEmail: string;
    timestamp: string;
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    caseCount: number;
    joinedDate: string;
  }>;
  casesByStatus: Record<string, number>;
  monthlyGrowth: number;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get session and verify admin role
    const session = await getSession(request);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = getDb();

    // Calculate date range for this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get total users count
    const totalUsersResult = await db
      .select({ count: count() })
      .from(users);
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get total cases count
    const totalCasesResult = await db
      .select({ count: count() })
      .from(cases);
    const totalCases = totalCasesResult[0]?.count || 0;

    // Get total attorneys count
    const totalAttorneysResult = await db
      .select({ count: count() })
      .from(attorneyProfiles);
    const totalAttorneys = totalAttorneysResult[0]?.count || 0;

    // Get MRR (sum of completed payments in current month)
    const mrrResult = await db
      .select({
        total: sql<string>`COALESCE(SUM(CAST(amount AS NUMERIC)), 0)`,
      })
      .from(payments)
      .where(
        and(
          eq(payments.status, "completed"),
          gte(payments.createdAt, monthStart)
        )
      );
    const mrr = mrrResult[0]?.total || "0";

    // Get recent activity (last 10 audit events with user info)
    const recentActivityResult = await db
      .select({
        id: auditEvents.id,
        action: auditEvents.action,
        userName: users.fullName,
        userEmail: users.email,
        timestamp: auditEvents.createdAt,
      })
      .from(auditEvents)
      .leftJoin(users, eq(auditEvents.userId, users.id))
      .orderBy(desc(auditEvents.createdAt))
      .limit(10);

    const recentActivity = recentActivityResult.map((item) => ({
      id: item.id,
      action: item.action,
      userName: item.userName || "Unknown",
      userEmail: item.userEmail || "Unknown",
      timestamp: item.timestamp.toISOString(),
    }));

    // Get recent users (last 10 users with case count)
    const recentUsersResult = await db
      .select({
        id: users.id,
        name: users.fullName,
        email: users.email,
        joinedDate: users.createdAt,
        caseCount: count(cases.id),
      })
      .from(users)
      .leftJoin(cases, eq(users.id, cases.userId))
      .orderBy(desc(users.createdAt))
      .limit(10)
      .groupBy(users.id, users.fullName, users.email, users.createdAt);

    const recentUsers = recentUsersResult.map((item) => ({
      id: item.id,
      name: item.name || "Unknown",
      email: item.email,
      caseCount: item.caseCount || 0,
      joinedDate: item.joinedDate.toISOString().split("T")[0],
    }));

    // Get cases by status breakdown
    const casesByStatusResult = await db
      .select({
        status: cases.status,
        count: count(),
      })
      .from(cases)
      .groupBy(cases.status);

    const casesByStatus: Record<string, number> = {};
    casesByStatusResult.forEach((item) => {
      casesByStatus[item.status] = item.count;
    });

    // Get monthly growth (count of users created in last 30 days)
    const monthlyGrowthResult = await db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo));
    const monthlyGrowth = monthlyGrowthResult[0]?.count || 0;

    const stats: AdminStats = {
      totalUsers,
      totalCases,
      totalAttorneys,
      mrr: String(mrr),
      recentActivity,
      recentUsers,
      casesByStatus,
      monthlyGrowth,
    };

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, must-revalidate",
      },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error(`Admin stats error: ${errMsg}`, error);

    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
