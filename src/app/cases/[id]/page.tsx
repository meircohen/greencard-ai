"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface CaseDetail {
  id: string;
  caseType: string;
  category: string;
  status: "draft" | "submitted" | "processing" | "approved" | "completed" | "denied" | "abandoned";
  receiptNumber: string;
  serviceCenter: string;
  createdAt: string;
  updatedAt: string;
}

interface Document {
  id: string;
  fileName: string;
  documentType: string;
  fileUrl: string;
  fileSize?: number;
  status: string;
  createdAt: string;
}

interface Form {
  id: string;
  formNumber: string;
  status: string;
  createdAt: string;
}

interface Deadline {
  id: string;
  deadlineType: string;
  deadlineDate: string;
  description?: string;
  completed: boolean;
}

interface CaseEvent {
  id: string;
  eventType: string;
  eventDate: string;
  description?: string;
}

interface CaseNote {
  id: string;
  content: string;
  createdAt: string;
  author: {
    fullName: string;
  };
}

const getCaseTitle = (caseType: string): string => {
  const titles: { [key: string]: string } = {
    i130: "I-130 Spouse Petition",
    i485: "I-485 Adjustment of Status",
    eb2: "EB-2 Employment-Based",
    eb1c: "EB-1C Green Card",
    l1b: "L-1B Work Visa",
    h1b: "H-1B Work Visa",
  };
  return titles[caseType] || caseType;
};

