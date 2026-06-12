# Core Questions – Response Methods

---

### Q1. What are the most commonly used response methods in Express?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “If I open your API code, which response methods will I see everywhere?”

**Answer (max 4 bullets):**
- `res.send()` – send a response body of various types (string, buffer, object, array) with automatic `Content-Type` detection.
- `res.json()` – send a JSON response with `Content-Type: application/json` and automatic serialization.
- `res.status()` – set the HTTP status code; usually chained before `send` or `json`.
- `res.redirect()`, `res.sendFile()`, `res.download()` – for redirects and file transfers.

**See also:** `../Learning/01-response-object-basics.md`

---

### Q2. What’s the difference between `res.send()` and `res.json()`? When do you use each?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “I see both `res.send` and `res.json` in code. Why pick one over the other?”

**Answer:**
- `res.send()` is a **generic** method: it accepts strings, buffers, or objects and infers the `Content-Type` from the argument (string → `text/html`, object → JSON, etc.).
- `res.json()` is **JSON-specific**: it always serializes the value to JSON and sets `Content-Type: application/json` regardless of input type.
- For APIs where you always return JSON, `res.json()` is clearer and guarantees the correct content type.
- Use `res.send()` when you intentionally return non-JSON (HTML, plain text, or raw binary) or when you want more flexible content types.

**See also:** `../Learning/02-send-json-end-differences.md`

---

### Q3. How does `res.status()` work and why do we chain it?

Type: API usage | Difficulty: Easy | Asked: High

**Hook:** “What does `return res.status(404).json({ ... })` actually do?”

**Answer:**
- `res.status(code)` sets the response’s HTTP status code and returns the `res` object, enabling method chaining.
- It does not immediately send the response; you still need to call something like `res.send()` or `res.json()`.
- Chaining makes code concise and expressive: `res.status(201).json({ id })` or `res.status(204).end()`.
- Consistently setting appropriate status codes improves client behavior and debuggability.

**See also:** `../Learning/03-status-and-headers.md`

---

### Q4. What does `res.end()` do, and how is it different from `res.send()`?

Type: Low-level detail | Difficulty: Medium | Asked: Medium

**Hook:** “When would you ever use `res.end()` directly?”

**Answer:**
- `res.end()` is a low-level method inherited from Node’s `http.ServerResponse`; it **terminates** the response, optionally with a final chunk of data.
- It doesn’t set headers or `Content-Type` for you; those must be set beforehand if needed.
- `res.send()` builds on top of this: it sets headers (like `Content-Type` and `Content-Length`), writes the body, and then ends the response.
- In typical Express apps, you rarely need `res.end()` directly except for very low-level streaming or when you’ve manually written to the response.

**See also:** `../Learning/02-send-json-end-differences.md`

---

### Q5. How do you perform redirects in Express, and what actually happens on the wire?

Type: Concept | Difficulty: Medium | Asked: Medium–High

**Hook:** “Explain what `res.redirect('/login')` does technically.”

**Answer:**
- `res.redirect([status], url)` sets a 3xx status code (default 302) and a `Location` header pointing to `url`, then ends the response.
- The browser sees the redirect status and `Location` header and makes a **new HTTP request** to the target URL; the original response body is usually ignored.
- You can specify different redirect codes, e.g. `301` for permanent, `302`/`303` for temporary.
- You generally cannot “send JSON with a redirect” in the same response; if you need to send data, you either avoid redirecting or encode data in the query string or client-side logic.

**See also:** `../Learning/04-redirects-and-files.md`

---

### Q6. How do you send a file from an Express route?

Type: Applied | Difficulty: Medium | Asked: Medium

**Hook:** “User clicks ‘Download invoice’ – what does your Express handler look like?”

**Answer:**
- Use `res.sendFile(absolutePath)` to send a file as the response body; Express resolves the path and sets headers like `Content-Type`.
- Paths should be absolute or resolved via `path.join(__dirname, ...)` to avoid issues with relative paths and security.
- To force a download instead of inline display, you can use `res.download(path, [filename])`, which sets `Content-Disposition: attachment`.
- Both methods stream the file, which is more memory-efficient than reading the entire file into memory first.

**See also:** `../Learning/04-redirects-and-files.md`

---

### Q7. How do you set headers and content type on a response?

Type: API usage | Difficulty: Medium | Asked: Medium

**Hook:** “Where do you set things like `Content-Type`, custom headers, or `Vary`?”

**Answer:**
- You can use `res.set(name, value)` or `res.header(name, value)` (alias) to set individual headers before sending the response.
- `res.type(mimeTypeOrExtension)` sets the `Content-Type` header using MIME lookup, e.g. `res.type('json')` or `res.type('text/html')`.
- For JSON APIs, `res.json()` automatically sets `Content-Type: application/json`.
- You can also use `res.vary(field)` to set the `Vary` header when doing content negotiation or caching-sensitive responses.

**See also:** `../Learning/03-status-and-headers.md`

---

### Q8. What are some best practices for API responses in Express?

Type: Design | Difficulty: Medium–High | Asked: Medium–High

**Hook:** “If I review your API, what patterns will I see in your responses?”

**Answer:**
- Always set correct status codes: `200/201` for success, `400` for client errors, `401/403` for auth issues, `404` for missing resources, `500` for unexpected errors.
- Use `res.json()` for API responses so clients can reliably parse JSON and so content type is always correct.
- Keep a consistent response envelope (e.g., `{ data, error }` or `{ success, payload }`) across endpoints for easier client handling.
- Centralize error handling via middleware so you don’t duplicate response logic in every route, and avoid sending stack traces in production.

**See also:** `../Learning/01-response-object-basics.md`