# Security Infrastructure

This document outlines the security measures implemented in GreenCard.ai.

## 1. Content Security Policy (CSP)

### Location
- **Middleware**: `src/middleware.ts` - Applied to all responses
- **Config**: `next.config.ts` - Fallback headers for static assets

### Policy Details

#### Default Source
- `default-src 'self'` - Only allow resources from same origin by default

#### Scripts
- `'self'` - Own scripts
- `'unsafe-inline'` and `'unsafe-eval'` - Required for Next.js runtime
- `cdnjs.cloudflare.com`, `cdn.jsdelivr.net` - Trusted CDNs

#### Styles
- `'self'` - Own stylesheets
- `'unsafe-inline'` - Required for Tailwind CSS
- Font CDNs: `fonts.googleapis.com`

#### Images
- `'self'` - Own images
- `data:` - Data URIs (avatars, icons)
- `https:` - All HTTPS sources (attorney photos, etc.)
- `blob:` - Canvas/generated images

#### Fonts
- `'self'` - Own fonts
- `data:` - Data URIs
- `fonts.gstatic.com`, CDN sources

#### Connections
- `'self'` - Same origin API
- `https://api.anthropic.com` - Claude API
- `https://api.stripe.com` - Stripe payments
- `https://wa.me` - WhatsApp messaging
- `wss:` - WebSocket connections

#### Other Directives
- `frame-ancestors 'none'` - Prevent clickjacking
- `base-uri 'self'` - Restrict base URL
- `form-action 'self'` - Prevent form hijacking
- `upgrade-insecure-requests` - Force HTTPS

## 2. Additional Security Headers

All responses include:

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | `nosniff` | Prevent MIME type sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer leakage |
| `Permissions-Policy` | See below | Disable sensitive features |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS (2 years) |
| `X-DNS-Prefetch-Control` | `on` | Enable DNS prefetching |
| `X-Permitted-Cross-Domain-Policies` | `none` | No cross-domain policies |

### Permissions Policy
Disabled by default:
- `geolocation`
- `microphone`
- `camera`
- `usb`
- `magnetometer`
- `gyroscope`
- `accelerometer`

Allowed only for same origin:
- `payment` - For Stripe checkout

## 3. Rate Limiting

### Implementation
Located in: `src/lib/rate-limit.ts`

### Architecture
1. **Primary**: Upstash Redis (production-recommended)
   - Distributed rate limiting via Upstash API
   - Supports multiple isolates/serverless instances
   - Uses sliding window algorithm

2. **Fallback**: In-memory bucket (development only)
   - Token bucket algorithm
   - Auto-cleanup of old buckets every 5 minutes
   - **WARNING**: Do NOT use in production on Cloudflare Workers

### Rate Limit Presets

| Tier | Limit | Window | Use Case |
|------|-------|--------|----------|
| `FREE_TIER` | 10 req/min | 60s | General free tier |
| `PAID_TIER` | 60 req/min | 60s | Paid accounts |
| `API_TIER` | 120 req/min | 60s | API access |
| `AUTH_TIER` | 5 attempts/15min | 900s | Login/signup (brute force) |
| `PASSWORD_RESET_TIER` | 3 req/hour | 3600s | Password reset |
| `UPLOAD_TIER` | 10 uploads/5min | 300s | File uploads |
| `CHAT_TIER` | 30 req/min | 60s | AI chat |

### IP Extraction
Helper function `getClientIp()` handles:
- Cloudflare headers (`CF-Connecting-IP`)
- Proxy headers (`X-Forwarded-For`)
- nginx headers (`X-Real-IP`)

### Usage Example
```typescript
import { rateLimit, CHAT_TIER, getClientIp } from '@/lib/rate-limit';

// Get client IP from request headers
const ip = getClientIp(request.headers);

// Check rate limit
const result = await rateLimit(ip, CHAT_TIER.limit, CHAT_TIER.window);

if (!result.success) {
  return NextResponse.json(
    { error: 'Rate limit exceeded' },
    {
      status: 429,
      headers: {
        'Retry-After': result.resetAfter?.toString() || '60',
      },
    }
  );
}
```

## 4. CSRF Protection

Located in: `src/lib/csrf.ts` (already implemented)

- Tokens generated and validated on all state-changing requests
- Exempt routes configured for webhooks and health checks
- Tokens set in cookies and validated from request body/headers

## 5. Production Deployment (Cloudflare Workers)

### Important Considerations

1. **Rate Limiting on Cloudflare**:
   - Must use Upstash Redis or Cloudflare Durable Objects
   - In-memory rate limiting WILL NOT work (requests hit different isolates)
   - Configure environment variables:
     ```
     UPSTASH_REDIS_REST_URL=https://...
     UPSTASH_REDIS_REST_TOKEN=...
     ```

2. **CSP in Workers**:
   - Headers set in middleware.ts apply to all requests
   - Headers in next.config.ts apply to static assets
   - Both are active for redundancy

3. **TLS/HTTPS**:
   - Cloudflare provides automatic HTTPS
   - HSTS preload configured (63,072,000 seconds = 2 years)
   - All insecure requests upgraded via CSP

## 6. Security Checklist

### Before Production Deployment
- [ ] Verify `UPSTASH_REDIS_REST_URL` and token configured
- [ ] Test rate limiting doesn't block legitimate users
- [ ] Verify CSP allows all needed resources (check browser console)
- [ ] Test authentication flows work on mobile
- [ ] Enable HSTS preload (greencard.bigcohen.org)
- [ ] Review and whitelist any new external resources
- [ ] Test CORS if needed (currently disabled by default)

### Monitoring
- [ ] Monitor CSP violation reports (if configured with report-uri)
- [ ] Monitor rate limit exceeds in logs
- [ ] Monitor Stripe webhook failures
- [ ] Monitor Anthropic API failures

## 7. Common Issues & Solutions

### CSP Violations
If you see CSP violations in browser console:
1. Check the exact source in the error
2. Add to appropriate directive in `src/middleware.ts`
3. Rebuild and redeploy

### Rate Limit False Positives
- Check IP extraction is correct (see network headers)
- Adjust rate limit tiers if needed
- Use Redis instead of in-memory for consistent behavior

### Mixed Content Warnings
- Ensure all external resources use `https://`
- CSP `upgrade-insecure-requests` handles this but prefer explicit https

## 8. References

- [OWASP Content Security Policy](https://owasp.org/www-community/attacks/csrf)
- [MDN CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)
- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)
- [Cloudflare Workers Best Practices](https://developers.cloudflare.com/workers/platform/security/)
