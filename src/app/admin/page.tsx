"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuthStore } from "@/lib/store";
import { BarChart3, Users, FileText, DollarSign, TrendingUp, AlertCircle, RefreshCw, Mail, Activity } from "lucide-react";
import { useState } from "react";

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
  plan: string;
  cases: number;
  joined: string;
  status: "active" | "inactive" | "suspended";
}

interface Attorney {
  id: string;
  name: string;
  barNumber: string;
  state: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    plan: "Pro",
    cases: 3,
    joined: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james.w@email.com",
    plan: "Basic",
    cases: 1,
    joined: "2024-03-20",
    status: "active",
  },
  {
    id: "3",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    plan: "Enterprise",
    cases: 12,
    joined: "2023-06-10",
    status: "active",
  },
  {
    id: "4",
    name: "David Kim",
    email: "d.kim@email.com",
    plan: "Pro",
    cases: 5,
    joined: "2024-02-05",
    status: "active",
  },
  {
    id: "5",
    name: "Lisa Johnson",
    email: "lisa.j@email.com",
    plan: "Basic",
    cases: 0,
    joined: "2024-04-01",
    status: "inactive",
  },
  {
    id: "6",
    name: "Ahmed Hassan",
    email: "ahmed.h@email.com",
    plan: "Pro",
    cases: 7,
    joined: "2023-11-30",
    status: "active",
  },
  {
    id: "7",
    name: "Emma Thompson",
    email: "emma.t@email.com",
    plan: "Enterprise",
    cases: 15,
    joined: "2023-05-12",
    status: "active",
  },
  {
    id: "8",
    name: "Michael Brown",
    email: "m.brown@email.com",
    plan: "Basic",
    cases: 2,
    joined: "2024-03-25",
    status: "suspended",
  },
];

const mockAttorneys: Attorney[] = [
  { id: "1", name: "Robert Martinez", barNumber: "CA123456", state: "California" },
  { id: "2", name: "Jessica Lee", barNumber: "NY654321", state: "New York" },
  { id: "3", name: "Thomas Anderson", barNumber: "TX789012", state: "Texas" },
];

const mockActivity: ActivityItem[] = [
  { id: "1", type: "User Signup", description: "New user registered for Pro plan", timestamp: "2 hours ago" },
  { id: "2", type: "Case Filed", description: "User filed I-140 petition", timestamp: "4 hours ago" },
  { id: "3", type: "Payment", description: "Monthly subscription processed", timestamp: "6 hours ago" },
  { id: "4", type: "Attorney Joined", description: "New attorney registered for verification", timestamp: "1 day ago" },
  { id: "5", type: "Case Approved", description: "I-485 application approved", timestamp: "1 day ago" },
  { id: "6", type: "RFE Received", description: "User received RFE notice", timestamp: "2 days ago" },
  { id: "7", type: "Payment", description: "Monthly subscription processed", timestamp: "2 days ago" },
  { id: "8", type: "User Signup", description: "New user registered for Basic plan", timestamp: "3 days ago" },
  { id: "9", type: "Support Ticket", description: "User submitted support request", timestamp: "3 days ago" },
  { id: "10", type: "Data Export", description: "User exported case documents", timestamp: "4 days ago" },
];

export default function AdminPage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "inactive">("all");

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

  const metrics: MetricCard[] = [
    {
      label: "Monthly Recurring Revenue",
      value: "$12,450",
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      trend: 12,
    },
    {
      label: "Total Users",
      value: "2,847",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      trend: 8,
    },
    {
      label: "Active Cases",
      value: "1,203",
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      trend: 15,
    },
    {
      label: "Attorney Partners",
      value: "45",
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      trend: 3,
    },
  ];

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === "all" || u.status === selectedFilter;
    return matchesSearch && matchesFilter;
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

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500/50"
              />
              <div className="flex gap-1 sm:gap-2 overflow-x-auto">
                {["all", "active", "inactive"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedFilter(status as any)}
                    className={`px-2 sm:px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      selectedFilter === status
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-500/40"
                        : "text-slate-600 hover:text-slate-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left text-slate-600">Email</th>
                    <th className="px-4 py-3 text-left text-slate-600">Plan</th>
                    <th className="px-4 py-3 text-left text-slate-600">Cases</th>
                    <th className="px-4 py-3 text-left text-slate-600">Joined</th>
                    <th className="px-4 py-3 text-left text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-100 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-600">
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{user.cases}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{user.joined}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-600"
                              : user.status === "inactive"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-4">
          {/* Attorneys Verification */}
          <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Attorneys Pending Verification</h3>
            <div className="space-y-3">
              {mockAttorneys.map((attorney) => (
                <div key={attorney.id} className="p-3 bg-white border border-slate-200 rounded">
                  <p className="text-sm font-medium text-slate-900">{attorney.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{attorney.barNumber} • {attorney.state}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded hover:bg-emerald-100 transition-colors">
                      Verify
                    </button>
                    <button className="flex-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded hover:bg-red-100 transition-colors">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
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
          {mockActivity.map((item, idx) => (
            <div key={item.id} className="flex gap-4 py-3 border-b border-slate-100 last:border-b-0">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-2" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{item.type}</p>
                <p className="text-xs text-slate-600 mt-1">{item.description}</p>
              </div>
              <p className="text-xs text-slate-400 flex-shrink-0">{item.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
