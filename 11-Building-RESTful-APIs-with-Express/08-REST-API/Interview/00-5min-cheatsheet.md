# REST APIs – 5 Minute Cheatsheet

## If you get only 3 questions

1. What does “RESTful” actually mean (constraints + HTTP semantics)?
2. How do you design good resource URLs, methods, and status codes?
3. How do you handle pagination, filtering, sorting, and versioning in a REST API?

---

## Mental models (1–2 lines each)

- REST is an **architectural style** defined by constraints: client–server, stateless, cacheable, uniform interface, layered system, and optional code-on-demand.
- HTTP verbs express actions; **URLs should be nouns** (resources) – “what” not “doWhat”.
- Collections: plural nouns (`/users`), single resources: `/users/{id}`, relationships: `/users/{id}/orders`.
- APIs should be **stateless**: each request carries all necessary context (auth, tenant, chosen locale) in headers/token; server doesn’t track session state between requests.
- Pagination, filtering, and sorting should be built in from day one using query params like `?page=2&pageSize=20&sort=-createdAt&status=active`.
- Breaking changes require **versioning**, often via URL path (`/api/v1/...`) or headers; non‑breaking additive changes typically don’t need a new version.

---

## Canonical patterns to recall

**1. Resource-oriented URL design**

```txt
GET    /api/v1/users           → list users
POST   /api/v1/users           → create user
GET    /api/v1/users/{id}      → get user
PUT    /api/v1/users/{id}      → replace user
PATCH  /api/v1/users/{id}      → partially update user
DELETE /api/v1/users/{id}      → delete user
GET    /api/v1/users/{id}/orders → list a user’s orders
```

Use plural nouns, map HTTP methods to CRUD semantics, and express relationships via shallow sub-resources.

---

**2. Pagination, sorting, filtering**

```txt
GET /api/v1/users?page=2&pageSize=20&sort=-createdAt&status=active&role=admin
```

- Pagination: `page`, `pageSize` (or `offset`/`limit`).
- Sorting: `sort=field` or `sort=-field` for descending.
- Filtering: dedicated query params per field (`status=active&role=admin`).

Include total counts and pagination links in headers or body when possible.

---

**3. Versioning via base path**

```txt
GET /api/v1/users
GET /api/v2/users
```

Version in URL path is explicit and simple to understand; introduce new versions only for breaking changes.

---

## Links to full notes

- REST constraints, statelessness, uniform interface → `../Learning/01-rest-constraints-and-principles.md`
- Resource naming, URL structure, and HTTP method mapping → `../Learning/02-resource-naming-and-methods.md`
- Pagination, filtering, sorting, field selection → `../Learning/03-pagination-filtering-sorting.md`
- Versioning strategies and backward compatibility → `../Learning/04-api-versioning-strategies.md`
- Error handling patterns and response envelopes → `../Learning/05-rest-error-handling-and-status-codes.md`