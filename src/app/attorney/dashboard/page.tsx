"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Briefcase, Users, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react";

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

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-500/20 text-gray-300",
  submitted: "bg-blue-500/20 text-blue-300",
  processing: "bg-yellow-500/20 text-yellow-300",
  approved: "bg-green-500/20 text-green-300",
  denied: "bg-red-500/20 text-red-300",
  abandoned: "bg-gray-500/20 text-gray-400",
  completed: "bg-emerald-500/20 text-emerald-300",
};

export default function AttorneyDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cases, setCases] = useState<AttorneyCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [statsRes, casesRes] = await Promise.all([
        fetch("/api/attorney/dashboard"),
        fetch("/api/attorney/cases"),
      ]);

      if (!statsRes.ok || !casesRes.ok) {
        setError("Failed to load dashboard data.");
        return;
      }

      const statsData = await statsRes.json();
      const casesData = await casesRes.json();

      setStats(statsData);
      setCases(casesData.cases);
    } catch {
      setError("Something went wrong loading the dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight flex items-center justify-center">
        <p className="text-secondary">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight flex items-center justify-center px-4">
        <Card className="p-8 text-center space-y-4 max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
          <p className="text-red-400">{error}</p>
          <Button onClick={loadData}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Attorney Dashboard</h1>
            <p className="text-secondary mt-1">Manage your assigned cases</p>
          </div>
          <Link href="/dashboard">
            <Button variant="secondary">Client View</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.totalAssigned}</p>
                  <p className="text-sm text-secondary">Assigned Cases</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {(stats.byStatus?.processing ?? 0) + (stats.byStatus?.submitted ?? 0)}
                  </p>
                  <p className="text-sm text-secondary">Active Cases</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {(stats.byStatus?.approved ?? 0) + (stats.byStatus?.completed ?? 0)}
                  </p>
                  <p className="text-sm text-secondary">Completed</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-2xl font-bold text-primary">{stats.availableToClaim}</p>
                  <p className="text-sm text-secondary">Available to Claim</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Cases Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-surface">
            <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Cases
            </h2>
          </div>

          {cases.length === 0 ? (
            <div className="p-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-secondary mb-4" />
              <p className="text-secondary">No cases assigned yet.</p>
              <p className="text-secondary text-sm mt-1">
                Cases will appear here when clients are matched to you.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-secondary border-b border-surface">
                    <th className="px-6 py-3 font-medium">Client</th>
                    <th className="px-6 py-3 font-medium">Case Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Score</th>
                    <th className="px-6 py-3 font-medium">Updated</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c.id} className="border-b border-surface/50 hover:bg-surface/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-primary font-medium">{c.clientName || "Unknown"}</p>
                        <p className="text-secondary text-sm">{c.clientEmail || ""}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-primary">{c.caseType}</p>
                        <p className="text-secondary text-sm">{c.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[c.status] || "bg-gray-500/20 text-gray-300"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-primary">
                        {c.score ? `${parseFloat(c.score).toFixed(0)}%` : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-secondary text-sm">
                        {new Date(c.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/cases/${c.id}`}>
                          <Button variant="secondary" className="text-sm px-3 py-1">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
