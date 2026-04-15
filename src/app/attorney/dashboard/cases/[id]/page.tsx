"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Save,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface CaseDetails {
  case: {
    id: string;
    userId: string;
    attorneyId: string | null;
    caseType: string;
    category: string;
    status: string;
    priorityDate: string | null;
    receiptNumber: string | null;
    serviceCenter: string | null;
    score: string | null;
    assessment: any;
    createdAt: string;
    updatedAt: string;
    clientId: string;
    clientName: string | null;
    clientEmail: string | null;
    clientPhone: string | null;
  };
  documents: Array<{
    id: string;
    documentType: string;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    mimeType: string | null;
    status: string;
    createdAt: string;
  }>;
  forms: Array<{
    id: string;
    formNumber: string;
    status: string;
    formData: any;
    createdAt: string;
    updatedAt: string;
  }>;
  notes: Array<{
    id: string;
    content: string;
    visibility: string;
    isPrivileged: boolean;
    createdAt: string;
    authorName: string | null;
  }>;
  deadlines: Array<{
    id: string;
    deadlineType: string;
    deadlineDate: string;
    description: string | null;
    completed: boolean;
  }>;
  conversations: Array<{
    id: string;
    type: string;
    createdAt: string;
    messagesCount: number;
  }>;
  payments: Array<{
    id: string;
    amount: string;
    status: string;
    description: string | null;
    createdAt: string;
  }>;
}

