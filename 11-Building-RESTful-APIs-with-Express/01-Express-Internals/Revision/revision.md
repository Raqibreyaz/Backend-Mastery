# Express Internals — One-Shot Revision

## 1. One-line Definition

Express is a minimal Node.js web framework that layers routing, middleware, and response helpers over the core `http` module.

## 2. Why was it introduced?

Raw Node HTTP requires manual URL/method checks, headers, parsing, and control flow. Express packages those common concerns into a small composable framework.

## 3. Core Mental Model

An Express app is a callable request handler plus an ordered stack of middleware and routes.

## 4. Internal Working

`app.listen(port)` creates a Node `http.Server` using the Express app as its request listener (roughly `http.createServer(app)`). For every request, Express walks registered layers in order, runs the matching handlers, and finishes when a handler sends a response or error handling completes.

`app.use()` adds middleware for matching path prefixes/all methods; `app.get()` and friends add method-and-path-specific route layers.

## 5. Key APIs / Syntax

```js
import express from 'express';
import http from 'node:http';

const app = express();
app.disable('x-powered-by');
app.get('/hello', (req, res) => res.send('Hello'));
http.createServer(app).listen(3000); // app.listen(3000) is the usual shorthand
```

## 6. Comparison

| Raw Node `http` | Express |
| --- | --- |
| Manually inspect URL/method and send headers/body | Declarative routes and helpers such as `res.json()` |
| One request-listener function to organize yourself | Ordered middleware/route pipeline |
| Smaller surface area | More convenience and ecosystem middleware |

## 7. Common Mistakes

- Assuming Express handles authentication, validation, or security automatically.
- Mounting parsers or global middleware after a route that needs them.
- Sending a response then continuing to write/send again.
- Treating Express as separate from Node HTTP; its `req`/`res` build on Node’s objects.

## 8. Production Considerations

- Disable `X-Powered-By`, put Express behind TLS/reverse-proxy infrastructure as appropriate, and configure trust proxy deliberately.
- Keep app construction separate from server startup to improve testing.
- Mount global parsing/logging/security middleware first, routes next, 404 and error handlers last.

## 9. Interview Questions

1. What does `app.listen()` do internally?
2. Describe the Express request–response lifecycle.
3. Why does registration order matter?
4. Compare Express with core Node `http`.

## 10. Memory Triggers

- **Node HTTP → Express app → stack → response.**
- **Express = router + middleware framework.**
- **Order is control flow.**

## 11. Summary

Express turns a Node HTTP server into an ordered pipeline of matching handlers. Its simplicity is its strength—and it makes application structure and middleware order your responsibility.
