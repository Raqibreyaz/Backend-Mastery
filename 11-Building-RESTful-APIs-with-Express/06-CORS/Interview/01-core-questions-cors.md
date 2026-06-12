# Core Questions – CORS

---

### Q1. What is CORS and why do we need it?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “If both backend and frontend are yours, why do you suddenly get CORS errors?”

**Answer (max 4 bullets):**
- CORS (Cross-Origin Resource Sharing) is a **browser-enforced security mechanism** that restricts JavaScript from making requests to a different origin unless the server explicitly allows it.
- It’s built on top of the **same-origin policy**, which by default only allows requests to the same scheme + host + port.
- Servers opt in to sharing resources by returning CORS headers like `Access-Control-Allow-Origin`.
- Without proper CORS configuration, browsers block access to the response, even if the server technically responded.

**See also:** `../Learning/01-cors-and-same-origin-policy.md`

---

### Q2. What is an origin? When are two URLs considered different origins?

Type: Concept | Difficulty: Easy | Asked: Medium

**Hook:** “Is `https://api.myapp.com` the same origin as `https://www.myapp.com`?”

**Answer:**
- An origin is defined by the **scheme (protocol), host, and port** of a URL.
- Two URLs differ in origin if any of these differ (e.g., `http` vs `https`, `www.myapp.com` vs `api.myapp.com`, port 80 vs 8080).
- `https://myapp.com` and `https://myapp.com:443` are effectively the same origin, but `https://myapp.com` and `http://myapp.com` are not.
- CORS is only relevant when the frontend and backend are on **different origins**.

**See also:** `../Learning/01-cors-and-same-origin-policy.md`

---

### Q3. What is a CORS preflight request and when does it occur?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “Why do I see an `OPTIONS` request before my real `POST`?”

**Answer:**
- A preflight request is an automatic **`OPTIONS` request** sent by the browser before certain cross-origin requests to check if the actual request is allowed.
- It is triggered for “non-simple” requests, e.g., methods other than `GET`, `HEAD`, or plain `POST`, or when non-safelisted headers (like `Authorization`) or non-safelisted `Content-Type` values are used.
- The server must respond with the appropriate CORS headers like `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.
- If the preflight fails, the browser blocks the actual request; the API might still have responded, but the response is not exposed to JavaScript.

**See also:** `../Learning/03-preflight-requests.md`

---

### Q4. How do you enable CORS in an Express.js application?

Type: Applied | Difficulty: Easy | Asked: High

**Hook:** “You deploy React on `localhost:3000` and Express on `localhost:5000` – what do you change on the backend?”

**Answer:**
- Install the `cors` package: `npm install cors`.
- Import and use it as middleware:

  ```js
  const cors = require('cors');
  app.use(cors()); // enables CORS for all origins and routes
  ```

  This adds permissive CORS headers such as `Access-Control-Allow-Origin: *`.

- For more control, pass options: `app.use(cors({ origin: 'http://localhost:3000' }));`.
- You can also apply CORS only to specific routes: `app.get('/public', cors(), handler);`.

**See also:** `../Learning/04-express-cors-middleware.md`

---

### Q5. How do you restrict CORS to specific origins and methods in Express?

Type: Applied | Difficulty: Medium | Asked: Medium–High

**Hook:** “You only want your production frontend and admin panel to call this API. How?”

**Answer:**
- Use a `corsOptions` object to define allowed origins, methods, and headers, then pass it to `cors()`:

  ```js
  const corsOptions = {
    origin: ['https://app.mycompany.com', 'https://admin.mycompany.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  };
  app.use(cors(corsOptions));
  ```

- You can also provide a function for `origin` to implement dynamic or programmatic checks against an allowlist.
- Avoid `*` in production, especially when sending credentials; CORS spec does not allow `Access-Control-Allow-Origin: *` together with credentials.
- Route-level CORS lets different routes use different policies (e.g., open `/public`, restricted `/api/*`).

**See also:** `../Learning/04-express-cors-middleware.md`

---

### Q6. How do you handle CORS preflight requests in Express?

Type: Applied | Difficulty: Medium | Asked: Medium

**Hook:** “Your browser complains that preflight requests are failing. What do you change?”

**Answer:**
- Ensure the server responds to `OPTIONS` requests on relevant routes, with appropriate CORS headers.
- With the `cors` middleware, you can use:

  ```js
  app.options('*', cors()); // handle all OPTIONS
  // or route-specific
  app.options('/api/data', cors(corsOptions));
  ```

- The preflight response should include headers like `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers` that match the actual request.
- Once the preflight succeeds, the browser proceeds with the real request.

**See also:** `../Learning/03-preflight-requests.md`

---

### Q7. Is CORS an authentication or security boundary?

Type: Conceptual | Difficulty: Medium | Asked: Medium

**Hook:** “If CORS blocks a request from another origin, is my API safe?”

**Answer:**
- CORS is **not** an authentication mechanism; it only controls whether the browser will expose the response to frontend code running in a different origin.
- A non-browser client (e.g., `curl`, Postman, backend service) can ignore CORS entirely and still hit your API.
- You must still implement proper authentication and authorization (tokens, sessions, RBAC, etc.) server-side.
- Think of CORS as a browser-level guard rail, not as a replacement for real security controls.

**See also:** `../Learning/02-cors-headers-and-browser-flow.md`

---

### Q8. What common CORS misconfigurations or pitfalls have you seen?

Type: Debugging | Difficulty: Medium–High | Asked: Medium–High

**Hook:** “Describe a real CORS bug you’ve debugged.”

**Answer:**
- Allowing `*` while also trying to send cookies/credentials, which violates the spec and leads to failed requests.
- Forgetting to include all needed headers in `Access-Control-Allow-Headers` (e.g., missing `Authorization`), causing preflight to fail.
- Handling `GET/POST` but not `OPTIONS`, so preflight hits 404/500 and the browser blocks the actual request.
- Adding CORS headers on normal responses but not on error responses, leading to confusing behavior where errors appear as CORS failures in the browser console.

**See also:** `../Learning/03-preflight-requests.md`