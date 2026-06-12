# Cookies – 5 Minute Cheatsheet

## If you get only 3 questions

1. What are HTTP cookies and how do you set/read them in Express?
2. What do `HttpOnly`, `Secure`, and `SameSite` actually do?
3. How do you configure cookies safely for auth/session tokens (local dev vs production)?

---

## Mental models (1–2 lines each)

- A cookie is a **small piece of data sent in `Set-Cookie` headers** and returned by the browser on subsequent requests in the `Cookie` header; it’s the browser’s built-in “key-value store” for per-origin state.
- In Express, you typically set cookies with `res.cookie(name, value, options)` and read them via `req.cookies` when using the `cookie-parser` middleware.
- `HttpOnly` makes cookies **inaccessible to JavaScript** (`document.cookie`), helping protect session tokens against theft via XSS.
- `Secure` restricts cookies to **HTTPS requests only**, protecting them from being sent over cleartext HTTP.
- `SameSite` controls whether cookies are sent on **cross-site requests**, giving protection against CSRF (`Strict`/`Lax` vs `None`).
- Most secure “session cookie” config: `HttpOnly; Secure; SameSite=Strict` (plus sensible `path` and `maxAge`), with some adjustments for cross-site SPA setups.

---

## Canonical examples to recall

**1. Basic setup with `cookie-parser` and setting a cookie**

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser()); // populates req.cookies

app.get('/set', (req, res) => {
  res.cookie('theme', 'dark', { maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
  res.send('Cookie set');
});

app.get('/get', (req, res) => {
  res.json({ cookies: req.cookies });
});
```

`cookie-parser` parses the `Cookie` header and adds `req.cookies`; `res.cookie` sends `Set-Cookie` headers with optional attributes like `maxAge`.

---

**2. Secure auth/session cookie (production)**

```js
app.post('/login', (req, res) => {
  const token = generateJwtForUser(req.user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,        // HTTPS only
    sameSite: 'Strict',  // or 'Lax' for some flows
    path: '/',
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.json({ ok: true });
});
```

`HttpOnly` prevents JavaScript access, `Secure` restricts to HTTPS, and `SameSite` controls cross-site sending to mitigate CSRF.

---

**3. Local dev vs production cookie settings**

```js
const isProd = process.env.NODE_ENV === 'production';

app.post('/login', (req, res) => {
  const token = generateJwtForUser(req.user);
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,           // false on http://localhost, true on HTTPS
    sameSite: isProd ? 'Strict' : 'Lax',
    path: '/',
  });
});
```

You typically relax `secure`/`SameSite` for localhost and tighten them in production with HTTPS.

---

## Links to full notes

- HTTP cookies basics and browser behavior → `../Learning/01-cookie-basics-and-lifecycle.md`
- Using `cookie-parser`, `res.cookie`, and reading `req.cookies` → `../Learning/02-express-cookie-parser-and-api.md`
- Security attributes: `HttpOnly`, `Secure`, `SameSite`, `Path`, `Domain`, `Max-Age` → `../Learning/03-cookie-security-attributes.md`
- Cookies for auth/session (JWT vs session id, cross-origin cookies) → `../Learning/04-auth-and-session-cookies.md`