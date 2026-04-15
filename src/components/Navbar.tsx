"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuthStore } from "@/lib/store";

const baseNavLinks = [
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/guides" },
  { label: "Contact", href: "/contact" },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const { user } = useAuthStore();

  const navLinks = [
    ...baseNavLinks,
    ...(user
      ? [{ label: "Dashboard", href: "/dashboard" }]
      : []),
    ...(user?.role === "attorney" || user?.role === "admin"
      ? [{ label: "Attorney Dashboard", href: "/attorney/dashboard" }]
      : []),
  ];

  useEffect(() => {
    const handleScroll = () => {
      setHasScroll(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-40
        transition-all duration-300
        ${hasScroll ? "bg-white border-b border-gray-200 shadow-sm" : "bg-white border-b border-gray-200"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-700">⚖</span>
            <div className="text-2xl font-bold text-blue-900">
              GreenCard.ai
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href="/assessment">
              <Button variant="primary" size="md">
                Free Case Evaluation
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-slate-900" />
            ) : (
              <Menu className="w-6 h-6 text-slate-900" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2 flex items-center justify-between">
              <LanguageSwitcher />
              <Link href="/assessment" className="flex-1 ml-4">
                <Button variant="primary" size="md">
                  Free Case Evaluation
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.displayName = "Navbar";
