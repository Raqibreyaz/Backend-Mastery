# Topic: Node.js Module Systems

- Lecture: Node.js Module System Explained – CommonJS vs ESM
- Date: 2026-06-06
- Source: [Video Link](https://youtu.be/n5KFI8FUMjk?si=gszjEyDaaKI6Hltd)
- Area: Framework / Language
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture introduces the two primary module systems in Node.js (CommonJS and ESM) and explores scoping differences between browsers and Node.js.

## 1. What is this topic?

- Definition: A module system is the mechanism used to import and export code between files in JavaScript.
- Why it exists: To organize code into reusable pieces and manage dependencies without polluting the global namespace.
- Where it’s used: In every professional Node.js application to structure backend services.

## 2. Mental model & intuition

Think of a module system as a "gatekeeper" for your code. In the browser, variables declared at the top level often land in a shared "global room" (the `window` object). In Node.js, every file is its own "private room." You cannot see what’s inside another room unless the owner explicitly exports it and you import it.

## 3. Internal working (mechanism)

- Key steps:
  1. Node.js treats every `.js` file as a module.
  2. When a file is executed, it is wrapped in a function scope, making top-level variables local to that file.
  3. This prevents variables from leaking into the `global` scope.
- Data flow: Variables defined via `var`, `let`, or `const` at the top level of an `app.js` file do not appear in the `global` object in Node.js, unlike in the browser.

## 4. Important terms & concepts

- **CommonJS (CJS):** The original module system for Node.js using `require()` and `module.exports`.
- **ESM (ES6 Modules):** The official ECMAScript standard using `import` and `export` syntax.
- **Global Scope:** The shared space accessible by all code; browser code often defaults to this, while Node.js protects it.
- **Local Scope:** The private space restricted to a specific module.

## 5. Example(s)

- **Browser behavior:** Defining `var num = 45;` at the top level attaches it to the `window` object.
- **Node.js behavior:** Defining `var num = 45;` at the top level makes it local to the file. It is *not* accessible via `global.num`.

## 6. Code / commands / API patterns

javascript
// Testing for global scope
var num = 45;
console.log(num); // Prints 45

// To force a global variable in Node.js (Not Recommended):
global.num2 = 67;

- The lecture demonstrates using a debugger in VS Code to inspect the `Scope` tab, showing that `num` exists in `Local` scope, not `Global` scope.

## 7. Edge cases, gotchas, and failure modes

- **Gotcha:** Manually attaching variables to the `global` object (e.g., `global.myVar = x`) is a bad practice. It leads to unpredictable bugs and makes the code difficult to trace.
- **Common mistake:** Expecting `var` to define a global variable in Node.js as it does in a browser script.

## 8. Trade-offs and alternatives

- **CommonJS:** Synchronous, older, standard in legacy Node.js.
- **ESM:** Asynchronous, modern standard, becoming the default in the ecosystem.

## 9. Questions and doubts while learning

- Question: Why are there two module systems?
  - Current understanding: CommonJS came first for server-side modularity; ESM was later standardized by the JS committee. Node.js now supports both for backward compatibility.

## 10. Practice tasks from the lecture

- Task: Create a truly global variable.
  - Goal: Discover how to properly handle global scope (to be solved in next lecture).
  - Approach: Attempt to find a way to attach variables globally without directly using `global.`.

## 11. Key takeaways

- Node.js encapsulates code in local modules by default.
- Browsers and Node.js handle top-level variables differently.
- The `Scope` tab in the debugger is the best tool for visualizing where variables live.
- Don't pollute the `global` namespace.

## 12. Minimal self-test

1. What is the main difference between browser global scope and Node.js module scope?
2. How do you inspect variable scope using the Node.js debugger?
3. Why shouldn't you attach variables to the `global` object?
4. What are the two module systems Node.js supports?
