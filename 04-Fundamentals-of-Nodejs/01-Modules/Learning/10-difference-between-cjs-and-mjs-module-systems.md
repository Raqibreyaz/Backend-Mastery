# Topic: Difference Between CJS (CommonJS) and MJS (ES6 Modules)

- **Lecture:** S4 Ep.10 - Difference Between CJS and MJS Module Systems
- **Date:** 2026-06-06
- **Source:** [Youtube](https://youtu.be/KAtoJTcf0MI?si=RAqcknSKUbK9JUay)
- **Area:** Language (Node.js/JavaScript)
- **Confidence after lecture (1–5):** 5
- **One-sentence summary:** This lecture compares the legacy synchronous CommonJS (CJS) module system with the modern asynchronous ES6 (MJS) module system in Node.js.

## 1. What is this topic?

- **Definition:** CJS and MJS are two different module systems in Node.js that dictate how files import and export code.
- **Why it exists:** CJS is the historical default for Node.js. ES6 Modules (MJS) are the modern, standard way for JavaScript to handle modules, offering better performance and asynchronous loading.
- **Where it’s used:** Backend Node.js applications; migrating from legacy codebases to modern standards.

## 2. Mental model & intuition

Think of **CJS** as a "synchronous librarian": the librarian stops everything to go fetch a book from the shelf, blocking the line until it's back. Think of **MJS** as a "modern logistics center": it offloads the request to a background worker and doesn't stop the main line until it actually needs to process the finished product.

## 3. Internal working (mechanism)

- **CJS (CommonJS):**
    1. Loads files **synchronously** (blocks the main thread).
    2. Uses `require()` for imports and `module.exports` for exports.
    3. The file extension is optional.
- **MJS (ES6 Modules):**
    1. Loads files **asynchronously** (uses separate threads for I/O).
    2. Uses `import` and `export` keywords.
    3. Mandatory file extensions; requires `"type": "module"` in `package.json`.
    4. **Hoisting:** `import` statements are processed during the Memory Creation Phase.

## 4. Important terms & concepts

- **Hoisting:** In MJS, `import` statements are moved to the top of the execution flow during the memory creation phase.
- **Top-level Await:** The ability to use `await` in MJS without being inside an `async` function (not possible in CJS).
- **Strict Mode:** MJS is always in `strict mode`; CJS is not by default.
- **Named vs. Default Exports:** MJS allows multiple named exports (granular control) vs. CJS which typically exports one object.

## 5. Example(s)

- **Minimal (CJS):** `const myModule = require('./file.js');`
- **Minimal (MJS):** `import myModule from './file.js';`
- **Production-like:** Using MJS to import multiple named functions from a utility file to keep the namespace clean.

## 6. Code / commands / API patterns

- **Set MJS in `package.json`:**
  
  { "type": "module" }
  
- **Import/Export:**
  javascript
  // MJS
  export const myVar = 10;
  import { myVar } from './file.js';
  

## 7. Edge cases, gotchas, and failure modes

- **Gotcha:** `this` keyword refers to `module.exports` in CJS, but is `undefined` in MJS.
- **Common Mistake:** Forgetting file extensions in MJS, which will crash the application.
- **Failure Mode:** Mixing `require` and `import` in the same environment without proper configuration can lead to runtime errors.

## 8. Trade-offs and alternatives

- **CJS:** Stable, legacy support, easier for small scripts; but synchronous (blocking).
- **MJS:** Modern, faster for large apps due to async loading, strictly enforced; but requires migration effort.

## 9. Questions and doubts while learning

- **Question:** Can I use both in one project?
  - **Understanding:** Yes, by using different extensions (.cjs and .mjs) or configuring `package.json`.

## 10. Practice tasks

- **Task:** Convert an existing CJS module to MJS.
  - **Goal:** Practice replacing `require` with `import` and handling default/named exports.

## 11. Key takeaways

- MJS is asynchronous (non-blocking).
- File extensions are mandatory in MJS.
- `import` is hoisted; `require` is not.
- Top-level `await` is only available in MJS.

## 12. Minimal self-test

1. What is the main performance difference between CJS and MJS loading?
2. Does `require` support hoisting?
3. What is the value of `this` in MJS vs CJS?
4. What flag is needed in `package.json` to enable MJS?
5. Can you use top-level `await` in CJS?

## 13. Links to related materials

- [ProCodrr Node.js Course](https://procodrr.com/nodejs/)