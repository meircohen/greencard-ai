"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuthStore } from "@/lib/store";
import { useTranslation } from "@/i18n";

const dropdownMenus = {
  services: {
    labelKey: "nav.services",
    items: [
      { labelKey: "nav.marriageGreenCards", href: "/guides/marriage-green-card" },
      { labelKey: "nav.familySponsorship", href: "/guides/i-130-guide" },
      { labelKey: "nav.adjustmentOfStatus", href: "/guides/i-485-guide" },
      { labelKey: "nav.workPermits", href: "/guides/i-765-guide" },
      { labelKey: "nav.citizenship", href: "/guides/n-400-guide" },
    ],
  },
  tools: {
    labelKey: "nav.tools",
    items: [
      { labelKey: "nav.caseTracker", href: "/tracker" },
      { labelKey: "nav.scamVerification", href: "/verify" },
      { labelKey: "nav.costCalculator", href: "/cost-calculator" },
      { labelKey: "nav.visaBulletinNav", href: "/visa-bulletin" },
      { labelKey: "nav.rfeDecoder", href: "/rfe-decoder" },
      { labelKey: "nav.interviewPrep", href: "/interview-prep" },
    ],
  },
  programs: {
    labelKey: "nav.programs",
    items: [
      { labelKey: "nav.filingGuarantee", href: "/guarantee" },
      { labelKey: "nav.caseRescue", href: "/rescue" },
      { labelKey: "nav.emergencyHelp", href: "/emergency" },
      { labelKey: "nav.familiaplan", href: "/familia" },
      { labelKey: "nav.referFriend", href: "/referral" },
      { labelKey: "nav.forAttorneys", href: "/attorney-os" },
      { labelKey: "nav.whatsappPortal", href: "/whatsapp-portal" },
    ],
  },
};

const directLinks = [
  { labelKey: "nav.pricing", href: "/pricing" },
  { labelKey: "nav.contact", href: "/contact" },
];

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hasScroll, setHasScroll] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();

  const authLinks = [
    ...(user ? [{ labelKey: "nav.dashboard", href: "/dashboard" }] : []),
    ...(user?.role === "attorney" || user?.role === "admin"
      ? [{ labelKey: "nav.attorneyDashboard", href: "/attorney/dashboard" }]
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleMouseEnter = (key: string) => {
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
    return () => clearTimeout(timer);
  };

  const isLinkActive = (href: string): boolean => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isDropdownActive = (items: Array<{ href: string }>): boolean => {
    return items.some((item) => isLinkActive(item.href));
  };

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
          <div className="hidden md:flex items-center gap-8" ref={dropdownRef}>
            {Object.entries(dropdownMenus).map(([key, menu]) => {
              const dropdownIsActive = isDropdownActive(menu.items);
              return (
              <div
                key={key}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(key)}
                onMouseLeave={handleMouseLeave}
              >
                <button className={`flex items-center gap-2 transition-colors duration-200 font-medium py-2 ${
                  dropdownIsActive ? "text-blue-900 font-semibold" : "text-slate-700 hover:text-slate-900"
                }`}>
                  {t(menu.labelKey)}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openDropdown === key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mega Dropdown Menu */}
                {openDropdown === key && (
                  <div className="absolute left-0 mt-0 w-xs bg-white rounded-lg shadow-lg border border-gray-100 py-4 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-2 min-w-xs">
                      {menu.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                            isLinkActive(item.href)
                              ? "text-blue-900 font-semibold bg-blue-50"
                              : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                          }`}
                        >
                          {t(item.labelKey)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
            })}

            {/* Direct Links */}
            {directLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 font-medium ${
                  isLinkActive(link.href)
                    ? "text-blue-900 font-semibold"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Auth Links */}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 font-medium ${
                  isLinkActive(link.href)
                    ? "text-blue-900 font-semibold"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          {/* Desktop Language Switcher & Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />

            {!user ? (
              <>
                {/* Login Link */}
                <Link
                  href="/login"
                  className={`transition-colors duration-200 font-medium ${
                    isLinkActive("/login")
                      ? "text-blue-900 font-semibold"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {t("nav.login")}
                </Link>
                {/* CTA Button */}
                <Link href="/assessment">
                  <Button variant="primary" size="md">
                    {t("nav.checkEligibility")}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* User Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 transition-colors duration-200 font-medium hover:bg-gray-50 rounded-lg"
                  >
                    <span>{user.name || t("nav.myAccount")}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors duration-150 ${
                          isLinkActive("/dashboard")
                            ? "text-blue-900 font-semibold bg-blue-50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                        }`}
                      >
                        {t("nav.dashboard")}
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className={`block px-4 py-2 text-sm transition-colors duration-150 ${
                          isLinkActive("/settings")
                            ? "text-blue-900 font-semibold bg-blue-50"
                            : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                        }`}
                      >
                        {t("nav.settings")}
                      </Link>
                      <button
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-150 border-t border-gray-100 mt-2 pt-2"
                      >
                        {t("nav.signOut")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
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
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 max-h-96 overflow-y-auto">
            {/* Dropdown Menus */}
            {Object.entries(dropdownMenus).map(([key, menu]) => {
              const dropdownIsActive = isDropdownActive(menu.items);
              return (
              <div key={key}>
                <button
                  onClick={() =>
                    setOpenDropdown(openDropdown === key ? null : key)
                  }
                  className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                    dropdownIsActive
                      ? "text-blue-900 font-semibold bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                  }`}
                >
                  {t(menu.labelKey)}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openDropdown === key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mobile Dropdown Items */}
                {openDropdown === key && (
                  <div className="pl-4 space-y-1 bg-gray-50 rounded-lg my-1">
                    {menu.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          isLinkActive(item.href)
                            ? "text-blue-900 font-semibold bg-blue-100"
                            : "text-slate-600 hover:text-slate-900 hover:bg-gray-100"
                        }`}
                      >
                        {t(item.labelKey)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
            })}

            {/* Direct Links */}
            {directLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  isLinkActive(link.href)
                    ? "text-blue-900 font-semibold bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Auth Links */}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  isLinkActive(link.href)
                    ? "text-blue-900 font-semibold bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {!user ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                    isLinkActive("/login")
                      ? "text-blue-900 font-semibold bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                  }`}
                >
                  {t("nav.login")}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                    isLinkActive("/settings")
                      ? "text-blue-900 font-semibold bg-blue-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-gray-50"
                  }`}
                >
                  {t("nav.settings")}
                </Link>
                <button
                  onClick={async () => {
                    setIsMenuOpen(false);
                    await logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-150 rounded-lg font-medium"
                >
                  {t("nav.signOut")}
                </button>
              </>
            )}

            <div className="px-4 py-2 flex items-center justify-between border-t border-gray-200 mt-4 pt-4">
              <LanguageSwitcher />
              {!user && (
                <Link href="/assessment" className="flex-1 ml-4">
                  <Button variant="primary" size="md">
                    {t("nav.checkEligibility")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

Navbar.displayName = "Navbar";
