# Topic: CommonJS Module System in Node.js

- **Lecture:** Understanding CommonJS in Node.js | S4 Ep.2
- **Date:** 2026-06-06
- **Source:** [Youtube](https://youtu.be/S6y_4RhQNPY?si=V6pHYbzrwXx7prqu)
- **Area:** Node.js / Backend Development
- **Confidence after lecture (1–5):** 5
- **One-sentence summary:** CommonJS is the default module system in Node.js that enables code organization and reusability through `require` and `module.exports`.

## 1. What is this topic?

- **Definition:** CommonJS (CJS) is a module system that allows splitting code into separate, reusable files (modules).
- **Why it exists:** It prevents monolithic files, improves code readability, enhances maintainability, and allows developers to fix issues in isolated files.
- **Where it’s used:** Backend Node.js applications that haven't migrated to ES Modules (ESM).

## 2. Mental model & intuition

Think of a module as a **black box**. You define functionality (like a calculator) inside one box, expose specific parts using a "door" (`module.exports`), and bring those parts into your main file using an "access key" (`require`).

## 3. Internal working (mechanism)

When you use `require('./file')`:
1. **Resolution:** Node.js looks for the file path provided.
2. **Execution:** It loads the entire file and executes it synchronously (this blocks the main thread until finished).
3. **Return:** It returns the value of the `module.exports` object from that file.

## 4. Important terms & concepts

- **`module.exports`:** The actual object that `require` returns. You can assign functions, objects, or even primitives to it.
- **`require`:** A synchronous function used to import modules. It executes the file upon first import.
- **Destructuring:** Used to extract specific functions/variables from an exported object.

## 5. Example(s)

### Minimal Example (math.js):
javascript
const sum = (a, b) => a + b;
module.exports = { sum };

### Realistic Example (app.js):
javascript
const { sum } = require('./math');
console.log(sum(2, 3)); // Output: 5


## 6. Code / commands / API patterns

javascript
// Exporting multiple functions
module.exports = { sum, product };

// Importing with destructuring
const { sum, product } = require('./math');

- **Note:** `require` can also use files without extensions (e.g., `require('./math')` finds `math.js`).

## 7. Edge cases, gotchas, and failure modes

- **Gotcha:** `require` is synchronous; heavy files can block the event loop.
- **Failure:** `require` throws an error if the path is wrong or the module is missing.
- **Gotcha:** `module.exports` vs `exports` (next video topic).

## 8. Trade-offs and alternatives

- **Trade-offs:** Simple to use, but blocking synchronous nature is different from browser-based asynchronous imports.
- **Alternatives:** **ES Modules (ESM)** using `import`/`export`. Modern standard, supported in Node.js with `

type": "module"` in `package.json`.

## 9. Questions and doubts while learning

- **Question:** Can we export more than one value?
  - **Understanding:** You can export an object containing multiple properties/functions, which is the standard industry approach.
- **Question:** What happens if I require a file multiple times?
  - **Understanding:** Node.js caches the module after the first load.

## 10. Practice tasks from the lecture

- **Task:** Modularize an application
  - **Goal:** Move math utilities into a separate file and import them.

## 11. Key takeaways

- Node.js treats files as modules.
- `module.exports` is the key to sharing code.
- `require` runs the module code synchronously.
- Keep your code clean by modularizing related functions.

## 12. Minimal self-test

1. What is the return value of `require()`?
2. Does `require()` execute the module code synchronously or asynchronously?
3. How do you export multiple functions from a single module?
4. What happens if you try to `require` a file that doesn't exist?
5. Why should you use `module.exports` instead of just a single function export?
