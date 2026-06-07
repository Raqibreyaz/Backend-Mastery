# Topic: Accessing `__filename` and `__dirname` in ES6 Modules

- Lecture: Accessing filename and dirname in ES6 Modules | S4 Ep.8
- Date: 2026-06-06
- Source: [Video Link](https://youtu.be/RWiXLtGnw54?si=M0_xdo3x6-7JPSBr)
- Area: Node.js / Language
- Confidence after lecture (1–5): 5
- One-sentence summary: Learn how to access file and directory paths in ES6 modules using `import.meta.url` since `__filename` and `__dirname` are not globally available.

## 1. What is this topic?

- **Definition**: Accessing the absolute path of the current file and its parent directory in a Node.js ES6 module environment.
- **Why it exists**: In CommonJS, `__filename` and `__dirname` are global variables. In ES6 Modules (`type: "module"`), these globals do not exist by default.
- **Where it’s used**: When performing file I/O operations (like reading local JSON files) or needing relative paths in a project.

## 2. Mental model & intuition

Think of `import.meta` as a "metadata bag" attached to every module. While CommonJS injects magic global variables, ES6 Modules favor explicit, scoped access. You get an object called `import.meta` that contains info about how your module was loaded. You can extract the path from it, similar to how you would access properties of an object.

## 3. Internal working (mechanism)

- **Key steps**:
  1. `import.meta` is a special object available only inside ES6 modules.
  2. It contains a `url` property representing the file path using the `file://` protocol.
  3. In newer Node.js versions, it also exposes `import.meta.filename` and `import.meta.dirname` directly.
- **Data flow**: Node.js populates the `import.meta` object upon module execution. Developers destructure this object to get the required path strings.

## 4. Important terms & concepts

- **`import.meta`**: An object containing metadata about the current module.
- **`file://` protocol**: The format Node.js uses to represent paths in ES6 modules (as opposed to standard OS path strings).
- **`process.cwd()`**: Returns the Current Working Directory of the process, which is where you ran the `node` command from, not where the file resides.

## 5. Example(s)

- **Modern Approach (Node v20+)**:
  js
  // Destructuring for clean access
  const { filename, dirname } = import.meta;
  console.log(filename, dirname);
  

## 6. Code / commands / API patterns

js
// Accessing via destructuring
const { filename, dirname } = import.meta;
console.log("File Path:", filename);
console.log("Dir Path:", dirname);


- **Explanation**: This accesses the absolute file and directory path directly from the module's metadata object.

## 7. Edge cases, gotchas, and failure modes

- **Gotcha**: Do not use `process.cwd()` to find file locations. If you run `node section4/app.js` from the root folder, `process.cwd()` will return the root, not the `section4` folder.
- **Failure**: Using `import.meta` outside of a module (e.g., in the Node REPL or a CJS file) will result in a Syntax Error.

## 8. Trade-offs and alternatives

- **Trade-off**: The modern `import.meta` approach is cleaner but requires Node.js v20+ for the most convenient `filename`/`dirname` properties.
- **Alternative**: Using `url` module utilities (`fileURLToPath`) is the standard practice for older Node.js versions.

## 9. Questions and doubts while learning

- **Question**: Can I add my own properties to `import.meta`?
  - **Understanding**: Yes, it is an object. You can attach custom data, though it's generally discouraged to keep modules clean.

## 10. Key takeaways

- ES6 modules lack `__filename` and `__dirname` globals.
- Use `import.meta` as the source for module metadata.
- Avoid `process.cwd()` for file path resolution; it is relative to the execution command, not the file location.

## 11. Minimal self-test

1. Why can't we use `__dirname` in ES6 modules?
2. What does `import.meta` contain by default?
3. How does `process.cwd()` differ from `import.meta.dirname`?
4. What protocol is used by `import.meta.url`?
5. Why is `process.chdir()` dangerous when relying on `process.cwd()`?