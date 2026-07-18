# Express Routing — One-Shot Revision

## 1. One-line Definition

Routing maps an HTTP method and request path to one or more Express handlers.

## 2. Why was it introduced?

APIs need explicit, maintainable endpoints instead of a large chain of manual `if (req.url)` checks.

## 3. Core Mental Model

A URL is what the client requested; a route is the server’s matching rule for handling it. Method + path together identify an endpoint.

## 4. Internal Working

Express checks route layers in registration order. `app.get`, `post`, `put`, `patch`, and `delete` constrain both method and path. A route can have multiple handlers; each must call `next()` to continue. `app.route('/users/:id')` groups method handlers for the same path.

## 5. Key APIs / Syntax

```js
app.get('/users/:id', (req, res) => res.json({ id: req.params.id }));
app.post('/users', createUser);
app.route('/users/:id').get(readUser).put(replaceUser).patch(updateUser).delete(deleteUser);
app.get(['/directory', '/folder'], handler);
app.get(/^\/items\/(\d+)$/, (req, res) => res.json({ id: req.params[0] }));
```

- `req.url`: request URL as currently seen by the handler.
- `req.originalUrl`: original request URL before mounted routers/middleware strip prefixes.
- `req.route.path`: the matched route pattern (available in a route handler).

## 6. Comparison

| Method | Typical REST intent |
| --- | --- |
| GET | Read resource(s) |
| POST | Create/action, usually non-idempotent |
| PUT | Replace resource, idempotent by intent |
| PATCH | Partial update |
| DELETE | Remove resource |

## 7. Common Mistakes

- Defining a broad/catch-all route before a specific one.
- Using a GET route for state-changing actions.
- Treating route parameters as validated input; they are strings and untrusted.
- Relying on complex regex routes when clear named parameters work.
- Assuming old path-pattern syntax behaves the same across Express versions.

## 8. Production Considerations

- Group domain routes with `express.Router()` and mount a versioned prefix such as `/api/v1`.
- Validate params, query strings, and bodies before business logic.
- Use consistent naming, status codes, and idempotency semantics.
- Add a final not-found handler after all routes.

## 9. Interview Questions

1. Difference between URL and route?
2. Compare PUT and PATCH.
3. What does `app.route()` improve?
4. Why does route order matter?

## 10. Memory Triggers

- **Endpoint = method + path.**
- **URL requested; route matched.**
- **Specific before broad.**

## 11. Summary

Express routing turns HTTP methods and paths into endpoint handlers. Keep routes explicit, ordered carefully, validated, and organized by resource/domain.
