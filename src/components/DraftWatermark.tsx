"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface DraftWatermarkProps {
  formName?: string;
}

export const DraftWatermark: React.FC<DraftWatermarkProps> = ({ formName = "Form" }) => {
  return (
    <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
      <AlertTriangle size={20} className="text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-amber-400">
          DRAFT - Requires Attorney Review Before Filing
        </p>
        <p className="text-xs text-secondary mt-1">
          This {formName} is saved as a draft. An immigration attorney must review and approve your form
          before it can be filed with USCIS.
        </p>
      </div>
    </div>
  );
};

DraftWatermark.displayName = "DraftWatermark";
