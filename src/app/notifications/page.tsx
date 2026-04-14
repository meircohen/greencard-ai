"use client";

import { useState } from "react";
import { useNotificationStore, Notification } from "@/lib/store";
import { Bell, Check, CheckCheck, Trash2, AlertCircle, FileText, CreditCard, Info, TrendingUp } from "lucide-react";
import Link from "next/link";

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "deadline",
    title: "RFE Response Due Soon",
    description: "Your RFE response for EB-2 case is due in 5 days. Please prepare all required documentation and submit before the deadline.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/cases/123",
  },
  {
    id: "2",
    type: "case_update",
    title: "Case Status Updated",
    description: "Your I-140 petition has been approved. You can now proceed to the next stage of your application.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/cases/456",
  },
  {
    id: "3",
    type: "document",
    title: "New Document Required",
    description: "Medical examination results needed for your application. Please schedule your appointment at a USCIS-designated civil surgeon.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/cases/789",
  },
  {
    id: "4",
    type: "billing",
    title: "Payment Received",
    description: "Your subscription payment of $99.99 has been processed successfully. Your next billing date is May 14, 2025.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Visa Bulletin Updated",
    description: "June 2025 visa bulletin is now available. Check the latest visa number availability and priority dates.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "6",
    type: "case_update",
    title: "Interview Scheduled",
    description: "Your consular interview has been scheduled for June 15, 2025 at 9:00 AM at the US Consulate.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/cases/123",
  },
  {
    id: "7",
    type: "deadline",
    title: "Form I-485 Expires Soon",
    description: "Your Form I-485 approval is valid for 1 year. You must use your visa before the expiration date.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "8",
    type: "document",
    title: "Tax Documents Needed",
    description: "Please upload your last 2 years of tax returns for income verification.",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/cases/456",
  },
];

type NotificationType = "all" | "case_update" | "deadline" | "document" | "billing";

function getIcon(type: Notification["type"]) {
  switch (type) {
    case "case_update":
      return <TrendingUp className="w-5 h-5 text-blue-500" />;
    case "deadline":
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    case "document":
      return <FileText className="w-5 h-5 text-green-500" />;
    case "billing":
      return <CreditCard className="w-5 h-5 text-amber-400" />;
    case "system":
      return <Info className="w-5 h-5 text-gray-400" />;
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
  const { notifications, markRead, markAllRead } = useNotificationStore();

  const displayNotifications = notifications.length === 0 ? mockNotifications : notifications;

  const filteredNotifications =
    activeFilter === "all"
      ? displayNotifications
      : displayNotifications.filter((n) => n.type === activeFilter);

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-gray-100">Notifications</h1>
        </div>
        <p className="text-gray-400">
          You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-surface/30 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === tab.value
                ? "bg-green-500/20 text-green-400 border border-green-500/40"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab.label}
            {tab.count > 0 && <span className="ml-2 text-xs opacity-75">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {unreadCount > 0 && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm font-medium"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notifications in this category</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-4 p-5 rounded-lg border transition-colors ${
                notification.read
                  ? "border-surface/20 bg-surface/5"
                  : "border-green-500/30 bg-green-500/5"
              }`}
            >
              <div className="flex-shrink-0 pt-1">{getIcon(notification.type)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-base font-semibold text-gray-100">
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">
                      New
                    </span>
                  )}
                </div>
                
                <p className="text-gray-300 text-sm mb-3">{notification.description}</p>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {formatFullDate(notification.timestamp)}
                  </p>
                  
                  {notification.actionUrl && (
                    <Link
                      href={notification.actionUrl}
                      className="text-xs text-green-500 hover:text-green-400 font-medium transition-colors"
                    >
                      View Case →
                    </Link>
                  )}
                </div>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markRead(notification.id)}
                  className="flex-shrink-0 p-2 text-gray-500 hover:text-green-500 transition-colors"
                  aria-label="Mark as read"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
