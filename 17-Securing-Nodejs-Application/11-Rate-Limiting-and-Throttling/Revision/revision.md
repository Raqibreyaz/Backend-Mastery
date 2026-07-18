# Rate Limiting and Throttling — One-Shot Revision

## 1. One-line Definition

Rate limiting rejects requests above a defined allowance; throttling slows or spaces requests to smooth load.

## 2. Why was it introduced?

They protect availability and fairness by stopping abuse, credential stuffing, scraping, accidental retry storms, and costly endpoint overload.

## 3. Core Mental Model

Rate limit is a **quota gate**; throttling is a **traffic pace controller**. Both are policies over a trusted client identity and a time window.

## 4. Internal Working

Common algorithms include fixed window, sliding window, token bucket, and leaky bucket. A key—user/account/API key/IP/route—maps to counters or tokens in a store. Excess requests are rejected with `429 Too Many Requests` (often with `Retry-After`) or deliberately delayed. Static limits are fixed; dynamic limits respond to configured metrics; adaptive controls react to live latency/error feedback.

## 5. Key APIs / Syntax

```js
import { rateLimit } from 'express-rate-limit';

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
}));
```

For multi-instance deployment, use a shared atomic store (commonly Redis), not a process-local memory counter.

## 6. Comparison

| Rate limiting | Throttling |
| --- | --- |
| Rejects excess requests | Delays/spaces excess requests |
| Clear client feedback: 429 | Increases latency/queues work |
| Best for hard quotas/abuse boundaries | Best for smoothing bursts/downstream protection |

## 7. Common Mistakes

- Using in-memory limits across multiple server instances.
- Keying only by IP when authenticated identity is available, or trusting forwarded IPs without proxy configuration.
- One global limit for login, uploads, public reads, and costly writes.
- Returning generic errors rather than 429/retry guidance.
- Queuing unbounded throttled work until memory is exhausted.

## 8. Production Considerations

- Limit by the most reliable identity available and use separate policies per route risk/cost.
- Coordinate limits at CDN/WAF/gateway/application layers; apply stricter controls to auth and expensive endpoints.
- Use shared storage, atomic counters, monitoring, and a documented response/appeal path for legitimate clients.
- Select limits from measured capacity; dynamic/adaptive throttling needs strong observability to avoid harming healthy traffic.

## 9. Interview Questions

1. Rate limiting versus throttling?
2. Why use 429 and `Retry-After`?
3. Why does a distributed app need a shared store?
4. Token bucket versus fixed window at a high level?

## 10. Memory Triggers

- **Limit rejects; throttle slows.**
- **429 tells client to back off.**
- **Distributed limits need shared atomic state.**

## 11. Summary

Use rate limits for firm quotas and throttling for load smoothing. Design policies per endpoint/client identity, enforce them across all instances, and monitor their fairness and effectiveness.
