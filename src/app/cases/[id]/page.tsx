"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  FileText,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  MessageSquare,
  Image as ImageIcon,
  Download,
  ChevronRight,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface CaseData {
  id: string;
  type: "i130" | "i485" | "eb2";
  title: string;
  receiptNumber: string;
  filedDate: string;
  serviceCenter: string;
  processingTime: string;
  estimatedDecision: string;
  progress: number;
  status: "active" | "pending" | "completed";
  currentStep: 0 | 1 | 2 | 3 | 4;
}

interface TimelineEvent {
  id: string;
  step: string;
  date: string;
  description: string;
  icon: string;
  isWarning?: boolean;
  attachment?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: "verified" | "pending" | "rejected";
}

interface Note {
  id: string;
  author: string;
  date: string;
  content: string;
}

const mockCaseData: { [key: string]: CaseData } = {
  "case-001": {
    id: "case-001",
    type: "i130",
    title: "I-130 Spouse Petition",
    receiptNumber: "LIN2401234567",
    filedDate: "January 15, 2024",
    serviceCenter: "Lincoln, Nebraska",
    processingTime: "8.5 - 14 months",
    estimatedDecision: "September 15, 2024",
    progress: 65,
    status: "active",
    currentStep: 1,
  },
  "case-002": {
    id: "case-002",
    type: "eb2",
    title: "EB-2 Employment-Based",
    receiptNumber: "TSC2310987654",
    filedDate: "October 3, 2023",
    serviceCenter: "Texas Service Center",
    processingTime: "12 - 18 months",
    estimatedDecision: "April 3, 2025",
    progress: 45,
    status: "pending",
    currentStep: 1,
  },
  "case-003": {
    id: "case-003",
    type: "i485",
    title: "I-485 Adjustment of Status",
    receiptNumber: "EAC2311123456",
    filedDate: "November 20, 2023",
    serviceCenter: "Eastern Processing Center",
    processingTime: "12 - 24 months",
    estimatedDecision: "November 20, 2025",
    progress: 28,
    status: "active",
    currentStep: 0,
  },
};

const timelineEvents: TimelineEvent[] = [
  {
    id: "evt1",
    step: "Filed",
    date: "January 15, 2024",
    description: "Petition submitted to USCIS",
    icon: "📤",
  },
  {
    id: "evt2",
    step: "Receipt Notice",
    date: "January 20, 2024",
    description: "Receipt confirmation received",
    icon: "📧",
    attachment: "I-797 Notice",
  },
  {
    id: "evt3",
    step: "Biometrics Scheduled",
    date: "March 10, 2024",
    description: "Appointment notice received",
    icon: "👆",
  },
  {
    id: "evt4",
    step: "RFE Received",
    date: "April 5, 2024",
    description: "Request for additional evidence issued",
    icon: "⚠️",
    isWarning: true,
    attachment: "RFE Letter",
  },
  {
    id: "evt5",
    step: "RFE Response Sent",
    date: "April 25, 2024",
    description: "Additional documents submitted",
    icon: "📄",
  },
];

const documents: Document[] = [
  {
    id: "doc1",
    name: "Birth Certificate",
    type: "Vital Record",
    uploadDate: "January 15, 2024",
    status: "verified",
  },
  {
    id: "doc2",
    name: "Marriage Certificate",
    type: "Vital Record",
    uploadDate: "January 15, 2024",
    status: "verified",
  },
  {
    id: "doc3",
    name: "Police Clearance",
    type: "Government Document",
    uploadDate: "January 18, 2024",
    status: "verified",
  },
  {
    id: "doc4",
    name: "Medical Examination",
    type: "Medical",
    uploadDate: "February 1, 2024",
    status: "verified",
  },
  {
    id: "doc5",
    name: "Passport Copy",
    type: "Travel Document",
    uploadDate: "January 15, 2024",
    status: "pending",
  },
  {
    id: "doc6",
    name: "Tax Returns",
    type: "Financial",
    uploadDate: "January 20, 2024",
    status: "verified",
  },
];

