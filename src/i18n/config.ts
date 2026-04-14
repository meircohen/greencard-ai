/**
 * i18n Configuration
 * Supports English and Spanish with easy expansion for additional languages
 */

export type SupportedLocale = "en" | "es";

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en", "es"] as const;

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
};

/**
 * Future locales for expansion:
 * - Chinese (zh) - Mandarin and Simplified Chinese
 * - Hindi (hi) - South Asian market
 * - Tagalog (tl) - Philippine market
 * - Vietnamese (vi) - Southeast Asian market
 * - Korean (ko) - East Asian market
 * - Arabic (ar) - Middle Eastern market
 * - French (fr) - African and Canadian market
 * - Portuguese (pt) - Brazilian and African market
 * - Haitian Creole (ht) - Caribbean market
 */

export const COOKIE_NAME = "locale";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds
