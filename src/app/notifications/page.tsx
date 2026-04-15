"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, AlertCircle, FileText, CreditCard, Info, TrendingUp } from "lucide-react";
import Link from "next/link";

// Map DB notification types to UI types
function mapDbTypeToUiType(dbType: string): string {
  switch (dbType) {
    case "case_status_update":
    case "case_approved":
      return "case_update";
    case "deadline_reminder":
    case "rfe_alert":
      return "deadline";
    case "document_received":
      return "document";
    case "payment_receipt":
      return "billing";
    case "welcome":
    case "system_alert":
      return "system";
    default:
      return "system";
  }
}

interface DBNotification {
  id: string;
  userId: string;
  caseId: string | null;
  type: string;
  title: string;
  message: string;
  metadata: any;
  read: boolean;
  readAt: string | null;
  createdAt: string;
}

interface UINotification {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

function convertDbToUiNotification(dbNotif: DBNotification): UINotification {
  return {
    id: dbNotif.id,
    type: mapDbTypeToUiType(dbNotif.type),
    title: dbNotif.title,
    description: dbNotif.message,
    timestamp: new Date(dbNotif.createdAt),
    read: dbNotif.read,
    actionUrl: dbNotif.caseId ? `/cases/${dbNotif.caseId}` : undefined,
  };
}

type NotificationType = "all" | "case_update" | "deadline" | "document" | "billing";

function getIcon(type: string) {
  switch (type) {
    case "case_update":
      return <TrendingUp className="w-5 h-5 text-blue-500" />;
    case "deadline":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "document":
      return <FileText className="w-5 h-5 text-green-500" />;
    case "billing":
      return <CreditCard className="w-5 h-5 text-amber-600" />;
    case "system":
      return <Info className="w-5 h-5 text-slate-600" />;
  }
}

function formatFullDate(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationType>("all");
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/notifications?limit=100");
        if (!response.ok) throw new Error("Failed to fetch notifications");

        const result = await response.json();
        const uiNotifications = (result.data || []).map(convertDbToUiNotification);
        setNotifications(uiNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const displayNotifications = notifications;

  const filteredNotifications =
    activeFilter === "all"
      ? displayNotifications
      : displayNotifications.filter((n) => n.type === activeFilter);

  const markAsRead = async (id: string) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });

      if (!response.ok) throw new Error("Failed to mark as read");

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (!response.ok) throw new Error("Failed to mark all as read");

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { label: string; value: NotificationType; count: number }[] = [
    {
      label: "All",
      value: "all",
      count: displayNotifications.length,
    },
    {
      label: "Case Updates",
      value: "case_update",
      count: displayNotifications.filter((n) => n.type === "case_update").length,
    },
    {
      label: "Deadlines",
      value: "deadline",
      count: displayNotifications.filter((n) => n.type === "deadline").length,
    },
    {
      label: "Documents",
      value: "document",
      count: displayNotifications.filter((n) => n.type === "document").length,
    },
    {
      label: "Billing",
      value: "billing",
      count: displayNotifications.filter((n) => n.type === "billing").length,
    },
  ];

  const unreadCount = displayNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <Bell className="w-6 sm:w-8 h-6 sm:h-8 text-green-500 flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Notifications</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600">
          You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 border-b border-slate-200 pb-3 sm:pb-4 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === tab.value
                ? "bg-emerald-50 text-emerald-600 border border-green-500/40"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
            {tab.count > 0 && <span className="ml-1 sm:ml-2 text-xs opacity-75">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {unreadCount > 0 && (
        <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
          <button
            onClick={markAllAsRead}
            disabled={submitting}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-500/20 transition-colors text-xs sm:text-sm font-medium whitespace-nowrap disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4 flex-shrink-0" />
            {submitting ? "Marking..." : "Mark all as read"}
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block animate-spin">
            <Bell className="w-8 sm:w-12 h-8 sm:h-12 text-slate-600" />
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-4">Loading notifications...</p>
        </div>
      ) : (
        <>
      {/* Notifications List */}
      <div className="space-y-2 sm:space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Bell className="w-8 sm:w-12 h-8 sm:h-12 text-slate-600 mx-auto mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm text-slate-600">No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 sm:gap-4 p-3 sm:p-5 rounded-lg border transition-colors ${
                notification.read
                  ? "border-slate-100 bg-slate-50"
                  : "border-green-500/30 bg-green-500/5"
              }`}
            >
              <div className="flex-shrink-0 pt-1 text-sm sm:text-base">{getIcon(notification.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded flex-shrink-0">
                      New
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-700 mb-2 sm:mb-3">{notification.description}</p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-slate-400">
                    {formatFullDate(notification.timestamp)}
                  </p>

                  {notification.actionUrl && (
                    <Link
                      href={notification.actionUrl}
                      className="text-xs text-green-500 hover:text-emerald-600 font-medium transition-colors whitespace-nowrap"
                    >
                      View Case →
                    </Link>
                  )}
                </div>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  disabled={submitting}
                  className="flex-shrink-0 p-1 text-slate-400 hover:text-green-500 transition-colors disabled:opacity-50"
                  aria-label="Mark as read"
                >
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
      </>
      )}
      </div>
      </main>
      <Footer />
    </div>
  );
}
