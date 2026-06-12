# Express Routing – 5 Minute Cheatsheet

## If you get only 3 questions

1. What is routing in Express and how does Express decide which handler runs for a request?
2. Difference between route parameters and query strings; when to use each?
3. How do you organize routes using `express.Router()` for a real project?

---

## Mental models (1–2 lines each)

- Routing defines **how your app responds** to a particular HTTP method and path combination (e.g., `GET /users`).
- A route is: **method + path pattern + one or more handlers** executed in order when the incoming request matches.
- Route paths can be **static**, **parameterized** (`/users/:id`), or **pattern-based** (regex-like strings).
- Route parameters (`:id`) are **part of the path**, used for required identifiers; Express exposes them on `req.params`.
- Query strings (`?page=2&sort=date`) are **optional modifiers** (filters, pagination, search) and are accessed via `req.query`; they do not affect route matching.
- `express.Router()` is a **mini Express app** that lets you group related routes and mount them under a common prefix like `/api/users`.

---

## Canonical examples to recall

**1. Basic routes with different HTTP methods**

```js
app.get("/users", (req, res) => {
  /* list users */
});
app.post("/users", (req, res) => {
  /* create user */
});
app.get("/users/:id", (req, res) => {
  /* get user by id */
});
app.put("/users/:id", (req, res) => {
  /* update user */
});
app.delete("/users/:id", (req, res) => {
  /* delete user */
});
```

Express uses methods like `app.get`, `app.post`, `app.put`, `app.delete` to define routes for different HTTP verbs.

---

**2. Route parameters + query strings**

```js
app.get("/blogs/:blogId", (req, res) => {
  const { blogId } = req.params; // e.g. /blogs/123
  const { page = 1, tag } = req.query; // e.g. ?page=2&tag=node
  res.json({ blogId, page, tag });
});
```

Route parameters are defined with `:` in the path and are used for dynamic segments; query strings are free-form key–value pairs after `?`.

---

**3. Modular routing with `express.Router()`**

```js
// users.routes.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  /* list users */
});
router.post("/", (req, res) => {
  /* create user */
});
router.get("/:id", (req, res) => {
  /* get user */
});

module.exports = router;

// app.js
const usersRouter = require("./users.routes");
app.use("/api/users", usersRouter);
```

A Router instance is a mountable route handler; you define routes on it and then attach it to the main app with `app.use(prefix, router)`.

---

## Links to full notes

- Routing basics, route matching and handler chain → `../Learning/01-routing-basics.md`
- Route parameters vs query strings, examples → `../Learning/02-route-params-and-query.md`
- Organizing routes with `express.Router()` → `../Learning/03-express-router-architecture.md`
- HTTP methods, REST-style resource routing → `../Learning/04-restful-routing-patterns.md`
