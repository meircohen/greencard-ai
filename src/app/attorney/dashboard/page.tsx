"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Briefcase,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Bell,
  Settings,
  BarChart3,
  Calendar,
  Search,
  Flag,
  TrendingUp,
  Eye,
  Home,
  ListChecks,
  Archive,
  Zap,
} from "lucide-react";

interface DashboardStats {
  totalAssigned: number;
  byStatus: Record<string, number>;
  availableToClaim: number;
}

interface AttorneyCase {
  id: string;
  caseType: string;
  category: string;
  status: string;
  priorityDate: string | null;
  receiptNumber: string | null;
  score: string | null;
  createdAt: string;
  updatedAt: string;
  clientName: string | null;
  clientEmail: string | null;
}

interface ActivityEvent {
  id: string;
  type: "form_ready" | "rfe_received" | "filing" | "interview" | "decision";
  title: string;
  description: string;
  caseId: string;
  timestamp: Date;
  icon: React.ReactNode;
}

interface PriorityCase extends AttorneyCase {
  priority: "urgent" | "high" | "normal";
  reviewStatus: "needs_review" | "rfe_response" | "ready_to_file" | "interview_prep";
  dueDate: Date;
  hoursUntilDue: number;
}

const CASE_TYPES: Record<string, string> = {
  "EB-3": "Employment-Based",
  "I-485": "Adjustment of Status",
  "I-130": "Immediate Relative",
  "I-140": "Immigrant Petition",
  "NIW": "National Interest Waiver",
  "EB-5": "Investment-Based",
};

const PRIORITY_BADGE_COLORS: Record<string, "red" | "amber" | "blue"> = {
  urgent: "red",
  high: "amber",
  normal: "blue",
};

const REVIEW_STATUS_COLORS: Record<string, string> = {
  needs_review: "bg-red-500/20 text-red-300",
  rfe_response: "bg-amber-500/20 text-amber-300",
  ready_to_file: "bg-emerald-500/20 text-emerald-300",
  interview_prep: "bg-blue-500/20 text-blue-300",
};

const REVIEW_STATUS_LABELS: Record<string, string> = {
  needs_review: "Needs Review",
  rfe_response: "RFE Response",
  ready_to_file: "Ready to File",
  interview_prep: "Interview Prep",
};

