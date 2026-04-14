# i18n Quick Reference

## Installation ✅
```bash
npm install next-intl  # Already installed
```

## File Locations
- **Config**: `src/i18n/config.ts`
- **English**: `src/i18n/en.ts`
- **Spanish**: `src/i18n/es.ts`
- **Utilities**: `src/i18n/index.ts`
- **Component**: `src/components/LanguageSwitcher.tsx`
- **Updated**: `src/components/Navbar.tsx`

## Using Translations

### In Client Components
```typescript
"use client";
import { useTranslation } from "@/i18n";

export function MyComponent() {
  const { t, locale, setLocale } = useTranslation();
  
  return (
    <>
      <h1>{t("hero.title")}</h1>
      <p>{t("hero.subtitle")}</p>
      <p>{t("bulletin.waitYears", { years: 2 })}</p>
      <button onClick={() => setLocale("es")}>
        Change to Spanish
      </button>
    </>
  );
}
```

## Translation Key Format

Keys use dot notation for nested sections:
- `hero.title` - Access hero section's title
- `nav.home` - Access nav section's home link
- `bulletin.waitYears` - Access bulletin section's wait years message

## Parameter Interpolation

Use `{paramName}` placeholders:
```typescript
// In translation file (en.ts):
"Wait: {years} years"

// Usage:
t("bulletin.waitYears", { years: 2 })
// Output: "Wait: 2 years"
```

## Supported Languages
- ✅ English (en) - Default
- ✅ Spanish (es)

## Adding a New Language (e.g., French)

### Step 1: Update config.ts
```typescript
export type SupportedLocale = "en" | "es" | "fr";
export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en", "es", "fr"];
export const LOCALE_NAMES: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};
```

### Step 2: Create fr.ts
Copy en.ts structure and translate all values

### Step 3: Register in index.ts
```typescript
import frTranslations from "./fr";

const translations: Record<SupportedLocale, Translations> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
};
```

### Step 4: Add flag emoji in LanguageSwitcher.tsx
```typescript
const FLAG_EMOJIS: Record<SupportedLocale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
};
```

## Translation Sections (130+ keys)

- **nav**: Navigation links
- **hero**: Hero section content
- **features**: Feature descriptions
- **chat**: AI advisor chat interface
- **assessment**: Case assessment section
- **bulletin**: Visa bulletin section
- **calculator**: Cost calculator
- **dashboard**: User dashboard
- **pricing**: Pricing plans
- **auth**: Authentication forms
- **common**: Common UI elements
- **footer**: Footer content
- **attorney**: Attorney network
- **documents**: Document management
- **interview**: Interview preparation
- **onboarding**: Onboarding flow
- **errors**: Error pages

## Language Persistence

Automatically saved in cookie:
- **Cookie name**: `locale`
- **Duration**: 1 year
- **Scope**: Persists across sessions
- **Reload**: Automatic on language change

## Locale Detection Priority

1. Check for `locale` cookie
2. Check browser language preference (`navigator.language`)
3. Fall back to English

## Functions Available

### `useTranslation()`
React hook for client components
```typescript
const { t, locale, setLocale } = useTranslation();
```

### `t(key, params?)`
Translation function with interpolation
```typescript
t("nav.home")
t("bulletin.waitYears", { years: 5 })
```

### `getLocaleFromCookie()`
Read current locale preference
```typescript
const locale = getLocaleFromCookie(); // "en" or "es"
```

### `setLocaleInCookie(locale, reload?)`
Save locale and optionally reload page
```typescript
setLocaleInCookie("es", true); // true = reload
```

## Troubleshooting

**Translation not showing?**
- Check key spelling (case-sensitive)
- Verify key exists in translation file
- Check browser console for warnings

**Page doesn't update after change?**
- Ensure `setLocaleInCookie(locale, true)` is called
- Clear browser cookies and try again

**LanguageSwitcher not visible?**
- Only renders after hydration
- Check that component is mounted

## Example Translation Entry

**English (en.ts)**:
```typescript
export default {
  nav: {
    home: "Home",
    aiAdvisor: "AI Advisor",
  },
  // ...
}
```

**Spanish (es.ts)**:
```typescript
export default {
  nav: {
    home: "Inicio",
    aiAdvisor: "Asesor IA",
  },
  // ...
}
```

## Best Practices

1. **Keep keys consistent** - Use same structure across languages
2. **Use professional terminology** - Especially for immigration terms
3. **Test both languages** - Verify all content translates properly
4. **Use descriptive parameter names** - Not `{0}`, use `{years}`
5. **Group related strings** - By feature/section for organization
6. **Fallback to English** - System does this automatically

## Performance Notes

- ✅ Translations loaded at build time (no runtime overhead)
- ✅ Cookie-based locale (minimal storage)
- ✅ No API calls for translations
- ✅ Page reload on language change (ensures all content updates)

## Documentation

For complete documentation, see:
- **USAGE.md**: Comprehensive guide
- **I18N_SETUP_SUMMARY.md**: Implementation overview
- **This file**: Quick reference

---

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: April 14, 2026
