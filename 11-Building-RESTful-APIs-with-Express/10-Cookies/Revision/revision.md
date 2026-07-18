# Cookies — One-Shot Revision

## 1. One-line Definition

A cookie is small browser-managed name/value state that the browser automatically attaches to matching HTTP requests.

## 2. Why was it introduced?

HTTP is stateless; cookies give websites a mechanism for sessions, preferences, and other scoped client state.

## 3. Core Mental Model

The server sets a cookie with `Set-Cookie`; the browser decides when to return it according to domain, path, expiry, `Secure`, `HttpOnly`, and `SameSite` rules.

## 4. Internal Working

The browser stores cookies (roughly limited to a few KB each) and sends eligible ones in the request `Cookie` header. Express can set them through `res.cookie()`. `cookie-parser` parses the incoming header into `req.cookies`; it does not make a cookie secure or provide session storage itself.

## 5. Key APIs / Syntax

```js
import cookieParser from 'cookie-parser';
import cors from 'cors';

app.use(cookieParser());
app.use(cors({ origin: 'https://app.example.com', credentials: true }));

app.post('/session', (req, res) => {
  res.cookie('session', token, {
    httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 1000,
  });
  res.sendStatus(204);
});
```

Use `res.clearCookie('session', options)` to remove a cookie; the relevant path/domain options must match its creation.

## 6. Comparison

| Flag | Effect |
| --- | --- |
| `HttpOnly` | JavaScript cannot read it; reduces XSS token theft |
| `Secure` | Browser sends it only over HTTPS (except local development caveats) |
| `SameSite=Lax/Strict/None` | Controls cross-site sending; `None` requires `Secure` |
| `maxAge` / `expires` | Persistent expiry; otherwise typically session cookie |

## 7. Common Mistakes

- Storing sensitive session tokens in readable JavaScript cookies instead of `HttpOnly` cookies.
- Using `SameSite=None` without `Secure`.
- Expecting cookies in cross-origin fetch without `credentials: 'include'` and matching CORS credentials settings.
- Pairing credentialed CORS with wildcard origin.
- Treating `HttpOnly` as CSRF protection; it is not.
- Putting large data in cookies; every matching request carries them.

## 8. Production Considerations

- Use `HttpOnly`, `Secure`, a deliberate `SameSite` policy, minimal scope (`Path`/`Domain`), short expiry/rotation, and signed/encrypted server-side session designs where appropriate.
- Defend cookie-authenticated state-changing endpoints against CSRF (SameSite plus token/origin strategy as required).
- Serve production only over HTTPS and avoid logging cookie values.
- For cross-site embedded flows, understand browser third-party-cookie restrictions; design fallbacks intentionally.

## 9. Interview Questions

1. How does a browser send cookies back to a server?
2. Explain `HttpOnly`, `Secure`, and `SameSite`.
3. What does `cookie-parser` do?
4. What is needed for cross-origin credentialed cookies?
5. Why do cookies require CSRF thinking?

## 10. Memory Triggers

- **Set-Cookie out; Cookie back.**
- **HttpOnly blocks JS; Secure requires HTTPS.**
- **SameSite controls cross-site send.**
- **Credentials CORS: explicit origin, never `*`.**

## 11. Summary

Cookies are browser-controlled request state. Set narrowly scoped, secure cookie attributes and pair cookie auth with deliberate CORS and CSRF protections.
