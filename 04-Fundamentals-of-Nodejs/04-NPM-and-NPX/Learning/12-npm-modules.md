# Topic: NPM Modules in Node.js

- **Lecture:** NPM Modules in Node.js Explained | S4 Ep.12
- **Date:** 2026-06-06
- **Source:** [YouTube](https://youtu.be/eKHimjFp47E?si=VK1pU5F2Xn5MFIXT)
- **Area:** Framework / Tooling
- **Confidence after lecture (1–5):** 5
- **One-sentence summary:** This lecture explores the manual creation of local NPM modules, how Node.js resolves modules, and how to configure `package.json` for dual support of ESM and CommonJS.

## 1. What is this topic?

- **Definition:** An NPM module is essentially any folder containing code that resides inside a `node_modules` directory, allowing it to be imported by its folder name.
- **Why it exists:** It solves the problem of organizing reusable code and dependency management, abstracting file paths into package names.
- **Where it’s used:** Used in every Node.js project to manage third-party libraries and internal shared logic.

## 2. Mental model & intuition

Think of the `node_modules` folder as a "magic" search path. When you import a package by name (e.g., `import x from 'math'`), Node.js ignores your local file system and looks strictly inside `node_modules` for a folder named `math`. If it finds it, it looks for the entry point (usually `index.js` or defined in `package.json`).

## 3. Internal working (mechanism)

- **Key steps:**
  1. Node.js detects an import without a `./` path.
  2. It searches the local `node_modules` folder for the module name.
  3. It reads the `package.json` inside that module to identify the entry point (`main`, `module`, or `exports` fields).
  4. It resolves the file and executes the code.

## 4. Important terms & concepts

- **CommonJS (CJS):** The traditional module system using `require()` and `module.exports`.
- **ES Modules (ESM):** The modern standard using `import` and `export`.
- **`package.json` Fields:** 
  - `main`: Entry point for CJS.
  - `module`: Entry point for ESM.
  - `exports`: A mapping object that allows conditional exports based on whether the user imports via `require` or `import`.

## 5. Example(s)

- **Minimal:** A folder named `math` inside `node_modules` with an `index.js` exporting a constant.
- **Production-like:** A folder containing separate files for CJS (`.cjs`) and ESM (`.mjs`) defined in `package.json` via the `exports` object to ensure universal compatibility.

## 6. Code / commands / API patterns


// package.json configuration for dual support
{
  "name": "math",
  "version": "1.0.0",
  "exports": {
    "import": "./math.mjs",
    "require": "./math.cjs"
  }
}

- **Explanation:** This configuration tells Node.js exactly which file to serve based on the consumer's module system.

## 7. Edge cases, gotchas, and failure modes

- **Gotchas:** If you name your folder something generic like `math`, ensure no other library in `node_modules` conflicts with it.
- **Failure Modes:** `ERR_MODULE_NOT_FOUND` usually happens when the `package.json` entry point doesn't match the file name or location.

## 8. Trade-offs and alternatives

- **Trade-offs:** Managing local packages manually is good for learning, but `npm install` handles dependency resolution, versioning, and transitiveness, which is impossible to maintain manually at scale.

## 9. Questions and doubts while learning

- **Question:** Do I need `"type": "module"` in my local package?
  - **Understanding:** Not necessarily, if you use the `exports` map and specific file extensions like `.mjs` or `.cjs`, Node.js will respect the module type accordingly.

## 10. Practice tasks from the lecture

- **Task:** Create a local module folder, configure it with `package.json`, and import it into an `app.js` file using both `import` and `require`.

## 11. Key takeaways

- NPM modules are just folders in `node_modules`.
- Node.js resolves imports by looking for `package.json` inside the module folder.
- You can support both CJS and ESM by using an `exports` object in your `package.json`.

## 12. Minimal self-test

1. What does Node.js look for when you perform an import without a file path?
2. What is the purpose of the `exports` field in `package.json`?
3. How do you force Node.js to treat a file as an ES module without `"type": "module"`?
4. What is the difference between `main` and `module` fields in `package.json`?
5. Why should you avoid just relying on `"type": "module"` when building a library?