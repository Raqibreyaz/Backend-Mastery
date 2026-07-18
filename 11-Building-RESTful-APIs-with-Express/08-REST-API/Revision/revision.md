# REST API — One-Shot Revision

## 1. One-line Definition

A REST API exposes resources through a uniform HTTP interface using resource-oriented URLs, methods, representations, and status codes.

## 2. Why was it introduced?

It gives clients and servers a predictable, interoperable way to exchange resource state over HTTP.

## 3. Core Mental Model

Resources are nouns (`/users`, `/users/:id`); HTTP methods describe what to do with their representations.

## 4. Internal Working

A client sends method, URI, headers, and optionally a body. The server authenticates, validates, performs the resource operation, and returns a representation/status/headers. REST is stateless: each request contains the context needed to process it; the server does not rely on hidden client session state between requests.

## 5. Key APIs / Syntax

```js
router.get('/users', listUsers);       // 200
router.post('/users', createUser);     // 201 + Location
router.get('/users/:id', getUser);     // 200 / 404
router.patch('/users/:id', updateUser);// 200 / 204
router.delete('/users/:id', deleteUser);// 204
```

Use query strings for filtering/pagination/sorting: `/users?role=admin&page=2&limit=20`.

## 6. Comparison

| Concern | REST convention |
| --- | --- |
| Collection | `GET /users`, `POST /users` |
| Item | `GET/PATCH/DELETE /users/:id` |
| Create success | `201 Created`, often `Location` |
| Bad client input | `400`/`422` |
| Missing resource | `404` |
| Unexpected server failure | `500` |

## 7. Common Mistakes

- Action-shaped URLs such as `/getUsers` when a resource route fits.
- Returning `200` for every outcome.
- Using GET for mutations.
- Confusing authentication (`401`) with authorization (`403`).
- Skipping pagination, validation, and a consistent error format.

## 8. Production Considerations

- Version intentionally (path, header, or media type strategy) and document contracts with OpenAPI.
- Validate all input; enforce authorization at the resource level.
- Design pagination/filtering limits, idempotency for retries, consistent errors, observability, caching, and rate limits.
- REST is a useful design style, not a requirement to force every operation into a noun-shaped URL.

## 9. Interview Questions

1. What constraints characterize REST?
2. PUT vs PATCH?
3. When do you return 201, 204, 401, and 403?
4. How would you paginate a collection?

## 10. Memory Triggers

- **Nouns in paths; verbs in methods.**
- **Stateless requests.**
- **Status code communicates outcome.**

## 11. Summary

REST APIs make resources predictable through HTTP semantics. Model resources clearly, validate and authorize every request, and make outcomes explicit with status codes and stable representations.
