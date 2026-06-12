# Express Middlewares – 5 Minute Cheatsheet

## If you get only 3 questions

1. What is middleware in Express and what can it do in the request–response cycle?
2. How does `next()` work and why does middleware execution order matter?
3. How do you implement and wire up error-handling middleware?

---

## Mental models (1–2 lines each)

- Middleware = a function that runs **between** the incoming HTTP request and the outgoing response, with access to `req`, `res`, and `next`.
- Each middleware can **run code, mutate `req`/`res`, end the response, or pass control** via `next()`; if nobody ends the cycle, the route handler will.
- Middleware is a **pipeline in strict top‑to‑bottom order**: Express calls them in the order they are registered, so ordering is effectively control flow.
- Types you should be able to name: **application‑level**, **router‑level**, **built‑in** (`express.json`, `express.urlencoded`, `express.static`), **third‑party**, and **error‑handling**.
- Error-handling middleware has the famous **four-argument signature** `(err, req, res, next)` and is typically registered after all routes.
- For async handlers, you either **wrap them and forward errors to `next(err)`** or use a helper like `express-async-handler` so errors don’t get swallowed.

---

## Canonical examples to recall

**1. Simple logging middleware**

```js
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[IN ] ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`[OUT] ${req.method} ${req.url} ${res.statusCode} in ${Date.now() - start}ms`);
  });
  next();
});
```

**2. Router-level auth middleware**

```js
const router = require('express').Router();

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  next();
}

router.use(requireAuth);
router.get('/me', (req, res) => res.json(req.user));
```

**3. Error-handling middleware**

```js
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Something went wrong' });
});
```

---

## Links to full notes

- Middleware basics, types and diagrams → `../Learning/01-middleware-basics.md`
- Execution order and `next()` pitfalls → `../Learning/02-middleware-order-and-next.md`
- Error-handling patterns and async helpers → `../Learning/03-error-handling-middleware.md`
- Real-world middleware stack from a project → `../Learning/04-real-world-middleware-stack.md`