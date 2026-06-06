# Topic: Library vs CLI Packages & Local vs Global Packages

- Lecture: S4 Ep.16 - Library vs CLI Package & Local vs Global Package Explained
- Date: 2026-06-06
- Source: [Video Link](https://youtube.com/playlist?list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr&si=O1h2LVbJWOVTPgwd)
- Area: Tooling
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture explores the distinction between library and CLI packages in Node.js, and how to manage them locally versus globally.

## 1. What is this topic?

- **Definition**: Understanding how Node.js packages function—either as code libraries you import (`axios`) or command-line tools you execute (`vite`).
- **Why it exists**: It separates logic used for application runtime (libraries) from development utilities (CLI tools) and clarifies scope (local project vs. machine-wide availability).
- **Where it’s used**: Every Node.js project. You use library packages for dependencies and CLI packages for build/run tools.

## 2. Mental model & intuition

Think of a **Library** like an ingredient in a recipe (you import it into your code to build the dish). Think of a **CLI Package** like a kitchen appliance (you use it from the command line to process your ingredients, but it isn't "inside" the food).

## 3. Internal working (mechanism)

- **Library Packages**: Installed in `node_modules`. Accessed via `require()` or `import`. They do not usually require a `bin` folder.
- **CLI Packages**: Often contain a `bin` folder (13:42). When installed, they provide an executable that allows you to trigger processes (like starting a server) directly from the terminal.
- **Execution**: Local CLI tools must be run via `npx` (or scripts in `package.json`), while global tools can be run directly if the directory is in your system path.

## 4. Important terms & concepts

- **Library Package**: Code meant to be imported into your application.
- **CLI Package**: A package designed to be run as a command via terminal.
- **Local Package**: Installed inside a specific project’s `node_modules`.
- **Global Package**: Installed in a system-wide directory, accessible from any folder.
- **Dev Dependency**: Packages needed only during development (e.g., `vite`), installed with `-D`.

## 5. Example(s)

- **Library**: `axios`. Used by importing into `app.js` (0:40).
- **CLI**: `vite`. Executed via `npx vite` to serve an application (8:17).

## 6. Code / commands / API patterns

bash
npm install axios            # Install library
npm install -D vite          # Install as dev dependency
npm install -g vite          # Install globally
npx vite                     # Run local CLI
vite                         # Run global CLI (if in path)


- **Explanation**: `npm install` brings the package into the project. `-D` ensures it's categorized as a development dependency. `-g` makes the tool available globally on the OS.

## 7. Edge cases, gotchas, and failure modes

- **Gotcha**: Running `vite` locally without `npx` or a `package.json` script will result in "command not found" (6:13).
- **Failure Mode**: PowerShell execution policy may block global commands. Solve using `Set-ExecutionPolicy Unrestricted -Scope CurrentUser` (16:31).

## 8. Trade-offs and alternatives

- **Local CLI**: Better for project versioning (specific project uses specific version).
- **Global CLI**: Convenient, but can lead to version conflicts if multiple projects require different versions of the same tool.

## 9. Questions and doubts while learning

- **Question**: Why can some packages be both libraries and CLIs?
  - **Understanding**: Hybrid packages provide functional code for import and a binary for command-line tasks.

## 10. Practice tasks from the lecture

- **Task**: Installing/Uninstalling packages.
  - **Goal**: Observe the `node_modules` and `package.json` changes when adding/removing local vs. dev dependencies.

## 11. Key takeaways

- Library packages are for code integration; CLI packages are for terminal automation.
- Use `npx` to execute local CLI packages.
- Use `npm install -D` for development tools.
- Use `npm install -g` for tools you want to access globally.

## 12. Minimal self-test

1. What is the main difference between a library and a CLI package?
2. Why do we use `npx`?
3. How do you distinguish between a dependency and a dev dependency in `package.json`?
4. What happens to the `node_modules` folder when a CLI package is installed?
5. When should you use the `-g` flag?