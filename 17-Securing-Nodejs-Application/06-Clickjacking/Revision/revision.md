# Clickjacking — One-Shot Revision

## 1. One-line Definition

Clickjacking tricks a user into clicking a hidden or disguised interface, often by framing a trusted site beneath attacker-controlled content.

## 2. Why was it introduced?

Embedding is useful, but without framing controls an attacker can overlay deceptive UI and cause unintended actions in an authenticated site.

## 3. Core Mental Model

If a page should not be embedded, tell the browser to refuse framing. UI deception is prevented by browser framing policy, not by hiding buttons in JavaScript.

## 4. Internal Working

An attacker frames a target page and positions transparent/overlaid elements so the victim’s apparent click lands on the target. Browser frame policy can block the load before UI interaction. Modern CSP `frame-ancestors` controls which parent origins may frame the page; legacy `X-Frame-Options` provides narrower compatibility protection.

## 5. Key APIs / Syntax

```http
Content-Security-Policy: frame-ancestors 'none'
X-Frame-Options: DENY
```

Use `'self'` / `SAMEORIGIN` when only same-origin framing is valid. Prefer CSP `frame-ancestors` for modern, allowlist-based requirements.

## 6. Comparison

| `X-Frame-Options` | CSP `frame-ancestors` |
| --- | --- |
| `DENY` or `SAMEORIGIN` | `'none'`, `'self'`, or explicit ancestor origins |
| Legacy/simple compatibility header | Modern, more expressive framing policy |
| `ALLOW-FROM` is obsolete | Use this for defined allowlists |

## 7. Common Mistakes

- Relying on JavaScript frame-busting; it is bypassable/unreliable.
- Allowing arbitrary sites to embed sensitive pages.
- Using the obsolete `ALLOW-FROM` directive.
- Forgetting that individual actions also need CSRF/authz defenses.

## 8. Production Considerations

- Set `frame-ancestors 'none'` for banking/admin/auth flows unless embedding is a real requirement.
- If embedding is required, allowlist only trusted parent origins and test integrations.
- Use Helmet framing policy configuration, HTTPS, CSP, and confirmation/reauthentication for high-risk actions.

## 9. Interview Questions

1. What is clickjacking?
2. How do `X-Frame-Options` and `frame-ancestors` differ?
3. Why is JavaScript frame-busting insufficient?
4. Does framing policy replace CSRF protection?

## 10. Memory Triggers

- **Clickjacking = deceptive iframe overlay.**
- **No framing: `frame-ancestors 'none'`.**
- **Frame policy complements, not replaces, CSRF/authz.**

## 11. Summary

Prevent clickjacking by explicitly controlling who may frame sensitive pages, preferably with CSP `frame-ancestors`, while retaining normal server-side action protections.
