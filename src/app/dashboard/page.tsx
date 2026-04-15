"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n";
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  MessageSquare,
  CreditCard,
  Upload,
  ArrowRight,
  Menu,
  X,
  Home,
  FileCheck,
  Mail,
  BookOpen,
  Settings,
  ChevronRight,
  Briefcase,
  User,
  LogOut,
  Loader,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";

interface Document {
  name: string;
  status: "uploaded" | "pending" | "not-required";
  uploadedDate?: string;
}

interface Message {
  id: string;
  sender: string;
  senderRole: "team" | "attorney";
  content: string;
  timestamp: string;
  avatar: string;
}

interface CaseStep {
  step: number;
  label: string;
  completed: boolean;
  current: boolean;
}

interface UserInfo {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface CaseData {
  id: string;
  caseType: string;
  category: string;
  status: string;
  attorneyId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedDocCategory, setExpandedDocCategory] = useState<string | null>(
    "marriage"
  );

  // Data fetching states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [cases, setCases] = useState<CaseData[]>([]);
  const [notifications, setNotifications] = useState([]);
  const [isDemo, setIsDemo] = useState(false);

  // Upload states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingDocument, setUploadingDocument] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const displayName = userInfo?.fullName?.split(" ")[0] || user?.name?.split(" ")[0] || "Client";

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user info
        const meResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (meResponse.status === 401) {
          router.push("/login");
          return;
        }

        if (!meResponse.ok) {
          throw new Error("Failed to fetch user info");
        }

        const meData = await meResponse.json();
        setUserInfo(meData.user);

        // Fetch cases
        const casesResponse = await fetch("/api/cases?page=1&limit=10", {
          credentials: "include",
        });

        if (!casesResponse.ok) {
          console.error("Failed to fetch cases");
        } else {
          const casesData = await casesResponse.json();
          setCases(casesData.cases || []);
        }

        // Fetch notifications
        const notificationsResponse = await fetch(
          "/api/notifications?page=1&limit=10",
          {
            credentials: "include",
          }
        );

