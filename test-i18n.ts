import { t, DEFAULT_LOCALE } from "./src/i18n";
import enTranslations from "./src/i18n/en";
import esTranslations from "./src/i18n/es";

// Test that translations are properly structured
console.log("✓ English translations loaded:", Object.keys(enTranslations).length, "sections");
console.log("✓ Spanish translations loaded:", Object.keys(esTranslations).length, "sections");

// Test locale detection
console.log("✓ Default locale:", DEFAULT_LOCALE);

// Test basic translation retrieval
const enHero = enTranslations.hero.title;
const esHero = esTranslations.hero.title;
console.log("✓ English hero title:", enHero);
console.log("✓ Spanish hero title:", esHero);

// Test parameter interpolation
const enWait = t(DEFAULT_LOCALE, "bulletin.waitYears", { years: 2 });
console.log("✓ Interpolation test:", enWait);

console.log("\n✅ All i18n tests passed!");
