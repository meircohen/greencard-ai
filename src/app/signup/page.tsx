"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/i18n";

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function SignupPageInner() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"client" | "attorney">("client");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    barNumber: "",
    barState: "",
    firmName: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Check for OAuth errors
  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "google_auth_failed") {
      setError(t('auth.googleSignupFailed'));
    }
  }, [searchParams, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError(t('auth.fieldRequired'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsNotMatch'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('auth.passwordMinLength'));
      return;
    }

    if (!agreeToTerms) {
      setError(t('auth.agreeToTerms'));
      return;
    }

    if (role === "attorney" && (!formData.barNumber || !formData.barState)) {
      setError(t('auth.barNumberRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role === "attorney" ? "attorney" : "immigrant",
          barNumber: role === "attorney" ? formData.barNumber : undefined,
          barState: role === "attorney" ? formData.barState : undefined,
          firmName: role === "attorney" ? formData.firmName : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('auth.signupFailed'));
        setIsLoading(false);
        return;
      }

      // Redirect to onboarding
      router.push("/onboarding");
    } catch (err) {
      setError(t('auth.errorOccurred'));
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <h1 className="text-3xl font-bold text-blue-900">GreenCard.ai</h1>
          </Link>
          <p className="text-slate-600 mt-2">{t('auth.createYourAccountText')}</p>
        </div>

        <Card className="p-8 space-y-6 max-h-[90vh] overflow-y-auto bg-white border border-gray-300">
          {/* Role Toggle */}
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setRole("client")}
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm ${
                role === "client"
                  ? "bg-blue-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t('auth.immigrant')}
            </button>
            <button
              onClick={() => setRole("attorney")}
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm ${
                role === "attorney"
                  ? "bg-blue-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t('auth.attorney')}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <Input
              label={t('auth.fullName')}
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Input
              label={t('auth.emailAddress')}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              label={t('auth.password')}
              type="password"
              name="password"
              placeholder={t('auth.atLeast8')}
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <Input
              label={t('auth.confirmPassword')}
              type="password"
              name="confirmPassword"
              placeholder={t('auth.password')}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            {/* Attorney Fields */}
            {role === "attorney" && (
              <>
                <Input
                  label={t('auth.barNumber')}
                  type="text"
                  name="barNumber"
                  placeholder="Your bar number"
                  value={formData.barNumber}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label={t('auth.barState')}
                  type="text"
                  name="barState"
                  placeholder="e.g., NY, CA, TX"
                  value={formData.barState}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label={t('auth.firmNameOptional')}
                  type="text"
                  name="firmName"
                  placeholder="Your law firm"
                  value={formData.firmName}
                  onChange={handleInputChange}
                />
              </>
            )}

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 rounded accent-blue-900 cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-slate-600">
                {t('auth.termsPrefix')}{" "}
                <Link
                  href="/terms"
                  className="text-blue-900 hover:text-blue-800"
                >
                  {t('auth.termsOfService')}
                </Link>{" "}
                {t('auth.andText')}{" "}
                <Link
                  href="/privacy"
                  className="text-blue-900 hover:text-blue-800"
                >
                  {t('auth.privacyPolicy')}
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-4 bg-blue-900 hover:bg-blue-800 text-white"
            >
              {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-600">
                {t('auth.orContinueWith')}
              </span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <Link href="/api/auth/google" className="block">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            >
              <GoogleIcon />
              <span>{t('auth.continueWithGoogle')}</span>
            </Button>
          </Link>

          {/* Sign In Link */}
          <p className="text-center text-slate-600 text-sm">
            {t('auth.alreadyHaveAccountText')}{" "}
            <Link
              href="/login"
              className="text-blue-900 hover:text-blue-800 transition-colors font-medium"
            >
              {t('auth.signInLink')}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <SignupPageInner />
    </Suspense>
  );
}
