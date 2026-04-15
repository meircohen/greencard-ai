"use client";

import React, { useState, useCallback, useEffect, useRef, Suspense } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
  Shield,
  Globe,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { DraftWatermark } from "@/components/DraftWatermark";
import { i485FormDefinition } from "@/lib/forms/i-485";
import { i485Translations } from "@/lib/forms/translations/i-485-es";
import type { FormField } from "@/lib/forms/i-130";

type FormValues = Record<string, string | boolean>;
type FormStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

function fieldCompletionCount(fields: FormField[], values: FormValues): { filled: number; total: number } {
  const required = fields.filter((f) => f.required);
  const filled = required.filter((f) => {
    const v = values[f.id];
    return v !== undefined && v !== "" && v !== false;
  });
  return { filled: filled.length, total: required.length };
}

function RfeIndicator({ risk }: { risk: string }) {
  if (risk === "high") return <Badge variant="amber" className="text-[10px] ml-2">High RFE Risk</Badge>;
  if (risk === "medium") return <Badge variant="blue" className="text-[10px] ml-2">Med Risk</Badge>;
  return null;
}

function FormFieldInput({
  field,
  value,
  onChange,
  showSpanish = false,
}: {
  field: FormField;
  value: string | boolean;
  onChange: (id: string, value: string | boolean) => void;
  showSpanish?: boolean;
}) {
  const translation = i485Translations[field.id as keyof typeof i485Translations];
  const displayLabel = showSpanish && translation ? translation.label : field.label;
  const displayHelpText = showSpanish && translation ? translation.helpText : field.helpText;

  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(field.id, e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-white/20 bg-white text-blue-900 focus:ring-blue-900/30"
        />
        <div className="flex-1">
          <span className="text-sm text-blue-900 group-hover:text-blue-800 transition-colors">
            {displayLabel}
          </span>
          <RfeIndicator risk={field.rfeRisk || "low"} />
          {displayHelpText && <p className="text-xs text-slate-500 mt-1">{displayHelpText}</p>}
          {showSpanish && !translation && <p className="text-xs text-slate-500 mt-1 italic">{field.helpText}</p>}
        </div>
      </label>
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          {displayLabel}
          {field.required && <span className="text-red-400 ml-1">*</span>}
          <RfeIndicator risk={field.rfeRisk || "low"} />
        </label>
        <select
          value={(value as string) || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-blue-900 focus:outline-none focus:border-blue-900/50 text-sm"
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {displayHelpText && <p className="text-xs text-slate-500 mt-1">{displayHelpText}</p>}
        {showSpanish && !translation && field.helpText && <p className="text-xs text-slate-500 mt-1 italic">{field.helpText}</p>}
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          {displayLabel}
          {field.required && <span className="text-red-400 ml-1">*</span>}
          <RfeIndicator risk={field.rfeRisk || "low"} />
        </label>
        <textarea
          value={(value as string) || ""}
          onChange={(e) => onChange(field.id, e.target.value)}
          placeholder={field.placeholder || ""}
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-blue-900 placeholder-muted focus:outline-none focus:border-blue-900/50 text-sm"
        />
        {displayHelpText && <p className="text-xs text-slate-500 mt-1">{displayHelpText}</p>}
        {showSpanish && !translation && field.helpText && <p className="text-xs text-slate-500 mt-1 italic">{field.helpText}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">
        {displayLabel}
        {field.required && <span className="text-red-400 ml-1">*</span>}
        <RfeIndicator risk={field.rfeRisk || "low"} />
      </label>
      <Input
        value={(value as string) || ""}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder || ""}
        type={field.type === "date" ? "date" : field.type === "phone" ? "tel" : "text"}
      />
      {displayHelpText && <p className="text-xs text-slate-500 mt-1">{displayHelpText}</p>}
      {showSpanish && !translation && field.helpText && <p className="text-xs text-slate-500 mt-1 italic">{field.helpText}</p>}
    </div>
  );
}

function I485FormContent({ caseId }: { caseId: string }) {

  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<FormValues>({});
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("DRAFT");
  const [showAttorneyGateModal, setShowAttorneyGateModal] = useState(false);
  const [showSpanish, setShowSpanish] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sections = i485FormDefinition.sections;
  const currentSection = sections[currentStep];
  const isLastStep = currentStep === sections.length - 1;

  // Load saved data on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/forms/${caseId}?formNumber=I-485`);
        if (res.ok) {
          const data = await res.json();
          if (data.formData && Object.keys(data.formData).length > 0) {
            setValues(data.formData as FormValues);
          }
          if (data.updatedAt) setLastSaved(data.updatedAt);
          if (data.status) setFormStatus(data.status as FormStatus);
        }
      } catch {
        // Silently fail on load, user starts fresh
      }
    }
    load();
  }, [caseId]);

  const saveForm = useCallback(async (data: FormValues) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formNumber: "I-485", formData: data, status: "DRAFT" }),
      });
      if (res.ok) {
        const result = await res.json();
        setLastSaved(result.updatedAt);
      }
    } catch {
      // Save failed silently; user can retry
    } finally {
      setSaving(false);
    }
  }, [caseId]);

  const handleFieldChange = useCallback(
    (id: string, value: string | boolean) => {
      setValues((prev) => {
        const next = { ...prev, [id]: value };
        // Auto-save after 2 seconds of inactivity
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => saveForm(next), 2000);
        return next;
      });
    },
    [saveForm]
  );

  const goNext = () => {
    if (currentStep < sections.length - 1) {
      saveForm(values);
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalizeClick = () => {
    // Save the current form data
    saveForm(values);
    // Show the attorney gate modal instead of submitting
    setShowAttorneyGateModal(true);
  };

  // Overall progress
  const totalRequired = sections.reduce((acc, s) => acc + s.fields.filter((f) => f.required).length, 0);
  const totalFilled = sections.reduce((acc, s) => {
    const { filled } = fieldCompletionCount(s.fields, values);
    return acc + filled;
  }, 0);
  const overallProgress = totalRequired > 0 ? Math.round((totalFilled / totalRequired) * 100) : 0;

  const { filled: sectionFilled, total: sectionTotal } = fieldCompletionCount(
    currentSection.fields,
    values
  );

  const highRfeFields = currentSection.fields.filter(
    (f) => f.rfeRisk === "high" && f.required && !values[f.id]
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Draft Watermark Banner */}
        {formStatus === "DRAFT" && <DraftWatermark formName="I-485" />}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Form I-485</h1>
              <p className="text-slate-600 text-sm mt-1">
                Application to Register Permanent Residence or Adjust Status
              </p>
            </div>
            <div className="flex items-center gap-3">
              {saving ? (
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <Loader2 size={12} className="animate-spin" /> Saving...
                </span>
              ) : lastSaved ? (
                <span className="text-xs text-slate-600 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-600" />
                  Saved {new Date(lastSaved).toLocaleTimeString()}
                </span>
              ) : null}
              <Button
                variant={showSpanish ? "primary" : "secondary"}
                onClick={() => setShowSpanish(!showSpanish)}
                className="flex items-center gap-2"
              >
                <Globe size={16} />
                {showSpanish ? "ES" : "EN"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => saveForm(values)}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </Button>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-1.5">
            {overallProgress}% complete ({totalFilled}/{totalRequired} required fields)
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {sections.map((section, idx) => {
            const { filled, total } = fieldCompletionCount(section.fields, values);
            const complete = total > 0 && filled === total;
            return (
              <button
                key={section.id}
                onClick={() => {
                  saveForm(values);
                  setCurrentStep(idx);
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  idx === currentStep
                    ? "bg-blue-900/20 border-blue-900/50 text-blue-900"
                    : complete
                      ? "bg-blue-900/5 border-blue-900/20 text-blue-900/70"
                      : "bg-gray-100 border-gray-300 text-slate-600 hover:border-gray-400"
                }`}
              >
                {complete && <CheckCircle2 size={10} className="inline mr-1" />}
                Part {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Current Section */}
        <Card className="p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{currentSection.title}</h2>
              <p className="text-sm text-slate-600 mt-1">{currentSection.description}</p>
            </div>
            <Badge variant={sectionFilled === sectionTotal ? "green" : "gray"}>
              {sectionFilled}/{sectionTotal}
            </Badge>
          </div>

          {/* RFE Warning */}
          {highRfeFields.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6">
              <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-600">High RFE Risk Fields</p>
                <p className="text-xs text-slate-600 mt-1">
                  {highRfeFields.length} required high-risk field{highRfeFields.length > 1 ? "s" : ""} not
                  yet completed. Missing these commonly triggers Requests for Evidence.
                </p>
              </div>
            </div>
          )}

          {/* Fields */}
          <div className="space-y-5">
            {currentSection.fields.map((field) => (
              <FormFieldInput
                key={field.id}
                field={field}
                value={values[field.id] ?? (field.type === "checkbox" ? false : "")}
                onChange={handleFieldChange}
                showSpanish={showSpanish}
              />
            ))}
          </div>
        </Card>

        {/* Legal Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 mb-6">
          <Shield size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-700">
            This tool assists with form preparation only. It does not constitute legal advice.
            Consult a licensed immigration attorney before filing. All data is encrypted at rest.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <span className="text-sm text-slate-600">
            Step {currentStep + 1} of {sections.length}
          </span>

          {currentStep < sections.length - 1 ? (
            <Button onClick={goNext} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              Next
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={handleFinalizeClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle2 size={16} />
              Complete Draft
            </Button>
          )}
        </div>
      </div>

      {/* Attorney Gate Modal */}
      <Modal
        isOpen={showAttorneyGateModal}
        onClose={() => setShowAttorneyGateModal(false)}
        title="Form Saved as Draft"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-600">Attorney Review Required</p>
              <p className="text-xs text-slate-700 mt-2">
                Your Form I-485 has been saved as a draft. An immigration attorney must review and
                approve your form before it can be filed with USCIS. This is a critical requirement to
                ensure compliance with all immigration regulations and to maximize your application's
                chances of approval.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <p className="text-sm text-slate-900 font-medium mb-3">Your Next Steps:</p>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0 mt-0.5">1.</span>
                <span>Your form has been securely saved as a draft</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0 mt-0.5">2.</span>
                <span>Continue editing your form as needed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0 mt-0.5">3.</span>
                <span>Upgrade to Attorney-Backed for professional attorney review</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 flex-shrink-0 mt-0.5">4.</span>
                <span>Your attorney will approve and file the form with USCIS</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowAttorneyGateModal(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Continue Editing
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => {
                // Navigate to pricing/upgrade page
                window.location.href = "/pricing?plan=attorney";
              }}
            >
              Upgrade to Attorney-Backed ($149/mo)
            </Button>
          </div>

          <p className="text-xs text-slate-700 text-center">
            Your draft is automatically saved and encrypted. You can come back to edit it anytime.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default function I485FormPage() {
  // Use a simple default caseId; the form auto-saves per caseId
  const caseId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("caseId") || "draft"
    : "draft";

  return <I485FormContent caseId={caseId} />;
}
