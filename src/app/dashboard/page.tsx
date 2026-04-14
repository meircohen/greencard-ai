"use client";

import React from "react";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  Zap,
  Clock,
} from "lucide-react";

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  variant?: "default" | "success" | "warning" | "info";
}

interface CaseItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: "processing" | "under-review" | "pending" | "completed";
  icon: React.ReactNode;
  filedDate?: string;
  location?: string;
}

interface DeadlineItem {
  date: string;
  title: string;
  description: string;
  urgency: "normal" | "warning" | "urgent";
}

const StatCard: React.FC<StatCard> = ({
  icon,
  label,
  value,
  subtext,
  variant = "default",
}) => {
  const variantClasses = {
    default: "bg-white/5 border-white/10",
    success: "bg-green-500/10 border-green-500/30",
    warning: "bg-amber-500/10 border-amber-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
  };

  const textVariant = {
    default: "text-primary",
    success: "text-green-300",
    warning: "text-amber-300",
    info: "text-blue-300",
  };

  return (
    <div className={`rounded-lg border p-6 ${variantClasses[variant]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-secondary text-sm font-medium">{label}</div>
        <div className={`${textVariant[variant]} opacity-70`}>{icon}</div>
      </div>
      <div className="space-y-1">
        <div className={`text-3xl font-bold ${textVariant[variant]}`}>
          {value}
        </div>
        {subtext && <div className="text-xs text-secondary">{subtext}</div>}
      </div>
    </div>
  );
};

const CaseCard: React.FC<CaseItem> = ({
  title,
  description,
  progress,
  status,
  icon,
  filedDate,
  location,
}) => {
  const statusConfig = {
    processing: {
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      label: "Processing",
    },
    "under-review": {
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      label: "Under Review",
    },
    pending: {
      badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      label: "Pending",
    },
    completed: {
      badge: "bg-green-500/20 text-green-300 border-green-500/30",
      label: "Completed",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/[0.08] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-green-500 opacity-70">{icon}</div>
          <div>
            <h3 className="font-semibold text-primary">{title}</h3>
            <p className="text-xs text-secondary mt-1">{description}</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded border whitespace-nowrap ${config.badge}`}
        >
          {config.label}
        </span>
      </div>

      {(filedDate || location) && (
        <div className="flex gap-4 text-xs text-muted mb-4 pb-4 border-b border-white/5">
          {filedDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{filedDate}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1">
              <span>{location}</span>
            </div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-secondary">Progress</span>
          <span className="text-primary font-medium">{progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const DeadlineCard: React.FC<DeadlineItem> = ({
  date,
  title,
  description,
  urgency,
}) => {
  const urgencyConfig = {
    normal: "bg-white/5 border-white/10",
    warning: "bg-amber-500/10 border-amber-500/30",
    urgent: "bg-red-500/10 border-red-500/30",
  };

  const urgencyIcon = {
    normal: <Clock className="w-4 h-4 text-secondary" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400" />,
    urgent: <AlertCircle className="w-4 h-4 text-red-400" />,
  };

  return (
    <div className={`rounded-lg border p-4 ${urgencyConfig[urgency]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1">{urgencyIcon[urgency]}</div>
        <div className="flex-1">
          <div className="font-semibold text-primary text-sm">{title}</div>
          <div className="text-xs text-secondary mt-1">{description}</div>
          <div className="text-xs font-mono text-muted mt-2">{date}</div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const cases: CaseItem[] = [
    {
      id: "1",
      title: "I-130 Spouse Petition",
      description: "Family-based immigration petition",
      progress: 65,
      status: "processing",
      icon: <FileText className="w-6 h-6" />,
      filedDate: "Filed Feb 2026",
      location: "Nebraska Service Center",
    },
    {
      id: "2",
      title: "I-485 Adjustment of Status",
      description: "Concurrent filing with biometrics completed",
      progress: 40,
      status: "under-review",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: "3",
      title: "I-765 EAD",
      description: "Work authorization pending initial review",
      progress: 20,
      status: "pending",
      icon: <FileText className="w-6 h-6" />,
    },
  ];

  const deadlines: DeadlineItem[] = [
    {
      date: "April 28, 2026",
      title: "RFE Response Due",
      description: "Submit response to Request for Evidence",
      urgency: "urgent",
    },
    {
      date: "May 15, 2026",
      title: "Medical Exam Expires",
      description: "Schedule renewal medical examination",
      urgency: "warning",
    },
    {
      date: "June 01, 2026",
      title: "Interview",
      description: "Biometric appointment at local USCIS office",
      urgency: "normal",
    },
  ];

  return (
    <div className="min-h-screen bg-midnight text-primary">
      {/* Page Header */}
      <div className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Welcome back, <span className="text-green-400">Meir</span>
          </h1>
          <p className="text-secondary">
            Here's an overview of your immigration cases and upcoming deadlines
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              label="Active Cases"
              value="3"
              variant="info"
            />
            <StatCard
              icon={<CheckCircle className="w-5 h-5" />}
              label="Documents Ready"
              value="12/15"
              subtext="80% complete"
              variant="success"
            />
            <StatCard
              icon={<AlertCircle className="w-5 h-5" />}
              label="Next Deadline"
              value="14 days"
              subtext="Urgent - RFE Response"
              variant="warning"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Case Score"
              value="82/100"
              subtext="+5 this month"
              variant="success"
            />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cases List - Left Side (2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">Your Cases</h2>
                <div className="space-y-4">
                  {cases.map((caseItem) => (
                    <CaseCard key={caseItem.id} {...caseItem} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1 space-y-6">
              {/* Upcoming Deadlines */}
              <div>
                <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
                <div className="space-y-3">
                  {deadlines.map((deadline, idx) => (
                    <DeadlineCard key={idx} {...deadline} />
                  ))}
                </div>
              </div>

              {/* AI Insight Card */}
              <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-green-300">
                      AI Case Analysis
                    </h3>
                    <p className="text-xs text-green-200/70 mt-2">
                      Based on your current progress and timeline:
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-green-100/80">
                  <p>
                    Your I-130 is tracking well at 65%. With the RFE response submitted on time, you're likely to receive a transfer to the adjustment processing center by early June.
                  </p>
                  <p>
                    Consider scheduling your medical exam 2 weeks before your interview to ensure any issues can be resolved quickly.
                  </p>
                </div>

                <button className="w-full mt-4 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50 text-green-300 text-sm font-medium hover:bg-green-500/30 transition-colors">
                  Get Full Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-6">
              <h3 className="font-semibold text-blue-300 mb-2">
                Did you know?
              </h3>
              <p className="text-sm text-blue-200/70">
                Submitting your RFE response early increases approval chances by 23% and can speed up processing by 30-60 days.
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-6">
              <h3 className="font-semibold text-purple-300 mb-2">
                Next Step
              </h3>
              <p className="text-sm text-purple-200/70">
                Prepare your RFE response. We've identified 3 key documents needed. Download the checklist from your documents section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
