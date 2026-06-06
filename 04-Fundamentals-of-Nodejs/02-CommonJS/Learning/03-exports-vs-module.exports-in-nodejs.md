# Topic: exports vs module.exports in Common.js

- Lecture: S4 Ep.3 | exports vs module.exports in Common.js
- Date: 2026-06-06
- Source: [Video Link](https://www.youtube.com/watch?v=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr)
- Area: Language / Node.js
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture explains the internal relationship between `exports` and `module.exports` and why incorrectly overwriting `exports` breaks modularity in Node.js.

## 1. What is this topic?

- **Definition**: The mechanism used in Common.js (Node.js) to expose functions, objects, or variables from one file to another via the `require()` function.
- **Why it exists**: It provides a way to encapsulate code within a module and selectively expose functionality, solving the problem of global scope pollution.
- **Where it’s used**: In every Node.js application using the Common.js module system.

## 2. Mental model & intuition

Think of `module.exports` as the "Official Box" that Node.js sends to whoever `require`s your file. `exports` is just a **shortcut (alias)** or a temporary label pointing to that same box. If you add things to the box (e.g., `exports.sum = ...`), both labels point to the same content. If you take the `exports` label and stick it onto a *completely different box* (reassigning it with `=`), the "Official Box" (`module.exports`) remains empty, and your code fails to export anything.

## 3. Internal working (mechanism)

1. Node.js creates a `module` object for every file.
2. Inside, `module.exports` is initialized as an empty object `{}`.
3. A variable `exports` is created: `let exports = module.exports;`.
4. When you do `require()`, Node.js returns the value of `module.exports` at the end of the file execution.
5. If you reassign `exports = someValue`, you break the reference to the original `module.exports` object.

## 4. Important terms & concepts

- **`module.exports`**: The object that is actually returned by the `require()` function.
- **`exports`**: A shorthand variable referencing `module.exports`.
- **Reference vs. Value**: Understanding that these variables point to memory addresses (references), not static values.

## 5. Example(s)

- **Minimal (Working)**:
  `exports.add = (a, b) => a + b;` // Modifies the object both point to.

- **Production-like (Broken)**:
  `exports = { add: (a, b) => a + b };` // Overwrites the `exports` variable; `module.exports` stays empty.

## 6. Code / commands / API patterns

javascript
// Correct approach 1: Adding properties
exports.sum = (a, b) => a + b;

// Correct approach 2: Overwriting the whole module
module.exports = { sum: (a, b) => a + b };

// INCORRECT approach:
exports = { sum: (a, b) => a + b }; // This exports nothing!


## 7. Edge cases, gotchas, and failure modes

- **Gotcha**: Reassigning `exports` with the `=` operator.
- **Failure mode**: `TypeError: ... is not a function` when calling a required module because the returned object is just an empty `{}`.
- **Detection**: Check `console.log(module.exports)` in the source file.

## 8. Trade-offs and alternatives

- **Trade-offs**: Simple syntax vs. potential for reference-breaking bugs.
- **Alternative**: ES Modules (`export`/`import`) which behave differently and don't have this specific `exports` alias confusion.

## 9. Questions and doubts while learning

- **Question**: Does `require()` ever look at the `exports` variable?
  - **Understanding**: No, it strictly returns the final state of `module.exports`.

## 10. Practice tasks from the lecture

- **Task**: Debugging exports.
  - **Goal**: Create two files, `math.js` and `app.js`, and try exporting functions using both valid and invalid assignment patterns to observe the output.

## 11. Key takeaways

- `exports` is just a reference to `module.exports`.
- Never reassign `exports` (e.g., `exports = ...`).
- Always modify `exports` by adding properties (e.g., `exports.name = ...`).
- Use `module.exports` if you need to export a single object, class, or function directly.

## 12. Minimal self-test

1. What is the difference between `exports` and `module.exports`?
2. What happens if you reassign `exports = {}`?
3. What does `require()` actually return?
4. Why is `exports` provided if it can lead to bugs?
5. How can you export a single class using Common.js?

## 13. Links to related materials

- Course Curriculum: [ProCodrr Node.js](https://procodrr.com/nodejs/)