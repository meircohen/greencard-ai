"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"immigrant" | "attorney">("immigrant");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setError(data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard or original page
      const from = searchParams.get("from") || "/dashboard";
      router.push(from);
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/">
            <h1 className="text-3xl font-bold gradient-text">GreenCard.ai</h1>
          </Link>
          <p className="text-secondary mt-2">Sign in to your account</p>
        </div>

        <Card className="p-8 space-y-6">
          {/* Role Toggle */}
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            <button
              onClick={() => setRole("immigrant")}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                role === "immigrant"
                  ? "bg-green-primary text-white shadow-glow-green"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Immigrant
            </button>
            <button
              onClick={() => setRole("attorney")}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                role === "attorney"
                  ? "bg-green-primary text-white shadow-glow-green"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Attorney
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
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-primary">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-primary hover:text-green-light transition-colors"
                >
                  Forgot password?
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
              className="w-full"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface/40 text-secondary">
                or continue with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex items-center justify-center gap-2"
              disabled
            >
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Google</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="flex items-center justify-center gap-2"
              disabled
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Apple</span>
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-secondary text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-green-primary hover:text-green-light transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-midnight flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