const STATUS_COLORS: Record<string, "red" | "amber" | "green" | "blue"> = {
  draft: "blue",
  submitted: "green",
  processing: "amber",
  approved: "green",
  denied: "red",
  documents_pending: "amber",
  rejected: "red",
  completed: "green",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  processing: "Processing",
  approved: "Approved",
  denied: "Denied",
  documents_pending: "Documents Pending",
  rejected: "Rejected",
  completed: "Completed",
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function CaseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const caseId = params?.id as string;

  const [caseData, setCaseData] = useState<CaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<
    "approve" | "request_changes" | "reject" | ""
  >("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [requestedDocs, setRequestedDocs] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Additional notes state
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [addingNotes, setAddingNotes] = useState(false);

  useEffect(() => {
    if (!caseId) return;

    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/attorney/cases/${caseId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("Case not found.");
          } else if (response.status === 403) {
            setError("You do not have access to this case.");
          } else {
            setError("Failed to load case details.");
          }
          return;
        }

        const data = await response.json();
        setCaseData(data);
      } catch (err) {
        setError("An error occurred while loading the case.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId]);

  const handleSubmitReview = async () => {
    if (!reviewDecision) {
      alert("Please select a decision.");
      return;
    }

    try {
      setSubmitting(true);
      const requestedDocsList =
        reviewDecision === "request_changes" && requestedDocs
          ? requestedDocs.split(",").map((doc) => doc.trim())
          : [];

      const response = await fetch(`/api/attorney/cases/${caseId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision: reviewDecision,
          notes: reviewNotes,
          requestedDocuments: requestedDocsList,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit review.");
        return;
      }

      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setReviewDecision("");
      setReviewNotes("");
      setRequestedDocs("");

      // Reload case data
      const reloadResponse = await fetch(`/api/attorney/cases/${caseId}`);
      if (reloadResponse.ok) {
        setCaseData(await reloadResponse.json());
      }
    } catch (err) {
      alert("An error occurred while submitting the review.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNotes = async () => {
    if (!additionalNotes.trim()) {
      alert("Please enter a note.");
      return;
    }

    try {
      setAddingNotes(true);
      const response = await fetch(`/api/attorney/cases/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: additionalNotes,
        }),
      });

      if (!response.ok) {
        alert("Failed to add note.");
        return;
      }

      alert("Note added successfully!");
      setShowNotesForm(false);
      setAdditionalNotes("");

      // Reload case data
      const reloadResponse = await fetch(`/api/attorney/cases/${caseId}`);
      if (reloadResponse.ok) {
        setCaseData(await reloadResponse.json());
      }
    } catch (err) {
      alert("An error occurred while adding the note.");
      console.error(err);
    } finally {
      setAddingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-600">Loading case details...</div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-600">{error || "Failed to load case."}</div>
      </div>
    );
  }

  const { case: caseRecord, documents, forms, notes, deadlines, conversations, payments } = caseData;
  const statusColor = STATUS_COLORS[caseRecord.status] || "blue";

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Case Review</h1>
            <p className="text-gray-600 mt-1">Case ID: {caseRecord.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Case Header */}
            <Card>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {caseRecord.caseType}
                    </h2>
                    <p className="text-gray-600 mt-1">{caseRecord.category}</p>
                  </div>
                  <Badge color={statusColor}>{STATUS_LABELS[caseRecord.status] || caseRecord.status}</Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {caseRecord.priorityDate && (
                    <div>
                      <p className="text-sm text-gray-600">Priority Date</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(caseRecord.priorityDate)}
                      </p>
                    </div>
                  )}
                  {caseRecord.receiptNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Receipt Number</p>
                      <p className="font-semibold text-gray-900">{caseRecord.receiptNumber}</p>
                    </div>
                  )}
                  {caseRecord.score && (
                    <div>
                      <p className="text-sm text-gray-600">Score</p>
                      <p className="font-semibold text-gray-900">{caseRecord.score}</p>
                    </div>
                  )}
                  {caseRecord.serviceCenter && (
                    <div>
                      <p className="text-sm text-gray-600">Service Center</p>
                      <p className="font-semibold text-gray-900">{caseRecord.serviceCenter}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Client Info */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-600" />
                  Client Information
                </h3>
                <div className="space-y-3">
                  {caseRecord.clientName && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{caseRecord.clientName}</span>
                    </div>
                  )}
                  {caseRecord.clientEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <a
                        href={`mailto:${caseRecord.clientEmail}`}
                        className="text-emerald-600 hover:underline"
                      >
                        {caseRecord.clientEmail}
                      </a>
                    </div>
                  )}
                  {caseRecord.clientPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <a
                        href={`tel:${caseRecord.clientPhone}`}
                        className="text-emerald-600 hover:underline"
                      >
                        {caseRecord.clientPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Documents */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Documents ({documents.length})
                </h3>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{doc.fileName}</p>
                          <p className="text-sm text-gray-600">
                            {doc.documentType} • {formatFileSize(doc.fileSize)} •{" "}
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white rounded-lg transition"
                        >
                          <Download className="w-4 h-4 text-emerald-600" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No documents uploaded yet.</p>
                )}
              </div>
            </Card>

            {/* Forms */}
            {forms.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Forms ({forms.length})
                  </h3>
                  <div className="space-y-4">
                    {forms.map((form) => (
                      <div key={form.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{form.formNumber}</h4>
                          <Badge color={form.status === "submitted" ? "green" : "blue"}>
                            {form.status}
                          </Badge>
                        </div>
                        {form.formData && (
                          <div className="text-sm text-gray-600 max-h-40 overflow-y-auto">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(form.formData, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Deadlines */}
            {deadlines.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Deadlines ({deadlines.length})
                  </h3>
                  <div className="space-y-2">
                    {deadlines.map((deadline) => (
                      <div
                        key={deadline.id}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Clock className="w-4 h-4 text-amber-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{deadline.deadlineType}</p>
                          <p className="text-sm text-gray-600">
                            Due: {formatDate(deadline.deadlineDate)}
                          </p>
                          {deadline.description && (
                            <p className="text-sm text-gray-700 mt-1">{deadline.description}</p>
                          )}
                        </div>
                        {deadline.completed && (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Notes */}
            {notes.length > 0 && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" />
                    Notes ({notes.length})
                  </h3>
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="border-l-4 border-emerald-200 pl-4 py-2">
                        <p className="text-sm text-gray-600">
                          {note.authorName} • {formatDate(note.createdAt)}
                        </p>
                        <p className="text-gray-900 mt-1">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar - Actions */}
          <div className="col-span-1 space-y-4">
            {/* Review Decision Form */}
            {!showReviewForm ? (
              <Button
                onClick={() => setShowReviewForm(true)}
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Submit Case Review
              </Button>
            ) : (
              <Card>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Submit Review</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Decision
                      </label>
                      <select
                        value={reviewDecision}
                        onChange={(e) =>
                          setReviewDecision(e.target.value as typeof reviewDecision)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select a decision</option>
                        <option value="approve">Approve & File</option>
                        <option value="request_changes">Request Changes</option>
                        <option value="reject">Reject</option>
                      </select>
                    </div>

                    {reviewDecision === "request_changes" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Documents Needed
                        </label>
                        <textarea
                          value={requestedDocs}
                          onChange={(e) => setRequestedDocs(e.target.value)}
                          placeholder="Comma-separated list of required documents"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          rows={3}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Attorney notes (private)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSubmitReview}
                        disabled={submitting || !reviewDecision}
                        className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                      >
                        {submitting ? "Submitting..." : "Submit"}
                      </button>
                      <button
                        onClick={() => {
                          setShowReviewForm(false);
                          setReviewDecision("");
                          setReviewNotes("");
                          setRequestedDocs("");
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Additional Notes */}
            {!showNotesForm ? (
              <Button
                onClick={() => setShowNotesForm(true)}
                variant="secondary"
                className="w-full"
              >
                Add Notes
              </Button>
            ) : (
              <Card>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-4">Add Note</h3>
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Your notes (private)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm mb-4"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddNotes}
                      disabled={addingNotes}
                      className="flex-1 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                    >
                      {addingNotes ? "Saving..." : "Save Note"}
                    </button>
                    <button
                      onClick={() => {
                        setShowNotesForm(false);
                        setAdditionalNotes("");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <div className="p-4 space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-semibold text-gray-900">{formatDate(caseRecord.createdAt)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-semibold text-gray-900">{formatDate(caseRecord.updatedAt)}</p>
                </div>
                {conversations.length > 0 && (
                  <div>
                    <p className="text-gray-600">Conversations</p>
                    <p className="font-semibold text-gray-900">{conversations.length}</p>
                  </div>
                )}
                {payments.length > 0 && (
                  <div>
                    <p className="text-gray-600">Payments</p>
                    <p className="font-semibold text-gray-900">{payments.length}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
