# Same-Origin Policy — One-Shot Revision

## 1. One-line Definition

The Same-Origin Policy (SOP) is a browser rule that prevents one origin’s scripts from freely reading another origin’s protected data.

## 2. Why was it introduced?

Without it, a malicious site could read a visitor’s bank, email, or other authenticated web data through the visitor’s browser.

## 3. Core Mental Model

Origin means **scheme + host + port**. Change any one, and browser scripts lose normal cross-origin read access.

## 4. Internal Working

SOP blocks cross-origin JavaScript from reading another origin’s response, storage, cookies, or iframe DOM. It does not universally stop cross-origin requests or embedding; CORS, cookie policies, CSP/frame restrictions, and server authorization define additional behavior.

## 5. Key APIs / Syntax

```txt
https://app.example.com:443  = one origin
http://app.example.com:443   = different scheme → different origin
https://api.example.com:443  = different host → different origin
https://app.example.com:8443 = different port → different origin
```

## 6. Comparison

| SOP | CORS |
| --- | --- |
| Browser’s default isolation rule | Server-declared, browser-enforced relaxation for allowed origins |
| Stops unauthorized cross-origin reads | Permits specified cross-origin reads |
| Not authentication/authorization | Also not authentication/authorization |

## 7. Common Mistakes

- Thinking same site and same origin mean the same thing.
- Assuming SOP prevents CSRF; requests can often still be sent cross-site.
- Treating CORS as an access-control system for curl/server-side clients.
- Forgetting `localhost` and `127.0.0.1` are different hosts.

## 8. Production Considerations

- Use explicit CORS allowlists only where cross-origin browser reads are needed.
- Combine SOP with `SameSite` cookies, CSRF defenses, CSP, frame restrictions, and real server-side authorization.
- Do not weaken isolation merely to make development convenient.

## 9. Interview Questions

1. What forms an origin?
2. What does SOP block versus allow?
3. How do SOP and CORS relate?
4. Why does SOP not solve CSRF?

## 10. Memory Triggers

- **Origin = scheme + host + port.**
- **Browser blocks reads, not all sends.**
- **CORS is controlled relaxation.**

## 11. Summary

SOP is the browser’s core isolation boundary. Understand its limits and pair it with CORS, cookie rules, and server-side authorization for complete protection.