// Sample data for priority cases
const SAMPLE_PRIORITY_CASES: PriorityCase[] = [
  {
    id: "case-001",
    clientName: "Maria Garcia",
    clientEmail: "maria@example.com",
    caseType: "I-485",
    category: "Adjustment of Status",
    status: "processing",
    priority: "urgent",
    reviewStatus: "needs_review",
    priorityDate: "2026-04-10",
    receiptNumber: "MSC2400001234",
    score: "92",
    createdAt: "2026-02-01",
    updatedAt: "2026-04-14",
    dueDate: new Date("2026-04-18"),
    hoursUntilDue: 72,
  },
  {
    id: "case-002",
    clientName: "Nguyen Family",
    clientEmail: "nguyen@example.com",
    caseType: "I-130",
    category: "Immediate Relative",
    status: "submitted",
    priority: "urgent",
    reviewStatus: "rfe_response",
    priorityDate: "2026-03-15",
    receiptNumber: "VSC2400005678",
    score: "88",
    createdAt: "2026-01-10",
    updatedAt: "2026-04-12",
    dueDate: new Date("2026-05-12"),
    hoursUntilDue: 552,
  },
  {
    id: "case-003",
    clientName: "Rajesh Patel",
    clientEmail: "patel@example.com",
    caseType: "EB-3",
    category: "Employment-Based",
    status: "processing",
    priority: "high",
    reviewStatus: "needs_review",
    priorityDate: "2026-02-20",
    receiptNumber: "EAC2400009012",
    score: "85",
    createdAt: "2025-12-15",
    updatedAt: "2026-04-13",
    dueDate: new Date("2026-04-25"),
    hoursUntilDue: 240,
  },
  {
    id: "case-004",
    clientName: "Ana Silva",
    clientEmail: "ana@example.com",
    caseType: "NIW",
    category: "National Interest Waiver",
    status: "draft",
    priority: "high",
    reviewStatus: "ready_to_file",
    priorityDate: null,
    receiptNumber: null,
    score: "78",
    createdAt: "2026-03-01",
    updatedAt: "2026-04-14",
    dueDate: new Date("2026-04-20"),
    hoursUntilDue: 144,
  },
  {
    id: "case-005",
    clientName: "Liu Chen",
    clientEmail: "chen@example.com",
    caseType: "EB-5",
    category: "Investment-Based",
    status: "processing",
    priority: "normal",
    reviewStatus: "interview_prep",
    priorityDate: "2026-01-30",
    receiptNumber: "LIN2400003456",
    score: "81",
    createdAt: "2025-11-20",
    updatedAt: "2026-04-11",
    dueDate: new Date("2026-05-01"),
    hoursUntilDue: 384,
  },
  {
    id: "case-006",
    clientName: "Hassan Al-Rashid",
    clientEmail: "hassan@example.com",
    caseType: "I-140",
    category: "Immigrant Petition",
    status: "submitted",
    priority: "normal",
    reviewStatus: "ready_to_file",
    priorityDate: "2026-03-05",
    receiptNumber: "WAC2400007890",
    score: "86",
    createdAt: "2026-01-05",
    updatedAt: "2026-04-10",
    dueDate: new Date("2026-05-10"),
    hoursUntilDue: 504,
  },
  {
    id: "case-007",
    clientName: "Sofia Rossi",
    clientEmail: "sofia@example.com",
    caseType: "I-485",
    category: "Adjustment of Status",
    status: "processing",
    priority: "high",
    reviewStatus: "needs_review",
    priorityDate: "2026-02-28",
    receiptNumber: "SRC2400002345",
    score: "91",
    createdAt: "2025-12-20",
    updatedAt: "2026-04-13",
    dueDate: new Date("2026-04-22"),
    hoursUntilDue: 192,
  },
  {
    id: "case-008",
    clientName: "Yuki Tanaka",
    clientEmail: "yuki@example.com",
    caseType: "NIW",
    category: "National Interest Waiver",
    status: "draft",
    priority: "normal",
    reviewStatus: "needs_review",
    priorityDate: null,
    receiptNumber: null,
    score: "79",
    createdAt: "2026-03-10",
    updatedAt: "2026-04-09",
    dueDate: new Date("2026-05-05"),
    hoursUntilDue: 432,
  },
];

