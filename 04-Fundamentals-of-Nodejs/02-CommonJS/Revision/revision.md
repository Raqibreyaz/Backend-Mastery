# CommonJS — One-Shot Revision

## 1. One-line Definition

**CommonJS (CJS)** is Node.js’s traditional module system, using `require()` to load a module and `module.exports` to expose its public value.

## 2. Why was it introduced?

It split server-side JavaScript into reusable files with private scope, avoiding one large file and global-variable collisions.

## 3. Core Mental Model

A CJS module is a private box. `module.exports` is the official package Node sends back to callers; `exports` is only a shortcut pointing at that package.

## 4. Internal Working

Node resolves a `require()` specifier, creates a `module` object, wraps and evaluates the file synchronously, then caches and returns `module.exports`.

Conceptually, Node wraps a CJS file as:

```js
(function (exports, require, module, __filename, __dirname) {
  // source file
});
```

This is why top-level variables are module-local, and why these five values are available in CJS. Cached modules normally execute only once; circular dependencies can expose partially initialized exports.

## 5. Key APIs / Syntax

```js
// math.cjs
exports.add = (a, b) => a + b;
module.exports.version = '1.0.0';

// app.cjs
const { add, version } = require('./math');
```

- `require('./math')`: relative user module; Node can resolve common extensions/index files.
- `require('package')`: core or installed package; Node searches module locations, including `node_modules`.
- `module.exports = value`: replaces the whole exported value (function, class, object, etc.).
- `exports.name = value`: adds a property while `exports` still points to `module.exports`.
- `node --require ./setup.cjs app.cjs`: preload a module before the entry file.

## 6. Comparison

| Area | `exports` | `module.exports` |
| --- | --- | --- |
| Role | Initial alias/reference | Actual value returned by `require()` |
| Safe use | Add properties: `exports.add = add` | Add properties or replace entirely |
| Reassignment | `exports = {...}` breaks the alias | `module.exports = {...}` exports the new value |

Compared with ESM, CJS uses runtime/synchronous `require()`, has `__dirname` and `__filename`, and does not provide top-level `await`.

## 7. Common Mistakes

- Writing `exports = { add }`; callers receive the unchanged `module.exports` instead.
- Expecting CJS top-level variables to be global.
- Doing heavy work during module initialization, which blocks on first `require()`.
- Forgetting that cache state is shared by all callers in the same process.
- Relying on a circular import to receive a fully initialized export.
- Building a custom loader with `eval()` for production; executing strings is unsafe and does not reproduce Node’s resolver, cache, or security model.

## 8. Production Considerations

- Use CJS when maintaining a CJS project or dependency ecosystem; prefer ESM for new code where the project standard allows it.
- Keep module initialization quick and free of surprising side effects.
- Export a small, intentional API and avoid mutable shared module state.
- Use explicit paths and test resolution from the actual execution directory.
- A custom loader is educational only. Use Node’s built-in loader; `node:vm` is not a security boundary for untrusted code.

## 9. Interview Questions

1. What does `require()` return?
2. Explain `exports` versus `module.exports`.
3. Why is `exports = value` usually wrong?
4. What is Node’s CJS wrapper function and what does it provide?
5. Why do repeated `require()` calls usually not re-run a module?
6. What can happen in a circular dependency?
7. How does CJS resolve a bare package specifier?

## 10. Memory Triggers

- **CJS = Call `require()` now.**
- **Official box:** `module.exports`.
- **Alias label:** `exports`; do not replace it.
- **Wrapper’s five:** `exports`, `require`, `module`, `__filename`, `__dirname`.
- **Cache:** loaded once, reused later.

## 11. Summary

CommonJS makes every Node file a private module. `require()` synchronously loads and caches it; `module.exports` is what callers receive. The most important rule is simple: add properties through `exports`, but replace a module only through `module.exports`.