const notes: Note[] = [
  {
    id: "note1",
    author: "You",
    date: "April 25, 2024",
    content:
      "Submitted RFE response documents. Included additional photos from wedding and joint bank account statements.",
  },
  {
    id: "note2",
    author: "Case Advisor",
    date: "April 5, 2024",
    content:
      "RFE received requesting additional evidence of relationship. This is common for spouse petitions. Response should include joint statements, financial documents, and wedding photos.",
  },
];

const steps = [
  { label: "Filed", icon: "📤" },
  { label: "Receipt", icon: "📧" },
  { label: "Biometrics", icon: "👆" },
  { label: "Interview", icon: "💬" },
  { label: "Decision", icon: "✅" },
];

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const caseData = mockCaseData[caseId];
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "documents" | "forms" | "notes"
  >("overview");
  const [newNote, setNewNote] = useState("");

  if (!caseData) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <Card className="p-8 text-center">
          <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Case Not Found
          </h2>
          <p className="text-slate-600">
            The case you're looking for doesn't exist.
          </p>
        </Card>
      </div>
    );
  }

  const typeEmojis = {
    i130: "👨‍👩‍👧‍👦",
    i485: "🏠",
    eb2: "💼",
  };

  const statusConfig = {
    active: { badge: "blue", color: "text-blue-600" },
    pending: { badge: "amber", color: "text-amber-600" },
    completed: { badge: "green", color: "text-emerald-600" },
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <span className="text-5xl">
                {typeEmojis[caseData.type as keyof typeof typeEmojis]}
              </span>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">
                  {caseData.title}
                </h1>
                <p className="text-slate-600">{caseData.receiptNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={
                  statusConfig[caseData.status as keyof typeof statusConfig]
                    .badge as
                    | "gray"
                    | "green"
                    | "amber"
                    | "blue"
                }
              >
                {caseData.status}
              </Badge>
              <Card className="px-6 py-3 bg-green-500/10 border-green-500/30">
                <div className="text-center">
                  <p className="text-xs text-slate-600">Progress</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {caseData.progress}%
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {(
            [
              "overview",
              "timeline",
              "documents",
              "forms",
              "notes",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "text-emerald-600 border-b-2 border-green-500"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <p className="text-sm text-slate-600 mb-1">Filing Date</p>
                <p className="text-lg font-semibold text-slate-900">
                  {caseData.filedDate}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-slate-600 mb-1">Service Center</p>
                <p className="text-lg font-semibold text-slate-900 line-clamp-2">
                  {caseData.serviceCenter}
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-sm text-slate-600 mb-1">Processing Time</p>
                <p className="text-lg font-semibold text-slate-900">
                  {caseData.processingTime}
                </p>
              </Card>
              <Card className="p-6 bg-green-500/10 border-green-500/30">
                <p className="text-sm text-slate-600 mb-1">Estimated Decision</p>
                <p className="text-lg font-semibold text-emerald-600">
                  {caseData.estimatedDecision}
                </p>
              </Card>
            </div>

            {/* Progress Stepper */}
            <Card className="p-8">
              <h3 className="font-semibold text-slate-900 mb-8">Progress Steps</h3>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold border-2 transition-all ${
                        idx < caseData.currentStep
                          ? "bg-green-500/30 border-green-500 text-emerald-600"
                          : idx === caseData.currentStep
                            ? "bg-green-500/50 border-green-500 text-slate-900"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <p
                      className={`text-xs font-medium text-center ${
                        idx <= caseData.currentStep
                          ? "text-slate-900"
                          : "text-slate-600"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-2 mt-8 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-600">Current Status</p>
                <Badge variant="blue" className="flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  {steps[caseData.currentStep].label}
                </Badge>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-l-4 border-l-blue-500">
                <p className="text-sm text-slate-600 mb-2">Documents Uploaded</p>
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {documents.length}
                </p>
                <p className="text-xs text-muted">
                  {documents.filter((d) => d.status === "verified").length} verified
                </p>
              </Card>
              <Card className="p-6 border-l-4 border-l-green-500">
                <p className="text-sm text-slate-600 mb-2">Forms Completed</p>
                <p className="text-4xl font-bold text-emerald-600 mb-2">3</p>
                <p className="text-xs text-muted">I-130, I-864, I-485</p>
              </Card>
              <Card className="p-6 border-l-4 border-l-amber-500">
                <p className="text-sm text-slate-600 mb-2">Upcoming Deadlines</p>
                <p className="text-4xl font-bold text-amber-600 mb-2">1</p>
                <p className="text-xs text-muted">June 1, 2024</p>
              </Card>
            </div>

            {/* AI Analysis Card */}
            <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
              <div className="flex items-start gap-4">
                <Zap size={24} className="text-emerald-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    AI Analysis & Insights
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600 flex-shrink-0 mt-0.5"
                      />
                      <span>
                        Your case has a high approval probability (94%) based on
                        similar cases
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle
                        size={16}
                        className="text-amber-600 flex-shrink-0 mt-0.5"
                      />
                      <span>
                        RFE was issued but your response was strong and
                        comprehensive
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Clock
                        size={16}
                        className="text-blue-600 flex-shrink-0 mt-0.5"
                      />
                      <span>
                        Expected decision by September 2024 based on current
                        processing times
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <Card className="p-8">
            <div className="space-y-8">
              {timelineEvents.map((event, idx) => (
                <div key={event.id} className="flex gap-6">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-2xl">{event.icon}</div>
                    {idx < timelineEvents.length - 1 && (
                      <div
                        className={`w-1 h-12 ${
                          event.isWarning
                            ? "bg-amber-500/30"
                            : "bg-green-500/30"
                        }`}
                      />
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="font-semibold text-slate-900">
                        {event.step}
                      </h4>
                      <span className="text-sm text-slate-600">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">
                      {event.description}
                    </p>
                    {event.attachment && (
                      <Button
                        variant="secondary"
                        className="text-xs flex items-center gap-2"
                      >
                        <Download size={14} />
                        {event.attachment}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Event Button */}
              <Button variant="secondary" className="w-full mt-8">
                <Plus size={18} className="mr-2" />
                Add Event
              </Button>
            </div>
          </Card>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => {
                const statusColors = {
                  verified: "border-green-500/50 bg-green-500/5",
                  pending: "border-amber-500/50 bg-amber-500/5",
                  rejected: "border-red-500/50 bg-red-500/5",
                };

                return (
                  <Card
                    key={doc.id}
                    className={`p-6 border ${statusColors[doc.status]}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <ImageIcon
                        size={24}
                        className="text-blue-600 flex-shrink-0"
                      />
                      <Badge
                        variant={
                          doc.status === "verified"
                            ? "green"
                            : doc.status === "pending"
                              ? "amber"
                              : "gray"
                        }
                        className="text-xs"
                      >
                        {doc.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-slate-600 mb-3">{doc.type}</p>
                    <p className="text-xs text-muted">
                      Uploaded: {doc.uploadDate}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Forms Tab */}
        {activeTab === "forms" && (
          <Card className="p-8">
            <div className="space-y-4">
              {["I-130", "I-864", "I-485"].map((form) => (
                <div
                  key={form}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={20} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-slate-900">{form}</p>
                      <p className="text-sm text-slate-600">
                        View and edit form
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-600" />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            {/* Add Note Form */}
            <Card className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Add a Note</h3>
              <div className="space-y-4">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write your notes here..."
                  className="w-full min-h-24 p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder-secondary focus:outline-none focus:border-green-500/50"
                />
                <Button className="bg-green-500 hover:bg-green-600">
                  Save Note
                </Button>
              </div>
            </Card>

            {/* Notes List */}
            <div className="space-y-4">
              {notes.map((note) => (
                <Card key={note.id} className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-slate-900">{note.author}</p>
                    <span className="text-xs text-slate-600">{note.date}</span>
                  </div>
                  <p className="text-slate-600">{note.content}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
