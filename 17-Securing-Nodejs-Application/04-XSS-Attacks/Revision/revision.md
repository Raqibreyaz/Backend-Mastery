# Cross-Site Scripting (XSS) — One-Shot Revision

## 1. One-line Definition

XSS is a vulnerability where attacker-controlled content executes as JavaScript in a trusted site’s browser context.

## 2. Why was it introduced?

Applications render user content; without context-aware output handling, that content can become executable markup/script and act as the victim.

## 3. Core Mental Model

Untrusted input is data, never code. Encode it for the exact output context, and sanitize only when deliberately accepting limited HTML.

## 4. Internal Working

- **Stored XSS:** malicious content is saved and later rendered to many users.
- **Reflected XSS:** request input is immediately reflected in a response.
- **DOM XSS:** unsafe client-side code converts a source such as URL/hash/message into executable DOM.

Dangerous sinks include `innerHTML`, inline event attributes, `javascript:` URLs, dynamic script creation, and `eval`/`Function`. A successful payload runs with the origin’s access, potentially reading non-HttpOnly data and performing actions as the user.

## 5. Key APIs / Syntax

```js
// Prefer text APIs
element.textContent = userComment;

// If a product truly accepts limited HTML, sanitize with a maintained sanitizer
element.innerHTML = DOMPurify.sanitize(userHtml);
```

Framework interpolation normally escapes text; do not bypass it with raw HTML rendering unless content is sanitized and CSP-backed.

## 6. Comparison

| Stored | Reflected | DOM-based |
| --- | --- | --- |
| Persisted server-side then shown later | Request data echoed in response | Client-side source reaches unsafe sink |
| Often broadest impact | Usually link/request-driven | May never reach server response |

## 7. Common Mistakes

- Assigning request/user data to `innerHTML`.
- Using escaping meant for HTML text in an attribute, URL, or JavaScript context.
- Believing input validation alone replaces output encoding.
- Relying solely on CSP instead of fixing unsafe rendering.
- Storing auth tokens where injected JS can read them.

## 8. Production Considerations

- Prefer text-only user content; use context-aware encoding by default.
- Sanitize allowed HTML with a maintained library and an explicit allowlist; sanitize again at the rendering boundary if needed.
- Deploy strict CSP, avoid inline scripts/eval, and use HttpOnly cookies for sensitive session tokens.
- Test all templating/client sinks and maintain dependency updates.

## 9. Interview Questions

1. Define stored, reflected, and DOM XSS.
2. Why is `innerHTML` dangerous with user input?
3. Encoding versus sanitization?
4. How does CSP help, and why is it not enough alone?

## 10. Memory Triggers

- **Input is data; output context matters.**
- **textContent safe default; innerHTML needs sanitization.**
- **Stored / reflected / DOM.**

## 11. Summary

Prevent XSS through safe rendering and context-aware encoding first, tightly allowlisted sanitization only when HTML is required, and CSP/cookie defenses as supporting layers.
