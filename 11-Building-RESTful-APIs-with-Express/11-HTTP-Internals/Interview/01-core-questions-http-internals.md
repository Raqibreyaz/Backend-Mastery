# Core Questions – HTTP Internals

---

### Q1. What is an HTTP header and why is it important?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “If the body is the data, what is all the stuff above it?”

**Answer (max 4 bullets):**

- An HTTP header is a key–value field in a request or response that carries **metadata** about the message (content type, length, auth, caching, etc.).
- Headers appear between the start line (`GET /... HTTP/1.1`) and the body, each on its own line followed by `:` and a value.
- Common request headers include `Host`, `Accept`, `Authorization`, `User-Agent`, `Cookie`.
- Common response headers include `Content-Type`, `Content-Length`, `Cache-Control`, `Location`, `Set-Cookie`.

**See also:** `../Learning/02-http-headers-and-metadata.md`

---

### Q2. How are HTTP status codes structured and what are the main classes?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “What’s the difference between 4xx and 5xx, and when do you use 201 vs 200?”

**Answer:**

- Status codes are three-digit numbers grouped into classes by their first digit: 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error.
- 2xx examples: `200 OK`, `201 Created`, `204 No Content`.
- 3xx examples: `301 Moved Permanently`, `302 Found`, `304 Not Modified`.
- 4xx/5xx examples: `400`, `401`, `403`, `404`, `409`, `422`, `500`, `503`; picking the right one helps clients react correctly and eases debugging.

**See also:** `../Learning/03-http-status-codes-and-api-design.md`

---

### Q3. What is HTTP keep-alive / persistent connection and why do we use it?

Type: Concept | Difficulty: Medium | Asked: Medium–High

**Hook:** “Does each HTTP request open a new TCP connection?”

**Answer:**

- HTTP keep-alive (persistent connections) allows multiple HTTP requests/responses to be sent over a single TCP connection instead of opening a new one for each request.
- In HTTP/1.1, connections are persistent by default; `Connection: keep-alive` can be used to be explicit or to maintain compatibility.
- The `Keep-Alive` header can specify hints like `timeout` and `max` (maximum number of requests on that connection).
- Reusing connections reduces latency and CPU overhead for connection setup/teardown, especially for many small requests.

**See also:** `../Learning/04-http-keep-alive-and-connection-management.md`

---

### Q4. What is content negotiation in HTTP and which headers are involved?

Type: Concept | Difficulty: Medium | Asked: Medium

**Hook:** “How does the server know whether to send JSON or HTML?”

**Answer:**

- Content negotiation is the mechanism by which the client and server agree on the best representation (e.g. media type, language) of a resource.
- Clients send preference headers such as `Accept` (media types), `Accept-Language` (languages), `Accept-Encoding` (compression), and the server responds with `Content-Type`, `Content-Language`, etc.
- Example: client sends `Accept: application/json`, server responds with `Content-Type: application/json; charset=utf-8`.
- In REST APIs, you often just default to JSON but can still leverage content negotiation for versioning or alternate formats if needed.

**See also:** `../Learning/05-content-negotiation-and-representations.md`

---

### Q5. How do you use HTTP status codes effectively in a REST API?

Type: Applied | Difficulty: Medium | Asked: High

**Hook:** “What status codes would you use for create, validation error, unauthorized, not found?”

**Answer:**

- Successful operations: `200 OK` for generic success, `201 Created` when a new resource is created (often with a `Location` header), `204 No Content` when there is no response body.
- Client errors: `400 Bad Request` for malformed requests, `401 Unauthorized` (auth required/invalid), `403 Forbidden` (auth OK but not allowed), `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity` for validation failures.
- Server errors: `500 Internal Server Error` for unexpected failures, `503 Service Unavailable` for maintenance or overload.
- Using the correct code removes ambiguity and lets clients implement robust error handling.

**See also:** `../Learning/03-http-status-codes-and-api-design.md`

---

### Q6. What’s the difference between request headers and response headers?

Type: Concept | Difficulty: Easy | Asked: Medium

**Hook:** “Is `Content-Type` a request or response header? What about `Location`?”

**Answer:**

- Request headers are sent by the client and describe the request, preferences, and client identity (e.g. `Host`, `Accept`, `Authorization`, `User-Agent`, `Cookie`).
- Response headers are sent by the server and describe the response context (e.g. `Content-Type`, `Content-Length`, `Server`, `Location`, `Set-Cookie`, `Cache-Control`).
- Some header names can appear in both directions with different semantics (e.g. `Content-Type` in requests for uploads vs in responses for bodies).
- Understanding the direction is important when debugging or configuring middleware like CORS, caching, or auth.

**See also:** `../Learning/02-http-headers-and-metadata.md`

---

### Q7. How does HTTP keep-alive interact with Node.js/Express?

Type: Applied | Difficulty: Medium | Asked: Medium–High

**Hook:** “Does Express manage keep-alive for you? When do connections close?”

**Answer:**

- Node’s HTTP server uses persistent connections by default for HTTP/1.1; Express is built on top of this behavior.
- Express doesn’t typically manage keep-alive explicitly; it sends responses and Node decides when to reuse or close connections based on headers and timeouts.
- You can configure server-level keep-alive timeouts in Node or at a reverse proxy (e.g. Nginx) to control idle connection lifetimes.
- For long-polling or streaming endpoints, understanding connection lifetimes is critical to avoid resource leaks.

**See also:** `../Learning/04-http-keep-alive-and-connection-management.md`

---

### Q8. How do caching headers like `Cache-Control` and `ETag` work at a high level?

Type: Concept | Difficulty: Medium | Asked: Medium

**Hook:** “How would you reduce repeated traffic on a `GET /products` endpoint?”

**Answer:**

- `Cache-Control` tells clients and intermediaries how to cache responses (e.g., `public, max-age=60`, `no-store`, `no-cache`).
- `ETag` and `Last-Modified` enable conditional requests; clients send `If-None-Match` or `If-Modified-Since` and servers can respond with `304 Not Modified` if content did not change.
- Proper caching reduces latency and backend load, especially for read-heavy endpoints.
- Caching strategy must respect data freshness and security (e.g. avoid caching sensitive personalized responses in shared caches).

**See also:** `../Learning/05-content-negotiation-and-representations.md`
