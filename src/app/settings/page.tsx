"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { User, Lock, Bell, CreditCard, Database, Upload, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

type TabType = "profile" | "security" | "notifications" | "billing" | "data";

interface ProfileData {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  locale: string | null;
  timezone: string | null;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"export" | "delete" | null>(null);

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    timezone: "America/New_York",
    locale: "en",
  });

  // Security state
  const [securitySubmitting, setSecuritySubmitting] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailCaseUpdates: true,
    emailDeadlines: true,
    emailDocuments: true,
    emailBilling: true,
    smsCaseUpdates: false,
    smsDeadlines: true,
    pushNotifications: true,
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await fetch("/api/settings/profile");
        if (!response.ok) throw new Error("Failed to fetch profile");

        const result = await response.json();
        const data = result.data;
        setProfileData(data);
        setProfileForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          timezone: data.timezone || "America/New_York",
          locale: data.locale || "en",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage({ type: "error", text: "Failed to load profile" });
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSave = async () => {
    try {
      setProfileSubmitting(true);
      const response = await fetch("/api/settings/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          timezone: profileForm.timezone,
          locale: profileForm.locale,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const result = await response.json();
      setProfileData(result.data);
      setMessage({ type: "success", text: "Profile updated successfully" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const handlePasswordChange = async () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (securityForm.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    try {
      setSecuritySubmitting(true);
      const response = await fetch("/api/settings/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      setMessage({
        type: "success",
        text: "Password changed successfully. Please login again.",
      });
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        // Redirect to login or refresh
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to change password",
      });
    } finally {
      setSecuritySubmitting(false);
    }
  };

  const handleNotificationSave = () => {
    setMessage({ type: "success", text: "Notification preferences updated" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExportData = () => {
    setModalAction("export");
    setShowModal(true);
  };

  const handleDeleteAccount = () => {
    setModalAction("delete");
    setShowModal(true);
  };

  const confirmAction = () => {
    if (modalAction === "export") {
      setMessage({ type: "success", text: "Your data export has started. You will receive it via email shortly." });
    } else if (modalAction === "delete") {
      setMessage({ type: "success", text: "Your account deletion request has been submitted. You will receive a confirmation email." });
    }
    setShowModal(false);
    setModalAction(null);
    setTimeout(() => setMessage(null), 5000);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "billing", label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
    { id: "data", label: "Data", icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 pt-20 sm:pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your account preferences and security</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 flex items-center gap-3 p-4 rounded-lg ${
          message.type === "success"
            ? "bg-emerald-50 border border-emerald-300"
            : "bg-red-50 border border-red-200"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <p className={message.type === "success" ? "text-emerald-600" : "text-red-600"}>
            {message.text}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="space-y-1 sm:space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-300"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-lg">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Profile Settings</h2>

              {profileLoading ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">Loading profile...</p>
                </div>
              ) : (
                <>
                  {/* Avatar Upload */}
                  <div className="mb-6 sm:mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-3 sm:mb-4">Profile Picture</label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                      <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {profileForm.fullName?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Picture
                        </button>
                        <p className="text-xs text-slate-500 mt-2">PNG, JPG or GIF. Max 5MB.</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={profileForm.fullName}
                          onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          disabled
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                        <select
                          value={profileForm.timezone}
                          onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500 transition-colors"
                        >
                          <option>America/New_York</option>
                          <option>America/Chicago</option>
                          <option>America/Denver</option>
                          <option>America/Los_Angeles</option>
                          <option>Europe/London</option>
                          <option>Europe/Paris</option>
                          <option>Asia/Tokyo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                        <select
                          value={profileForm.locale}
                          onChange={(e) => setProfileForm({ ...profileForm, locale: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500 transition-colors"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={handleProfileSave}
                      disabled={profileSubmitting}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {profileSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-lg space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Security Settings</h2>

                {/* Change Password */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Change Password</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500 transition-colors"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-800"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-green-500 transition-colors"
                      />
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      disabled={securitySubmitting}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      {securitySubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>

                {/* 2FA */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Two-Factor Authentication</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-lg mb-4">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-sm sm:text-base text-slate-900 font-medium">Two-Factor Authentication</p>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">Protect your account with an authenticator app</p>
                    </div>
                    <a
                      href="/settings/mfa"
                      className="px-4 py-2 bg-green-600 text-white text-xs sm:text-sm rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap"
                    >
                      Set up 2FA
                    </a>
                  </div>
                </div>
              </div>

              {/* Active Sessions */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Active Sessions</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-lg">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-sm sm:text-base text-slate-900 font-medium">Current Session</p>
                      <p className="text-xs text-slate-600 mt-1">Chrome on macOS • Last active now</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded whitespace-nowrap">
                      CURRENT
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-lg">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-sm sm:text-base text-slate-900 font-medium">Safari on iPhone</p>
                      <p className="text-xs text-slate-600 mt-1">Last active 2 days ago</p>
                    </div>
                    <button className="text-xs text-red-600 hover:text-red-700 font-medium whitespace-nowrap">Sign Out</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-lg">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Notification Preferences</h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Notification Types */}
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 sm:mb-4">Case Updates</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center gap-2 sm:gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailCaseUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailCaseUpdates: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base text-slate-800 font-medium">Email</p>
                        <p className="text-xs text-slate-500">Get notified via email</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 sm:gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsCaseUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsCaseUpdates: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base text-slate-800 font-medium">SMS</p>
                        <p className="text-xs text-slate-500">Get notified via text message</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 sm:pt-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 sm:mb-4">Deadlines</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center gap-2 sm:gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailDeadlines}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailDeadlines: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base text-slate-800 font-medium">Email</p>
                        <p className="text-xs text-slate-500">Get notified via email</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 sm:gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsDeadlines}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsDeadlines: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base text-slate-800 font-medium">SMS</p>
                        <p className="text-xs text-slate-500">Get notified via text message</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 sm:pt-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-3 sm:mb-4">Other</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <label className="flex items-center gap-2 sm:gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailDocuments}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailDocuments: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base text-slate-800 font-medium">Document Requests</p>
                        <p className="text-xs text-slate-500">When new documents are needed</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 sm:gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailBilling}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailBilling: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base text-slate-800 font-medium">Billing Updates</p>
                        <p className="text-xs text-slate-500">Invoices and subscription changes</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-2 sm:gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base text-slate-800 font-medium">Push Notifications</p>
                        <p className="text-xs text-slate-500">Browser notifications</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleNotificationSave}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && (
            <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-lg space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Billing Settings</h2>

                {/* Current Plan */}
                <div className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Current Plan: Professional</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">$99.99 per month • Renews on May 14, 2025</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <div>
                      <p className="text-xs text-slate-500">Cases Included</p>
                      <p className="text-base sm:text-lg font-bold text-emerald-600">Unlimited</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Attorney Connections</p>
                      <p className="text-base sm:text-lg font-bold text-emerald-600">5</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button className="px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base font-medium rounded-lg transition-colors">
                      Change Plan
                    </button>
                    <button className="px-4 sm:px-6 py-2 bg-red-50 hover:bg-red-500/20 text-red-600 text-sm sm:text-base font-medium rounded-lg transition-colors border border-red-200">
                      Cancel Subscription
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Payment Method</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white border border-slate-200 rounded-lg mb-3 sm:mb-4">
                    <div>
                      <p className="text-sm sm:text-base text-slate-900 font-medium">Visa ending in 4242</p>
                      <p className="text-xs sm:text-sm text-slate-500 mt-1">Expires 12/2026</p>
                    </div>
                    <button className="text-xs sm:text-sm text-green-500 hover:text-emerald-600 font-medium mt-2 sm:mt-0">Update</button>
                  </div>
                  <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-400 font-medium">Add another payment method</button>
                </div>

                {/* Usage */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Usage This Month</h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs sm:text-sm text-slate-700">API Requests</p>
                        <p className="text-xs sm:text-sm text-slate-500">2,450 / 10,000</p>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "24.5%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs sm:text-sm text-slate-700">Document Storage</p>
                        <p className="text-xs sm:text-sm text-slate-500">3.2 GB / 50 GB</p>
                      </div>
                      <div className="w-full bg-white rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "6.4%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice History */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Invoice History</h3>
                  <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <table className="w-full text-xs sm:text-sm whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-500">Date</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-500">Amount</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-500">Status</th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-500">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-surface/20 hover:bg-slate-50">
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700">April 14, 2025</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700">$99.99</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded">Paid</span></td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><button className="text-green-500 hover:text-emerald-600 text-xs font-medium">Download</button></td>
                        </tr>
                        <tr className="border-b border-surface/20 hover:bg-slate-50">
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700">March 14, 2025</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700">$99.99</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded">Paid</span></td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><button className="text-green-500 hover:text-emerald-600 text-xs font-medium">Download</button></td>
                        </tr>
                        <tr className="border-b border-surface/20 hover:bg-slate-50">
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700">February 14, 2025</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3 text-slate-700">$99.99</td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-medium rounded">Paid</span></td>
                          <td className="px-2 sm:px-4 py-2 sm:py-3"><button className="text-green-500 hover:text-emerald-600 text-xs font-medium">Download</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === "data" && (
            <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-lg">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Data Management</h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Export Data */}
                <div className="p-4 sm:p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Export Your Data</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                    Download a copy of all your data including cases, documents, and account information in a portable format.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="px-4 sm:px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
                  >
                    Export Data
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">Delete Account</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mb-3 sm:mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-slate-200 rounded-lg p-4 sm:p-6 max-w-sm w-full">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">
              {modalAction === "export" ? "Export Your Data?" : "Delete Your Account?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">
              {modalAction === "export"
                ? "We will prepare your data export and send it to your email address. This may take a few minutes."
                : "This will permanently delete your account and all associated data. This action cannot be undone."}
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  modalAction === "export"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {modalAction === "export" ? "Export" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
      </main>
      <Footer />
    </div>
  );
}