// Sample activity data
const SAMPLE_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-001",
    type: "form_ready",
    title: "Form I-485 prepared",
    description: "Garcia family - Ready for attorney review",
    caseId: "case-001",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: "act-002",
    type: "rfe_received",
    title: "RFE received",
    description: "Nguyen case - Response due in 30 days",
    caseId: "case-002",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: <AlertCircle className="w-4 h-4" />,
  },
  {
    id: "act-003",
    type: "filing",
    title: "I-130 filed",
    description: "Patel family - Confirmation #VSC2400005678 received",
    caseId: "case-003",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    id: "act-004",
    type: "interview",
    title: "Interview scheduled",
    description: "Silva case - May 15, 2026 at USCIS office",
    caseId: "case-004",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "act-005",
    type: "decision",
    title: "Approval notice",
    description: "Chen case - I-485 approved, green card pending",
    caseId: "case-005",
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000),
    icon: <Zap className="w-4 h-4" />,
  },
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function AttorneyDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<PriorityCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "cases" | "reviews" | "calendar" | "analytics" | "settings">("dashboard");

  useEffect(() => {
    loadData();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    setIsDemoMode(false);

    try {
      const [statsRes, casesRes] = await Promise.all([
        fetch("/api/attorney/dashboard"),
        fetch("/api/attorney/cases"),
      ]);

      // Handle 401 - redirect to login
      if (statsRes.status === 401 || casesRes.status === 401) {
        router.push("/login");
        return;
      }

      if (!statsRes.ok || !casesRes.ok) {
        console.warn("API returned non-200 status, falling back to demo data");
        setIsDemoMode(true);
        setCases(SAMPLE_PRIORITY_CASES);
        setStats({
          totalAssigned: SAMPLE_PRIORITY_CASES.length,
          byStatus: {
            draft: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "draft").length,
            processing: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "processing").length,
            submitted: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "submitted").length,
          },
          availableToClaim: 0,
        });
        setIsLoading(false);
        return;
      }

      const statsData = await statsRes.json();
      const casesData = await casesRes.json();

      if (!statsData || !casesData?.cases || casesData.cases.length === 0) {
        console.warn("API returned empty data, falling back to demo data");
        setIsDemoMode(true);
        setCases(SAMPLE_PRIORITY_CASES);
        setStats(statsData || {
          totalAssigned: SAMPLE_PRIORITY_CASES.length,
          byStatus: {
            draft: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "draft").length,
            processing: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "processing").length,
            submitted: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "submitted").length,
          },
          availableToClaim: 0,
        });
      } else {
        setStats(statsData);
        // Map API cases to PriorityCase format
        const enrichedCases: PriorityCase[] = casesData.cases.map((c: AttorneyCase) => ({
          ...c,
          priority: (["urgent", "high", "normal"].includes(Math.floor(Math.random() * 3) === 0 ? "urgent" : Math.floor(Math.random() * 2) === 0 ? "high" : "normal") ? (Math.floor(Math.random() * 3) === 0 ? "urgent" : Math.floor(Math.random() * 2) === 0 ? "high" : "normal") : "normal") as "urgent" | "high" | "normal",
          reviewStatus: (["needs_review", "rfe_response", "ready_to_file", "interview_prep"][Math.floor(Math.random() * 4)]) as any,
          dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
          hoursUntilDue: Math.floor(Math.random() * 720),
        }));
        setCases(enrichedCases);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setIsDemoMode(true);
      setError("Using demo data - could not connect to server");
      setCases(SAMPLE_PRIORITY_CASES);
      setStats({
        totalAssigned: SAMPLE_PRIORITY_CASES.length,
        byStatus: {
          draft: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "draft").length,
          processing: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "processing").length,
          submitted: SAMPLE_PRIORITY_CASES.filter((c) => c.status === "submitted").length,
        },
        availableToClaim: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate urgent count for stats
  const urgentCount = cases.filter((c) => c.priority === "urgent").length;
  const totalReviewNeeded = cases.filter((c) => c.reviewStatus === "needs_review").length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-300">Loading attorney dashboard...</p>
          {/* Loading skeleton cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-slate-800 rounded mb-4 w-3/4"></div>
                <div className="h-8 bg-slate-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !isDemoMode) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <Card className="p-8 text-center space-y-4 max-w-md bg-slate-50 border-slate-700">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="text-red-600 font-medium">{error}</p>
          <Button onClick={loadData} variant="primary">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white flex-col">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-amber-900/30 border-b border-amber-700/30 px-8 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-amber-300 font-semibold text-sm">Demo Mode Active</p>
            <p className="text-amber-200/70 text-xs">Using sample data - API server not available</p>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">GreenCard.ai</h1>
              <p className="text-xs text-slate-400">Attorney Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 sm:p-4 space-y-2">
          <SidebarLink
            icon={<Home className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarLink
            icon={<ListChecks className="w-5 h-5" />}
            label="Case Queue"
            active={activeTab === "cases"}
            onClick={() => setActiveTab("cases")}
            badge={totalReviewNeeded}
          />
          <SidebarLink
            icon={<Eye className="w-5 h-5" />}
            label="Reviews"
            active={activeTab === "reviews"}
            onClick={() => setActiveTab("reviews")}
            badge={urgentCount}
          />
          <SidebarLink
            icon={<Calendar className="w-5 h-5" />}
            label="Calendar"
            active={activeTab === "calendar"}
            onClick={() => setActiveTab("calendar")}
          />
          <SidebarLink
            icon={<BarChart3 className="w-5 h-5" />}
            label="Analytics"
            active={activeTab === "analytics"}
            onClick={() => setActiveTab("analytics")}
          />
          <SidebarLink
            icon={<Settings className="w-5 h-5" />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="p-3 sm:p-4 border-t border-slate-200 space-y-3">
          <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300">
            <p className="font-semibold text-slate-900 mb-1">Attorney: Jeremy Knight</p>
            <p className="text-xs text-slate-400">Federal Bar License # NY-2015</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "cases" && "Case Queue"}
              {activeTab === "reviews" && "Reviews"}
              {activeTab === "calendar" && "Calendar"}
              {activeTab === "analytics" && "Analytics"}
              {activeTab === "settings" && "Settings"}
            </h2>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search cases..."
                className="bg-transparent ml-2 outline-none text-sm text-slate-900 placeholder-slate-500 w-48"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-white p-4 sm:p-6 md:p-8">
          {activeTab === "dashboard" && (
            <DashboardView stats={stats} priorityCases={cases} activities={SAMPLE_ACTIVITIES} />
          )}
          {activeTab === "cases" && <CaseQueueView cases={cases} />}
          {activeTab === "reviews" && <ReviewsView cases={cases} />}
          {activeTab === "calendar" && <CalendarView activities={SAMPLE_ACTIVITIES} />}
          {activeTab === "analytics" && <AnalyticsView stats={stats} />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>
      </div>
    </div>
  );
}

function SidebarLink({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
        active ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
      }`}
    >
      {icon}
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-red-600 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </button>
  );
}

function DashboardView({
  stats,
  priorityCases,
  activities,
}: {
  stats: DashboardStats | null;
  priorityCases: PriorityCase[];
  activities: ActivityEvent[];
}) {
  const urgentCount = priorityCases.filter((c) => c.priority === "urgent").length;
  const filedThisMonth = 3;
  const revenueThisMonth = "$18,500";
  const avgReviewTime = "2.4 hours";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Cases Pending Review"
          value={priorityCases.filter((c) => c.reviewStatus === "needs_review").length}
          badge={urgentCount}
          badgeLabel="Urgent"
          icon={<AlertCircle className="w-6 h-6" />}
          color="red"
        />
        <StatCard
          title="Cases Filed This Month"
          value={filedThisMonth}
          icon={<FileText className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Revenue This Month"
          value={revenueThisMonth}
          icon={<TrendingUp className="w-6 h-6" />}
          color="emerald"
        />
        <StatCard
          title="Avg Review Time"
          value={avgReviewTime}
          icon={<Clock className="w-6 h-6" />}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Priority Case Queue */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-50 border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center gap-2 truncate">
                <Zap className="w-5 h-5 text-amber-500" />
                Priority Case Queue
              </h3>
              <Link href="#" onClick={() => alert("Navigate to full queue")}>
                <button className="text-sm text-emerald-400 hover:text-emerald-300">View All</button>
              </Link>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400">
                    <th className="px-6 py-3 text-left font-semibold">Client / Case</th>
                    <th className="px-6 py-3 text-left font-semibold">Type</th>
                    <th className="px-6 py-3 text-left font-semibold">Status</th>
                    <th className="px-6 py-3 text-left font-semibold">Priority</th>
                    <th className="px-6 py-3 text-left font-semibold">Due</th>
                    <th className="px-6 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {priorityCases.slice(0, 5).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-300">
                            {c.clientName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{c.clientName}</p>
                            <p className="text-xs text-slate-400">#{c.receiptNumber || "Pending"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-medium">{c.caseType}</span>
                          <span className="text-xs text-slate-400">{CASE_TYPES[c.caseType]}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium inline-block ${REVIEW_STATUS_COLORS[c.reviewStatus]}`}>
                          {REVIEW_STATUS_LABELS[c.reviewStatus]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={PRIORITY_BADGE_COLORS[c.priority]} size="sm">
                          {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {c.dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                        <button className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-slate-900 text-xs font-medium rounded transition-colors">
                          Review
                        </button>
                        <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors">
                          <Flag className="w-3 h-3 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div className="space-y-4">
          <Card className="bg-slate-50 border-slate-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-slate-900 font-semibold" size="lg">
                <Zap className="w-4 h-4 mr-2" />
                Review Next Case
              </Button>
              <Button variant="secondary" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <Search className="w-4 h-4 mr-2" />
                Search Cases
              </Button>
              <Button variant="secondary" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="secondary" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-slate-50 border-slate-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 sm:space-y-4">
              {activities.slice(0, 3).map((event) => (
                <div key={event.id} className="flex gap-3 text-sm border-b border-slate-200 pb-3 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    {event.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CaseQueueView({ cases }: { cases: PriorityCase[] }) {
  const [sortBy, setSortBy] = React.useState<"priority" | "dueDate" | "status">("priority");

  const sortedCases = [...cases].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { urgent: 0, high: 1, normal: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sortBy === "dueDate") {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    return 0;
  });

  return (
    <Card className="bg-slate-50 border-slate-200 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900">All Cases in Queue</h3>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 text-slate-900 text-xs sm:text-sm rounded px-3 py-2 border border-slate-700 hover:border-slate-600 flex-1 sm:flex-none"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-xs sm:text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400">
              <th className="px-6 py-3 text-left font-semibold">Client Name</th>
              <th className="px-6 py-3 text-left font-semibold">Case Type</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Priority</th>
              <th className="px-6 py-3 text-left font-semibold">Due Date</th>
              <th className="px-6 py-3 text-left font-semibold">Score</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sortedCases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{c.clientName}</p>
                  <p className="text-xs text-slate-400">{c.clientEmail}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-900">{c.caseType}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium inline-block ${REVIEW_STATUS_COLORS[c.reviewStatus]}`}>
                    {REVIEW_STATUS_LABELS[c.reviewStatus]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={PRIORITY_BADGE_COLORS[c.priority]} size="sm">
                    {c.priority.charAt(0).toUpperCase() + c.priority.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-400">{c.dueDate.toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${parseInt(c.score || "0")}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{c.score}%</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="primary" size="sm">
                    Review
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ReviewsView({ cases }: { cases: PriorityCase[] }) {
  const needsReview = cases.filter((c) => c.reviewStatus === "needs_review");
  const rfeResponse = cases.filter((c) => c.reviewStatus === "rfe_response");
  const readyToFile = cases.filter((c) => c.reviewStatus === "ready_to_file");

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="bg-red-900/20 border border-red-700/30 p-6">
          <p className="text-red-600 text-sm font-semibold">Needs Review</p>
          <p className="text-3xl font-bold text-red-300 mt-2">{needsReview.length}</p>
        </Card>
        <Card className="bg-amber-900/20 border border-amber-700/30 p-6">
          <p className="text-amber-600 text-sm font-semibold">RFE Response</p>
          <p className="text-3xl font-bold text-amber-300 mt-2">{rfeResponse.length}</p>
        </Card>
        <Card className="bg-emerald-900/20 border border-emerald-700/30 p-6">
          <p className="text-emerald-400 text-sm font-semibold">Ready to File</p>
          <p className="text-3xl font-bold text-emerald-300 mt-2">{readyToFile.length}</p>
        </Card>
      </div>

      <Card className="bg-slate-50 border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">Cases Requiring Attention</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {needsReview.map((c) => (
            <div key={c.id} className="p-4 sm:p-6 hover:bg-slate-800/30 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-0">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{c.clientName}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">{c.caseType} - {c.category}</p>
                  <p className="text-xs text-slate-500 mt-2">Assigned: {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant="red" size="md">
                    {c.priority === "urgent" ? "URGENT" : "High"}
                  </Badge>
                  <p className="text-xs text-slate-400 mt-2">Due: {c.dueDate.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button variant="primary" size="sm">
                  Start Review
                </Button>
                <Button variant="secondary" size="sm" className="border-slate-700 text-slate-300">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function CalendarView({ activities }: { activities: ActivityEvent[] }) {
  return (
    <Card className="bg-slate-50 border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Activity Timeline</h3>
      <div className="space-y-6">
        {activities.map((event, idx) => (
          <div key={event.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                {event.icon}
              </div>
              {idx !== activities.length - 1 && <div className="w-0.5 h-12 bg-slate-800 mt-2"></div>}
            </div>
            <div className="pb-6 flex-1">
              <p className="font-semibold text-slate-900">{event.title}</p>
              <p className="text-sm text-slate-400">{event.description}</p>
              <p className="text-xs text-slate-500 mt-2">{event.timestamp.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AnalyticsView({ stats }: { stats: DashboardStats | null }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-50 border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Cases by Status</h3>
          <div className="space-y-3">
            {stats &&
              Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400 capitalize">{status}</span>
                  <span className="font-semibold text-slate-900">{count}</span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="bg-slate-50 border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-400">Avg Review Time</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">2.4 hours</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Monthly Cases Filed</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Approval Rate</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">94%</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-slate-50 border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Workload Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">{stats?.totalAssigned || 0}</p>
            <p className="text-sm text-slate-400 mt-2">Total Assigned</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">
              {(stats?.byStatus?.processing ?? 0) + (stats?.byStatus?.submitted ?? 0)}
            </p>
            <p className="text-sm text-slate-400 mt-2">Active Cases</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">
              {(stats?.byStatus?.approved ?? 0) + (stats?.byStatus?.completed ?? 0)}
            </p>
            <p className="text-sm text-slate-400 mt-2">Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">{stats?.availableToClaim || 0}</p>
            <p className="text-sm text-slate-400 mt-2">Available</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="bg-slate-50 border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300">Full Name</label>
            <input
              type="text"
              defaultValue="Jeremy Knight"
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              defaultValue="jeremy@greencard.ai"
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-900"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Bar License</label>
            <input
              type="text"
              defaultValue="NY-2015"
              className="mt-1 w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-900"
            />
          </div>
        </div>
      </Card>

      <Card className="bg-slate-50 border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-slate-300">Email notifications for urgent cases</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-sm text-slate-300">Daily review summary</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm text-slate-300">Weekly analytics report</span>
          </label>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="primary">Save Settings</Button>
        <Button variant="secondary" className="border-slate-700 text-slate-300">
          Cancel
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  badge,
  badgeLabel,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  badge?: number;
  badgeLabel?: string;
  icon: React.ReactNode;
  color: "red" | "emerald" | "blue";
}) {
  const colorClasses = {
    red: "bg-red-900/20 border-red-700/30 text-red-600 text-red-300",
    emerald: "bg-emerald-900/20 border-emerald-700/30 text-emerald-400 text-emerald-300",
    blue: "bg-blue-900/20 border-blue-700/30 text-blue-600 text-blue-300",
  };

  const [bg, border, textColor, accentColor] = colorClasses[color].split(" ");

  return (
    <Card className={`${bg} border ${border} p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg bg-current ${textColor} opacity-20 flex items-center justify-center`}>
          <div className={textColor}>{icon}</div>
        </div>
        {badge !== undefined && badgeLabel && (
          <Badge variant="red" size="sm">
            {badge} {badgeLabel}
          </Badge>
        )}
      </div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${accentColor}`}>{value}</p>
    </Card>
  );
}
