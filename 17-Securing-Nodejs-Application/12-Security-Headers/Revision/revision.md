# Security Headers — One-Shot Revision

## 1. One-line Definition

Security headers are HTTP response directives that tell browsers to apply safer loading, framing, transport, privacy, and feature-use behavior.

## 2. Why was it introduced?

Browsers need server-declared policies to reduce common client-side attack classes without requiring every page to implement custom JavaScript defenses.

## 3. Core Mental Model

Headers are browser guardrails. Each mitigates a narrow risk; together they provide defense in depth, not immunity from unsafe application code.

## 4. Internal Working

Browsers receive headers with responses and enforce applicable policies for future resource loads/navigation. Helmet is Express middleware that sets a secure baseline of related headers; it must be configured to match the application’s actual assets, embedding needs, and TLS deployment.

## 5. Key APIs / Syntax

```js
import helmet from 'helmet';
app.use(helmet());
```

| Header | Primary purpose |
| --- | --- |
| `Content-Security-Policy` | Restrict resource/script sources; mitigate XSS |
| `Strict-Transport-Security` | Remember HTTPS-only transport |
| `X-Content-Type-Options: nosniff` | Prevent MIME sniffing |
| `Referrer-Policy` | Limit referrer leakage |
| `Permissions-Policy` | Limit browser features such as camera/mic |
| CSP `frame-ancestors` / `X-Frame-Options` | Restrict framing/clickjacking |
| COOP/CORP/COEP | Configure cross-origin isolation/resource policy |

## 6. Comparison

| CSP `frame-ancestors` | `X-Frame-Options` |
| --- | --- |
| Modern, expressive framing allowlist | Older, simple `DENY`/`SAMEORIGIN` support |
| Part of CSP policy | Legacy compatibility header |

`HSTS` only applies after an HTTPS response is received; it is not a substitute for first-connection TLS/certificate security.

## 7. Common Mistakes

- Adding Helmet and assuming no configuration/testing is needed.
- Enabling HSTS on a domain/subdomains before all are HTTPS-capable.
- Weakening CSP with broad sources/unsafe directives without tracking why.
- Depending on obsolete `X-XSS-Protection` rather than CSP and safe rendering.
- Breaking legitimate third-party assets/embeds without report-only rollout.

## 8. Production Considerations

- Use Helmet as a baseline, then explicitly tune CSP, framing, referrer, permissions, and cross-origin policies.
- Test headers in staging with browser tooling and CSP reporting before enforcing strict rules.
- Apply HSTS only behind correctly deployed HTTPS and coordinate with all subdomains.
- Maintain headers at the reverse proxy/CDN too, and prevent duplicate/conflicting policies.

## 9. Interview Questions

1. What security headers does Helmet help set?
2. CSP versus X-Frame-Options?
3. What does HSTS do and when is it risky?
4. Why is `nosniff` useful?

## 10. Memory Triggers

- **CSP scripts, HSTS transport, frame policy UI.**
- **Helmet baseline—not a finished threat model.**
- **Test before enforcing.**

## 11. Summary

Security headers add important browser-side layers. Deploy Helmet, configure policies for real application needs, and validate them alongside secure server and frontend code.
