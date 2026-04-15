"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Shield, CheckCircle, Copy, ArrowLeft } from "lucide-react";

type MfaStep = "start" | "scan" | "verify" | "backup" | "done";

export default function MfaSetupPage() {
  const [step, setStep] = useState<MfaStep>("start");
  const [qrCode, setQrCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);

  const startSetup = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/mfa/setup", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to start MFA setup.");
        return;
      }

      setQrCode(data.qrCode);
      setBackupCodes(data.backupCodes);
      setStep("scan");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifySetup = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode, type: "totp" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid code. Please try again.");
        return;
      }

      setStep("backup");
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopiedBackup(true);
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-blue-900">Two-Factor Authentication</h1>
        </div>

        {/* Step: Start */}
        {step === "start" && (
          <Card className="p-8 space-y-6 bg-gray-50 border border-gray-300">
            <div className="text-center space-y-4">
              <Shield className="mx-auto h-16 w-16 text-blue-900" />
              <h2 className="text-xl font-semibold text-blue-900">Secure your account</h2>
              <p className="text-slate-600">
                Two-factor authentication adds an extra layer of security. You will need
                an authenticator app like Google Authenticator, Authy, or 1Password.
              </p>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <Button onClick={startSetup} className="w-full bg-blue-900 hover:bg-blue-800 text-white" disabled={isLoading}>
              {isLoading ? "Setting up..." : "Set up 2FA"}
            </Button>
          </Card>
        )}

        {/* Step: Scan QR */}
        {step === "scan" && (
          <Card className="p-8 space-y-6 bg-gray-50 border border-gray-300">
            <h2 className="text-lg font-semibold text-blue-900 text-center">
              Scan this QR code
            </h2>
            <p className="text-slate-600 text-center text-sm">
              Open your authenticator app and scan the QR code below.
            </p>

            {qrCode && (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="MFA QR Code" width={200} height={200} />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="totp" className="block text-sm font-medium text-slate-900">
                Enter the 6-digit code from your app
              </label>
              <Input
                id="totp"
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
                maxLength={6}
                autoComplete="one-time-code"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <Button
              onClick={verifySetup}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white"
              disabled={isLoading || verifyCode.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify and enable"}
            </Button>
          </Card>
        )}

        {/* Step: Backup codes */}
        {step === "backup" && (
          <Card className="p-8 space-y-6 bg-gray-50 border border-gray-300">
            <div className="text-center space-y-2">
              <CheckCircle className="mx-auto h-12 w-12 text-blue-900" />
              <h2 className="text-lg font-semibold text-blue-900">2FA enabled</h2>
              <p className="text-slate-600 text-sm">
                Save these backup codes in a safe place. Each code can only be used once
                if you lose access to your authenticator app.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-300">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, i) => (
                  <code key={i} className="text-sm text-slate-900 font-mono bg-gray-50 rounded px-2 py-1 text-center">
                    {code}
                  </code>
                ))}
              </div>
            </div>

            <Button
              onClick={copyBackupCodes}
              variant="secondary"
              className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-slate-900"
            >
              <Copy className="h-4 w-4" />
              {copiedBackup ? "Copied!" : "Copy backup codes"}
            </Button>

            <Button onClick={() => setStep("done")} className="w-full bg-blue-900 hover:bg-blue-800 text-white">
              I have saved my backup codes
            </Button>
          </Card>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <Card className="p-8 space-y-6 text-center bg-gray-50 border border-gray-300">
            <CheckCircle className="mx-auto h-16 w-16 text-blue-900" />
            <h2 className="text-xl font-semibold text-blue-900">All set!</h2>
            <p className="text-slate-600">
              Two-factor authentication is now enabled on your account.
              You will be asked for a code each time you sign in.
            </p>
            <Link href="/settings">
              <Button className="w-full mt-4 bg-blue-900 hover:bg-blue-800 text-white">Back to settings</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
