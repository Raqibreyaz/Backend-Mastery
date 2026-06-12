# Core Questions – Path Module

---

### Q1. What is the `path` module in Node.js and why is it useful?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “Why not just build paths with string concatenation?”

**Answer (max 4 bullets):**
- The `path` module is a built-in Node.js module that provides utilities for working with file and directory paths.
- It abstracts away platform differences (POSIX `/` vs Windows `\`), so your code works correctly across operating systems.
- It helps you join, resolve, normalize, and parse paths without manually handling separators or `..` segments.
- Using it reduces bugs when moving between environments (e.g., dev on macOS, prod on Linux/Windows).

**See also:** `../Learning/01-path-module-basics.md`

---

### Q2. What is the difference between `path.join()` and `path.resolve()`?

Type: Concept | Difficulty: Medium | Asked: High

**Hook:** “They both combine segments – how are they different?”

**Answer:**
- `path.join(...segments)` concatenates segments with the platform-specific separator and normalizes the result but does **not** guarantee an absolute path.
- `path.resolve(...segments)` processes segments from right to left until it finds an absolute path, then returns the **absolute** normalized path; if none is found, it uses the current working directory as a base.
- Example: `path.join('foo', '/bar')` → `'foo/bar'` (on POSIX), while `path.resolve('foo', '/bar')` → `'/bar'` because `/bar` is already absolute.
- In practice, `join` is great for building relative paths; `resolve` is better when you need an absolute path to pass to things like `fs` or `sendFile`.

**See also:** `../Learning/02-join-resolve-normalize.md`

---

### Q3. How does `path.normalize()` work and what is it *not*?

Type: Detail | Difficulty: Medium | Asked: Medium

**Hook:** “Can `path.normalize` or `path.join` protect you from path traversal?”

**Answer:**
- `path.normalize(p)` resolves `.` and `..` segments and removes duplicate separators, returning a cleaned-up path string.
- `path.join` internally normalizes the result as well.
- However, they are **not security mechanisms**: they happily normalize traversal sequences like `../../etc/passwd` into a valid path outside your intended directory.
- You must still perform containment checks when building paths from user input.

**See also:** `../Learning/04-path-traversal-defense.md`

---

### Q4. How do you get the directory name, file name, and extension from a path?

Type: API usage | Difficulty: Easy | Asked: Medium

**Hook:** “Given `/var/www/app/index.html`, how do you split it?”

**Answer:**
- `path.dirname(p)` returns the directory portion, e.g. `path.dirname('/var/www/app/index.html')` → `/var/www/app` on POSIX.
- `path.basename(p)` returns the last portion, e.g. `index.html`; you can also pass an extension to strip.
- `path.extname(p)` returns the extension, e.g. `.html`.
- Together they let you inspect and manipulate file names and directories cleanly.

**See also:** `../Learning/01-path-module-basics.md`

---

### Q5. How do you safely build paths for `express.static` or `res.sendFile`?

Type: Applied | Difficulty: Medium | Asked: Medium–High

**Hook:** “How do you avoid hard-coded paths when serving files in Express?”

**Answer:**
- Use `path.join(__dirname, 'public')` (or similar) to construct the directory passed to `express.static` or `res.sendFile`.
- Example: `app.use(express.static(path.join(__dirname, 'public')));` ensures the correct absolute path regardless of where the process is started.
- For `res.sendFile`, you typically compute an absolute file path with `path.join` or `path.resolve` plus `__dirname`.
- This avoids brittle relative paths like `'../public'` that depend on the current working directory.

**See also:** `../Learning/03-path-and-express-examples.md`

---

### Q6. How do you defend against path traversal when constructing file paths from user input?

Type: Security | Difficulty: Medium–High | Asked: Medium–High

**Hook:** “User passes a file name as a query param; how do you prevent `/../../etc/passwd` from being read?”

**Answer:**
- Start from a fixed base directory: `const baseDir = path.resolve(__dirname, 'files');`.
- Resolve the user input relative to the base: `const target = path.resolve(baseDir, userInput);`.
- Check that the resolved path still resides under the base, e.g.:

  ```js
  if (!target.startsWith(baseDir + path.sep)) {
    throw new Error('Path traversal detected');
  }
  ```

- Prefer ID-based lookups (e.g. `fileId → real path in DB`) so you never expose raw paths to clients in the first place.

**See also:** `../Learning/04-path-traversal-defense.md`

---

### Q7. How does `path.resolve()` process its arguments?

Type: Internals | Difficulty: Medium | Asked: Medium

**Hook:** “Given `path.resolve('foo', '/bar', 'baz')`, what does it return and why?”

**Answer:**
- `path.resolve` processes segments from **right to left**, stopping when it encounters an absolute path.
- Once an absolute segment is found, everything to its left is ignored; remaining segments to its right are resolved relative to it.
- Example: `path.resolve('foo', '/bar', 'baz')` → `/bar/baz` because `/bar` is absolute, so `foo` is ignored.
- If no absolute segment is found, it resolves relative to the current working directory.

**See also:** `../Learning/02-join-resolve-normalize.md`

---

### Q8. Why is the `path` module especially important in cross-platform Node.js apps?

Type: Design | Difficulty: Easy | Asked: Medium

**Hook:** “What breaks if you hard-code `/` in file paths?”

**Answer:**
- Different OSes use different path separators (`/` vs `\`) and have different conventions for absolute paths.
- Manually concatenating strings like `'src/' + file` can misbehave or look wrong on Windows paths.
- Using `path.join`, `path.resolve`, and related helpers ensures paths are constructed correctly regardless of platform.
- This matters for libraries, CLIs, and backends that may be deployed on multiple operating systems.

**See also:** `../Learning/01-path-module-basics.md`