# Cross-Site Request Forgery (CSRF) — One-Shot Revision

## 1. One-line Definition

CSRF tricks a logged-in user’s browser into sending an unwanted state-changing request to a site that trusts the user’s cookies.

## 2. Why was it introduced?

Browsers automatically attach eligible cookies to requests; an attacker can exploit that ambient authority even though they cannot read the response due to SOP.

## 3. Core Mental Model

Cookie authentication proves *who* sent the cookie, not *which site intentionally initiated* the action. Unsafe requests need an unforgeable, application-verified signal.

## 4. Internal Working

An attacker page can cause the victim’s browser to submit a form or load a request to a target site. If cookies are sent and the target lacks CSRF defenses, the action executes. Defenses include SameSite cookies, synchronizer/double-submit tokens, and custom headers checked with origin/referrer validation. A cross-site HTML form cannot set arbitrary custom headers, which makes header-token patterns useful for APIs.

## 5. Key APIs / Syntax

```js
app.post('/transfer', requireAuth, (req, res) => {
  if (req.get('Origin') !== 'https://app.example.com') return res.sendStatus(403);
  if (!timingSafeTokenCheck(req.get('X-CSRF-Token'), req.session.csrfToken)) return res.sendStatus(403);
  // perform validated action
});
```

Use a maintained CSRF approach matching the session/auth architecture; never invent predictable tokens.

## 6. Comparison

| CSRF | XSS |
| --- | --- |
| Forces authenticated browser to send unwanted request | Executes attacker script in trusted origin |
| Usually cannot read target response | Can often read/act within trusted origin |
| Defend with SameSite, tokens, origin/header checks | Defend with output safety, sanitization, CSP |

## 7. Common Mistakes

- Assuming SOP prevents CSRF.
- Relying only on hidden form fields without server-side token verification.
- Treating SameSite as a universal replacement for CSRF defenses in complex cross-site flows.
- Protecting GET but not POST/PATCH/DELETE; GET should not mutate state in the first place.
- Allowing permissive credentialed CORS origins.

## 8. Production Considerations

- Use cookie `SameSite=Lax`/`Strict` where product flow permits, plus CSRF tokens/origin checks for unsafe cookie-authenticated endpoints.
- Validate `Origin` (and carefully use `Referer` fallback where appropriate) and require custom headers for SPA APIs.
- Reauthenticate/confirm high-value actions and log suspicious failures.
- Bearer tokens manually added to Authorization headers change the CSRF model but increase XSS token-storage concerns.

## 9. Interview Questions

1. Why doesn’t SOP prevent CSRF?
2. Why do cookies make CSRF possible?
3. How do synchronizer tokens work?
4. CSRF token versus SameSite cookie?

## 10. Memory Triggers

- **CSRF = forged send, not stolen read.**
- **Cookies are ambient authority.**
- **SameSite + verified token/origin for unsafe actions.**

## 11. Summary

CSRF exploits automatic cookie sending. Defend state-changing cookie-authenticated endpoints using layered SameSite, token, and origin/custom-header verification.
