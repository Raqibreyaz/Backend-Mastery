# Core Questions – Express Middlewares

---

### Q1. What is middleware in Express, exactly?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “What happens between receiving a request and sending a response in an Express app?”

**Answer (max 4 bullets):**
- Middleware is a function with signature `(req, res, next)` that runs during the request–response cycle.
- It can execute arbitrary code, read/modify `req` and `res`, end the response, or call `next()` to continue the chain.
- Express executes middleware functions sequentially in the order they are registered.
- Many core features (body parsing, static files, logging, auth) are implemented as middleware.

**See also:** `../Learning/01-middleware-basics.md`

---

### Q2. What are the different types of middleware in Express?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “If I ask you to categorize middleware, what buckets do you use?”

**Answer:**
- Application-level: bound to the app instance via `app.use()` / `app.METHOD()` and can run for many routes.
- Router-level: bound to an `express.Router()` instance via `router.use()` / `router.METHOD()`.
- Built-in: `express.json`, `express.urlencoded`, `express.static`.
- Third-party: `cors`, `cookie-parser`, `express-rate-limit`, `express-validator`, etc.
- Error-handling: functions with `(err, req, res, next)` signature to centralize error responses.

**See also:** `../Learning/01-middleware-basics.md`

---

### Q3. How does middleware execution order work and why does it matter?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “If I move a logging middleware below a route, what changes?”

**Answer:**
- Express builds a **stack** of middleware and routes in registration order (`app.use` / `app.get` calls).
- For each request, it walks the stack top‑to‑bottom, calling each matching middleware.
- If a middleware sends a response (e.g., `res.json(...)`) and does **not** call `next()`, the chain stops there.
- Therefore, order controls behavior: auth before routes, body parsing before handlers, notFound + error handlers last.

**See also:** `../Learning/02-middleware-order-and-next.md`

---

### Q4. What is `next()` and what happens if you forget to call it?

Type: Concept / Bug | Difficulty: Medium | Asked: High

**Hook:** “Why do we even need `next()`? What’s the failure mode if you miss it?”

**Answer:**
- `next` is a function that hands control to the next middleware in the stack; Express injects it when calling your middleware.
- If you neither end the response nor call `next()`, the request will just hang until it times out.
- You can pass an error to `next(err)` to short‑circuit to error-handling middleware instead of normal handlers.
- In router-level middleware, `next('route')` and `next('router')` can skip remaining handlers in that scope.

**See also:** `../Learning/02-middleware-order-and-next.md`

---

### Q5. How do application-level and router-level middleware differ in practice?

Type: Applied | Difficulty: Medium | Asked: Medium

**Hook:** “When do you choose `app.use()` vs `router.use()`?”

**Answer:**
- Application-level middleware (`app.use`) runs for **all matching routes** on the app instance; good for global concerns like logging, security headers, and parsing.
- Router-level middleware (`router.use`) scopes logic to a subset of routes, often one resource or domain (e.g., `/admin`, `/api/users`).
- This scoping improves modularity and testability: each router carries its own mini pipeline.
- You can compose routers and attach them with `app.use('/prefix', router)` to build hierarchical middleware stacks.

**See also:** `../Learning/01-middleware-basics.md`

---

### Q6. How does error-handling middleware work in Express?

Type: Error handling | Difficulty: Medium | Asked: High

**Hook:** “What’s special about error-handling middleware, and where do you put it?”

**Answer:**
- Error-handling middleware has four parameters: `(err, req, res, next)`.
- It is usually registered **after all routes and other middleware**, so any `next(err)` bubbles into it.
- Inside, you log the error and send a normalized response (status code, message, maybe error code) without leaking internals.
- It centralizes error formatting and can differentiate between operational errors (expected) and programmer bugs.

**See also:** `../Learning/03-error-handling-middleware.md`

---

### Q7. How should you handle errors from async middleware / route handlers?

Type: Async | Difficulty: Medium | Asked: Medium–High

**Hook:** “Why do async/await handlers sometimes swallow errors in Express 4?”

**Answer:**
- In Express 4, unhandled promise rejections inside async handlers are **not automatically** passed to error-handling middleware.
- A common pattern is wrapping handlers in a helper that catches errors and calls `next(err)`:

  ```js
  const wrap = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  ```

- Alternatively, use libraries like `express-async-handler` to avoid writing this wrapper manually.
- In all cases, the goal is: “any error ends up in the central error-handling middleware.”

**See also:** `../Learning/03-error-handling-middleware.md`

---

### Q8. What are typical real-world uses of middleware in an Express API?

Type: Applied | Difficulty: Easy | Asked: Medium

**Hook:** “If I look at your production Express app, what middlewares will I probably see?”

**Answer:**
- Request parsing: `express.json()`, `express.urlencoded()` to parse JSON and form data bodies.
- Logging and diagnostics: `morgan` or custom logging to track method, URL, status, latency.
- Security: `helmet` for security headers, `cors` for CORS policy, `express-rate-limit` for brute‑force protection.
- Business concerns: authentication/authorization, input validation (`express-validator`), tenant resolution, and feature flags implemented as custom middleware.

**See also:** `../Learning/04-real-world-middleware-stack.md`

---

### Q9. What common bugs or pitfalls arise with middleware?

Type: Debugging | Difficulty: Medium | Asked: Medium

**Hook:** “Tell me a bug you’ve seen that was caused by middleware misuse.”

**Answer:**
- Forgetting to call `next()` or to end the response, causing hanging requests and timeouts.
- Sending multiple responses from different middleware/handlers (e.g., calling `res.json` and then `next()` and another handler writes again).
- Registering middleware in the wrong order (e.g., reading `req.body` before the body parser, or auth after routes) so logic never runs.
- Catching errors in async handlers but not forwarding them to `next(err)`, bypassing centralized error handling.

**See also:** `../Learning/02-middleware-order-and-next.md`