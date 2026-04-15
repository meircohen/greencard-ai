import React from "react";
import { CheckCircle2, AlertCircle, Clock, XCircle } from "lucide-react";
import { getProcessingTime } from "@/lib/uscis-data";

export interface CaseStatusData {
  receiptNumber: string;
  status: "Received" | "Processing" | "Approved" | "Denied" | "RFE Issued";
  formType: string;
  lastUpdated: string;
  description: string;
}

interface CaseStatusResultProps {
  data: CaseStatusData;
  onNewSearch?: () => void;
}

/**
 * Component to display USCIS case status result with color-coded badges
 * and estimated processing times from uscis-data.ts
 */
export const CaseStatusResult: React.FC<CaseStatusResultProps> = ({
  data,
  onNewSearch,
}) => {
  const getStatusColor = (
    status: string
  ): {
    bg: string;
    border: string;
    text: string;
    icon: React.ReactNode;
  } => {
    switch (status) {
      case "Approved":
        return {
          bg: "bg-green-50",
          border: "border-green-500",
          text: "text-green-900",
          icon: <CheckCircle2 size={32} className="text-green-600" />,
        };
      case "Denied":
        return {
          bg: "bg-red-50",
          border: "border-red-500",
          text: "text-red-900",
          icon: <XCircle size={32} className="text-red-600" />,
        };
      case "RFE Issued":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-500",
          text: "text-yellow-900",
          icon: <AlertCircle size={32} className="text-yellow-600" />,
        };
      case "Received":
        return {
          bg: "bg-blue-50",
          border: "border-blue-500",
          text: "text-blue-900",
          icon: <Clock size={32} className="text-blue-600" />,
        };
      default: // Processing
        return {
          bg: "bg-indigo-50",
          border: "border-indigo-500",
          text: "text-indigo-900",
          icon: <Clock size={32} className="text-indigo-600" />,
        };
    }
  };

  const statusColor = getStatusColor(data.status);
  const processingTime = getProcessingTime(data.formType);

  return (
    <div className="w-full space-y-4">
      {/* Status Header Card */}
      <div
        className={`${statusColor.bg} border-l-4 ${statusColor.border} rounded-lg p-6`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${statusColor.text} mb-2`}>
              {data.status}
            </h3>
            <p className="text-sm text-gray-600">
              Receipt: {data.receiptNumber}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Last updated: {data.lastUpdated}
            </p>
          </div>
          <div className="flex-shrink-0">{statusColor.icon}</div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Form Type */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Form Type
          </p>
          <p className="text-lg font-semibold text-gray-900">{data.formType}</p>
        </div>

        {/* Processing Time */}
        {processingTime && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Est. Processing Time
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {processingTime.weeks} weeks
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Range: {processingTime.range}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Status Details
        </p>
        <p className="text-gray-700 leading-relaxed">{data.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {onNewSearch && (
          <button
            onClick={onNewSearch}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            Check Another Case
          </button>
        )}
        <a
          href="https://www.uscis.gov/case-status"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition text-center"
        >
          View on USCIS
        </a>
      </div>
    </div>
  );
};

export default CaseStatusResult;
