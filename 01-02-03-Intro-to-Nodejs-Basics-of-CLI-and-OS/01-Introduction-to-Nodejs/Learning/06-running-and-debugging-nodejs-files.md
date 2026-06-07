# Topic: Running and Debugging Node.js Files

- Lecture: S1 Ep.6 - How to Properly Run and Debug Node.js Files
- Date: 2026-06-07
- Source: [Youtube Link](https://www.youtube.com/watch?v=uuZT57qY3t0&list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr&index=8)
- Area: Tooling / Node.js
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture covers the fundamental workflow for running Node.js scripts, managing file paths, using the built-in VS Code debugger, and understanding the Global object.

## 1. What is this topic?

- Definition: The process of executing JavaScript code in a Node.js runtime environment outside of a browser.
- Why it exists: Traditional browser JavaScript cannot directly interact with the host operating system's file system or OS resources, whereas Node.js provides a backend environment to perform these system-level tasks.
- Where it’s used: Backend development, automation scripts, and server-side application logic.

## 2. Mental model & intuition

Think of the browser as a sandbox—it's designed to keep your computer safe by preventing code from touching your files. Node.js is like taking that same JavaScript language and giving it 'superpowers' (access to the OS), effectively letting it read, write, and manage your local machine.

## 3. Internal working (mechanism)

- Key steps:
  1. Define the file system (fs) module using `require`.
  2. Use synchronous methods like `readFileSync` to read file content into memory.
  3. Convert binary data (Buffers) into human-readable strings using `.toString()`.
- Data flow: Code → Node Runtime → OS File System → Buffer Data → String Output.
- Assumptions: The design assumes the environment has file access permissions and that the file path is correctly formatted for the OS.

## 4. Important terms & concepts

- Node.js Runtime: The environment that allows JS execution on a machine.
- Buffer: A raw memory area representing binary data; how Node reads files before they are converted to text.
- F5 Debugger: A VS Code utility that lets you step through code, inspect variables, and set breakpoints.
- Global Object: The Node.js equivalent of the browser's `window` object, serving as the top-level scope.

## 5. Example(s)

- Toy Example: Using `fs.readFileSync` to read a local text file and printing its contents to the console.
- Production Example: Building a backend utility that reads configuration files or processes local logs to perform system automation.

## 6. Code / commands / API patterns

js
const fs = require('fs');
const text = fs.readFileSync('./text.txt', 'utf-8');
console.log(text.toString());

- Explanation: Imports the file system module, reads a specific file synchronously, and prints its contents as a string.

js
console.log(global);

- Explanation: Logs the entire global object in Node.js, showing all available properties and methods accessible in the execution context.

## 7. Edge cases, gotchas, and failure modes

- Edge cases: File path errors (missing files or invalid paths).
- Gotchas: Windows paths use backslashes (`\`), which are escape characters in JavaScript; therefore, use double backslashes (`\\`) in strings.
- Common mistakes: Forgetting to call `.toString()` on a Buffer, resulting in strange binary output instead of the file text.
- Failure modes: Incompatibility between browser-only code (e.g., using `window`) and Node-only code (e.g., using `global`).

## 8. Trade-offs and alternatives

- Performance: `readFileSync` is blocking (stops execution until file is read), which is simple for scripts but bad for high-traffic servers.
- Alternatives: `fs.readFile` (asynchronous) is preferred for production servers to prevent blocking the event loop.

## 9. Questions and doubts while learning

- Question: How does `global` differ from `window`?
  - Understanding: `window` is for browsers (contains DOM methods); `global` is for Node (contains OS/Node specific methods).
- Question: Why use `readFileSync` instead of `fs.readFile`?
  - Understanding: `readFileSync` is easier for beginners and simple CLI scripts; `readFile` is necessary for non-blocking I/O.

## 10. Practice tasks from the lecture

- Task: Setup Debugging
  - Goal: Create a `launch.json` file to enable F5 debugging.
  - What it teaches: How to automate development workflows and inspect program state effectively.

## 11. Key takeaways

- Node.js allows JS to access the file system, unlike browsers.
- Always convert Buffer data to strings when reading text files.
- Use `launch.json` and F5 in VS Code for efficient debugging.
- Use `global` or `globalThis` instead of `window` in Node.js.

## 12. Minimal self-test

1. What is the purpose of the 'fs' module in Node.js?
2. Why do we see 'Buffer' data instead of text when reading a file?
3. How do you handle file paths in Windows for JavaScript strings?
4. What is the difference between `readFileSync` and `readFile`?
5. Where do you find global variables in a Node.js environment?

## 13. Links to related materials

- Course Curriculum: https://procodrr.com/nodejs/
- Full Playlist: https://youtube.com/playlist?list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr
