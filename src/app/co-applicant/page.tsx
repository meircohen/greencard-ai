"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { AlertCircle, CheckCircle, DollarSign } from "lucide-react";

interface FormData {
  annualIncome: string;
  employmentStatus: string;
  employer: string;
  numberOfDependents: string;
  savings: string;
  propertyValue: string;
  taxFilingStatus: string;
}

const employmentOptions = [
  { value: "", label: "Select employment status" },
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "retired", label: "Retired" },
  { value: "unemployed", label: "Unemployed" },
  { value: "other", label: "Other" },
];

const taxFilingOptions = [
  { value: "", label: "Select tax filing status" },
  { value: "single", label: "Single" },
  { value: "married-joint", label: "Married Filing Jointly" },
  { value: "married-separate", label: "Married Filing Separately" },
  { value: "head-of-household", label: "Head of Household" },
];

function CoApplicantPortalInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    annualIncome: "",
    employmentStatus: "",
    employer: "",
    numberOfDependents: "",
    savings: "",
    propertyValue: "",
    taxFilingStatus: "",
  });

  useEffect(() => {
    if (token) {
      setIsVerified(true);
    }
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({
          annualIncome: "",
          employmentStatus: "",
          employer: "",
          numberOfDependents: "",
          savings: "",
          propertyValue: "",
          taxFilingStatus: "",
        });
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <Navbar />
        <main className="flex-1">
          <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-600">Invalid Access</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">Access Link Invalid</h1>
              <p className="text-slate-600 text-lg">
                The access token in the URL is invalid or has expired.
              </p>
            </div>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-3xl mx-auto">
              <Card className="p-8">
                <p className="text-slate-700 mb-4">
                  Please ask your spouse to send you a fresh invitation link to complete the I-864 Affidavit of Support.
                </p>
                <Button variant="primary" size="lg">
                  Contact Support
                </Button>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Navbar />
      <main className="flex-1">
      <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <Badge variant="green" size="sm">
              Secure Portal
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-2">I-864 Affidavit of Support</h1>
          <p className="text-slate-600 text-lg">
            Your spouse has invited you to complete the financial section of the I-864
          </p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          {submitSuccess ? (
            <Card className="p-8 border-emerald-200 bg-emerald-50">
              <div className="flex items-start gap-4 mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-emerald-900 mb-2">
                    Form Submitted Successfully
                  </h2>
                  <p className="text-emerald-800">
                    Your financial information has been securely submitted. Your spouse will be notified and can proceed with the rest of the application.
                  </p>
                </div>
              </div>
              <p className="text-sm text-emerald-700 mb-6">
                Reference ID: {Math.random().toString(36).substring(2, 11).toUpperCase()}
              </p>
              <Button variant="primary" size="lg" onClick={() => setSubmitSuccess(false)}>
                Back to Home
              </Button>
            </Card>
          ) : (
            <>
              <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
                <div className="flex gap-4">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Why We Need This Information</h3>
                    <p className="text-blue-800 text-sm">
                      USCIS requires sponsors to prove they can financially support their spouse's green card application. Your income must meet the Federal Poverty Guidelines. This form collects only your financial information as the US citizen sponsor—you will not see your spouse's personal details or account information.
                    </p>
                  </div>
                </div>
              </Card>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Your Financial Information</h2>

                  <div className="space-y-6">
                    <Input
                      label="Annual Income (USD)"
                      name="annualIncome"
                      type="number"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      placeholder="50000"
                      required
                    />

                    <Select
                      label="Employment Status"
                      name="employmentStatus"
                      value={formData.employmentStatus}
                      onChange={handleInputChange}
                      options={employmentOptions}
                      required
                    />

                    {formData.employmentStatus && formData.employmentStatus !== "retired" && formData.employmentStatus !== "unemployed" && (
                      <Input
                        label="Employer/Business Name"
                        name="employer"
                        type="text"
                        value={formData.employer}
                        onChange={handleInputChange}
                        placeholder="ABC Corporation"
                        required
                      />
                    )}

                    <Input
                      label="Number of Dependents (excluding spouse)"
                      name="numberOfDependents"
                      type="number"
                      value={formData.numberOfDependents}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      required
                    />

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-semibold text-slate-900 mb-4">Assets</h3>
                      
                      <Input
                        label="Liquid Savings/Bank Accounts (USD)"
                        name="savings"
                        type="number"
                        value={formData.savings}
                        onChange={handleInputChange}
                        placeholder="25000"
                      />
                    </div>

                    <Input
                      label="Real Estate/Property Value (USD)"
                      name="propertyValue"
                      type="number"
                      value={formData.propertyValue}
                      onChange={handleInputChange}
                      placeholder="300000"
                    />

                    <Select
                      label="Tax Filing Status"
                      name="taxFilingStatus"
                      value={formData.taxFilingStatus}
                      onChange={handleInputChange}
                      options={taxFilingOptions}
                      required
                    />
                  </div>
                </Card>

                <Card className="p-6 bg-amber-50 border-amber-200">
                  <div className="flex gap-4">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-amber-900 mb-2">Privacy Notice</h3>
                      <p className="text-amber-800 text-sm">
                        Your information is encrypted and transmitted securely. It will only be shared with your spouse and their immigration attorney for the purposes of completing the I-864 form. You will not have access to their personal information.
                      </p>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Financial Information"}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CoApplicantPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <CoApplicantPortalInner />
    </Suspense>
  );
}
