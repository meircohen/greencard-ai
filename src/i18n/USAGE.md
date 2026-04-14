# GreenCard.ai Internationalization (i18n) System

## Overview

Complete i18n system with English and Spanish support, designed for easy expansion to additional languages.

**Supported Languages:**
- English (en) - Default
- Spanish (es) - Español

**Future Language Support:**
- Chinese (zh), Hindi (hi), Tagalog (tl), Vietnamese (vi), Korean (ko), Arabic (ar), French (fr), Portuguese (pt), Haitian Creole (ht)

---

## File Structure

```
src/i18n/
├── config.ts          # Configuration (locales, cookie name, etc.)
├── en.ts              # English translations
├── es.ts              # Spanish translations
├── index.ts           # Utilities & hooks
└── USAGE.md          # This file
```

---

## Configuration

### `src/i18n/config.ts`

Contains:
- `SUPPORTED_LOCALES` - Array of supported locale codes
- `DEFAULT_LOCALE` - Default language (English)
- `LOCALE_NAMES` - Display names for each locale
- `COOKIE_NAME` - Cookie key for storing user's language preference
- `COOKIE_MAX_AGE` - Cookie expiration (1 year)

---

## Translation Files

### Structure

Each translation file exports a nested object with keys organized by feature:

```typescript
export default {
  nav: { home, aiAdvisor, assessment, ... },
  hero: { badge, title, titleGradient, subtitle, ... },
  features: { sectionLabel, title, subtitle, feature1Title, ... },
  // ... more sections
}
```

### Key Patterns

- Use dot notation for nested keys: `hero.title`, `nav.home`
- Keys support parameter interpolation: `"{years} years"` → `"2 years"`
- All keys are typed in translation file (use `as const`)

---

## Usage

### In Client Components

Use the `useTranslation()` hook:

```typescript
"use client";

import { useTranslation } from "@/i18n";

export function MyComponent() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
      <p>{t("bulletin.waitYears", { years: 2 })}</p>
      
      <button onClick={() => setLocale("es")}>
        Cambiar a Español
      </button>
    </div>
  );
}
```

### In Server Components (Planned)

For future server-side rendering:

```typescript
import { t, DEFAULT_LOCALE } from "@/i18n";

// Pass locale as a prop from layout
export function MyServerComponent({ locale }: { locale: string }) {
  const title = t(locale as any, "hero.title");
  return <h1>{title}</h1>;
}
```

### LanguageSwitcher Component

Fully functional dropdown for language selection:

```typescript
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Navbar() {
  return (
    <nav>
      <div>Logo</div>
      <LanguageSwitcher />
    </nav>
  );
}
```

Features:
- Globe icon with flag emoji
- Dropdown with all supported languages
- Checkmark on current language
- Updates cookie and reloads page on change
- Responsive (globe icon only on mobile, flag + label on desktop)

---

## Adding New Languages

### Step 1: Update Configuration

```typescript
// src/i18n/config.ts
export const SUPPORTED_LOCALES = ["en", "es", "fr"] as const; // Add "fr"
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
  fr: "Français", // Add this
};
```

### Step 2: Create Translation File

```typescript
// src/i18n/fr.ts
export default {
  nav: { home: "Accueil", aiAdvisor: "Conseiller IA", ... },
  // ... copy all keys from en.ts and translate
} as const;
```

### Step 3: Register Translation

```typescript
// src/i18n/index.ts
import frTranslations from "./fr";

const translations: Record<SupportedLocale, Translations> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations, // Add this
};
```

### Step 4: Add Flag Emoji

```typescript
// src/components/LanguageSwitcher.tsx
const FLAG_EMOJIS: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷", // Add this
};
```

---

## Translation Interpolation

Use curly braces for dynamic values:

```typescript
// en.ts
"Wait: {years} years"

// Usage
t("bulletin.waitYears", { years: 5 })
// Output: "Wait: 5 years"
```

Multiple parameters:
```typescript
t("attorney.yearsExp", { years: 10 })
t("attorney.casesHandled", { count: 150 })
t("attorney.approvalRate", { rate: 92 })
```

---

## Locale Detection

### Automatic Detection

1. Check for existing `locale` cookie
2. If not found, check browser language preference (`navigator.language`)
3. If browser language not supported, default to English

### Manual Control

```typescript
import { getLocaleFromCookie, setLocaleInCookie } from "@/i18n";

// Get current locale
const locale = getLocaleFromCookie();

// Set locale (with optional page reload)
setLocaleInCookie("es", true); // true = reload page
```

---

## Best Practices

1. **Key Organization:** Group related strings by feature (nav, hero, features, etc.)

2. **Consistency:** Use same terminology across all translations
   - "Green Card" vs "Tarjeta de Residencia"
   - Keep abbreviations consistent (USCIS, I-130, H-1B)

3. **Context:** Provide context when translating
   - Understand immigration terminology in both languages
   - Use professional terminology appropriate for target audience

4. **Parameter Names:** Use descriptive parameter names
   ```typescript
   // Good
   "{years} years"
   
   // Avoid
   "{0} years"
   ```

5. **Fallback Behavior:** System automatically falls back to English if key not found
   - Check console for warnings
   - Log missing translations in development

6. **Type Safety:** All translation keys are typed in source files
   - TypeScript will help catch typos
   - Use IDE autocomplete

---

## Translation Quality Tips

For Spanish translations:
- Use formal "tú" or "usted" based on context
- Immigration terminology should match official USCIS Spanish materials
- Professional tone appropriate for legal/immigration context
- Common terms:
  - Green Card = Tarjeta de Residencia / Green Card
  - USCIS = USCIS (no translation)
  - I-130 = I-130 (form numbers don't translate)
  - Attorney = Abogado
  - Case = Caso
  - Timeline = Cronograma
  - Approval Rate = Tasa de Aprobación

---

## Performance Considerations

- Translations are loaded at build time (no runtime overhead)
- Cookie-based locale persistence (minimal storage)
- Page reload on language change (ensures all content updates)
- LanguageSwitcher mounts only after hydration (prevents SSR mismatch)

---

## Testing

### Test Language Switching

```typescript
import { getLocaleFromCookie, setLocaleInCookie } from "@/i18n";

// In test
test("language switching works", () => {
  setLocaleInCookie("es", false);
  expect(getLocaleFromCookie()).toBe("es");
});
```

### Test Translations

```typescript
import { t, DEFAULT_LOCALE } from "@/i18n";

test("all keys exist in both languages", () => {
  const enKeys = Object.keys(enTranslations).flat();
  const esKeys = Object.keys(esTranslations).flat();
  
  expect(enKeys).toEqual(esKeys);
});
```

---

## Troubleshooting

**Issue:** Translation not showing up
- Check key spelling (case-sensitive, use dot notation)
- Verify key exists in translation file
- Check browser console for warnings

**Issue:** Page doesn't update after language change
- Ensure `setLocaleInCookie()` is called with `reload = true`
- Clear browser cookies and try again

**Issue:** Mobile LanguageSwitcher not visible
- Component only renders after hydration (on mount)
- Check that `currentLocale` state is initialized

---

## Future Enhancements

- [ ] Dynamic language loading (lazy load translation files)
- [ ] RTL support for Arabic and Hebrew
- [ ] Automatic date/number formatting by locale
- [ ] Namespace support for code-splitting translations
- [ ] Extract missing translation keys script
- [ ] Integration with translation management platform
