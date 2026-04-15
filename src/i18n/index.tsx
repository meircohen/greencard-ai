"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import type { SupportedLocale } from "./config";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, COOKIE_NAME, COOKIE_MAX_AGE, LOCALE_NAMES } from "./config";
import enTranslations from "./en";
import esTranslations from "./es";

// Allow any structure for translations
type Translations = Record<string, any>;

const translations: Record<SupportedLocale, Translations> = {
  en: enTranslations,
  es: esTranslations,
};

/**
 * Create translation context
 */
interface I18nContextType {
  locale: SupportedLocale;
  t: (key: string, params?: Record<string, string | number>) => string;
  setLocale: (locale: SupportedLocale) => void;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Get nested translation value from object using dot notation
 * Example: getNestedValue(obj, "hero.title")
 */
function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((current, prop) => {
    return current?.[prop];
  }, obj) as string;
}

/**
 * Interpolate parameters in translation string
 * Example: "Wait: {years} years" with { years: "2" } => "Wait: 2 years"
 */
function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }, str);
}

/**
 * useTranslation hook - use in client components
 */
export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within I18nProvider");
  }
  return context;
}

/**
 * I18nProvider component - wrap your app with this to enable i18n
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    if (typeof document === "undefined") return DEFAULT_LOCALE;
    return getLocaleFromCookie();
  });

  const handleSetLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    setLocaleInCookie(newLocale, false); // false = no reload, state change is enough
  };

  const contextValue: I18nContextType = {
    locale,
    t: (key: string, params?: Record<string, string | number>) =>
      t(locale, key, params),
    setLocale: handleSetLocale,
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Translation function that works with dot notation keys
 * @param key - Dot notation key (e.g., "hero.title")
 * @param params - Optional parameters for interpolation (e.g., { years: "2" })
 * @returns Translated string
 */
export function t(
  locale: SupportedLocale,
  key: string,
  params?: Record<string, string | number>
): string {
  try {
    const translationSet = translations[locale] || translations[DEFAULT_LOCALE];
    const translation = getNestedValue(translationSet, key);

    if (!translation) {
      console.warn(`Translation not found: ${key} for locale ${locale}`);
      // Fallback to English
      return getNestedValue(translations[DEFAULT_LOCALE], key) || key;
    }

    return interpolate(translation, params);
  } catch (error) {
    console.error(`Error translating key: ${key}`, error);
    return key;
  }
}

/**
 * Get current locale from cookie
 */
export function getLocaleFromCookie(): SupportedLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;

  const cookies = document.cookie.split("; ");
  const localeCookie = cookies.find((c) => c.startsWith(`${COOKIE_NAME}=`));

  if (localeCookie) {
    const locale = localeCookie.split("=")[1] as SupportedLocale;
    if (SUPPORTED_LOCALES.includes(locale)) {
      return locale;
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Get locale from browser language preference
 */
export function getBrowserLocale(): SupportedLocale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;

  const browserLang = navigator.language.split("-")[0];

  if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }

  return DEFAULT_LOCALE;
}

/**
 * Set locale cookie and optionally reload page
 */
export function setLocaleInCookie(locale: SupportedLocale, reload = false) {
  if (typeof document === "undefined") return;

  const date = new Date();
  date.setSeconds(date.getSeconds() + COOKIE_MAX_AGE);

  document.cookie = `${COOKIE_NAME}=${locale}; path=/; expires=${date.toUTCString()}; SameSite=Lax`;

  if (reload) {
    window.location.reload();
  }
}

/**
 * Export config for use in server components and other modules
 */
export { SUPPORTED_LOCALES, DEFAULT_LOCALE, COOKIE_NAME, LOCALE_NAMES };
export type { SupportedLocale };
