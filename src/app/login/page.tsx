"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, Shield } from "lucide-react";
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

function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"client" | "attorney">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaUserId, setMfaUserId] = useState("");

  // Check for OAuth errors
  React.useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "google_auth_failed") {
      setError(t('auth.googleAuthFailed'));
    } else if (errorParam === "too_many_requests") {
      setError(t('auth.tooManyAttempts'));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('common.error'));
        setIsLoading(false);
        return;
      }

      // Check if MFA is required
      if (data.mfaRequired) {
        setMfaRequired(true);
        setMfaUserId(data.userId);
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard or original page
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    } catch (err) {
      setError(t('common.error'));
      setIsLoading(false);
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: mfaCode, type: "totp" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('common.error'));
        setIsLoading(false);
        return;
      }

      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    } catch (err) {
      setError(t('common.error'));
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
          <p className="text-slate-600 mt-2">{t('auth.signInAccount')}</p>
        </div>

        {/* MFA Verification Step */}
        {mfaRequired && (
          <Card className="p-8 space-y-6 bg-white border border-gray-300">
            <div className="text-center space-y-2">
              <Shield className="mx-auto h-10 w-10 text-blue-900" />
              <h2 className="text-lg font-semibold text-blue-900">{t('auth.twoFactorAuth')}</h2>
              <p className="text-slate-600 text-sm">{t('auth.enterCode')}</p>
            </div>

            <form onSubmit={handleMfaVerify} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <Input
                type="text"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                disabled={mfaCode.length !== 6}
              >
                {isLoading ? t('auth.verifyingCode') : t('auth.verifyCode')}
              </Button>
            </form>

            <button
              onClick={() => { setMfaRequired(false); setMfaCode(""); setError(""); }}
              className="text-sm text-blue-900 hover:text-blue-800 text-center w-full"
            >
              {t('auth.backToLogin')}
            </button>
          </Card>
        )}

        {/* Login Form */}
        {!mfaRequired && <Card className="p-8 space-y-6 bg-white border border-gray-300">
          {/* Role Toggle */}
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg">
            <button
              onClick={() => setRole("client")}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                role === "client"
                  ? "bg-blue-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {t('auth.client')}
            </button>
            <button
              onClick={() => setRole("attorney")}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
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
              label={t('auth.emailAddress')}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-slate-900">
                  {t('auth.password')}
                </label>
                <Link
                  href="/reset-password"
                  className="text-sm text-blue-900 hover:text-blue-800 transition-colors"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
            >
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
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

          {/* Sign Up Link */}
          <p className="text-center text-slate-600 text-sm">
            {t('auth.dontHaveAccount')}{" "}
            <Link
              href="/signup"
              className="text-blue-900 hover:text-blue-800 transition-colors font-medium"
            >
              {t('auth.signUp2')}
            </Link>
          </p>
        </Card>}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
