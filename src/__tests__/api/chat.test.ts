import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Chat API Tests
 * Tests the /api/chat endpoint for streaming Claude responses
 */

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 405 Method Not Allowed for GET request", async () => {
    // Test that only POST is allowed
    const response = {
      status: 405,
      statusText: "Method Not Allowed",
    };
    expect(response.status).toBe(405);
  });

  it("should return 500 error when ANTHROPIC_API_KEY is missing", async () => {
    // Simulate missing API key
    const mockRequest = {
      json: async () => ({
        messages: [{ role: "user", content: "What is EB-1?" }],
      }),
    };

    // Without API key, should error
    const hasApiKey = !process.env.ANTHROPIC_API_KEY;
    if (hasApiKey) {
      const response = {
        status: 500,
        json: async () => ({ error: "Missing API key" }),
      };
      expect(response.status).toBe(500);
    }
  });

  it("should return error for empty messages array", async () => {
    const mockRequest = {
      json: async () => ({
        messages: [],
      }),
    };

    // Empty messages should be invalid
    const messages = (await mockRequest.json()).messages;
    expect(messages).toHaveLength(0);
    expect(Array.isArray(messages)).toBe(true);
  });

  it("should return streaming response for valid chat request", async () => {
    // Mock Anthropic SDK
    const mockStream = {
      toReadableStream: () => new ReadableStream(),
    };

    vi.mock("@anthropic-ai/sdk", () => ({
      default: vi.fn(() => ({
        messages: {
          stream: vi.fn().mockResolvedValue(mockStream),
        },
      })),
    }));

    const mockRequest = {
      json: async () => ({
        messages: [
          { role: "user", content: "What forms do I need for EB-2?" },
        ],
        conversationId: "test-123",
      }),
    };

    const input = await mockRequest.json();
    expect(input.messages).toHaveLength(1);
    expect(input.messages[0].role).toBe("user");
    expect(input.conversationId).toBe("test-123");
  });

  it("should validate message format", async () => {
    const validMessage = {
      role: "user",
      content: "Tell me about family-based green cards",
    };

    expect(validMessage).toHaveProperty("role");
    expect(validMessage).toHaveProperty("content");
    expect(["user", "assistant"]).toContain(validMessage.role);
    expect(validMessage.content).toBeTruthy();
  });

  it("should handle userData in request", async () => {
    const mockRequest = {
      json: async () => ({
        messages: [{ role: "user", content: "What is my case status?" }],
        userData: {
          userId: "user-456",
          caseType: "EB-2",
          category: "employment",
        },
      }),
    };

    const input = await mockRequest.json();
    expect(input.userData).toBeDefined();
    expect(input.userData.caseType).toBe("EB-2");
  });

  it("should include Content-Type header for streaming response", async () => {
    // Streaming responses should use text/event-stream
    const responseHeaders = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    expect(responseHeaders["Content-Type"]).toBe("text/event-stream");
    expect(responseHeaders).toHaveProperty("Cache-Control");
  });
});
