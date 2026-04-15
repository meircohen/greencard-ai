"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import type { SupportedLocale } from "@/i18n";
import { SUPPORTED_LOCALES, LOCALE_NAMES, setLocaleInCookie, getLocaleFromCookie } from "@/i18n";

const FLAG_EMOJIS: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
};

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale | null>(() => {
    if (typeof window !== "undefined") return getLocaleFromCookie();
    return null;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: SupportedLocale) => {
    setCurrentLocale(locale);
    setIsOpen(false);
    setLocaleInCookie(locale, true); // true = reload page
  };

  if (currentLocale === null) {
    return null; // Don't render until mounted
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200 flex items-center gap-2"
        aria-label="Toggle language selector"
        aria-expanded={isOpen}
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">
          {FLAG_EMOJIS[currentLocale]}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-secondary border border-white/10 rounded-lg shadow-lg py-2 z-50">
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`
                w-full px-4 py-2 text-left hover:bg-white/10 transition-colors duration-200
                flex items-center justify-between
                ${currentLocale === locale ? "text-primary bg-white/5" : "text-secondary"}
              `}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{FLAG_EMOJIS[locale]}</span>
                <span>{LOCALE_NAMES[locale]}</span>
              </span>
              {currentLocale === locale && (
                <span className="text-primary text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

LanguageSwitcher.displayName = "LanguageSwitcher";
