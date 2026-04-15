"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { ChevronRight, ChevronLeft, MapPin, Briefcase, CheckCircle, Users, FileText } from "lucide-react";
import { useTranslation } from "@/i18n";

type Step = 1 | 2 | 3 | 4 | 5;

interface OnboardingData {
  purpose?: string;
  countryOfBirth?: string;
  immigrationStatus?: string;
  currentLocation?: string;
  needs?: string[];
  caseDescription?: string;
  budget?: string;
  familyServiceType?: string;
}

const stepLabels = ["Welcome", "About You", "Your Goal", "Your Case", "Get Started"];

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Argentina",
  "Australia",
  "Austria",
  "Bangladesh",
  "Brazil",
  "Canada",
  "China",
  "France",
  "Germany",
  "Hong Kong",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Israel",
  "Japan",
  "Mexico",
  "Nigeria",
  "Pakistan",
  "Philippines",
  "Poland",
  "Russia",
  "Saudi Arabia",
  "South Korea",
  "Ukraine",
  "United Kingdom",
  "Vietnam",
];

const immigrationStatuses = ["H-1B", "F-1", "B-2", "Green Card", "US Citizen", "Other"];

const needs = [
  { label: "Case Assessment", value: "assessment" },
  { label: "Form Filing Help", value: "forms" },
  { label: "Attorney Matching", value: "attorney" },
  { label: "Document Review", value: "documents" },
  { label: "Deadline Tracking", value: "deadline" },
  { label: "Cost Estimation", value: "cost" },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardingData>({});
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [showCountries, setShowCountries] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCountrySearch = (value: string) => {
    setCountrySearch(value);
    if (value) {
      setFilteredCountries(
        countries.filter((c) => c.toLowerCase().includes(value.toLowerCase()))
      );
      setShowCountries(true);
    } else {
      setShowCountries(false);
    }
  };

  const selectCountry = (country: string) => {
    setData({ ...data, countryOfBirth: country });
    setCountrySearch("");
    setShowCountries(false);
  };

  const toggleNeed = (value: string) => {
    const currentNeeds = data.needs || [];
    if (currentNeeds.includes(value)) {
      setData({
        ...data,
        needs: currentNeeds.filter((n) => n !== value),
      });
    } else {
      setData({
        ...data,
        needs: [...currentNeeds, value],
      });
    }
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep((step + 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Submit onboarding data to API
      setIsSubmitting(true);
      setError(null);

      try {
        const res = await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            purpose: data.purpose,
            countryOfBirth: data.countryOfBirth,
            immigrationStatus: data.immigrationStatus,
            currentLocation: data.currentLocation,
            needs: data.needs,
            caseDescription: data.caseDescription,
            budget: data.budget,
            familyServiceType: data.familyServiceType,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to complete onboarding");
        }

        // Success - redirect to dashboard
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!data.purpose;
      case 2:
        return !!data.countryOfBirth && !!data.immigrationStatus && !!data.currentLocation;
      case 3:
        return data.needs && data.needs.length > 0;
      case 4:
        return true; // Optional step
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-midnight via-deep to-surface">
      <Navbar />
      <main className="flex-1">
      {/* Logo */}
      <div className="pt-8 px-4">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center font-bold text-white">
            G
          </div>
          <span className="font-bold text-white">GreenCard.ai</span>
        </Link>
      </div>

      {/* Progress */}
      <OnboardingProgress currentStep={step} totalSteps={5} stepLabels={stepLabels} />

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-16">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="bg-surface/50 border-white/[0.06]">
              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-4">Welcome to GreenCard.ai</h2>
                <p className="text-slate-400 text-lg mb-8">
                  Let's get to know your immigration goals so we can provide personalized guidance.
                </p>

                <div className="space-y-3">
                  {[
                    {
                      value: "greencard",
                      label: "I need a green card",
                      description: "Assess my pathway to permanent residence",
                    },
                    {
                      value: "visa",
                      label: "I'm renewing my visa",
                      description: "Help with visa renewal and extensions",
                    },
                    {
                      value: "citizen",
                      label: "I want to become a citizen",
                      description: "Naturalization (N-400) guidance",
                    },
                    {
                      value: "help",
                      label: "I need help with my case",
                      description: "General immigration case assistance",
                    },
                    {
                      value: "attorney",
                      label: "I'm an attorney",
                      description: "Access legal resources and case tools",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, purpose: option.value })}
                      className={`w-full p-4 rounded-lg border text-left transition-all ${
                        data.purpose === option.value
                          ? "bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20"
                          : "bg-surface-2/50 border-white/[0.06] hover:border-green-500/50"
                      }`}
                    >
                      <div className="font-semibold text-white">{option.label}</div>
                      <div className="text-sm text-slate-400 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2: About You */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="bg-surface/50 border-white/[0.06]">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Tell Us About You</h2>

                {/* Country */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">Country of Birth</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={countrySearch || data.countryOfBirth || ""}
                      onChange={(e) => handleCountrySearch(e.target.value)}
                      onFocus={() => countrySearch && setShowCountries(true)}
                      className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                    {showCountries && filteredCountries.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-surface-2 border border-white/[0.06] rounded-lg max-h-60 overflow-y-auto z-10">
                        {filteredCountries.map((country) => (
                          <button
                            key={country}
                            onClick={() => selectCountry(country)}
                            className="w-full px-4 py-2 text-left text-white hover:bg-green-500/20 border-b border-white/[0.06] last:border-b-0"
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {data.countryOfBirth && (
                    <p className="text-green-400 text-sm mt-2">{data.countryOfBirth} selected</p>
                  )}
                </div>

                {/* Immigration Status */}
                <div className="mb-6">
                  <label className="block text-white font-semibold mb-3">Current Immigration Status</label>
                  <div className="grid grid-cols-2 gap-3">
                    {immigrationStatuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setData({ ...data, immigrationStatus: status })}
                        className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                          data.immigrationStatus === status
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : "bg-surface-2 border-white/[0.06] text-slate-300 hover:border-green-500/50"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Location */}
                <div>
                  <label className="block text-white font-semibold mb-3">Current Location</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "US", label: "In the US" },
                      { value: "Outside US", label: "Outside the US" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setData({ ...data, currentLocation: option.value })}
                        className={`p-3 rounded-lg border transition-all font-medium ${
                          data.currentLocation === option.value
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : "bg-surface-2 border-white/[0.06] text-slate-300 hover:border-green-500/50"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Your Goal */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="bg-surface/50 border-white/[0.06]">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">What Do You Need?</h2>
                <p className="text-slate-400 mb-6">Select all that apply</p>

                <div className="space-y-3">
                  {needs.map((need) => (
                    <button
                      key={need.value}
                      onClick={() => toggleNeed(need.value)}
                      className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-3 ${
                        data.needs?.includes(need.value)
                          ? "bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20"
                          : "bg-surface-2/50 border-white/[0.06] hover:border-green-500/50"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                          data.needs?.includes(need.value)
                            ? "bg-green-500 border-green-500"
                            : "border-white/[0.06]"
                        }`}
                      >
                        {data.needs?.includes(need.value) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-white font-medium">{need.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Your Case */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="bg-surface/50 border-white/[0.06]">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Tell Us More</h2>

                {data.needs?.includes("assessment") && (
                  <div className="mb-6">
                    <label className="block text-white font-semibold mb-3">Brief Case Description</label>
                    <textarea
                      placeholder="Tell us about your case... What visa are you on? When did you enter the US? What's your goal?"
                      value={data.caseDescription || ""}
                      onChange={(e) => setData({ ...data, caseDescription: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-surface-2 border border-white/[0.06] text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 min-h-32 resize-none"
                    />
                  </div>
                )}

                {data.needs?.includes("attorney") && (
                  <div>
                    <label className="block text-white font-semibold mb-3">Budget Range</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "under-5k", label: "Under $5K" },
                        { value: "5-10k", label: "$5K - $10K" },
                        { value: "10-20k", label: "$10K - $20K" },
                        { value: "20k-plus", label: "$20K+" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setData({ ...data, budget: option.value })}
                          className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                            data.budget === option.value
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : "bg-surface-2 border-white/[0.06] text-slate-300 hover:border-green-500/50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {data.purpose === "citizen" && (
                  <div>
                    <label className="block text-white font-semibold mb-3">What service do you need?</label>
                    <div className="space-y-2">
                      {[
                        "Help with N-400 form",
                        "Interview preparation",
                        "Civics test study guide",
                        "English language help",
                      ].map((service) => (
                        <button
                          key={service}
                          onClick={() => setData({ ...data, familyServiceType: service })}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            data.familyServiceType === service
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : "bg-surface-2 border-white/[0.06] text-slate-300 hover:border-green-500/50"
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!data.needs?.includes("assessment") &&
                  !data.needs?.includes("attorney") &&
                  data.purpose !== "citizen" && (
                    <p className="text-slate-400 italic">
                      Additional details are optional. You can skip this step.
                    </p>
                  )}
              </div>
            </Card>
          </div>
        )}

        {/* Step 5: Get Started */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="bg-surface/50 border-white/[0.06]">
              <div className="p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <div className="text-center mb-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">You're All Set!</h2>
                  <p className="text-slate-400">Here's what we have for you</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="p-4 bg-surface-2 rounded-lg border border-white/[0.06]">
                    <p className="text-sm text-slate-400">Purpose</p>
                    <p className="text-white font-semibold capitalize">{data.purpose}</p>
                  </div>

                  {data.countryOfBirth && (
                    <div className="p-4 bg-surface-2 rounded-lg border border-white/[0.06]">
                      <p className="text-sm text-slate-400">Country of Birth</p>
                      <p className="text-white font-semibold">{data.countryOfBirth}</p>
                    </div>
                  )}

                  {data.immigrationStatus && (
                    <div className="p-4 bg-surface-2 rounded-lg border border-white/[0.06]">
                      <p className="text-sm text-slate-400">Immigration Status</p>
                      <p className="text-white font-semibold">{data.immigrationStatus}</p>
                    </div>
                  )}

                  {data.currentLocation && (
                    <div className="p-4 bg-surface-2 rounded-lg border border-white/[0.06]">
                      <p className="text-sm text-slate-400">Current Location</p>
                      <p className="text-white font-semibold">{data.currentLocation}</p>
                    </div>
                  )}

                  {data.needs && data.needs.length > 0 && (
                    <div className="p-4 bg-surface-2 rounded-lg border border-white/[0.06]">
                      <p className="text-sm text-slate-400 mb-2">You need help with</p>
                      <div className="flex flex-wrap gap-2">
                        {data.needs.map((need) => (
                          <span key={need} className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                            {needs.find((n) => n.value === need)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-green-200 text-sm">
                    We'll personalize your dashboard and provide tailored recommendations based on your answers.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex gap-3">
          {step > 1 && (
            <Button
              onClick={handleBack}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          )}

          {step === 1 && <div className="flex-1" />}

          {step < 5 && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}

          {step === 5 && (
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating your case..." : "Start Free Assessment"}
            </Button>
          )}
        </div>

        {step > 1 && step < 5 && (
          <button
            onClick={() => {
              router.push("/dashboard");
            }}
            className="w-full mt-3 text-slate-400 hover:text-slate-300 text-sm py-2"
          >
            Explore Dashboard
          </button>
        )}
      </div>
      </main>
      <Footer />
    </div>
  );
}
