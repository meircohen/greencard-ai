"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuthStore } from "@/lib/store";

const baseNavLinks = [
  { label: "Home", href: "/" },
  { label: "Chat", href: "/chat" },
  { label: "Assessment", href: "/assessment" },
  { label: "Visa Bulletin", href: "/visa-bulletin" },
  { label: "Cost Calculator", href: "/cost-calculator" },
  { label: "Dashboard", href: "/dashboard" },
];

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);
  const { user } = useAuthStore();

  const navLinks = [
    ...baseNavLinks,
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
        ${hasScroll ? "glass" : "bg-transparent"}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold gradient-text">
              GreenCard.ai
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-secondary hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Language Switcher & CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="primary" size="md">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-secondary hover:text-primary hover:bg-white/5 rounded-lg transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 py-2 flex items-center justify-between">
              <LanguageSwitcher />
              <Button variant="primary" size="md" className="flex-1 ml-4">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.displayName = "Navbar";
