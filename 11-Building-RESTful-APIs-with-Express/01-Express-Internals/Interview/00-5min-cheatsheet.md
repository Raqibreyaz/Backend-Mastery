# Express.js Intro & Internals – 5 Minute Cheatsheet

## If you get only 3 questions

1. What is Express.js and why is it the “de facto” Node.js web framework?
2. What actually happens inside Express between `app.listen()` and `res.send()`?
3. How does middleware + routing form the internal pipeline in Express?

---

## Mental models (1–2 lines each)

- Express is a **minimal, unopinionated web framework** for Node.js built on top of the core `http` module to simplify routing, middleware, and HTTP helpers for building APIs and web apps.
- An Express app is basically a **stack of middleware and route handlers** – Express itself is mainly a router + middleware framework.
- When you call `app.listen`, Express creates an underlying Node `http.Server` and passes a **single request handler function** that walks this stack.
- Every incoming request goes through the same pipeline: **Node HTTP → Express app function → middleware chain → route handler → (optional) error handlers → response**.
- Middleware order defines control flow; routing is essentially middleware with path/method conditions.

---

## Canonical examples to recall

**1. Minimal Express app vs raw Node HTTP**

```js
// Raw Node
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/hello' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('Hello');
  }
  res.writeHead(404);
  res.end();
});
server.listen(3000);

// Express
const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello');
});

app.listen(3000);
```

Express layers routing and HTTP helpers (`res.send`, `res.json`, etc.) on top of Node’s `http.Server`, avoiding the boilerplate of manual URL/method checks and header handling.

---

**2. Request → middleware → route → response lifecycle**

```js
const app = express();

app.use(express.json());               // 1) parse JSON body
app.use((req, res, next) => {          // 2) logging middleware
  console.log(req.method, req.url);
  next();
});

app.get('/users/:id', (req, res) => {  // 3) route handler
  res.json({ id: req.params.id });
});
```

Internally, Express keeps a list of handlers in registration order; for each request, it iterates through them, executing any whose path/method match, until one sends a response or the stack ends.

---

**3. Express app as “function + stack” under the hood**

Conceptually:

```txt
const app = express(); // app is a function(req, res) with an attached stack []

app.use(mw1);          // push mw1 to stack
app.use('/users', mw2);// push mw2 with a path condition
app.get('/users', h1); // push route handler h1 with method/path conditions

app.listen(3000);      // creates http.Server and uses app(req, res) as handler
```

When Node’s HTTP server receives a request, it calls `app(req, res)`, which walks the stack and invokes matching middleware/handlers in order.

---

## Links to full notes

- What is Express? History, philosophy (minimal, plugin-focused), features → `../Learning/01-what-is-express-and-why-use-it.md`
- Request–response lifecycle in Express (from Node HTTP to middleware/route to response) → `../Learning/02-express-request-response-lifecycle.md`
- Internal middleware stack, how `app.use`/`app.METHOD` build the pipeline → `../Learning/03-express-middleware-stack-and-routing-internals.md`
- Express vs raw Node HTTP server – trade-offs and when you might go lower level → `../Learning/04-express-vs-node-http.md`