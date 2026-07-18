# Node.js Modules — One-Shot Revision

## 1. One-line Definition

A **module** is a self-contained unit of code—usually a file—that exposes selected values or behaviour for other files to use.

## 2. Why was it intrdddddddddddddddddddddddddddddddddddddddddddddddddoduced?

As JavaScript applications grew, putting everything in one global scope caused name collisions, tightly coupled code, and difficult maintenance. Modules give code private scope, clear public APIs, reuse, and dependency management.

## 3. Core Mental Model

Treat every module as a private room:

- Code inside the room is private by default.
- `export` / `module.exports` is the door through which the room exposes something.
- `import` / `require()` is how another room requests that exposed value.
- Use the global object only when truly necessary; shared globals make dependencies hidden and bugs harder to trace.

In Node.js, top-level variables in a CommonJS file are module-local, not properties of `global`. This differs from a classic browser script, where a top-level `var` can become a property of `window`.

## 4. Internal Working

### CommonJS (CJS)

Node wraps each CommonJS file roughly like this before it runs:

```js
(function (exports, require, module, __filename, __dirname) {
  // module source code
});
```

That wrapper creates per-file scope. `require()` resolves and evaluates a dependency when it is called, then returns the cached `module.exports` object on later requests. This synchronous model suited early server-side Node.js and remains common in legacy code.

### ECMAScript Modules (ESM)

ESM is the official JavaScript module standard, introduced in ES2015. Node first resolves and links the static `import` / `export` graph, then evaluates it. Imports are available before the module body runs and imported bindings are live read-only views of the exporter’s bindings.

ESM supports asynchronous module loading where required (for example, `import()` and top-level `await`). It is not best understood as simply “running on a separate thread”; JavaScript execution still normally runs on its event-loop thread.

## 5. Key APIs / Syntax

### CommonJS

```js
// math.cjs
const add = (a, b) => a + b;
module.exports = { add };

// app.cjs
const { add } = require('./math.cjs');
console.log(add(2, 3));
```

- Import: `require('specifier')`
- Export: `module.exports = value` or `exports.name = value`
- `exports` initially refers to `module.exports`; reassigning `exports = ...` does **not** change the exported value.
- `require()` can be called conditionally or dynamically.

### ECMAScript Modules

```js
// math.js (when package.json has "type": "module")
export const add = (a, b) => a + b;
export default function subtract(a, b) {
  return a - b;
}

// app.js
import subtract, { add } from './math.js';
console.log(add(2, 3), subtract(5, 2));
```

- Named export/import: `export const name = ...`, `import { name } from ...`
- Default export/import: `export default value`, `import value from ...`
- Dynamic import: `const module = await import('./math.js')`
- Local-file specifiers require their extension in Node ESM: `./math.js`, not `./math`.
- ESM is enabled by `.mjs`, or by `.js` files in a package whose `package.json` contains `{ "type": "module" }`.
- ESM is always strict mode and permits top-level `await`.

### Module types in Node.js

```js
import { add } from './math.js';       // user-defined module: relative path
import fs from 'node:fs/promises';     // core/native module: built into Node
import express from 'express';          // npm module: installed dependency
```

- **User-defined modules:** files written in the project; import with `./` or `../`.
- **Core/native modules:** built into Node, such as `fs`, `path`, and `crypto`; prefer the `node:` prefix for clarity.
- **NPM modules:** third-party packages installed with npm and recorded in `package.json` / lockfile.

## 6. Comparison

| Area | CommonJS | ESM |
| --- | --- | --- |
| Main syntax | `require`, `module.exports` | `import`, `export` |
| Loading style | Runtime, synchronous `require()` | Static linking before evaluation; async features supported |
| File choice | `.cjs`, or `.js` in a CommonJS package | `.mjs`, or `.js` with `"type": "module"` |
| Local import extension | Often resolved without extension | Extension required |
| Strict mode | Not automatic | Always enabled |
| Top-level `await` | Not supported | Supported |
| Top-level `this` | Usually `module.exports` | `undefined` |
| Exports | One exported value (often an object) | Named exports plus one optional default export |

JavaScript originally had no native module system. CommonJS filled that gap for Node.js; ESM is now the language standard shared by browsers and Node.js. Both continue to matter because many packages and applications use CJS.

## 7. Common Mistakes

- Expecting a top-level Node variable to be global; it is module-local.
- Polluting `global` to share data instead of importing an explicit dependency.
- In ESM, omitting `.js` from a relative import path.
- Using `import` in a `.js` file without making the package ESM, or using `require()` directly in an ESM file.
- Reassigning `exports` instead of `module.exports` in CJS.
- Mixing default and named exports/imports incorrectly.
- Assuming CJS and ESM interoperate identically; check a dependency’s documented export shape when crossing the boundary.
- Forgetting to install an npm package or add it to project dependencies.

## 8. Production Considerations

- Prefer ESM for new code when the project and its dependencies support it; follow the existing project convention when working in an established codebase.
- Be consistent: define the package mode deliberately with `"type"`, and use `.cjs` / `.mjs` only when a mixed setup is needed.
- Use explicit, small exports rather than a large global or catch-all utility object.
- Prefer `node:` for Node core imports to make provenance clear and avoid package-name confusion.
- Pin and audit npm dependencies; `node_modules` is generated, while `package.json` and the lockfile record the reproducible dependency graph.
- Avoid circular dependencies. They can expose partially initialized CJS exports and create confusing ESM initialization failures.
- Use `import()` for optional or expensive ESM dependencies when lazy loading genuinely improves startup or memory use.

## 9. Interview Questions

1. What problem does a module system solve?
2. Why are top-level variables in a Node CommonJS file not global?
3. What is the difference between `exports` and `module.exports`?
4. Compare `require()` with static `import`.
5. How do you make Node treat `.js` files as ESM?
6. Why must relative ESM imports include their file extension in Node?
7. What are named exports and default exports?
8. What is top-level `await`, and which module system supports it?
9. What are user-defined, core, and npm modules? Give one example of each.
10. Why is `node:fs` preferable to `fs` in modern Node code?
11. What problems can circular dependencies cause?
12. Can CJS and ESM coexist in one project? How?

## 10. Memory Triggers

- **Room:** each module has private scope.
- **Door:** export exposes; import/require consumes.
- **CJS = Call `require()` now:** runtime and synchronous.
- **ESM = Engine maps imports first:** static module graph before evaluation.
- **`.cjs` / `.mjs`:** explicit file-level choice; `"type"` controls `.js`.
- **ESM needs `./file.js`:** extension is part of the specifier.
- **Three sources:** `./mine`, `node:built-in`, `package-name`.

## 11. Summary

Modules make Node.js code private, reusable, and maintainable. Node supports legacy CommonJS (`require`, `module.exports`) and standard ESM (`import`, `export`). Know the package mode, use correct local paths and export syntax, avoid globals and circular dependencies, and distinguish code you write from Node core modules and installed npm packages.
