# Path Module – 5 Minute Cheatsheet

## If you get only 3 questions

1. What is the `path` module and why should you use it instead of hard-coded strings?
2. Difference between `path.join()` and `path.resolve()` – when do you use each?
3. How do you use `path` safely to avoid directory traversal bugs in file-serving endpoints?

---

## Mental models (1–2 lines each)

- The `path` module provides **cross‑platform utilities** for working with file and directory paths so you don’t hard-code `/` or `\` and break on Windows vs POSIX.
- `path.join()` simply **concatenates and normalizes** path segments with the correct separator; it does not guarantee an absolute path.
- `path.resolve()` **resolves segments into an absolute path**, processing from right to left until it finds an absolute segment or falls back to the current working directory.
- `path.basename()` gets the last part of a path (file name), while `path.dirname()` gets the directory portion; `path.extname()` gets the extension.
- `path.normalize()` cleans up a path (collapses `..`, `.` and duplicate separators) but by itself is **not a security boundary**.
- To prevent path traversal, you typically `path.resolve(base, userPart)` and then verify the result still stays under `base` using something like `startsWith(base + path.sep)`.

---

## Canonical examples to recall

**1. Basic usage and cross‑platform safe joins**

```js
const path = require('node:path');

const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(__dirname, 'uploads', 'images');

console.log(publicDir);  // e.g. /app/public or C:\app\public
```

`path.join` joins segments using the platform-specific separator and normalizes the result.

---

**2. `join` vs `resolve`**

```js
const p1 = path.join('api', 'v1', '..', 'users');   // 'api/users' (relative)
const p2 = path.resolve('api', 'v1', '..', 'users'); // '/cwd/api/users' (absolute)
```

`path.join` returns a normalized relative path string, while `path.resolve` returns an absolute path based on the current working directory (or the first absolute segment).

---

**3. Safe path building for file serving**

```js
const baseDir = path.resolve(__dirname, 'files');

function safePath(userInput) {
  const resolved = path.resolve(baseDir, userInput);
  if (!resolved.startsWith(baseDir + path.sep)) {
    throw new Error('Path traversal detected');
  }
  return resolved;
}
```

`path.resolve` plus a containment check (`startsWith(baseDir + path.sep)`) ensures user input cannot escape the intended directory, unlike naive `path.join` alone.

---

## Links to full notes

- Overview of `path` and common methods (join, resolve, basename, dirname, extname) → `../Learning/01-path-module-basics.md`
- `join` vs `resolve` vs `normalize` deep dive → `../Learning/02-join-resolve-normalize.md`
- Using `path` with Express (`express.static`, `sendFile`, uploads) → `../Learning/03-path-and-express-examples.md`
- Path traversal vulnerabilities and safe patterns → `../Learning/04-path-traversal-defense.md`