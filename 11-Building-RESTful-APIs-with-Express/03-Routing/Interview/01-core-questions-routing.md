# Core Questions – Express Routing

---

### Q1. What is routing in Express?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “When I hit `GET /users`, how does Express know what to run?”

**Answer (max 4 bullets):**
- Routing is the mechanism that **maps incoming HTTP requests** (method + URL path) to specific handler functions.
- A route in Express is defined using methods like `app.get`, `app.post`, etc., with a path and one or more callbacks.
- When a request comes in, Express scans the defined routes in order and executes the first route whose method and path pattern match.
- Routes can be defined on the main app or on Router instances and then mounted under prefixes.

**See also:** `../Learning/01-routing-basics.md`

---

### Q2. How do you define routes for different HTTP methods on the same path?

Type: API usage | Difficulty: Easy | Asked: High

**Hook:** “How do you handle `GET /users` and `POST /users` cleanly?”

**Answer:**
- You can define separate routes:

  ```js
  app.get('/users', listUsers);
  app.post('/users', createUser);
  ```

  where each method corresponds to an HTTP verb.

- Alternatively, you can use `app.route('/users')` to chain handlers for multiple methods on the same path.
- This grouping makes it clear that these handlers operate on the same resource endpoint.
- It aligns naturally with RESTful APIs (GET = read, POST = create, PUT/PATCH = update, DELETE = delete).

**See also:** `../Learning/04-restful-routing-patterns.md`

---

### Q3. What are route parameters and how do you use them?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “Explain `/users/:id` and how you read the id.”

**Answer:**
- Route parameters are **named segments of the URL path** that act as placeholders, defined with a colon syntax, like `/users/:id`.
- Express captures their values into `req.params`, e.g., `req.params.id` for `/users/123`.
- You can define multiple parameters like `/users/:userId/posts/:postId` and destructure them from `req.params`.
- They are typically used for required resource identifiers where the URL wouldn’t make sense without that value.

**See also:** `../Learning/02-route-params-and-query.md`

---

### Q4. How do query strings differ from route parameters, and when do you use each?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “When do you choose `/users/:id` vs `/users?id=...`?”

**Answer:**
- Route parameters (`/users/:id`) are part of the path and usually represent **required identifiers** for a single resource.
- Query strings (`/users?role=admin&page=2`) are optional key–value pairs after `?` used for filters, pagination, sorting, and search terms.
- Express exposes route parameters via `req.params` and query strings via `req.query`.
- Route matching ignores the query string, so adding or removing query parameters does not change which route handler is chosen.

**See also:** `../Learning/02-route-params-and-query.md`

---

### Q5. What is `express.Router()` and why is it useful?

Type: Architecture | Difficulty: Medium | Asked: High

**Hook:** “How do you keep routes maintainable as your app grows?”

**Answer:**
- `express.Router()` creates a **mini Express application** that can have its own routes and middleware.
- You use it to group related routes (e.g., all `/users` routes) into separate modules.
- In the main app, you mount routers under prefixes with `app.use('/api/users', usersRouter)`.
- This improves modularity, separation of concerns, and makes large codebases easier to navigate and test.

**See also:** `../Learning/03-express-router-architecture.md`

---

### Q6. How does Express decide which route matches a request?

Type: Internals | Difficulty: Medium | Asked: Medium–High

**Hook:** “If two routes could match, which one wins?”

**Answer:**
- Express keeps an internal list of routes in the order you define them on the app or Router.
- For each incoming request, it checks routes sequentially and picks the **first one whose method and path pattern match** the request.
- More specific routes should be defined **before** generic catch‑all routes (like `app.get('*', ...)`) to avoid shadowing.
- Because of this, route definition order is a tool for controlling precedence and fallback behavior.

**See also:** `../Learning/01-routing-basics.md`

---

### Q7. How do you handle “not found” (404) routes in Express?

Type: Error handling | Difficulty: Easy | Asked: Medium

**Hook:** “What happens if no route matches a request?”

**Answer:**
- After defining all routes, you add a final middleware like:

  ```js
  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });
  ```

- Since Express processes middleware and routes in order, this catch‑all runs only if no previous route matched.
- You can mount separate 404 handlers per Router if you want more granular behavior (e.g., `/api` vs frontend routes).
- In production apps, 404 handlers often log enough context to help debugging missing routes.

**See also:** `../Learning/01-routing-basics.md`

---

### Q8. How can you share route parameters between parent and child routers?

Type: Detail | Difficulty: Medium | Asked: Medium

**Hook:** “You have `/users/:userId` and a nested router for `/posts` – how does the child see `userId`?”

**Answer:**
- When creating a Router, you can pass `{ mergeParams: true }`:

  ```js
  const postsRouter = express.Router({ mergeParams: true });
  ```

- This tells Express to **merge parameters** from the parent route into the child router’s `req.params`.
- You then mount it like `app.use('/users/:userId/posts', postsRouter)` and inside the child routes you can access `req.params.userId`.
- Without `mergeParams: true`, the child router would only see its own parameters, not the parent’s.

**See also:** `../Learning/03-express-router-architecture.md`

---

### Q9. How do you design RESTful routes for a resource like “posts”?

Type: Applied / REST | Difficulty: Medium | Asked: Medium–High

**Hook:** “Give me the set of routes you’d expose for blog posts.”

**Answer:**
- Common RESTful routes would be:

  ```txt
  GET    /posts          → list posts
  POST   /posts          → create post
  GET    /posts/:id      → get a single post
  PUT    /posts/:id      → replace a post
  PATCH  /posts/:id      → partially update a post
  DELETE /posts/:id      → delete a post
  ```

- Each route uses HTTP verbs to express intent and uses route parameters for resource identifiers.
- Optional filters like `?author=...&page=...` are expressed via query strings on the list route, e.g., `GET /posts?author=alice&page=2`.
- Using consistent, resource-based URLs and verbs simplifies both client and server logic.

**See also:** `../Learning/04-restful-routing-patterns.md`