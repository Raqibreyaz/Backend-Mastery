# Cookies and Security — One-Shot Revision

## 1. One-line Definition

Cookie security is the use of scope and transport attributes to control when browser-stored cookies are sent and who can access them.

## 2. Why was it introduced?

Cookies carry sessions automatically, which is convenient but exposes applications to token theft, cross-site request risks, and overly broad sharing if attributes are weak.

## 3. Core Mental Model

Cookies are governed by different boundaries: **Domain/Path** decide where they go, **Secure** decides transport, **HttpOnly** decides JavaScript access, and **SameSite** decides cross-site sending.

## 4. Internal Working

A host-only cookie goes only to the host that set it; setting `Domain=example.com` allows matching subdomains too. Same-site is broader than same-origin: related subdomains can be same-site. Top-level navigations and subresource/fetch requests interact differently with `SameSite` rules. Cross-origin fetch needs both browser credentials mode and explicit credentialed CORS server headers.

## 5. Key APIs / Syntax

```js
res.cookie('session', value, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 1000,
});
```

`SameSite=Strict` is most restrictive; `Lax` is a common balanced default; `None` permits cross-site behavior but requires `Secure`.

## 6. Comparison

| Attribute | Main protection |
| --- | --- |
| `HttpOnly` | Limits XSS reading cookie via JS |
| `Secure` | HTTPS-only transmission |
| `SameSite` | Reduces cross-site cookie sending/CSRF exposure |
| `Domain`/`Path` | Limits destination scope |
| `maxAge`/`expires` | Limits lifetime |

## 7. Common Mistakes

- Setting `Domain` broadly when host-only is enough.
- Using `SameSite=None` without `Secure`.
- Assuming HttpOnly prevents CSRF.
- Expecting cross-origin `fetch` to send cookies without `credentials: 'include'` and explicit CORS credentials/origin configuration.
- Keeping sessions valid too long or putting sensitive data in cookie values.

## 8. Production Considerations

- Use `HttpOnly`, `Secure`, least Domain/Path scope, short lifetime/rotation, and deliberate SameSite policy.
- Pair cookie sessions with CSRF defenses for unsafe operations.
- Avoid wildcard CORS when credentials are enabled; use an origin allowlist.
- Prepare for third-party cookie blocking rather than assuming embedded cross-site sessions work everywhere.

## 9. Interview Questions

1. Host-only versus Domain cookie?
2. Same-origin versus same-site?
3. What do Secure, HttpOnly, and SameSite do?
4. What is required for credentialed cross-origin fetch?

## 10. Memory Triggers

- **Domain/path scope destination.**
- **Secure HTTPS; HttpOnly no JS; SameSite cross-site control.**
- **Cookie auth still needs CSRF protection.**

## 11. Summary

Secure cookies use the smallest scope and strongest practical flags. They are an important session layer but must be paired with CORS, CSRF, XSS, and server authorization defenses.
