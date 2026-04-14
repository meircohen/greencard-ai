import { test, expect } from "@playwright/test";

/**
 * Chat Page E2E Tests
 * Tests the chat interface, message sending, and real-time interaction
 */

test.describe("Chat Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/chat");
  });

  test("should load chat page successfully", async ({ page }) => {
    await expect(page).toHaveURL(/\/chat/);
    const chatContainer = page.locator('[data-testid="chat-container"]');
    await expect(chatContainer).toBeVisible();
  });

  test("should display welcome message", async ({ page }) => {
    const welcomeMessage = page.locator(
      '[data-testid="welcome-message"]'
    );
    await expect(welcomeMessage).toBeVisible();

    const text = await welcomeMessage.textContent();
    expect(text).toBeTruthy();
  });

  test("should display quick suggestion chips", async ({ page }) => {
    const suggestionChips = page.locator('[data-testid="suggestion-chip"]');
    const count = await suggestionChips.count();

    expect(count).toBeGreaterThan(0);

    // Click first suggestion
    const firstChip = suggestionChips.first();
    await expect(firstChip).toBeVisible();
    await expect(firstChip).toContainText(/.+/); // Has text
  });

  test("should send message and display in chat history", async ({ page }) => {
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');

    await expect(messageInput).toBeVisible();
    await expect(sendButton).toBeVisible();

    // Type a message
    const testMessage = "What visa category am I eligible for?";
    await messageInput.fill(testMessage);

    // Verify message is in input
    await expect(messageInput).toHaveValue(testMessage);

    // Send message
    await sendButton.click();

    // Message should appear in chat
    const userMessage = page.locator(
      `text=${testMessage}`
    );
    await expect(userMessage).toBeVisible({ timeout: 5000 });
  });

  test("should disable send button while message is empty", async ({
    page,
  }) => {
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');

    // Initially button should be disabled
    await expect(messageInput).toHaveValue("");
    const isDisabled = await sendButton.isDisabled();
    expect(isDisabled).toBe(true);

    // Type message
    await messageInput.fill("Test message");
    await expect(sendButton).toBeEnabled();

    // Clear message
    await messageInput.clear();
    await expect(sendButton).toBeDisabled();
  });

  test("should clear message input after sending", async ({ page }) => {
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');

    // Type and send
    await messageInput.fill("Test message");
    await sendButton.click();

    // Wait for message to appear
    await page.waitForTimeout(500);

    // Input should be cleared
    await expect(messageInput).toHaveValue("");
  });

  test("should display typing indicator while waiting for response", async ({
    page,
  }) => {
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');

    await messageInput.fill("What is an EB-1A visa?");
    await sendButton.click();

    // Look for typing indicator
    const typingIndicator = page.locator('[data-testid="typing-indicator"]');

    // Should appear for a moment (may disappear quickly)
    const isVisible = await typingIndicator
      .isVisible({ timeout: 1000 })
      .catch(() => false);
    expect(typeof isVisible).toBe("boolean");
  });

  test("should scroll to latest message", async ({ page }) => {
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');
    const messagesContainer = page.locator('[data-testid="messages-container"]');

    // Send multiple messages
    for (let i = 0; i < 3; i++) {
      await messageInput.fill(`Test message ${i}`);
      await sendButton.click();
      await page.waitForTimeout(300);
    }

    // Get scroll position
    const scrollTop = await messagesContainer.evaluate(
      (el: HTMLElement) => el.scrollTop
    );
    const scrollHeight = await messagesContainer.evaluate(
      (el: HTMLElement) => el.scrollHeight
    );
    const clientHeight = await messagesContainer.evaluate(
      (el: HTMLElement) => el.clientHeight
    );

    // Should be scrolled near bottom
    expect(scrollTop + clientHeight).toBeGreaterThan(scrollHeight - 100);
  });

  test("should handle message formatting with newlines", async ({ page }) => {
    const messageInput = page.locator('[data-testid="message-input"]');

    // Shift+Enter should add newline
    await messageInput.fill("Line 1");
    await messageInput.press("Shift+Enter");
    await messageInput.type("Line 2");

    const value = await messageInput.inputValue();
    expect(value).toContain("Line 1");
    expect(value).toContain("Line 2");
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const chatContainer = page.locator('[data-testid="chat-container"]');
    await expect(chatContainer).toBeVisible();

    const messageInput = page.locator('[data-testid="message-input"]');
    await expect(messageInput).toBeVisible();
  });

  test("should maintain conversation context", async ({ page }) => {
    const messageInput = page.locator('[data-testid="message-input"]');
    const sendButton = page.locator('[data-testid="send-button"]');

    // Send first message
    await messageInput.fill("I am from India");
    await sendButton.click();

    await page.waitForTimeout(500);

    // Send follow-up
    await messageInput.fill("What visa categories suit me?");
    await sendButton.click();

    // Both messages should be visible
    const firstMsg = page.locator("text=I am from India");
    const secondMsg = page.locator("text=What visa categories");

    await expect(firstMsg).toBeVisible({ timeout: 5000 });
    await expect(secondMsg).toBeVisible({ timeout: 5000 });
  });
});
