# Topic: Working with Environment Variables in Terminal

- Lecture: Working with Environment Variables in Terminal | Node.js Fundamentals Course | S3 Ep.8
- Date: 2026-06-06
- Source: https://youtube.com/playlist?list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr
- Area: OS / Language / Tooling
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture covers how to manage, manipulate, and access environment variables in various terminal environments and their role in Node.js applications.

## 1. What is this topic?

- Definition: Environment variables are dynamic values (key-value pairs) that affect the way running processes behave on a computer.
- Why it exists: They provide a way to pass configuration or secrets to an application without hardcoding them into the source code.
- Where it’s used: Storing API keys, database credentials, system paths, and debugging configuration flags across environments (development, production).

## 2. Mental model & intuition

Think of environment variables as a global "settings bag" that follows a process. When you start a program, it receives a copy of this bag. The parent process (like your terminal) passes its bag to the child process (like your Node.js script). You can modify what is in the bag before passing it on, or update the system settings globally.

## 3. Internal working (mechanism)

- Key steps:
  1. The parent process (e.g., Bash) defines the environment variables.
  2. When a child process (e.g., Node.js) is spawned, it inherits a copy of the parent's environment variables.
  3. Changes made within the child process do not affect the parent's environment.
  4. System-wide variables are stored in the registry (Windows) or system files, which can be modified via CLI tools or UI.
- Assumptions: Processes generally treat `process.env` as a read-only object for configuration, though it is technically mutable in Node.js.

## 4. Important terms & concepts

- Term: `env`
  - Definition: Command to print all environment variables in the current session.
- Term: `export`
  - Definition: Shell command to create or modify an environment variable for the current process.
- Term: `setx`
  - Definition: Windows command to set environment variables permanently in the registry.
- Term: `.env` file
  - Definition: A text file used by convention to store key-value pairs to be loaded into `process.env`.

## 5. Example(s)

- Minimal: Setting `VAR=value` before a command to set it only for that command's execution.
- Realistic: Using a `.env` file to store `DB_PASSWORD=secret123` so the code can access `process.env.DB_PASSWORD` securely.

## 6. Code / commands / API patterns

bash
# List all env variables
env

# Export a variable for the current session
export MY_VAR=hello

# Set a permanent variable in Windows
setx MY_VAR "value"

# Unset a variable in terminal
unset MY_VAR


javascript
// Loading .env files manually
const fs = require('fs');
const data = fs.readFileSync('.env', 'utf-8');
const variables = data.split('\n');
variables.forEach(line => {
  const [key, value] = line.split('=');
  process.env[key] = value;
});


## 7. Edge cases, gotchas, and failure modes

- Gotchas: `setx` does not update the current terminal session, only future ones.
- Common mistakes: Forgetting to handle character encoding/line endings (CRLF vs LF) when reading `.env` files manually, causing hidden characters in values.
- Failure modes: Hardcoding secrets in source control (git) instead of using `.env` files which should be in `.gitignore`.

## 8. Trade-offs and alternatives

- Alternatives:
  - Dotenv package: Simplifies reading `.env` files; best practice for most Node.js projects.
  - System-level configuration: Better for secrets that should not be in the project directory.

## 9. Questions and doubts while learning

- Question: Does a child process affect the parent's environment?
  - Answer: No, the child gets a copy. Modifications only persist in the child or if written to persistent storage (registry/file).

## 10. Practice tasks from the lecture

- Task: Implement a custom `.env` parser.
  - Goal: Understand how `process.env` is populated.
  - Approach: Use `fs` to read the file, split by newline, and parse key-value pairs.

## 11. Key takeaways

- Environment variables are key for decoupling configuration from code.
- Parent processes pass their environment to children via inheritance.
- Always add `.env` to `.gitignore` to prevent sensitive data leaks.
- Manual parsing of `.env` files is educational, but use established libraries like `dotenv` in production.

## 12. Minimal self-test

1. What is the difference between `export` and `setx`?
2. Why shouldn't you commit `.env` files to GitHub?
3. How do you pass an environment variable to a command just once?
4. What happens to the parent environment if a child process updates an environment variable?
5. Why do we need Regex when parsing `.env` files?