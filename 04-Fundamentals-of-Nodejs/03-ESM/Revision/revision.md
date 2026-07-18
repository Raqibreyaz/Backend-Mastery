# ES Modules (ESM) — One-Shot Revision

## 1. One-line Definition

**ESM** is JavaScript’s standard module system, using static `import` and `export` declarations.

## 2. Why was it introduced?

It gives JavaScript one portable module format for browsers and Node.js, with analyzable dependency graphs and explicit exports.

## 3. Core Mental Model

ESM is a map drawn before execution: Node resolves and links the import graph first, then evaluates modules. Imports are live bindings, not copied values.

## 4. Internal Working

Node treats a file as ESM when it has an `.mjs` extension or is a `.js` file under a `package.json` with `"type": "module"`. Static imports are resolved before the body runs. ESM is strict mode, has module scope, and supports top-level `await`.

CJS wrapper globals are absent: `require`, `module`, `exports`, `__filename`, and `__dirname` are not defined by default.

## 5. Key APIs / Syntax

```js
// package.json
{ "type": "module" }

// math.js
export const add = (a, b) => a + b;
export default function subtract(a, b) { return a - b; }

// app.js
import subtract, { add } from './math.js';
const optionalModule = await import('./optional.js');
```

Relative imports need an extension: `./math.js`.

```js
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
```

- `import.meta.url`: current module URL, commonly `file://...` in Node.
- `import.meta.filename` / `.dirname`: convenient current-file paths in recent Node versions.
- `process.cwd()`: where Node was launched—not necessarily this module’s directory.
- `new URL('./data.json', import.meta.url)`: form a URL relative to this module.
- `path.resolve(...)`: joins filesystem path segments relative to the current working directory unless anchored.
- `import.meta.resolve(specifier)`: resolves a module specifier using ESM resolution and returns a URL string.

## 6. Comparison

| Need | Use | Result / base |
| --- | --- | --- |
| Build an OS filesystem path | `path.resolve('config', 'app.json')` | Path string; normally based on `process.cwd()` |
| Refer to a file beside this ESM module | `new URL('./data.json', import.meta.url)` | URL based on current module |
| Ask what an import specifier resolves to | `import.meta.resolve('package')` | URL via module-resolution rules |
| Get a filesystem path from a file URL | `fileURLToPath(url)` | OS path string |

ESM uses `import`/`export`, static linking, strict mode, and top-level `await`; CJS uses `require()`/`module.exports` and has wrapper globals.

## 7. Common Mistakes

- Omitting `.js` from a relative ESM import.
- Using `require()` or `__dirname` directly in an ESM file.
- Treating `process.cwd()` as the current module directory.
- Using `path.resolve()` to resolve a package specifier; it only handles filesystem paths.
- Treating URLs and path strings as interchangeable without `fileURLToPath()` / `pathToFileURL()`.
- Mixing default and named imports: `import value from` differs from `import { value } from`.

## 8. Production Considerations

- Make package mode explicit with `"type": "module"`; use `.cjs` or `.mjs` only for intentional mixed-mode boundaries.
- Build local resource paths from `import.meta.url`, not the working directory.
- Use `node:` for Node core modules.
- Use dynamic `import()` only when runtime/optional loading is truly needed; keep normal imports static for clarity and tooling.
- Check compatibility carefully when consuming or publishing CJS/ESM dual packages.

## 9. Interview Questions

1. How can Node recognize ESM?
2. What is the difference between named and default exports?
3. Why are relative file extensions required in Node ESM?
4. How do you replace `__dirname` and `__filename`?
5. What is the difference between `import.meta.url` and `process.cwd()`?
6. When should you use `path.resolve()` versus `import.meta.resolve()`?
7. What does static import linking mean?

## 10. Memory Triggers

- **ESM = Engine maps imports first.**
- **`type: module` or `.mjs`.**
- **Relative ESM = include `.js`.**
- **Current module = `import.meta.url`; current command folder = `cwd`.**
- **Paths for files; specifiers for imports.**

## 11. Summary

ESM is the modern standard module format. Enable it deliberately, use explicit import paths, distinguish file paths from module specifiers, and derive module-relative resources from `import.meta.url`.
