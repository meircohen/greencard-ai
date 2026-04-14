"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store";
import { User, Lock, Bell, CreditCard, Database, Upload, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

type TabType = "profile" | "security" | "notifications" | "billing" | "data";

export default function SettingsPage() {
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"export" | "delete" | null>(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    timezone: user?.timezone || "America/New_York",
    language: user?.language || "en",
  });

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
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

  const handleProfileSave = () => {
    if (user) {
      updateProfile({
        name: profileForm.fullName,
        phone: profileForm.phone,
        timezone: profileForm.timezone,
        language: profileForm.language,
      });
      setMessage({ type: "success", text: "Profile updated successfully" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePasswordChange = () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (securityForm.newPassword.length < 8) {
      setMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    setMessage({ type: "success", text: "Password changed successfully" });
    setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "", twoFactorEnabled: false });
    setTimeout(() => setMessage(null), 3000);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account preferences and security</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`mb-6 flex items-center gap-3 p-4 rounded-lg ${
          message.type === "success" 
            ? "bg-green-500/10 border border-green-500/30" 
            : "bg-red-500/10 border border-red-500/30"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <p className={message.type === "success" ? "text-green-400" : "text-red-400"}>
            {message.text}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="p-6 bg-surface/50 border border-surface/40 rounded-lg">
              <h2 className="text-xl font-bold text-gray-100 mb-6">Profile Settings</h2>

              {/* Avatar Upload */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-300 mb-4">Profile Picture</label>
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="flex-1">
                    <button className="flex items-center gap-2 px-4 py-2 bg-deep border border-surface/30 rounded-lg text-sm font-medium text-gray-300 hover:bg-surface/20 transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Picture
                    </button>
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG or GIF. Max 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                      className="w-full px-4 py-2 bg-deep border border-surface/30 rounded-lg text-gray-200 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full px-4 py-2 bg-deep/50 border border-surface/30 rounded-lg text-gray-400 cursor-not-allowed opacity-60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-deep border border-surface/30 rounded-lg text-gray-200 focus:outline-none focus:border-green-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                      className="w-full px-4 py-2 bg-deep border border-surface/30 rounded-lg text-gray-200 focus:outline-none focus:border-green-500/50 transition-colors"
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={profileForm.language}
                      onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                      className="w-full px-4 py-2 bg-deep border border-surface/30 rounded-lg text-gray-200 focus:outline-none focus:border-green-500/50 transition-colors"
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
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="p-6 bg-surface/50 border border-surface/40 rounded-lg space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-100 mb-6">Security Settings</h2>

                {/* Change Password */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={securityForm.currentPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-deep border border-surface/30 rounded-lg text-gray-200 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          className="w-full px-4 py-2 bg-deep border border-surface/30 rounded-lg text-gray-200 focus:outline-none focus:border-green-500/50"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 bg-deep border border-surface/30 rounded-lg text-gray-200 focus:outline-none focus:border-green-500/50"
                      />
                    </div>
                    <button
                      onClick={handlePasswordChange}
                      className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* 2FA */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-deep border border-surface/30 rounded-lg mb-4">
                    <div>
                      <p className="text-gray-100 font-medium">Enable 2FA</p>
                      <p className="text-sm text-gray-400 mt-1">Add an extra layer of security to your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securityForm.twoFactorEnabled}
                        onChange={(e) => setSecurityForm({ ...securityForm, twoFactorEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
                    </label>
                  </div>
                  {securityForm.twoFactorEnabled && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-400 mb-3">Scan this QR code with your authenticator app:</p>
                      <div className="w-32 h-32 bg-white rounded-lg p-2 mb-3">
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded flex items-center justify-center text-xs text-gray-600">
                          [QR Code]
                        </div>
                      </div>
                      <p className="text-xs text-gray-400">Enter the 6-digit code from your app to confirm setup</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Sessions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-deep border border-surface/30 rounded-lg">
                    <div>
                      <p className="text-gray-100 font-medium">Current Session</p>
                      <p className="text-xs text-gray-400 mt-1">Chrome on macOS • Last active now</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded">
                      CURRENT
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-deep border border-surface/30 rounded-lg">
                    <div>
                      <p className="text-gray-100 font-medium">Safari on iPhone</p>
                      <p className="text-xs text-gray-400 mt-1">Last active 2 days ago</p>
                    </div>
                    <button className="text-xs text-red-400 hover:text-red-300 font-medium">Sign Out</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="p-6 bg-surface/50 border border-surface/40 rounded-lg">
              <h2 className="text-xl font-bold text-gray-100 mb-6">Notification Preferences</h2>

              <div className="space-y-6">
                {/* Notification Types */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">Case Updates</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-deep border border-surface/30 rounded-lg cursor-pointer hover:bg-surface/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailCaseUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailCaseUpdates: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">Email</p>
                        <p className="text-xs text-gray-400">Get notified via email</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-deep border border-surface/30 rounded-lg cursor-pointer hover:bg-surface/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsCaseUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsCaseUpdates: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">SMS</p>
                        <p className="text-xs text-gray-400">Get notified via text message</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-surface/30 pt-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">Deadlines</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-deep border border-surface/30 rounded-lg cursor-pointer hover:bg-surface/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailDeadlines}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailDeadlines: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">Email</p>
                        <p className="text-xs text-gray-400">Get notified via email</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-deep border border-surface/30 rounded-lg cursor-pointer hover:bg-surface/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.smsDeadlines}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsDeadlines: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">SMS</p>
                        <p className="text-xs text-gray-400">Get notified via text message</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="border-t border-surface/30 pt-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4">Other</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-deep border border-surface/30 rounded-lg cursor-pointer hover:bg-surface/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailDocuments}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailDocuments: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">Document Requests</p>
                        <p className="text-xs text-gray-400">When new documents are needed</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-deep border border-surface/30 rounded-lg cursor-pointer hover:bg-surface/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailBilling}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailBilling: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">Billing Updates</p>
                        <p className="text-xs text-gray-400">Invoices and subscription changes</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-deep border border-surface/30 rounded-lg cursor-pointer hover:bg-surface/20 transition-colors">
                      <input
                        type="checkbox"
                        checked={notificationSettings.pushNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                        className="w-4 h-4 accent-green-500 rounded"
                      />
                      <div>
                        <p className="text-gray-200 font-medium">Push Notifications</p>
                        <p className="text-xs text-gray-400">Browser notifications</p>
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
            <div className="p-6 bg-surface/50 border border-surface/40 rounded-lg space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-100 mb-6">Billing Settings</h2>

                {/* Current Plan */}
                <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg mb-8">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">Current Plan: Professional</h3>
                  <p className="text-gray-400 mb-4">$99.99 per month • Renews on May 14, 2025</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-400">Cases Included</p>
                      <p className="text-lg font-bold text-green-400">Unlimited</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Attorney Connections</p>
                      <p className="text-lg font-bold text-green-400">5</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                      Change Plan
                    </button>
                    <button className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-colors border border-red-500/30">
                      Cancel Subscription
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Payment Method</h3>
                  <div className="flex items-center justify-between p-4 bg-deep border border-surface/30 rounded-lg mb-4">
                    <div>
                      <p className="text-gray-100 font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-gray-400 mt-1">Expires 12/2026</p>
                    </div>
                    <button className="text-sm text-green-500 hover:text-green-400 font-medium">Update</button>
                  </div>
                  <button className="text-sm text-blue-500 hover:text-blue-400 font-medium">Add another payment method</button>
                </div>

                {/* Usage */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Usage This Month</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-300">API Requests</p>
                        <p className="text-sm text-gray-400">2,450 / 10,000</p>
                      </div>
                      <div className="w-full bg-surface/50 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "24.5%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-300">Document Storage</p>
                        <p className="text-sm text-gray-400">3.2 GB / 50 GB</p>
                      </div>
                      <div className="w-full bg-surface/50 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "6.4%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invoice History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-4">Invoice History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-surface/30">
                          <th className="px-4 py-3 text-left text-gray-400">Date</th>
                          <th className="px-4 py-3 text-left text-gray-400">Amount</th>
                          <th className="px-4 py-3 text-left text-gray-400">Status</th>
                          <th className="px-4 py-3 text-left text-gray-400">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-surface/20 hover:bg-surface/20">
                          <td className="px-4 py-3 text-gray-300">April 14, 2025</td>
                          <td className="px-4 py-3 text-gray-300">$99.99</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded">Paid</span></td>
                          <td className="px-4 py-3"><button className="text-green-500 hover:text-green-400 text-xs font-medium">Download</button></td>
                        </tr>
                        <tr className="border-b border-surface/20 hover:bg-surface/20">
                          <td className="px-4 py-3 text-gray-300">March 14, 2025</td>
                          <td className="px-4 py-3 text-gray-300">$99.99</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded">Paid</span></td>
                          <td className="px-4 py-3"><button className="text-green-500 hover:text-green-400 text-xs font-medium">Download</button></td>
                        </tr>
                        <tr className="border-b border-surface/20 hover:bg-surface/20">
                          <td className="px-4 py-3 text-gray-300">February 14, 2025</td>
                          <td className="px-4 py-3 text-gray-300">$99.99</td>
                          <td className="px-4 py-3"><span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded">Paid</span></td>
                          <td className="px-4 py-3"><button className="text-green-500 hover:text-green-400 text-xs font-medium">Download</button></td>
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
            <div className="p-6 bg-surface/50 border border-surface/40 rounded-lg">
              <h2 className="text-xl font-bold text-gray-100 mb-6">Data Management</h2>

              <div className="space-y-6">
                {/* Export Data */}
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">Export Your Data</h3>
                  <p className="text-gray-400 mb-4">
                    Download a copy of all your data including cases, documents, and account information in a portable format.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Export Data
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">Delete Account</h3>
                  <p className="text-gray-400 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface border border-surface/40 rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold text-gray-100 mb-4">
              {modalAction === "export" ? "Export Your Data?" : "Delete Your Account?"}
            </h3>
            <p className="text-gray-400 mb-6">
              {modalAction === "export"
                ? "We will prepare your data export and send it to your email address. This may take a few minutes."
                : "This will permanently delete your account and all associated data. This action cannot be undone."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-deep border border-surface/30 text-gray-300 font-medium rounded-lg hover:bg-surface/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors ${
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
  );
}