        if (!notificationsResponse.ok) {
          console.error("Failed to fetch notifications");
        } else {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.data || []);
        }

        // If no cases, show demo mode
        if (!cases || cases.length === 0) {
          setIsDemo(true);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Mock data - Marriage-based green card case (used as fallback)
  const mockCaseSteps: CaseStep[] = [
    { step: 1, label: "Intake", completed: true, current: false },
    { step: 2, label: "Documents", completed: true, current: false },
    { step: 3, label: "Attorney Review", completed: true, current: true },
    { step: 4, label: "Filed", completed: false, current: false },
    { step: 5, label: "Processing", completed: false, current: false },
    { step: 6, label: "Approved", completed: false, current: false },
  ];

  const mockDocuments: Record<string, Document[]> = {
    marriage: [
      {
        name: "Marriage Certificate",
        status: "uploaded",
        uploadedDate: "April 10, 2026",
      },
      { name: "Photos Together", status: "uploaded", uploadedDate: "April 10" },
      {
        name: "Wedding Invitations",
        status: "pending",
      },
      {
        name: "Joint Bank Statements",
        status: "pending",
      },
    ],
    immigration: [
      {
        name: "Birth Certificate",
        status: "uploaded",
        uploadedDate: "April 2, 2026",
      },
      {
        name: "Passport Copy",
        status: "uploaded",
        uploadedDate: "April 2, 2026",
      },
      { name: "I-94", status: "uploaded", uploadedDate: "April 5, 2026" },
      { name: "Medical Exam (I-693)", status: "pending" },
    ],
    financial: [
      { name: "Tax Returns (2024)", status: "uploaded", uploadedDate: "April 8" },
      { name: "Tax Returns (2023)", status: "pending" },
      {
        name: "Affidavit of Support (I-864)",
        status: "pending",
      },
      { name: "W-2 Forms", status: "uploaded", uploadedDate: "April 8" },
    ],
  };

  const mockMessages: Message[] = [
    {
      id: "1",
      sender: "Case Team",
      senderRole: "team",
      content:
        "We've reviewed your initial documents. The marriage evidence looks strong. Next, we need your spouse's tax returns and medical exam results.",
      timestamp: "Today, 10:30 AM",
      avatar: "CT",
    },
    {
      id: "2",
      sender: "Jeremy Knight, Esq.",
      senderRole: "attorney",
      content:
        "I've completed my review of your case. Everything looks good. We're on track to file your I-485 next week.",
      timestamp: "Yesterday, 2:15 PM",
      avatar: "JK",
    },
    {
      id: "3",
      sender: "Case Team",
      senderRole: "team",
      content:
        "Welcome to GreenCard.ai! We've started preparing your I-485. Please upload your marriage certificate and recent photos.",
      timestamp: "April 2, 2026",
      avatar: "CT",
    },
  ];

  const mockPaymentInfo = {
    plan: "Complete - Marriage Green Card",
    total: 1499,
    paid: 374.75,
    payments: 3,
    totalPayments: 12,
    nextPayment: 124.92,
    nextPaymentDate: "May 15, 2026",
  };

  // Use mock data when in demo mode or data is empty
  const caseSteps = mockCaseSteps;
  const documents = mockDocuments;
  const messages = mockMessages;
  const paymentInfo = mockPaymentInfo;

  const documentStatuses = {
    uploaded: Object.values(documents)
      .flat()
      .filter((d) => d.status === "uploaded").length,
    pending: Object.values(documents)
      .flat()
      .filter((d) => d.status === "pending").length,
    total: Object.values(documents).flat().length,
  };

  const sidebarLinks = [
    { labelKey: "dashboard.myCase", icon: Briefcase, href: "#" },
    { labelKey: "dashboard.documents", icon: FileCheck, href: "#" },
    { labelKey: "dashboard.messages", icon: Mail, href: "#" },
    { labelKey: "dashboard.payments", icon: CreditCard, href: "#" },
    { labelKey: "dashboard.interviewPrep", icon: BookOpen, href: "#" },
    { labelKey: "dashboard.settings", icon: Settings, href: "#" },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDocument(file.name);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caseId", cases[0]?.id || "default");
      formData.append("documentType", "general");

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        setUploadSuccess(`${file.name} uploaded successfully`);
        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => {
          setUploadingDocument(null);
          setUploadSuccess(null);
        }, 3000);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadingDocument(null);
      alert(`Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-emerald-700 font-medium">{t('dashboard.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Demo Banner */}
      {isDemo && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <p className="text-sm text-blue-900">
            {t('dashboard.demoBanner')}
          </p>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <p className="text-sm text-red-900">
            <span className="font-semibold">{t('common.error')}:</span> {error}
          </p>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-emerald-50 to-white border-r border-emerald-100 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="px-6 py-8 border-b border-emerald-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-emerald-900">GreenCard</h2>
            </div>
            <p className="text-sm text-emerald-700 mt-2">{t('dashboard.clientPortal')}</p>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarLinks.map((link) => (
              <a
                key={link.labelKey}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 text-emerald-900 hover:bg-emerald-100 rounded-lg transition-colors group"
              >
                <link.icon className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700" />
                <span className="font-medium">{t(link.labelKey)}</span>
              </a>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-6 border-t border-emerald-100 space-y-2">
            <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 rounded-lg">
              <User className="w-5 h-5 text-emerald-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-900 truncate">
                  {displayName}
                </p>
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">{t('auth.signOut')}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-24 left-4 z-50 md:hidden p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {/* Main Content */}
      <main className="md:ml-64">
        {/* Top Header */}
        <div className="bg-white border-b border-emerald-100 sticky top-0 z-30">
          <div className="px-4 sm:px-6 py-4 md:py-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-950 truncate">
              {t('dashboard.welcomeBack')} {displayName}
            </h1>
            <p className="text-emerald-700 text-xs sm:text-sm mt-1 truncate">
              {t('dashboard.caseProgressing')}
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
          {/* 1. Case Status Hero */}
          <section className="bg-gradient-to-br from-emerald-50 to-emerald-25 border border-emerald-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Left Side - Case Info */}
              <div>
                <h2 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                  {t('dashboard.yourCase')}
                </h2>
                <h3 className="text-3xl font-bold text-emerald-950 mb-1">
                  {t('dashboard.marriageBasedGreenCard')}
                </h3>
                <p className="text-emerald-700 mb-6">
                  {t('dashboard.formI485')}
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 font-medium">
                      {t('dashboard.filedDate')}
                    </span>
                    <span className="text-emerald-950 font-semibold">
                      {t('dashboard.notYetFiled')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 font-medium">
                      {t('dashboard.estimatedTimeline')}
                    </span>
                    <span className="text-emerald-950 font-semibold">
                      {t('dashboard.processingMonths')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-emerald-100">
                    <span className="text-emerald-700 font-medium">
                      {t('dashboard.attorney')}
                    </span>
                    <span className="text-emerald-950 font-semibold">
                      {t('dashboard.attorneyName')}
                    </span>
                  </div>
                </div>

                {/* Next Action */}
                <div className="bg-white border-2 border-amber-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-amber-900 mb-2">
                    {t('dashboard.actionNeeded')}
                  </p>
                  <p className="text-sm text-amber-800 mb-3">
                    {t('dashboard.uploadDocumentsPrompt')}
                  </p>
                  <button
                    onClick={triggerFileInput}
                    disabled={uploadingDocument !== null}
                    className="w-full bg-amber-50 hover:bg-amber-100 disabled:opacity-50 text-amber-900 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingDocument ? `${t('common.uploading')}... ${uploadingDocument}` : t('dashboard.uploadDocuments')}
                  </button>
                  {uploadSuccess && (
                    <p className="text-xs text-emerald-700 mt-2">{uploadSuccess}</p>
                  )}
                </div>
              </div>

              {/* Right Side - Progress Steps */}
              <div>
                <h4 className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-6">
                  {t('dashboard.caseProgress')}
                </h4>
                <div className="space-y-3">
                  {caseSteps.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          item.completed
                            ? "bg-emerald-500 text-white"
                            : item.current
                              ? "bg-emerald-100 border-2 border-emerald-500 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.completed ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          item.step
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            item.current
                              ? "text-emerald-700"
                              : item.completed
                                ? "text-emerald-600"
                                : "text-gray-500"
                          }`}
                        >
                          {item.label}
                        </p>
                      </div>
                      {item.current && (
                        <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded">
                          {t('dashboard.current')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Document Checklist */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mb-4 sm:mb-6">
              {t('dashboard.documentChecklist')}
            </h2>
            <div className="bg-white border border-emerald-200 rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-emerald-950">
                    {t('dashboard.documentsReady')}
                  </p>
                  <p className="text-sm text-emerald-700">
                    {documentStatuses.uploaded} of {documentStatuses.total}
                    {t('dashboard.uploaded')}
                  </p>
                </div>
                <div className="w-32 h-2 bg-emerald-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{
                      width: `${(documentStatuses.uploaded / documentStatuses.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="divide-y divide-emerald-100">
                {Object.entries(documents).map(([category, docs]) => (
                  <div key={category}>
                    <button
                      onClick={() =>
                        setExpandedDocCategory(
                          expandedDocCategory === category ? null : category
                        )
                      }
                      className="w-full px-6 py-4 hover:bg-emerald-25 transition-colors flex items-center justify-between group"
                    >
                      <span className="font-semibold text-emerald-950 capitalize">
                        {t(category === "marriage"
                          ? "dashboard.marriageEvidence"
                          : category === "immigration"
                            ? "dashboard.immigrationDocuments"
                            : "dashboard.financialDocuments")}
                      </span>
                      <ChevronRight
                        className={`w-5 h-5 text-emerald-600 transition-transform ${
                          expandedDocCategory === category ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {expandedDocCategory === category && (
                      <div className="bg-emerald-25 px-6 py-4 space-y-3">
                        {docs.map((doc, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {doc.status === "uploaded" ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              ) : doc.status === "pending" ? (
                                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                              ) : (
                                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="font-medium text-emerald-950">
                                  {doc.name}
                                </p>
                                {doc.uploadedDate && (
                                  <p className="text-xs text-emerald-600">
                                    {doc.uploadedDate}
                                  </p>
                                )}
                              </div>
                            </div>
                            {doc.status === "pending" && (
                              <button
                                onClick={triggerFileInput}
                                disabled={uploadingDocument !== null}
                                className="ml-4 px-3 py-1 bg-emerald-100 hover:bg-emerald-200 disabled:opacity-50 text-emerald-700 text-sm font-medium rounded transition-colors flex items-center gap-1 whitespace-nowrap"
                              >
                                <Upload className="w-4 h-4" />
                                {t('dashboard.upload')}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Recent Messages */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mb-4 sm:mb-6">
              {t('dashboard.recentMessages')}
            </h2>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white border border-emerald-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${
                        msg.senderRole === "attorney"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                    >
                      {msg.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-emerald-950">
                          {msg.sender}
                        </p>
                        <span className="text-xs text-emerald-600">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-emerald-800 leading-relaxed">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
              {t('dashboard.viewAllMessages')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          {/* 4. Payment Summary */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mb-4 sm:mb-6">
              {t('dashboard.paymentSummary')}
            </h2>
            <div className="bg-white border border-emerald-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <h3 className="text-lg font-bold text-emerald-950 mb-4">
                    {paymentInfo.plan}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-emerald-700">{t('dashboard.totalServiceFee')}</span>
                      <span className="font-bold text-emerald-950">
                        ${paymentInfo.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-emerald-700">{t('dashboard.amountPaid')}</span>
                      <span className="font-bold text-emerald-950">
                        ${paymentInfo.paid.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-px bg-emerald-200" />
                    <div className="flex justify-between">
                      <span className="text-emerald-700">
                        {t('dashboard.remainingBalance')}
                      </span>
                      <span className="font-bold text-emerald-950">
                        ${(paymentInfo.total - paymentInfo.paid).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-950 mb-4">
                    {t('dashboard.paymentProgress')}
                  </h4>
                  <div className="bg-emerald-50 rounded-lg p-4 mb-4">
                    <div className="flex items-end justify-between mb-2">
                      <span className="text-sm text-emerald-700">
                        {paymentInfo.payments} of {paymentInfo.totalPayments}{" "}
                        {t('dashboard.payments')}
                      </span>
                      <span className="text-sm font-bold text-emerald-950">
                        {Math.round(
                          (paymentInfo.paid / paymentInfo.total) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full h-3 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                        style={{
                          width: `${(paymentInfo.paid / paymentInfo.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-25 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      {t('dashboard.nextPaymentDue')}
                    </p>
                    <p className="text-sm text-blue-800">
                      ${paymentInfo.nextPayment.toFixed(2)} on{" "}
                      {paymentInfo.nextPaymentDate}
                    </p>
                  </div>
                </div>
              </div>
              <button className="mt-6 text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2">
                {t('dashboard.viewPaymentHistory')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* 5. Quick Actions */}
          <section className="mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mb-4 sm:mb-6">
              {t('dashboard.quickActions')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <button
                onClick={triggerFileInput}
                disabled={uploadingDocument !== null}
                className="p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 disabled:opacity-50 text-white rounded-2xl hover:shadow-lg transition-all hover:scale-105 font-semibold flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                {uploadingDocument ? t('common.uploading') : t('dashboard.uploadDocument')}
              </button>
              <button className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:shadow-lg transition-all hover:scale-105 font-semibold flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('dashboard.sendMessage')}
              </button>
              <button className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all hover:scale-105 font-semibold flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                {t('dashboard.scheduleCall')}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