const typeEmojis: { [key: string]: string } = {
  i130: "👨‍👩‍👧‍👦",
  i485: "🏠",
  eb2: "💼",
  eb1c: "💼",
  l1b: "💼",
  h1b: "💼",
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const statusConfig: {
  [key: string]: {
    badge: "gray" | "green" | "amber" | "blue" | "red";
    color: string;
  };
} = {
  draft: { badge: "gray", color: "text-slate-600" },
  submitted: { badge: "blue", color: "text-blue-600" },
  processing: { badge: "amber", color: "text-amber-600" },
  approved: { badge: "green", color: "text-emerald-600" },
  completed: { badge: "green", color: "text-emerald-600" },
  denied: { badge: "red", color: "text-red-600" },
  abandoned: { badge: "gray", color: "text-slate-600" },
};

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [forms, setForms] = useState<Form[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [events, setEvents] = useState<CaseEvent[]>([]);
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "timeline" | "documents" | "forms" | "notes"
  >("overview");
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cases/${caseId}/detail`);

        if (!response.ok) {
          if (response.status === 401) {
            setError("Not authenticated");
          } else if (response.status === 404) {
            setError("Case not found");
          } else if (response.status === 403) {
            setError("You do not have permission to view this case");
          } else {
            setError("Failed to load case details");
          }
          return;
        }

        const data = await response.json();
        setCaseData(data.case);
        setDocuments(data.documents || []);
        setForms(data.forms || []);
        setDeadlines(data.deadlines || []);
        setEvents(data.events || []);
        setNotes(data.notes || []);
        setError(null);
      } catch (err) {
        setError("Failed to load case details");
        console.error("Error fetching case detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetail();
  }, [caseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 sm:pt-24 pb-8 sm:pb-12 flex items-center justify-center">
          <Clock size={48} className="text-muted opacity-50 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 sm:pt-24 pb-8 sm:pb-12 flex items-center justify-center">
          <Card className="p-8 text-center">
            <FileText size={48} className="mx-auto text-muted mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {error || "Case Not Found"}
            </h2>
            <p className="text-slate-600">
              {error || "The case you're looking for doesn't exist."}
            </p>
            <Button
              onClick={() => router.push("/cases")}
              className="mt-6 bg-green-500 hover:bg-green-600"
            >
              Back to Cases
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const title = getCaseTitle(caseData.caseType);
  const emoji = typeEmojis[caseData.caseType] || "📄";
  const config = statusConfig[caseData.status] || statusConfig.draft;

  const steps = [
    { label: "Draft", icon: "📝" },
    { label: "Submitted", icon: "📤" },
    { label: "Processing", icon: "⏳" },
    { label: "Approved", icon: "✅" },
  ];

  const getProgressFromStatus = (status: string): number => {
    const progressMap: { [key: string]: number } = {
      draft: 10,
      submitted: 30,
      processing: 55,
      approved: 85,
      completed: 100,
      denied: 0,
      abandoned: 0,
    };
    return progressMap[status] || 0;
  };

  const progress = getProgressFromStatus(caseData.status);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/cases")}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Cases
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{emoji}</span>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">
                    {title}
                  </h1>
                  <p className="text-slate-600">{caseData.receiptNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={config.badge}>
                  {caseData.status}
                </Badge>
                <Card className="px-6 py-3 bg-green-500/10 border-green-500/30">
                  <div className="text-center">
                    <p className="text-xs text-slate-600">Progress</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {progress}%
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <p className="text-sm text-slate-600 mb-1">Filing Date</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatDate(caseData.createdAt)}
                  </p>
                </Card>
                <Card className="p-6">
                  <p className="text-sm text-slate-600 mb-1">Service Center</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {caseData.serviceCenter || "—"}
                  </p>
                </Card>
                <Card className="p-6 bg-green-500/10 border-green-500/30">
                  <p className="text-sm text-slate-600 mb-1">Last Updated</p>
                  <p className="text-lg font-semibold text-emerald-600">
                    {formatDate(caseData.updatedAt)}
                  </p>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-blue-500">
                  <p className="text-sm text-slate-600 mb-2">
                    Documents Uploaded
                  </p>
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    {documents.length}
                  </p>
                  <p className="text-xs text-muted">
                    {documents.filter((d) => d.status === "extracted").length} processed
                  </p>
                </Card>
                <Card className="p-6 border-l-4 border-l-green-500">
                  <p className="text-sm text-slate-600 mb-2">Forms</p>
                  <p className="text-4xl font-bold text-emerald-600 mb-2">
                    {forms.length}
                  </p>
                  <p className="text-xs text-muted">
                    {forms.filter((f) => f.status === "submitted").length} submitted
                  </p>
                </Card>
                <Card className="p-6 border-l-4 border-l-amber-500">
                  <p className="text-sm text-slate-600 mb-2">Upcoming Deadlines</p>
                  <p className="text-4xl font-bold text-amber-600 mb-2">
                    {deadlines.filter((d) => !d.completed).length}
                  </p>
                  <p className="text-xs text-muted">
                    {deadlines.length > 0
                      ? `Next: ${formatDate(deadlines[0].deadlineDate)}`
                      : "No deadlines"}
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <Card className="p-8">
              {events.length > 0 ? (
                <div className="space-y-8">
                  {events.map((event, idx) => (
                    <div key={event.id} className="flex gap-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="text-2xl">📅</div>
                        {idx < events.length - 1 && (
                          <div className="w-1 h-12 bg-green-500/30" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-semibold text-slate-900">
                            {event.eventType}
                          </h4>
                          <span className="text-sm text-slate-600">
                            {formatDate(event.eventDate)}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-slate-600">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="secondary" className="w-full mt-8">
                    <Plus size={18} className="mr-2" />
                    Add Event
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">No events recorded yet</p>
                </div>
              )}
            </Card>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div>
              {documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => {
                    const statusColors: {
                      [key: string]: string;
                    } = {
                      uploaded: "border-amber-500/50 bg-amber-500/5",
                      processing: "border-blue-500/50 bg-blue-500/5",
                      extracted: "border-green-500/50 bg-green-500/5",
                      error: "border-red-500/50 bg-red-500/5",
                      archived: "border-slate-500/50 bg-slate-500/5",
                    };

                    return (
                      <Card
                        key={doc.id}
                        className={`p-6 border ${
                          statusColors[doc.status] ||
                          statusColors.uploaded
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <ImageIcon
                            size={24}
                            className="text-blue-600 flex-shrink-0"
                          />
                          <Badge
                            variant={
                              doc.status === "extracted"
                                ? "green"
                                : doc.status === "processing"
                                  ? "blue"
                                  : "gray"
                            }
                            className="text-xs"
                          >
                            {doc.status}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-1 line-clamp-2">
                          {doc.fileName}
                        </h4>
                        <p className="text-xs text-slate-600 mb-3">
                          {doc.documentType}
                        </p>
                        <p className="text-xs text-muted">
                          Uploaded: {formatDate(doc.createdAt)}
                        </p>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <FileText
                    size={48}
                    className="mx-auto text-muted mb-4 opacity-50"
                  />
                  <p className="text-slate-600">No documents uploaded yet</p>
                </Card>
              )}
            </div>
          )}

          {/* Forms Tab */}
          {activeTab === "forms" && (
            <Card className="p-8">
              {forms.length > 0 ? (
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div
                      key={form.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {form.formNumber}
                          </p>
                          <p className="text-sm text-slate-600">
                            Status: {form.status}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-slate-600" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">No forms added yet</p>
                </div>
              )}
            </Card>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <Card className="p-6">
                <h3 className="font-semibold text-slate-900 mb-4">
                  Add a Note
                </h3>
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
              {notes.length > 0 ? (
                <div className="space-y-4">
                  {notes.map((note) => (
                    <Card key={note.id} className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-slate-900">
                          {note.author.fullName}
                        </p>
                        <span className="text-xs text-slate-600">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-600">{note.content}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <MessageSquare
                    size={48}
                    className="mx-auto text-muted mb-4 opacity-50"
                  />
                  <p className="text-slate-600">No notes yet</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
