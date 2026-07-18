# Express Middleware — One-Shot Revision

## 1. One-line Definition

Middleware is a function in the Express request–response pipeline that can inspect/change `req`/`res`, end the response, or pass control onward.

## 2. Why was it introduced?

It separates cross-cutting concerns—parsing, logging, authentication, validation, CORS, errors—from individual route handlers.

## 3. Core Mental Model

Middleware is an ordered relay race: each matching handler must either send/end a response or call `next()` exactly once to hand off control.

## 4. Internal Working

Express scans its stack in registration order. Normal middleware is `(req, res, next)`; calling `next(err)` skips normal handlers and looks for error middleware `(err, req, res, next)`. A path mounted with `app.use('/users', ...)` matches a `/users` prefix and temporarily removes that mount path from `req.url`; `req.originalUrl` retains the original URL.

## 5. Key APIs / Syntax

```js
app.use(express.json());
app.use((req, res, next) => { console.log(req.method); next(); });
app.get('/users', requireAuth, (req, res) => res.json([]));
app.use((err, req, res, next) => {
  res.status(err.status ?? 500).json({ message: 'Internal Server Error' });
});
```

Types: application-level (`app.use`), router-level (`router.use`), built-in (`express.json`, `express.urlencoded`, `express.static`), third-party, and error-handling middleware.

## 6. Comparison

| Normal middleware | Error middleware |
| --- | --- |
| `(req, res, next)` | `(err, req, res, next)` |
| Runs during normal stack traversal | Runs after `next(err)`/thrown forwarded error |
| Calls `next()` to continue | Sends error response or calls `next(err)` |

## 7. Common Mistakes

- Neither calling `next()` nor sending a response: request hangs.
- Calling `next()` after sending a response, leading to double-send errors.
- Registering the error handler before routes.
- Parsing JSON manually instead of `express.json()`.
- Ignoring rejected promises in async code; forward failures to `next(err)` (or use an Express 5-compatible async strategy).

## 8. Production Considerations

- Put request IDs/logging/security/parsers before routes; put 404 then centralized error middleware last.
- Keep middleware small and reusable; do not put unrelated business logic in global middleware.
- Never expose stack traces or internal error details to clients in production.
- Ensure auth/authorization middleware is mounted on every protected route group.

## 9. Interview Questions

1. What does `next()` do and what if it is omitted?
2. Why is middleware order important?
3. What distinguishes error middleware?
4. Compare `app.use()` and `router.use()`.

## 10. Memory Triggers

- **Match → act → end or next.**
- **Four arguments = error handler.**
- **Global first; errors last.**

## 11. Summary

Middleware is Express’s composition mechanism. Correct order, one clear completion path, and centralized error handling make an API predictable and maintainable.
