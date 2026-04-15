"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Clock, FileText, Loader2 } from "lucide-react";

interface CaseStatusResult {
  receiptNumber: string;
  status: string;
  formType: string;
  lastUpdated: string;
  description: string;
  estimatedProcessingTime?: string;
}

export default function CaseStatusPage() {
  const [receiptNumber, setReceiptNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaseStatusResult | null>(null);
  const [error, setError] = useState("");

  const validateReceiptNumber = (input: string): boolean => {
    // Format: XXX-XXXXXXXXXX (3 letters, dash, 9 digits)
    const regex = /^[A-Z]{3}-\d{9,10}$/;
    return regex.test(input.toUpperCase());
  };

  const formatReceiptNumber = (input: string): string => {
    // Remove any formatting and convert to uppercase
    const cleaned = input.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Format as XXX-XXXXXXXXXX
    if (cleaned.length >= 3) {
      return cleaned.substring(0, 3) + "-" + cleaned.substring(3, 13);
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setReceiptNumber(formatReceiptNumber(input));
    setError("");
  };

  const handleCheckStatus = async () => {
    if (!receiptNumber) {
      setError("Please enter a receipt number");
      return;
    }

    if (!validateReceiptNumber(receiptNumber)) {
      setError("Invalid receipt number format. Use format: XXX-XXXXXXXXXX");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/case-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiptNumber }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to check case status");
        return;
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while checking status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCheckStatus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            USCIS Case Status
          </h1>
          <p className="text-lg text-gray-600">
            Check the status of your USCIS application or petition
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 mb-8">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="receipt"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Receipt Number
              </label>
              <input
                id="receipt"
                type="text"
                placeholder="e.g., IOE-0912345678"
                value={receiptNumber}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: 3 letters, dash, 9-10 digits (e.g., IOE-0912345678)
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              onClick={handleCheckStatus}
              disabled={loading || !receiptNumber}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Checking Status...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Check Status
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Status Header */}
            <div
              className={`p-6 sm:p-8 border-l-4 ${
                result.status === "Approved"
                  ? "border-green-500 bg-green-50"
                  : result.status === "Denied"
                    ? "border-red-500 bg-red-50"
                    : result.status === "Received"
                      ? "border-blue-500 bg-blue-50"
                      : "border-yellow-500 bg-yellow-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {result.status}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Receipt Number: {result.receiptNumber}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {result.status === "Approved" ? (
                    <CheckCircle2 size={40} className="text-green-600" />
                  ) : result.status === "Denied" ? (
                    <AlertCircle size={40} className="text-red-600" />
                  ) : (
                    <Clock size={40} className="text-blue-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Form Type */}
              <div className="border-b pb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Form Type
                </h3>
                <p className="text-lg text-gray-900">{result.formType}</p>
              </div>

              {/* Last Updated */}
              <div className="border-b pb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Last Updated
                </h3>
                <p className="text-lg text-gray-900">{result.lastUpdated}</p>
              </div>

              {/* Description */}
              <div className="border-b pb-6">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Status Details
                </h3>
                <p className="text-base text-gray-700 leading-relaxed">
                  {result.description}
                </p>
              </div>

              {/* Estimated Processing Time (if available) */}
              {result.estimatedProcessingTime && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Estimated Processing Time
                  </h3>
                  <p className="text-base text-gray-700">
                    {result.estimatedProcessingTime}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Resources */}
            <div className="px-6 sm:px-8 py-6 bg-blue-50 border-t border-blue-200">
              <p className="text-sm text-gray-700 mb-3">
                <strong>Need more information?</strong>
              </p>
              <a
                href="https://www.uscis.gov/case-status"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Visit USCIS Case Status Portal
              </a>
            </div>
          </div>
        )}

        {/* Information Card */}
        {!result && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Where to find your receipt number:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>
                  On your Notice of Action (Form I-797) - top right corner
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>In your USCIS account under "My Cases"</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">•</span>
                <span>In confirmation emails from USCIS</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
