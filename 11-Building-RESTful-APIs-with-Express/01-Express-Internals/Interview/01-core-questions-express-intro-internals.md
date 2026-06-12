# Core Questions – Express Intro & Internals

---

### Q1. What is Express.js and why is it so widely used?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “Why does almost every Node backend tutorial use Express?”

**Answer (max 4 bullets):**
- Express.js is a minimal and flexible web application framework for Node.js, designed for building web applications and APIs.
- It provides core features like routing, middleware support, HTTP helpers, template engine integration, and static file serving, while keeping the core small.
- It sits on top of the Node `http` module, simplifying server creation and request handling.
- Because it’s unopinionated and has a huge ecosystem of middleware, it became the de facto standard backend framework in the Node.js ecosystem.

**See also:** `../Learning/01-what-is-express-and-why-use-it.md`

---

### Q2. How does Express relate to Node’s core `http` module?

Type: Internals | Difficulty: Medium | Asked: Medium–High

**Hook:** “When you call `app.listen`, what’s actually happening under the hood?”

**Answer:**
- Underneath, Express uses Node’s `http` (or `https`) module; `app.listen(port)` creates an `http.Server` instance.
- The Express app (`app`) is essentially a function `(req, res)` plus a stack of middleware/route handlers; that function is passed to `http.createServer` as the request listener.
- Node’s HTTP server accepts TCP connections and emits `request` events; Express receives those and runs its own pipeline on each.
- This layering lets you still drop down to the raw `req`/`res` from Node if needed, while mostly using Express’s higher-level abstractions.

**See also:** `../Learning/04-express-vs-node-http.md`

---

### Q3. What is the request–response lifecycle in an Express app?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “Walk me through what happens from an incoming HTTP request to `res.send`.”

**Answer:**
- A client sends an HTTP request to your server; Node’s `http.Server` receives it and calls the Express app function with `req` and `res`.
- Express walks its internal stack of middleware and routes in the order they were registered, checking for path/method matches.
- Each middleware can read/modify `req`/`res`, end the response, or call `next()` to pass control to the next handler.
- Eventually, a route handler sends a response (e.g., `res.json`, `res.send`), or an error is passed to an error-handling middleware; then the response is flushed back to the client.

**See also:** `../Learning/02-express-request-response-lifecycle.md`

---

### Q4. What is Express middleware, conceptually? How is it used internally?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “When people say ‘Express is just middleware’, what do they mean?”

**Answer:**
- Express middleware is any function with signature `(req, res, next)` (or `(err, req, res, next)` for error handlers) that participates in the request–response cycle.
- Internally, Express stores all middleware and route handlers in a single ordered stack; middleware are just entries with optional path/method filters.
- For each request, Express iterates through this stack, executing handlers that match; calling `next()` moves to the next one, while sending a response ends the chain.
- This simple model underpins routing, body parsing, logging, auth, error handling, and basically everything else in Express.

**See also:** `../Learning/03-express-middleware-stack-and-routing-internals.md`

---

### Q5. How does routing work in Express internally?

Type: Internals | Difficulty: Medium | Asked: Medium–High

**Hook:** “What’s the difference between `app.use('/users', ...)` and `app.get('/users', ...)` under the hood?”

**Answer:**
- Both `app.use` and `app.METHOD` (e.g. `app.get`, `app.post`) register entries in the same internal stack, but route handlers have both method and path constraints.
- `app.use('/users', mw)` registers middleware for any method whose path starts with `/users`.
- `app.get('/users', handler)` registers a route that only matches `GET` requests whose path matches `/users` (or the pattern) exactly.
- During request processing, Express scans that stack in order and runs any matching handlers, so **registration order** is also your precedence mechanism.

**See also:** `../Learning/03-express-middleware-stack-and-routing-internals.md`

---

### Q6. Why is the order of middleware/route registration important in Express?

Type: Internals | Difficulty: Medium | Asked: High

**Hook:** “Why does moving one `app.use` above/below a route suddenly break auth or session?”

**Answer:**
- Express processes middleware and routes strictly in the order they are registered; there is one unified handler list, regardless of whether you used `app.use` or `app.get`.
- If a piece of middleware (e.g. `express.json`, session, auth) is registered **after** a route, that route will not see its effects.
- If a route or middleware sends a response and doesn’t call `next()`, the chain stops and no subsequent handlers run.
- Therefore, global concerns like body parsing, cookies, sessions, and logging should be mounted early; catch-all 404 or error handlers should be mounted last.

**See also:** `../Learning/02-express-request-response-lifecycle.md`

---

### Q7. How would you explain Express’s design philosophy compared to more “heavy” frameworks?

Type: Design | Difficulty: Medium | Asked: Medium

**Hook:** “Why might you choose Express over something more opinionated?”

**Answer:**
- Express is purposely **minimal and unopinionated**, often described as “Sinatra-inspired” – it gives you routing + middleware and lets you bring your own structure.
- Many features (authentication, validation, security hardening, etc.) are not built-in but provided via external middleware packages.
- This makes Express flexible and lightweight but also puts more responsibility on you to define project structure and choose libraries.
- In interviews, emphasizing your understanding of this trade-off (flexibility vs conventions) shows maturity.

**See also:** `../Learning/01-what-is-express-and-why-use-it.md`

---

### Q8. What are some core built-in features of Express beyond routing?

Type: Concept | Difficulty: Easy–Medium | Asked: Medium

**Hook:** “If routing is one, what else does Express give you out of the box?”

**Answer:**
- Built-in middleware: `express.json`, `express.urlencoded`, `express.static`, which cover body parsing and static file serving.
- HTTP helper methods on the response object: `res.json`, `res.send`, `res.status`, `res.redirect`, `res.sendFile`.
- Built-in support for view engines and server-side template rendering, if you’re building server-rendered pages.
- Error-handling middleware pattern with the `(err, req, res, next)` signature for centralized error handling.

**See also:** `../Learning/01-what-is-express-and-why-use-it.md`