# CORS — One-Shot Revision

## 1. One-line Definition

**CORS** is a browser-enforced HTTP policy that lets a server declare which other origins may read its responses.

## 2. Why was it introduced?

The same-origin policy prevents a malicious site from freely reading another site’s authenticated data. CORS provides controlled cross-origin sharing.

## 3. Core Mental Model

The browser enforces CORS; the server grants permission through response headers. CORS is not authentication or access control for non-browser clients.

## 4. Internal Working

An origin is **scheme + host + port**—`http://localhost:3000` and `http://127.0.0.1:3000` differ. Simple cross-origin requests can be sent directly; non-simple requests trigger a preflight `OPTIONS` request. The browser checks headers such as `Access-Control-Allow-Origin`, `-Methods`, and `-Headers` before sending/allowing the actual request.

## 5. Key APIs / Syntax

```js
import cors from 'cors';

const allowedOrigins = new Set(['https://app.example.com']);
app.use(cors({
  origin(origin, cb) {
    cb(null, !origin || allowedOrigins.has(origin));
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
```

Credentialed browser requests also need client-side `credentials: 'include'`, server-side credentials permission, and a specific allowed origin—not `*`.

## 6. Comparison

| Simple request | Preflighted request |
| --- | --- |
| Browser usually sends actual request directly | Browser first sends `OPTIONS` |
| Restricted methods/headers/content types | Custom headers, many methods, or other non-simple conditions |
| Response must still permit origin | Preflight must permit origin/method/headers |

## 7. Common Mistakes

- Treating different localhost hostnames/ports as the same origin.
- Sending multiple origins in one `Access-Control-Allow-Origin` header; allow one matching origin per response.
- Combining `Access-Control-Allow-Origin: *` with credentials.
- Forgetting to handle/configure preflight OPTIONS requests.
- Thinking CORS stops curl, Postman, attackers, or server-to-server requests.

## 8. Production Considerations

- Use an allowlist—not reflected arbitrary origins—especially with credentials.
- Permit only methods and headers the frontend needs; set an appropriate preflight cache (`maxAge`) where suitable.
- Use CORS alongside real authentication, authorization, CSRF protection (where cookie auth applies), and rate limiting.
- Prefer the maintained `cors` middleware over hand-built headers unless requirements are tiny and well tested.

## 9. Interview Questions

1. What defines an origin?
2. What is a preflight request?
3. Why cannot wildcard origin be used with credentials?
4. Is CORS a server-side security boundary?

## 10. Memory Triggers

- **Origin = scheme + host + port.**
- **Browser enforces; server permits.**
- **OPTIONS asks first.**
- **Credentials need one explicit origin.**

## 11. Summary

CORS is a browser permission protocol. Configure the smallest explicit origin/method/header policy needed, and never mistake it for authentication or authorization.
