# HTTP Internals – 5 Minute Cheatsheet

## If you get only 3 questions

1. What are HTTP headers and how do they shape requests/responses?
2. How do HTTP status codes work (major categories + the ones you actually use)?
3. What is HTTP keep-alive / persistent connections and why do they matter?

---

## Mental models (1–2 lines each)

- HTTP is a **text-based application protocol** on top of TCP; each request/response has a start line, headers, an optional body, and ends with a connection decision (keep or close).
- HTTP headers are **key–value metadata** that describe how to interpret the message (content type, encoding, caching, auth, etc.).
- HTTP status codes are three-digit numbers grouped into 1xx, 2xx, 3xx, 4xx, 5xx that describe the outcome of the request (informational, success, redirection, client error, server error).
- HTTP/1.1 defaults to **persistent connections**: multiple requests/responses share a single TCP connection, controlled by headers like `Connection: keep-alive` and `Keep-Alive`.
- Content negotiation uses headers like `Accept`, `Accept-Language`, `Accept-Encoding` vs server’s `Content-Type` to pick the best representation.
- In real APIs, correct use of status codes, headers (caching, content type), and keep-alive directly affects **performance, reliability, and debuggability**.

---

## Canonical examples to recall

**1. Typical HTTP request and response shape**

```txt
GET /api/v1/users?page=2 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer <token>
User-Agent: curl/8.0
Connection: keep-alive

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 123
Cache-Control: public, max-age=60
Connection: keep-alive

{"data":[...],"page":2}
```

Headers carry metadata such as preferred content types (`Accept`), response media type (`Content-Type`), caching (`Cache-Control`), and connection behavior (`Connection`).

---

**2. Status code classes and common codes**

```txt
2xx → Success      (200 OK, 201 Created, 204 No Content)
3xx → Redirection  (301 Moved Permanently, 302 Found, 304 Not Modified)
4xx → Client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity)
5xx → Server error (500 Internal Server Error, 503 Service Unavailable)
```

Status codes communicate the outcome and next steps; using specific codes instead of always `200` makes APIs predictable and easier to debug.

---

**3. Keep-alive / persistent connections**

```txt
Request:
Connection: keep-alive

Response:
Connection: keep-alive
Keep-Alive: timeout=5, max=100
```

With persistent connections, the same TCP connection is reused for multiple HTTP requests/responses, reducing latency and CPU overhead; `Keep-Alive` can hint timeout and max request count.

---

## Links to full notes

- HTTP message anatomy (start line, headers, body, connection) → `../Learning/01-http-message-structure.md`
- Request vs response headers, common ones in APIs → `../Learning/02-http-headers-and-metadata.md`
- Status code classes and mapping to API behavior → `../Learning/03-http-status-codes-and-api-design.md`
- Persistent connections, `Connection` and `Keep-Alive`, and performance → `../Learning/04-http-keep-alive-and-connection-management.md`
- Content negotiation (`Accept`, `Content-Type`, language/encoding) → `../Learning/05-content-negotiation-and-representations.md`