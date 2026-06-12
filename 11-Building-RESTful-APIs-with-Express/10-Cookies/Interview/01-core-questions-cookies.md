# Core Questions – Cookies

---

### Q1. What are HTTP cookies and how are they used in web apps?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “If HTTP is stateless, how does a server remember who you are?”

**Answer (max 4 bullets):**
- A cookie is a small key–value pair the server sends in a `Set-Cookie` header; the browser stores it and includes it on subsequent requests in the `Cookie` header for that origin.
- Cookies let the server associate requests with state such as authentication sessions, preferences, or tracking identifiers.
- Each cookie is scoped by attributes like domain, path, and expiration.
- Because cookies are automatically attached to matching requests, they’re often used for login sessions and CSRF-prone operations.

**See also:** `../Learning/01-cookie-basics-and-lifecycle.md`

---

### Q2. How do you set and read cookies in an Express.js app?

Type: API usage | Difficulty: Easy | Asked: High

**Hook:** “Show me how you’d store a ‘theme=dark’ cookie and read it back.”

**Answer:**
- Install and use `cookie-parser` middleware: `app.use(cookieParser());` – this parses the `Cookie` header and populates `req.cookies`.
- Set cookies with `res.cookie(name, value, options)`, which adds a `Set-Cookie` header.
- Example:

  ```js
  res.cookie('theme', 'dark', { maxAge: 7 * 24 * 60 * 60 * 1000 });
  const theme = req.cookies.theme;
  ```

- You can also clear cookies with `res.clearCookie(name, options)`.

**See also:** `../Learning/02-express-cookie-parser-and-api.md`

---

### Q3. What does the `HttpOnly` attribute do and why is it important?

Type: Security | Difficulty: Medium | Asked: High

**Hook:** “Can JavaScript read your session cookie? Should it?”

**Answer:**
- `HttpOnly` tells the browser that the cookie **must not be accessible from JavaScript**, i.e., it’s hidden from `document.cookie`.
- This mitigates session theft via XSS: if an attacker injects JavaScript, they cannot directly read cookies marked `HttpOnly`.
- It does not stop the cookie from being sent with HTTP requests; it only limits client-side access.
- Session identifiers and auth tokens should almost always be stored in `HttpOnly` cookies rather than localStorage.

**See also:** `../Learning/03-cookie-security-attributes.md`

---

### Q4. What does the `Secure` attribute do and when should you use it?

Type: Security | Difficulty: Medium | Asked: Medium–High

**Hook:** “Why might your cookie not be setting in development when `secure` is true?”

**Answer:**
- `Secure` tells the browser to only send the cookie over **HTTPS** connections (and typically on localhost during development).
- This prevents cookies from being transmitted in cleartext over HTTP, protecting against network eavesdropping.
- Browsers generally ignore attempts to set `Secure` cookies from insecure `http://` origins.
- In production you should set `secure: true` for auth/session cookies; in local development you often use `secure: false` because you’re on plain HTTP.

**See also:** `../Learning/03-cookie-security-attributes.md`

---

### Q5. What is `SameSite` and how does it help with CSRF?

Type: Security | Difficulty: Medium–High | Asked: High

**Hook:** “Why do modern browsers complain about `SameSite` when setting cookies?”

**Answer:**
- `SameSite` controls whether cookies are sent on **cross-site requests** (e.g., when a different site submits a form or makes a request to your domain).
- `SameSite=Strict` – only send the cookie for requests originating from the same site; strongest CSRF protection but can break some cross-site flows.
- `SameSite=Lax` – send cookies on top-level navigations (e.g., clicking a link) but not on background cross-site requests like POST form submissions or XHR.
- `SameSite=None` – allow cross-site usage, but must be combined with `Secure`; needed for some SPA setups where API and frontend are on different domains.

**See also:** `../Learning/03-cookie-security-attributes.md`

---

### Q6. How do you configure cookies for auth/session in Express (local vs production)?

Type: Applied | Difficulty: Medium–High | Asked: Medium–High

**Hook:** “You’re storing a JWT in a cookie – what options do you set?”

**Answer:**
- For production, a typical config is:

  ```js
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict', // or 'Lax' depending on UX needs
    path: '/',
    maxAge: 60 * 60 * 1000,
  });
  ```

- For local development on `http://localhost`, you usually set `secure: false` and `sameSite: 'Lax'` to avoid browser blocking while still getting some CSRF protection.
- When dealing with cross-origin frontends (e.g., `api.myapp.com` and `app.myapp.com`), you might use `SameSite=None; Secure` and configure CORS and `withCredentials` properly.
- Session middleware like `express-session` / `cookie-session` expose `cookie` options where you configure these flags centrally.

**See also:** `../Learning/04-auth-and-session-cookies.md`

---

### Q7. What’s the difference between cookies and `localStorage` for auth?

Type: Concept | Difficulty: Medium | Asked: Medium

**Hook:** “Why prefer cookies for auth tokens instead of localStorage?”

**Answer:**
- Cookies automatically attach to matching requests, which is useful for session management but can make CSRF a concern; `localStorage` does not auto-send.
- `HttpOnly` cookies are not accessible from JavaScript, making it harder for XSS to steal the token; `localStorage` is fully accessible to any injected script.
- CSRF can be mitigated with `SameSite`, CSRF tokens, and origin checks when using cookies.
- Many production setups use **HttpOnly + Secure + SameSite cookies** for session tokens instead of localStorage for better security posture.

**See also:** `../Learning/04-auth-and-session-cookies.md`

---

### Q8. How do you sign cookies and why would you do that?

Type: Security | Difficulty: Medium | Asked: Medium

**Hook:** “How do you detect if a cookie has been tampered with?”

**Answer:**
- `cookie-parser` supports **signed cookies** when initialized with a secret: `app.use(cookieParser(secret));`.
- When you set a cookie with `{ signed: true }`, Express adds an HMAC signature and stores it alongside the value.
- When reading, `req.signedCookies` gives you values that pass signature verification; tampered cookies are automatically dropped.
- Signed cookies help detect modification but do not encrypt the contents; for confidentiality you’d need encryption or server-side sessions.

**See also:** `../Learning/02-express-cookie-parser-and-api.md`