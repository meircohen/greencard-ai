"use client";

import { Bell, Check, CheckCheck, X, AlertCircle, FileText, CreditCard, Info, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useNotificationStore, Notification } from "@/lib/store";
import Link from "next/link";

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "deadline",
    title: "RFE Response Due Soon",
    description: "Your RFE response for EB-2 case is due in 5 days",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/cases/123",
  },
  {
    id: "2",
    type: "case_update",
    title: "Case Status Updated",
    description: "Your I-140 petition has been approved",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    actionUrl: "/cases/456",
  },
  {
    id: "3",
    type: "document",
    title: "New Document Required",
    description: "Medical examination results needed for your application",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionUrl: "/cases/789",
  },
  {
    id: "4",
    type: "billing",
    title: "Payment Received",
    description: "Your subscription payment has been processed successfully",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Visa Bulletin Updated",
    description: "June 2025 visa bulletin is now available",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

function getIcon(type: Notification["type"]) {
  switch (type) {
    case "case_update":
      return <TrendingUp className="w-4 h-4 text-blue-500" />;
    case "deadline":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "document":
      return <FileText className="w-4 h-4 text-green-500" />;
    case "billing":
      return <CreditCard className="w-4 h-4 text-amber-400" />;
    case "system":
      return <Info className="w-4 h-4 text-gray-400" />;
  }
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();

  // Initialize with mock notifications on first load
  const displayNotifications = notifications.length === 0 ? mockNotifications : notifications;
  const unreadNotifications = displayNotifications.filter((n) => !n.read);
  const displayUnreadCount = unreadNotifications.length || unreadCount;

  const handleMarkRead = (id: string) => {
    markRead(id);
  };

  const handleMarkAllRead = () => {
    markAllRead();
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-200 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {displayUnreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
            {displayUnreadCount > 99 ? "99+" : displayUnreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-deep/95 backdrop-blur-md border border-surface/40 rounded-lg shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface/30">
            <h3 className="text-sm font-semibold text-gray-100">Notifications</h3>
            {displayUnreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1 text-xs text-green-500 hover:text-green-400 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Info className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No notifications yet</p>
              </div>
            ) : (
              displayNotifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-4 border-b border-surface/20 hover:bg-surface/20 transition-colors cursor-pointer group`}
                  onClick={() => handleMarkRead(notification.id)}
                >
                  <div className="flex-shrink-0 pt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-100">{notification.title}</p>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{notification.description}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatRelativeTime(notification.timestamp)}</p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(notification.id);
                      }}
                      className="flex-shrink-0 p-1 text-gray-500 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-center p-3 border-t border-surface/30">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs text-green-500 hover:text-green-400 font-medium transition-colors"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
