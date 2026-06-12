# CORS – 5 Minute Cheatsheet

## If you get only 3 questions

1. What is CORS and why does it exist?
2. What is a preflight request and when does the browser send one?
3. How do you enable and configure CORS in an Express API using the `cors` middleware?

---

## Mental models (1–2 lines each)

- CORS (Cross-Origin Resource Sharing) is a **browser security mechanism** that controls whether a web page from one origin can call an API on another origin.
- It is enforced by the **browser**, not by Node/Express; CORS works via HTTP headers like `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, and `Access-Control-Allow-Headers`.
- A **preflight request** is an automatic `OPTIONS` request sent by the browser to check if a cross-origin request is allowed before sending the actual `POST`/`PUT`/`DELETE` or request with custom headers.
- Express does **not** handle CORS by default; the usual approach is to use the `cors` middleware (`npm install cors`) and configure allowed origins, methods, headers, and credentials.
- For public APIs you might allow `*`, but for production apps you typically **whitelist specific origins** and possibly validate origins programmatically.
- CORS is not an auth mechanism; it just tells the browser whether it may expose the response to frontend JavaScript.

---

## Canonical examples to recall

**1. Enable CORS for all routes (development)**

```js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Allow all origins (development / quick demo)
```

`app.use(cors())` attaches the `cors` middleware globally and the server sends permissive headers like `Access-Control-Allow-Origin: *`.

---

**2. Restrict CORS to specific origins and methods**

```js
const corsOptions = {
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
```

You can configure the `cors` middleware with explicit origins, methods, headers, and whether credentials (cookies, auth headers) are allowed.

---

**3. Handling preflight (OPTIONS) explicitly when needed**

```js
const corsOptions = { origin: 'https://myapp.com' };

app.options('*', cors(corsOptions)); // handle all OPTIONS preflight
// or route-specific:
app.options('/api/data', cors(corsOptions));
```

Preflight requests are `OPTIONS` calls that must receive the appropriate CORS headers; `cors` middleware can handle them for you.

---

## Links to full notes

- Same-origin policy, what “origin” means, and why CORS was introduced → `../Learning/01-cors-and-same-origin-policy.md`
- CORS headers (`Access-Control-Allow-*`) and browser behavior → `../Learning/02-cors-headers-and-browser-flow.md`
- Preflight requests, simple vs non-simple requests → `../Learning/03-preflight-requests.md`
- Using the `cors` middleware in Express (global vs route-level, credentials, origin whitelists) → `../Learning/04-express-cors-middleware.md`