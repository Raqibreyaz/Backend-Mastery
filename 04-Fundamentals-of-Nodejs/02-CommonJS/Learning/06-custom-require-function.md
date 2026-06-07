# Topic: Building a Custom `require()` Function in Node.js

- Lecture: Build Your Own require() Function in Node.js from Scratch! 🚀 | Custom Module System | S4 Ep.6
- Date: 2026-06-06
- Source: [Video Link](https://youtu.be/4rdGtseITWg?si=W527AnHeFdCn0Djg)
- Area: Language (Node.js)
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture demonstrates how to implement a custom module loader in Node.js by reading file contents and executing them within a wrapped scope using `eval` or the `vm` module.

## 1. What is this topic?

- **Definition**: Creating a user-defined function (e.g., `loadModule`) that replicates the functionality of Node.js's built-in `require()` system.
- **Why it exists**: To understand the underlying module system architecture, how Node.js handles file execution, and how scoping works behind the scenes.
- **Where it’s used**: Conceptual learning for understanding Node.js internals (not for use in production environments).

## 2. Mental model & intuition

Imagine you have a file as a string. To run it as a module, you don't just execute it; you wrap it in a function so it has its own private scope. By controlling what variables (like `exports` or `module`) are passed to that function, you control what the module can see and what it can export back to the caller.

## 3. Internal working (mechanism)

1. **Read**: Use the `fs` module to read the target file path into a string (Buffer).
2. **Wrap**: Place the code string inside a wrapper function (IIFE - Immediately Invoked Function Expression).
3. **Execute**: Use `eval()` or the `vm` module to run the string as JavaScript code within the desired context.
4. **Bridge**: Inject dependencies (like a custom `exports` object) into the wrapper so the module can attach data to it.
5. **Return**: The custom loader returns the modified `exports` object to the user.

## 4. Important terms & concepts

- **IIFE (Immediately Invoked Function Expression)**: A function that runs as soon as it is defined; used here to create a new scope for the module code.
- **`eval()`**: A function that evaluates a string as JavaScript code; used in the basic implementation.
- **`vm` module**: A core Node.js module used to run code in a specific context (V8 virtual machine), which is more secure than `eval()`.
- **Context/Scope**: The environment in which code executes. The custom loader creates a new context for each module.

## 5. Example(s)

- **Toy Example**: A custom function that reads a file, wraps it in `(function(exports) { ... })()`, and executes it.
- **Production-like (conceptual)**: Using `vm.runInNewContext` to pass specific variables (`console`, `require`, `exports`) into the execution sandbox, simulating the real Node.js `require` isolation.

## 6. Code / commands / API patterns

js
// Basic implementation using eval
const fs = require('fs');

function loadModule(path) {
  const fileContent = fs.readFileSync(path).toString();
  const customExports = {};
  
  // Wrapping and evaluating
  eval(`(function(exports) { ${fileContent} })(customExports)`);
  
  return customExports;
}


*   **Explanation**: This reads the file, passes an empty `customExports` object to the wrapper function, and returns it after the module modifies it.

## 7. Edge cases, gotchas, and failure modes

- **Edge cases**: Files missing `.js` extensions, relative paths vs. absolute paths.
- **Gotchas**: `eval()` does not work as expected in `strict mode`. Using `vm` creates an isolated scope where standard globals (like `console`) might not exist unless explicitly passed.
- **Common mistakes**: Forgetting to convert `fs.readFileSync` (a Buffer) to a string using `.toString()`.
- **Failure modes**: Malicious code execution if `eval()` is used on user-provided strings; crashes if the target file contains syntax errors.

## 8. Trade-offs and alternatives

- **Trade-offs**: Implementing your own is high complexity and insecure; native `require` is highly optimized and secure.
- **Alternatives**: Using native `require()` (standard), or ESM `import` statements.

## 9. Questions and doubts while learning

- **Question**: Why does the native system use `vm` instead of `eval`?
  - **Understanding**: `eval` runs in the current scope and is a massive security risk. `vm` provides a sandbox for code execution.

## 10. Practice tasks from the lecture

- **Task**: Extend `loadModule` to handle file extensions automatically.
  - **Goal**: Implement logic that appends `.js` if the file doesn't have it.

## 11. Key takeaways

- Modules in Node.js are just files wrapped in function expressions.
- We can manually manipulate this by reading files, wrapping them in functions, and injecting an `exports` object.
- `vm` module is the proper tool for creating isolated execution environments (sandboxes).

## 12. Minimal self-test

1. How do you transform a Buffer into code for execution?
2. Why do we wrap modules in an IIFE?
3. What is the security difference between `eval` and `vm`?
4. How does a module communicate back to the `require` function?
5. What happens to the local variables of a module once the wrapping function finishes execution?

## 13. Links to related materials

- Related: Node.js Core Modules (fs, vm)
- Context: Advanced JavaScript (IIFE concepts)