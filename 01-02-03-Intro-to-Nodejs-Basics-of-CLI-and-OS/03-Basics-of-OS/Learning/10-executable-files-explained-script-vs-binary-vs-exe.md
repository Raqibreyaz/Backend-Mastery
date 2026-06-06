# Topic: Executable Files: Script vs Binary

- Lecture: Executable Files Explained: Script vs Binary, and EXE | Node.js Fundamentals Course | S3 Ep.11
- Date: 2026-06-06
- Source: https://youtube.com/playlist?list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr
- Area: OS / Tooling
- Confidence after lecture (1–5): 5
- One-sentence summary: An exploration of how operating systems execute files, differentiating between text-based scripts and compiled binary executables.

## 1. What is this topic?

- Definition: An executable file is a file that contains instructions capable of being executed by the operating system.
- Why it exists: To allow users and the OS to run programs, commands, or scripts by calling the file path directly.
- Where it’s used: Everywhere in computing; from system commands (ls, node) to user-created applications and batch/shell scripts.

## 2. Mental model & intuition

Think of a terminal as a waiter. When you type a command, the waiter looks for an item on the menu (the PATH). 
- A **Script** is like a handwritten recipe (text file) that the waiter reads line-by-line to perform tasks.
- A **Binary** is like a pre-cooked meal (machine code); the waiter doesn't need to read a recipe, they just serve it, and it runs immediately.

## 3. Internal working (mechanism)

- Key steps:
  1. The user provides a path to the file (e.g., `./file.txt`).
  2. The OS checks the file's permission flags (the 'x' or executable bit).
  3. If it's a script, the OS passes the content to an interpreter (like Bash).
  4. If it's a binary, the OS loads the machine code directly into memory to execute.
- Data flow: The terminal shell interprets user input, resolves the file path, checks permissions, and triggers the process.
- Assumptions: The OS assumes that if a file is marked executable, it contains valid instructions for the environment.

## 4. Important terms & concepts

- **Script File:** A text file containing human-readable commands. Executed by an interpreter.
- **Binary File:** A non-text file containing zeros and ones (compiled machine code). Directly executable.
- **Executable Permission (x):** A filesystem flag required on Unix-like systems to allow a file to be run as a program.
- **PATH Variable:** An environment variable defining directories where the OS looks for executables.

## 5. Example(s)

- **Minimal:** A text file `hello.txt` containing `ls`. Running `./hello.txt` in Bash triggers `ls`.
- **Production:** A `node.exe` file or a compiled binary created via `pkg` (Node.js) that runs independently of an installed Node runtime.

## 6. Code / commands / API patterns

bash
# Check permissions
ls -l

# Make a file executable (Unix)
chmod +x style.css

# Run a file
./filename

# Build a Node.js binary
npm install pkg
npm run build


- `chmod +x`: Grants execute permission.
- `pkg`: A tool to bundle Node.js code into a standalone binary.

## 7. Edge cases, gotchas, and failure modes

- **Edge cases:** Trying to execute a binary on a different OS (e.g., .exe on Linux).
- **Gotchas:** File extensions (like .txt or .css) don't strictly determine executability; permissions do.
- **Common mistakes:** Forgetting `./` when executing files in the current directory, causing the shell to search the PATH instead.
- **Failure modes:** "Permission denied" errors occur when the 'x' bit is missing.

## 8. Trade-offs and alternatives

- **Scripts:** Easy to modify, human-readable, but require an interpreter installed on the target machine.
- **Binaries:** Faster, portable (can include runtime), but harder to modify and debug.

## 9. Questions and doubts while learning

- Question: Why does Windows run files by default without chmod?
  - Understanding: Windows treats executable extensions (.exe, .bat) as inherently executable, whereas Unix systems rely on specific permissions.

## 10. Practice tasks from the lecture

- Task: Create a standalone binary from a Node.js script.
  - Goal: Understand bundling and portability.

## 11. Key takeaways

- Executable files are either scripts (text) or binaries (compiled).
- Unix-like systems require the 'x' permission bit to execute files.
- The PATH variable controls where the OS looks for global commands.
- Node.js can be bundled into binaries using tools like `pkg`.

## 12. Minimal self-test

1. What is the difference between a script and a binary file?
2. How do you grant execute permission on Linux?
3. Why is the `./` prefix necessary when running local files?
4. What happens if the PATH variable is set to an empty string?
5. Can you run a binary built for Windows on a Linux machine directly?

## 13. Links to related materials

- Course Link: https://app.procodrr.com/web/checkout/66c86939c0a286ccc32c0d8b
- Docs: Node.js Documentation