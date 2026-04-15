"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import type { SupportedLocale } from "@/i18n";
import { SUPPORTED_LOCALES, LOCALE_NAMES, useTranslation } from "@/i18n";

const FLAG_EMOJIS: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
};

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, setLocale } = useTranslation();
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

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 flex items-center gap-2 text-slate-700"
        aria-label="Toggle language selector"
        aria-expanded={isOpen}
      >
        <Globe className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">
          {FLAG_EMOJIS[locale]}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50">
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className={`
                w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors duration-200
                flex items-center justify-between
                ${locale === l ? "text-blue-900 bg-slate-50 font-semibold" : "text-slate-700"}
              `}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{FLAG_EMOJIS[l]}</span>
                <span>{LOCALE_NAMES[l]}</span>
              </span>
              {locale === l && (
                <span className="text-emerald-600 text-lg">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

LanguageSwitcher.displayName = "LanguageSwitcher";
