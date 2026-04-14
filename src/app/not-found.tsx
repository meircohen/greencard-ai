"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-deep to-midnight flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold bg-gradient-to-r from-green-primary to-blue-500 bg-clip-text text-transparent">
              404
            </h1>
          </div>

          {/* Message */}
          <h2 className="text-4xl font-bold text-primary mb-4">
            Page Not Found
          </h2>

          <p className="text-xl text-secondary mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="secondary" size="lg">
                Chat with AI
              </Button>
            </Link>
          </div>

          {/* Support Link */}
          <div className="mt-8">
            <p className="text-secondary mb-4">Need help? Contact our support</p>
            <Link
              href="/contact"
              className="inline-flex items-center text-green-primary hover:text-green-light transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Get Support
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
