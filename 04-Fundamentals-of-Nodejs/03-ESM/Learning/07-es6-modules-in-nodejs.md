# Topic: ES6 Modules in Node.js

- Lecture: ES6 Modules in Node.js – The Modern Way to Import & Export! | S4 Ep.7
- Date: 2026-06-06
- Source: [Video Link](https://youtu.be/GhXtWbygdyg?si=JIXPalrCWkgT5oLO)
- Area: Language (JavaScript/Node.js)
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture explains how to implement and use ES6 native module syntax (`import`/`export`) in Node.js by configuring `package.json`.

## 1. What is this topic?

- Definition: A standardized module system (ECMAScript Modules) that uses `import` and `export` keywords.
- Why it exists: To provide a native, standard way for JavaScript files to share code across environments (browsers and Node.js), replacing the older CommonJS `require()` system.
- Where it’s used: Modern web development, including React, Vue, and modern Node.js backends.

## 2. Mental model & intuition

Think of modules as separate "islands" of code. In older Node.js (CommonJS), you had to use a bridge (`require`) to bring things from one island to another. With ES6 modules, you are using the official, built-in shipping lanes of the JavaScript language. By setting `"type": "module"` in `package.json`, you are telling the Node.js engine to treat all files as ES6 modules, which changes the internal environment (e.g., enabling strict mode by default and creating a dedicated module scope).

## 3. Internal working (mechanism)

- Key steps:
  1. Node.js checks `package.json` for `"type": "module"`.
  2. If present, it enables the ES6 module loader.
  3. Each file runs in its own "Module Scope" (no global access for local variables).
  4. Strict mode is enforced automatically.
- Data flow: Imports are resolved at the module level; dependencies are loaded/linked by the engine.
- Assumptions: It assumes files are strictly defined as modules, meaning `require`, `__dirname`, and `__filename` are unavailable.

## 4. Important terms & concepts

- **Named Export**: Exporting specific variables or functions using `export`. Needs `import { name }` syntax.
- **Default Export**: Exporting one primary value using `export default`. Imported without curly braces.
- **Module Scope**: Variables inside an ES6 module do not pollute the global scope.
- **Strict Mode**: Automatically enabled in ES6 modules; it prevents unsafe practices like undeclared variables.

## 5. Example(s)

- Conceptual: `export const a = 10;` vs `export default 5;`
- Production: `import { helper } from './utils.js';` followed by using `helper()` in the main logic.

## 6. Code / commands / API patterns


// package.json
{
  "type": "module"
}

- Purpose: Sets the project to use ES6 modules globally.

javascript
// Exporting
export const num = 5;
export default num;

// Importing
import num, { num as n } from './math.js';

- Explanation: Shows how to mix default and named exports.

## 7. Edge cases, gotchas, and failure modes

- Gotchas: `require()` does not work in ES6 modules. `__dirname` and `__filename` are undefined.
- Common mistakes: Forgetting to add `.js` extensions in import paths; failing to set `"type": "module"` in `package.json`.
- Failure modes: If you try to import using relative paths without the file extension, the code will throw an error.

## 8. Trade-offs and alternatives

- Trade-offs: ES6 modules require more explicit configuration but offer standard performance and tooling compatibility.
- Alternatives: CommonJS (`require`/`module.exports`) is the legacy alternative, better for older projects or CJS-only environments.

## 9. Questions and doubts while learning

- Question: How do I get `__dirname` if it's gone?
  - Current understanding: It's replaced by other mechanisms (to be covered in next lecture).

## 10. Practice tasks from the lecture

- Task: Enable ES6 modules in a new project.
  - Goal: Practice `import`/`export` syntax and verify the `package.json` requirement.

## 11. Key takeaways

- Use `"type": "module"` in `package.json` to enable ES6 modules.
- `import` and `export` are the new standards.
- ES6 modules enforce strict mode and module-level scoping.
- File extensions (like `.js`) are mandatory in imports.

## 12. Minimal self-test

1. How do you enable ES6 modules in Node.js?
2. What happens to `require()` when you switch to ES6 modules?
3. What is the difference between a default and a named export?
4. Why do you need to add the `.js` extension to your imports?
5. Is strict mode enabled by default in ES6 modules?

## 13. Links to related materials

- ES6 Concepts Playlist: https://www.youtube.com/playlist?list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr
- Node.js Course: https://procodrr.com/nodejs/