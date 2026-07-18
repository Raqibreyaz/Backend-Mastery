# Content Security Policy (CSP) — One-Shot Revision

## 1. One-line Definition

CSP is a browser-enforced response policy that restricts which sources may load or execute content on a page.

## 2. Why was it introduced?

It limits the impact of XSS and content injection by refusing scripts, frames, styles, images, and connections that do not match an allowlist.

## 3. Core Mental Model

CSP is a page’s resource allowlist. Start restrictive, then permit only the sources/features the page genuinely needs.

## 4. Internal Working

The server sends `Content-Security-Policy` (or first evaluates `Content-Security-Policy-Report-Only`). Directives apply by resource class. `default-src` is the fallback; more specific directives override it. Inline scripts are blocked unless explicitly authorized with a per-response nonce or stable content hash.

## 5. Key APIs / Syntax

```http
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; script-src 'self' 'nonce-RANDOM';
```

```js
// Generate a fresh cryptographic nonce per response; put it in CSP and the needed script tag.
// Prefer Helmet to set a baseline, then customize deliberately.
app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"] } }));
```

Useful directives: `script-src`, `style-src`, `img-src`, `connect-src`, `font-src`, `object-src`, `base-uri`, `form-action`, `frame-ancestors`, and `upgrade-insecure-requests`.

## 6. Comparison

| Nonce | Hash |
| --- | --- |
| Fresh random value per response | Base64 hash of fixed inline content |
| Good for dynamic trusted inline script | Good for stable inline script |
| Must be unpredictable and matched in tag | Changes whenever content changes |

## 7. Common Mistakes

- Using `unsafe-inline` or `unsafe-eval` as a permanent fix.
- Broad wildcards that defeat the policy.
- Reusing a nonce across responses or deriving it predictably.
- Deploying an enforcing CSP without report-only testing/asset inventory.
- Believing CSP fixes an unsafe `innerHTML` sink.

## 8. Production Considerations

- Begin with report-only, collect violations safely, then enforce a minimal policy.
- Move inline code to external files where possible; use nonces/hashes only for intentional exceptions.
- Use CSP alongside output encoding/sanitization, not instead of them.
- Use `frame-ancestors` to control framing; it supersedes old frame-policy approaches in modern browsers.

## 9. Interview Questions

1. What threat does CSP primarily mitigate?
2. What is `default-src`?
3. Nonce versus hash?
4. Why avoid `unsafe-inline` and `unsafe-eval`?

## 10. Memory Triggers

- **CSP = browser resource allowlist.**
- **Default restrictive; allow only needed.**
- **Nonce fresh; hash fixed.**

## 11. Summary

CSP is a powerful XSS mitigation layer. Use an explicit minimal policy, authorize inline code with fresh nonces or hashes only when necessary, and retain safe rendering practices.
