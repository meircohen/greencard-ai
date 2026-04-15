/**
 * Analytics helper functions for GA4 and other tracking
 * These functions are safe to call on both client and server
 * (checks for window availability internally)
 */

/**
 * Track a custom event in Google Analytics 4
 * @param name - Event name (e.g., "form_submission", "feature_used")
 * @param params - Optional event parameters
 */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // GA4 gtag tracking
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", name, params || {});
    }
  } catch (error) {
    // Silently fail if gtag is not available
    console.debug("GA4 tracking unavailable for event:", name);
  }
}

/**
 * Track a page view in Google Analytics 4
 * @param url - Page URL to track
 */
export function trackPageView(url: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    // GA4 page view tracking
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("config", (window as any).GA_MEASUREMENT_ID || "", {
        page_path: url,
      });
    }
  } catch (error) {
    // Silently fail if gtag is not available
    console.debug("GA4 page view tracking unavailable for URL:", url);
  }
}

/**
 * Track an error event (useful for debugging)
 * @param errorName - Name/type of error
 * @param errorMessage - Error message
 */
export function trackError(
  errorName: string,
  errorMessage: string
): void {
  trackEvent("exception", {
    description: `${errorName}: ${errorMessage}`,
    fatal: false,
  });
}

/**
 * Declare gtag for TypeScript
 */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
