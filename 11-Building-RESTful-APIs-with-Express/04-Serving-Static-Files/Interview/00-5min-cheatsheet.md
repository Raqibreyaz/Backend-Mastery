# Serving Static Files – 5 Minute Cheatsheet

## If you get only 3 questions

1. How do you serve static files (HTML, CSS, JS, images) from an Express app?
2. What is `express.static`, and how do virtual path prefixes and multiple static directories work?
3. How do you control caching for static files using headers like `Cache-Control`, `ETag`, and `max-age`?

---

## Mental models (1–2 lines each)

- Static files = assets returned “as is” from disk (HTML, CSS, JS, images, fonts) with **no server-side code execution**.
- `express.static(root)` is a built-in middleware that serves files from a root directory based on the request path.
- You can mount static middleware at the app root or under a **virtual path prefix** like `/static` so URLs do not have to mirror the folder structure exactly.
- Express/`serve-static` do **no in-memory caching**; they rely on HTTP caching with headers like `ETag`, `Last-Modified`, and `Cache-Control` (`max-age`, `immutable`).
- Always use `path.join(__dirname, 'public')` (or similar) when configuring the static directory to avoid path issues across environments.
- Never put sensitive files (secrets, `.env`, private docs) in the static root – anything in that directory is directly accessible over HTTP.

---

## Canonical examples to recall

**1. Basic static files from a `public` directory**

```js
const express = require("express");
const path = require("path");

const app = express();
const staticPath = path.join(__dirname, "public");

app.use(express.static(staticPath)); // e.g. /css/style.css → public/css/style.css

app.listen(3000);
```

Express serves static files from the `public` folder; paths map directly from URL to files under the root directory.

---

**2. Virtual path prefix and multiple directories**

```js
// Files under public/ are served under /static
app.use("/static", express.static(path.join(__dirname, "public")));

// Another directory for images
app.use("/images", express.static(path.join(__dirname, "images")));
```

You can register `express.static` multiple times and/or mount it under prefixes like `/static` to avoid exposing the actual folder name.

---

**3. Tuning caching headers**

```js
app.use(
  express.static(path.join(__dirname, "public"), {
    etag: true, // enable ETag (default)
    lastModified: true, // enable Last-Modified (default)
    maxAge: "1d", // cache static assets for 1 day
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }),
);
```

`express.static`/`serve-static` let you configure `maxAge`, `etag`, `lastModified`, and custom headers to control client-side caching behavior.

---

## Links to full notes

- Basics of static content & directory structure → `../Learning/01-static-files-basics.md`
- `express.static` options, virtual prefixes, multiple roots → `../Learning/02-express-static-and-options.md`
- Caching headers (`ETag`, `Last-Modified`, `Cache-Control`) and performance → `../Learning/03-static-file-caching-strategies.md`
- Serving SPAs and fallbacks (index.html for unknown routes) → `../Learning/04-static-files-and-spa-routing.md`
