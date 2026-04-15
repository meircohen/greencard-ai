"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/lib/store";
import { BarChart3, Users, FileText, DollarSign, TrendingUp, AlertCircle, RefreshCw, Mail, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface MetricCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  caseCount: number;
  joinedDate: string;
}

interface ActivityItem {
  id: string;
  action: string;
  userName: string;
  userEmail: string;
  timestamp: string;
}

interface AdminStatsData {
  totalUsers: number;
  totalCases: number;
  totalAttorneys: number;
  mrr: string;
  recentActivity: ActivityItem[];
  recentUsers: AdminUser[];
  casesByStatus: Record<string, number>;
  monthlyGrowth: number;
}


export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is admin on mount
  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "admin") {
      router.push("/");
      return;
    }

    // Fetch admin stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/admin/stats", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/");
            return;
          }
          throw new Error(`Failed to fetch stats: ${response.statusText}`);
        }

        const data: AdminStatsData = await response.json();
        setStats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load admin stats";
        setError(message);
        console.error("Admin stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-red-600">Access Denied</h2>
            <p className="text-red-700 text-sm mt-1">
              You do not have permission to access the admin dashboard. Only administrators can view this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-slate-600">Loading admin dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 p-8 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-red-600">Error Loading Dashboard</h2>
                <p className="text-red-700 text-sm mt-1">
                  {error || "Failed to load admin statistics. Please try refreshing the page."}
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const metrics: MetricCard[] = [
    {
      label: "Monthly Recurring Revenue",
      value: `$${parseFloat(stats.mrr).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      trend: Math.min(stats.monthlyGrowth, 25),
    },
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: <Users className="w-6 h-6 text-blue-600" />,
      trend: Math.min(stats.monthlyGrowth, 25),
    },
    {
      label: "Active Cases",
      value: stats.totalCases.toLocaleString(),
      icon: <FileText className="w-6 h-6 text-amber-600" />,
      trend: Math.min((Object.values(stats.casesByStatus).reduce((a, b) => a + b, 0) / stats.totalCases * 100) || 0, 25),
    },
    {
      label: "Attorney Partners",
      value: stats.totalAttorneys.toLocaleString(),
      icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
      trend: 3,
    },
  ];

  const filteredUsers = stats.recentUsers.filter((u) => {
    const matchesSearch = (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full">
            ADMIN
          </span>
        </div>
        <p className="text-slate-600 text-sm">Platform overview and management</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-slate-600 text-sm">{metric.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{metric.value}</p>
              </div>
              {metric.icon}
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-emerald-600">+{metric.trend}% this month</span>
            </div>
            {/* Simple sparkline representation */}
            <div className="flex gap-1 mt-3">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-1 bg-emerald-50 rounded-full"
                  style={{ opacity: 0.4 + (Math.random() * 0.6) }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Users Section */}
        <div className="lg:col-span-2">
          <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Users</h2>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left text-slate-600">Email</th>
                    <th className="px-4 py-3 text-left text-slate-600">Cases</th>
                    <th className="px-4 py-3 text-left text-slate-600">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium">{user.name || "Unknown"}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{user.email}</td>
                      <td className="px-4 py-3 text-slate-700">{user.caseCount}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{user.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-4">
          {/* Cases Summary */}
          <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Cases by Status</h3>
            <div className="space-y-3">
              {Object.entries(stats.casesByStatus).length > 0 ? (
                Object.entries(stats.casesByStatus).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-b-0">
                    <p className="text-sm font-medium text-slate-700 capitalize">{status}</p>
                    <p className="text-sm font-semibold text-slate-900">{count}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-600">No cases found</p>
              )}
            </div>
          </div>

          {/* System Health */}
          <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">API Latency</p>
                <p className="text-sm font-medium text-emerald-600">45ms</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Error Rate</p>
                <p className="text-sm font-medium text-emerald-600">0.02%</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">AI Tokens Today</p>
                <p className="text-sm font-medium text-blue-600">1.2M</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Storage Used</p>
                <p className="text-sm font-medium text-amber-600">15.3 GB</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 bg-white hover:bg-slate-100 rounded transition-colors">
                <RefreshCw className="w-4 h-4" />
                Refresh Visa Bulletin
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 bg-white hover:bg-slate-100 rounded transition-colors">
                <Mail className="w-4 h-4" />
                Send Newsletter
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 bg-white hover:bg-slate-100 rounded transition-colors">
                <Activity className="w-4 h-4" />
                View Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((item) => {
              const activityTime = new Date(item.timestamp);
              const now = new Date();
              const diffMs = now.getTime() - activityTime.getTime();
              const diffMins = Math.floor(diffMs / 60000);
              const diffHours = Math.floor(diffMs / 3600000);
              const diffDays = Math.floor(diffMs / 86400000);

              let timeStr = "just now";
              if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins}m ago`;
              else if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours}h ago`;
              else if (diffDays > 0) timeStr = `${diffDays}d ago`;

              return (
                <div key={item.id} className="flex gap-4 py-3 border-b border-slate-200 last:border-b-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-600 mt-1">{item.userName} ({item.userEmail})</p>
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0">{timeStr}</p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-slate-600">No recent activity</p>
          )}
        </div>
      </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
