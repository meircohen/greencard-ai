"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (role === "attorney" && (!formData.barNumber || !formData.barState)) {
      setError("Bar number and state are required for attorneys");
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
        setError(data.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
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
          <p className="text-secondary mt-2">Create your account</p>
        </div>

        <Card className="p-8 space-y-6 max-h-[90vh] overflow-y-auto">
          {/* Role Toggle */}
          <div className="flex gap-2 bg-surface/50 p-1 rounded-lg">
            <button
              onClick={() => setRole("client")}
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm ${
                role === "client"
                  ? "bg-green-primary text-white shadow-glow-green"
                  : "text-secondary hover:text-primary"
              }`}
            >
              Immigrant
            </button>
            <button
              onClick={() => setRole("attorney")}
              className={`flex-1 py-2 px-4 rounded-md transition-all text-sm ${
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
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            {/* Attorney Fields */}
            {role === "attorney" && (
              <>
                <Input
                  label="Bar Number"
                  type="text"
                  name="barNumber"
                  placeholder="Your bar number"
                  value={formData.barNumber}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Bar State"
                  type="text"
                  name="barState"
                  placeholder="e.g., NY, CA, TX"
                  value={formData.barState}
                  onChange={handleInputChange}
                  required
                />

                <Input
                  label="Firm Name (Optional)"
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
                className="w-5 h-5 mt-0.5 rounded accent-green-primary cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-secondary">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-green-primary hover:text-green-light"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-green-primary hover:text-green-light"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? "Creating account..." : "Create Account"}
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

          {/* Sign In Link */}
          <p className="text-center text-secondary text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-primary hover:text-green-light transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
