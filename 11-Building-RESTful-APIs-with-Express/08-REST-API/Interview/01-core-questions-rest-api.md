# Core Questions – REST APIs

---

### Q1. What makes an API “RESTful”? What are the REST constraints?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “Is any JSON over HTTP automatically REST?”

**Answer (max 4 bullets):**
- REST is an architectural style defined by constraints: client–server, stateless, cacheable, uniform interface, layered system, and optional code-on-demand.
- **Client–server**: UI concerns separated from data/storage concerns.
- **Stateless**: each request contains everything needed; server does not hold per-client session state between requests.
- **Uniform interface**: standard methods, resource identification via URIs, representations, and self-descriptive messages.

**See also:** `../Learning/01-rest-constraints-and-principles.md`

---

### Q2. How do you design good REST endpoints? (nouns vs verbs, collections vs single)

Type: Design | Difficulty: Easy–Medium | Asked: High

**Hook:** “`/createUser` vs `/users` – which one and why?”

**Answer:**
- Endpoints represent **resources as nouns**; HTTP methods express the action, so avoid verbs in URLs (`/users` not `/createUser`).
- Use plural nouns for collections (`/users`), and `/users/{id}` for a single resource.
- Express relationships via sub-resources (e.g. `/users/{id}/orders`), but avoid deep nesting beyond 2–3 levels.
- Keep naming consistent and predictable across the whole API, so clients can guess endpoints.

**See also:** `../Learning/02-resource-naming-and-methods.md`

---

### Q3. How do HTTP methods map to CRUD in a REST API?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “Explain your method choices for a standard `/users` resource.”

**Answer:**
- `GET /users` – list resources; `GET /users/{id}` – retrieve a single resource.
- `POST /users` – create a new resource under the collection.
- `PUT /users/{id}` – replace the resource completely; `PATCH /users/{id}` – partial update.
- `DELETE /users/{id}` – delete a resource; idempotence expectations matter (repeated `DELETE` should be safe).

**See also:** `../Learning/02-resource-naming-and-methods.md`

---

### Q4. What does “stateless” mean in the context of REST?

Type: Concept | Difficulty: Medium | Asked: Medium–High

**Hook:** “If you’re using JWT or session tokens, is your API still stateless?”

**Answer:**
- Statelessness means the server does **not store client session state** between requests; each request carries all necessary context (auth, tenant, locale) independently.
- The server can store persistent data in a database, but it does not rely on per-client in-memory session for correctness.
- Token-based auth (e.g., JWTs) fits well: the token is sent on each request and contains the claims needed to authorize the call.
- Statelessness improves scalability and simplifies horizontal scaling and failure recovery.

**See also:** `../Learning/01-rest-constraints-and-principles.md`

---

### Q5. How do you handle pagination, filtering, and sorting in a REST API?

Type: Applied | Difficulty: Medium | Asked: High

**Hook:** “Your `/users` collection has millions of rows. How do you design the endpoint?”

**Answer:**
- Use query parameters for pagination, e.g. `GET /users?page=2&pageSize=20` or `offset`/`limit`; server-side pagination should be supported from day one.
- Use a `sort` parameter like `sort=createdAt` or `sort=-createdAt` for descending order.
- Use dedicated query parameters for filtering, e.g. `/users?status=active&role=admin`.
- Include metadata like total count and pagination links in headers (e.g. `X-Total-Count`, `Link`) or in the response body.

**See also:** `../Learning/03-pagination-filtering-sorting.md`

---

### Q6. How and why do you version a REST API?

Type: Design | Difficulty: Medium | Asked: Medium–High

**Hook:** “When do you introduce `/v2`, and where do you put the version?”

**Answer:**
- Versioning is used when introducing **breaking changes** that could break existing clients (field removal, semantic changes, auth changes).
- A common approach is base-path versioning, e.g. `/api/v1/users` and `/api/v2/users`.
- Alternate strategies include custom headers (`Accept: application/vnd.myapp.v1+json`) or query params, but path versioning is the simplest and most explicit.
- Non-breaking additions (new fields, new endpoints) usually don’t require a new version; they should be handled compatibly.

**See also:** `../Learning/04-api-versioning-strategies.md`

---

### Q7. How should a well-designed REST API handle errors?

Type: Design | Difficulty: Medium | Asked: Medium–High

**Hook:** “What do your error responses look like? Which status codes do you use?”

**Answer:**
- Use meaningful HTTP status codes: `4xx` for client errors (400, 401, 403, 404, 409, 422), `5xx` for server errors (500, 503).
- Return a consistent error envelope (e.g. `{ error: { code, message, details } }`) so clients can parse and display errors easily.
- Include enough context for debugging (error code, correlation id, maybe a user-safe message) but avoid leaking sensitive internal details.
- For validation errors, return structured information per field where possible.

**See also:** `../Learning/05-rest-error-handling-and-status-codes.md`

---

### Q8. How do caching and HTTP headers fit into REST best practices?

Type: Concept | Difficulty: Medium | Asked: Medium

**Hook:** “How would you reduce load on a heavily-read endpoint like `/products`?”

**Answer:**
- REST’s cacheable constraint encourages use of HTTP caching headers like `Cache-Control`, `ETag`, and `Last-Modified` for safe, idempotent operations like `GET`.
- Clients and intermediaries (CDNs, proxies) can cache responses based on these headers, reducing latency and backend load.
- For paginated lists, you can still use caching, but be careful with invalidation when underlying data changes frequently.
- Caching strategy is part of API design, not just an infra concern.

**See also:** `../Learning/01-rest-constraints-and-principles.md`

---

### Q9. What are some common REST anti-patterns you try to avoid?

Type: Debugging / Design | Difficulty: Medium–High | Asked: Medium–High

**Hook:** “Give some examples of ‘not really REST’ designs you’ve seen.”

**Answer:**
- Verb-heavy URLs like `/createUser`, `/updateUser`, instead of resource-based `/users` with correct HTTP methods.
- Overloading `POST` for everything (fetch, update, delete), ignoring the semantics of `GET`, `PUT`, `PATCH`, `DELETE`.
- Ignoring pagination on large collections and returning unbounded lists.
- Making breaking changes without versioning, or exposing inconsistent naming conventions and structures across endpoints.

**See also:** `../Learning/02-resource-naming-and-methods.md`