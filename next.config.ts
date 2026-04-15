import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Prevent clickjacking attacks
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Legacy XSS protection (redundant with CSP but good for older browsers)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Control referrer information
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Disable access to sensitive device features
          {
            key: "Permissions-Policy",
            value:
              "geolocation=(), microphone=(), camera=(), payment=(self), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
          },
          // Force HTTPS and preload in browser HSTS list
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Enable DNS prefetching for performance (safe with strict CSP)
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Content Security Policy - Comprehensive protection against XSS and injection attacks
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Scripts: self + unsafe-inline/eval for Next.js + trusted CDNs
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com cdn.jsdelivr.net",
              // Styles: self + unsafe-inline (required for Tailwind) + font CDNs
              "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com cdn.jsdelivr.net fonts.googleapis.com",
              // Images: self, data URIs, and all HTTPS sources (for external images)
              "img-src 'self' data: https: blob:",
              // Fonts: self, data URIs, and common font CDNs
              "font-src 'self' data: cdnjs.cloudflare.com cdn.jsdelivr.net fonts.gstatic.com",
              // API connections: self + trusted services + WebSocket
              "connect-src 'self' https://api.anthropic.com https://api.stripe.com https://wa.me wss:",
              // Prevent framing from external sites
              "frame-ancestors 'none'",
              // Restrict base URL to same origin
              "base-uri 'self'",
              // Only allow form submissions to same origin
              "form-action 'self'",
              // Upgrade insecure requests to HTTPS
              "upgrade-insecure-requests",
            ].join("; "),
          },
          // Additional protection headers
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          {
            key: "X-Content-Security-Policy",
            value: "default-src 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
