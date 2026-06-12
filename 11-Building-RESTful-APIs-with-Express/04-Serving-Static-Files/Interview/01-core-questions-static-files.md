# Core Questions – Serving Static Files

---

### Q1. How do you serve static files in Express?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “Show me how you’d serve CSS/JS/image files from an Express app.”

**Answer (max 4 bullets):**

- You use the built-in `express.static` middleware and mount it with `app.use`.
- Example: `app.use(express.static(path.join(__dirname, 'public')));` serves files under `public/` directly (e.g., `/css/style.css`).
- Static files are typically things like HTML, CSS, client-side JavaScript, images, fonts, and other assets that don’t need server-side processing.
- Express does not serve static files by default; you must explicitly enable `express.static`.

**See also:** `../Learning/01-static-files-basics.md`

---

### Q2. What exactly is `express.static` doing under the hood?

Type: Concept | Difficulty: Medium | Asked: Medium–High

**Hook:** “Is `express.static` magic? What does it actually do?”

**Answer:**

- `express.static` is a built-in middleware powered by the separate `serve-static` package.
- It takes a root directory and maps URL paths to files relative to that root, streaming the file contents as the HTTP response.
- It sets appropriate headers like `Content-Type`, `Content-Length`, and caching headers (`ETag`, `Last-Modified`, `Cache-Control`) by default.
- It does **no server-side in-memory caching** by itself; caching is handled via HTTP semantics, although you can layer your own caching solution on top if needed.

**See also:** `../Learning/02-express-static-and-options.md`

---

### Q3. How do virtual path prefixes and multiple static directories work?

Type: API usage | Difficulty: Easy | Asked: Medium

**Hook:** “I want my assets served under `/static`, not at the root. How?”

**Answer:**

- You can mount `express.static` at a specific path prefix, e.g. `app.use('/static', express.static('public'));`.
- With this setup, a file at `public/js/main.js` is accessible at `/static/js/main.js`.
- You can register multiple static directories, e.g. `app.use(express.static('public'));` and `app.use('/images', express.static('images'));`.
- Virtual prefixes let you keep internal folder structure flexible while keeping URLs stable and tidy.

**See also:** `../Learning/02-express-static-and-options.md`

---

### Q4. How does caching work for static files, and how can you tune it?

Type: Performance | Difficulty: Medium | Asked: Medium–High

**Hook:** “How do you avoid re-sending the same static assets on every request?”

**Answer:**

- `express.static`/`serve-static` use headers like `ETag`, `Last-Modified`, and `Cache-Control` to enable browser-side caching.
- `maxAge` controls the `Cache-Control: max-age` directive, telling browsers how long they can consider the response fresh.
- You can set `immutable: true` to indicate that a resource will not change during its lifetime, which is ideal for fingerprinted assets.
- The `setHeaders` option lets you customize headers per file (e.g., `no-cache` for HTML, long `max-age` for fingerprinted JS/CSS).

**See also:** `../Learning/03-static-file-caching-strategies.md`

---

### Q5. Are there any security considerations when serving static files?

Type: Security | Difficulty: Medium | Asked: Medium

**Hook:** “What could go wrong if you misconfigure static file serving?”

**Answer:**

- Anything under the static root can be fetched directly by clients, so you must ensure no sensitive files (like `.env`, logs, server-rendered templates, or internal docs) are placed there.
- You should use a specific static directory (e.g., `public/`) instead of the project root to reduce accidental exposure.
- `express.static`/`serve-static` normalize paths and prevent directory traversal outside the configured root (e.g., `..` segments are handled), but you should still be cautious about what you put under that directory.
- Avoid letting user-controlled values decide the static directory path; keep configuration centralized in code.

**See also:** `../Learning/01-static-files-basics.md`

---

### Q6. How do you serve an SPA (single-page app) with Express static files?

Type: Applied | Difficulty: Medium | Asked: Medium

**Hook:** “React/Vue/Angular front-end + Express backend – how do you wire static and routing?”

**Answer:**

- You typically build the SPA into a static `build` or `dist` folder and point `express.static` at that directory, e.g. `app.use(express.static(path.join(__dirname, 'build')));`.
- For client-side routing, you often add a catch‑all route **after** static middleware that returns `index.html` for any path not matched by API routes or static assets.
- This lets the browser load the SPA shell and then let the front-end router handle the path.
- API routes are usually namespaced (e.g., `/api/...`) so they don’t conflict with SPA routes.

**See also:** `../Learning/04-static-files-and-spa-routing.md`

---

### Q7. When would you use Express for static files vs. a CDN or reverse proxy (Nginx)?

Type: Architecture | Difficulty: Medium–High | Asked: Medium

**Hook:** “In production, do you still serve static assets through Express?”

**Answer:**

- For small apps or during development, serving static files via Express is simple and often sufficient.
- In production at scale, it’s common to offload static assets to a CDN or a reverse proxy like Nginx for better caching, TLS termination, and bandwidth efficiency.
- Express can still be the origin server, but edge caches and proxies handle most static traffic, reducing load on the Node.js process.
- The interview signal is that you understand the trade-off: convenience vs performance and operational robustness.

**See also:** `../Learning/03-static-file-caching-strategies.md`
