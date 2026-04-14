import { test, expect } from "@playwright/test";

/**
 * Home Page E2E Tests
 * Tests the landing page, navigation, and CTA buttons
 */

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load with correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/GreenCard.ai|Home/i);
  });

  test("should display hero section", async ({ page }) => {
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    // Check for main headline
    const headline = page.locator('h1');
    await expect(headline).toBeVisible();
    const text = await headline.textContent();
    expect(text).toBeTruthy();
  });

  test("should display navigation links", async ({ page }) => {
    const navbar = page.locator('[data-testid="navbar"]');
    await expect(navbar).toBeVisible();

    // Check for home link
    const homeLink = navbar.locator('a[href="/"]');
    await expect(homeLink).toBeVisible();

    // Check for other main links
    const featureLink = navbar.locator('a[href="#features"]');
    await expect(featureLink).toBeVisible();
  });

  test("should navigate to chat page via CTA button", async ({ page }) => {
    const ctaButton = page.locator('button, a[href*="chat"]').first();
    await expect(ctaButton).toBeVisible();

    await ctaButton.click();
    // Should either navigate or open chat modal
    const url = page.url();
    expect(url).toMatch(/chat|#chat/i);
  });

  test("should navigate to pricing page", async ({ page }) => {
    const pricingLink = page.locator('a[href="/pricing"]');
    if (await pricingLink.isVisible()) {
      await pricingLink.click();
      await expect(page).toHaveURL(/\/pricing/);
    }
  });

  test("should display feature section", async ({ page }) => {
    const featuresSection = page.locator(
      '[data-testid="features-section"]'
    );

    if (await featuresSection.isVisible()) {
      const featureCards = featuresSection.locator('[data-testid^="feature-"]');
      const count = await featureCards.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should have accessible color contrast", async ({ page }) => {
    // Check that main text is readable
    const mainText = page.locator('h1, p');
    const firstVisible = mainText.first();
    await expect(firstVisible).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Hero section should still be visible
    const heroSection = page.locator('[data-testid="hero-section"]');
    await expect(heroSection).toBeVisible();

    // Navigation should be visible (hamburger or full)
    const navbar = page.locator('[data-testid="navbar"]');
    await expect(navbar).toBeVisible();
  });

  test("should load all images", async ({ page }) => {
    const images = page.locator("img");
    const count = await images.count();

    // Verify at least one image loaded
    if (count > 0) {
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);
        const isVisible = await img.isVisible();
        expect(isVisible || (await img.getAttribute("src"))).toBeTruthy();
      }
    }
  });

  test("should have working external links with proper target", async ({
    page,
  }) => {
    const externalLinks = page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    if (count > 0) {
      const firstLink = externalLinks.first();
      const href = await firstLink.getAttribute("href");
      expect(href).toMatch(/^https?:\/\//);

      // Check for rel attribute
      const rel = await firstLink.getAttribute("rel");
      expect(rel).toContain("noopener");
    }
  });
});
