import { describe, it, expect, beforeEach } from "vitest";

/**
 * Tests for Stripe webhook idempotency logic.
 * We test the algorithm in isolation since the actual webhook handler
 * requires Stripe signature verification and DB access.
 */

// Replicate the idempotency logic from the webhook route
const processedEvents = new Map<string, number>();
const MAX_PROCESSED = 100; // smaller for testing
const EVENT_TTL_MS = 1000; // 1 second for test speed

function isAlreadyProcessed(eventId: string): boolean {
  const ts = processedEvents.get(eventId);
  if (ts && Date.now() - ts < EVENT_TTL_MS) return true;

  if (processedEvents.size > MAX_PROCESSED) {
    const cutoff = Date.now() - EVENT_TTL_MS;
    for (const [key, val] of processedEvents) {
      if (val < cutoff) processedEvents.delete(key);
    }
  }
  return false;
}

function markProcessed(eventId: string): void {
  processedEvents.set(eventId, Date.now());
}

describe("Webhook idempotency store", () => {
  beforeEach(() => {
    processedEvents.clear();
  });

  it("allows first processing of an event", () => {
    expect(isAlreadyProcessed("evt_001")).toBe(false);
  });

  it("blocks duplicate processing within TTL", () => {
    markProcessed("evt_002");
    expect(isAlreadyProcessed("evt_002")).toBe(true);
  });

  it("allows different events independently", () => {
    markProcessed("evt_003");
    expect(isAlreadyProcessed("evt_003")).toBe(true);
    expect(isAlreadyProcessed("evt_004")).toBe(false);
  });

  it("allows reprocessing after TTL expires", async () => {
    markProcessed("evt_005");
    expect(isAlreadyProcessed("evt_005")).toBe(true);

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, EVENT_TTL_MS + 50));
    expect(isAlreadyProcessed("evt_005")).toBe(false);
  });

  it("cleans up old entries when map exceeds max size", () => {
    // Fill the map past MAX_PROCESSED
    for (let i = 0; i < MAX_PROCESSED + 10; i++) {
      processedEvents.set(`evt_old_${i}`, Date.now() - EVENT_TTL_MS - 1000);
    }
    expect(processedEvents.size).toBeGreaterThan(MAX_PROCESSED);

    // Trigger cleanup by checking a new event
    isAlreadyProcessed("evt_new");

    // Old expired entries should be cleaned up
    expect(processedEvents.size).toBeLessThanOrEqual(MAX_PROCESSED);
  });

  it("preserves recent entries during cleanup", () => {
    // Add old entries
    for (let i = 0; i < MAX_PROCESSED + 5; i++) {
      processedEvents.set(`evt_old_${i}`, Date.now() - EVENT_TTL_MS - 1000);
    }
    // Add a recent entry
    markProcessed("evt_recent");

    // Trigger cleanup
    isAlreadyProcessed("evt_trigger");

    // Recent entry should survive cleanup
    expect(isAlreadyProcessed("evt_recent")).toBe(true);
  });
});
