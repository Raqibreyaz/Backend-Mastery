# Topic: How Commands Work in Terminal

- Lecture: S3 Ep.13 - How Commands Work in Terminal | Node.js Fundamentals Course
- Date: 2026-06-06
- Source: [Youtube](https://youtu.be/LZdR8sVz0ak?si=6IKI4T-D9pdYUiMJ)
- Area: OS / Tooling
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture explains the internal hierarchy and mechanism—aliases, functions, built-ins, hash tables, and PATH execution—that the terminal uses to resolve and run commands.

## 1. What is this topic?

- Definition: The process of command resolution within a Unix-like shell (specifically Bash) when a user inputs a command.
- Why it exists: To provide a deterministic, efficient, and flexible way to map user input strings to executable code or scripts.
- Where it’s used: Any CLI interaction, shell scripting, and environment configuration for development environments (like Node.js).

## 2. Mental model & intuition

Think of the terminal as a librarian looking for a book on a shelf. The librarian doesn't check every shelf randomly; they follow a strict hierarchy of lists. If you ask for a book, they first check their "quick access" memo (Alias), then their "routine tasks" list (Functions), then "built-in" procedures (Built-ins), then a "frequently used" index (Hash Table), and finally, they go to the "main library" (PATH directories) to find an executable file.

## 3. Internal working (mechanism)

When you type a command and hit enter, the shell checks in this specific order:

1. **Aliases**: Are there any shortcuts defined?
2. **Functions**: Is there a shell function with this name?
3. **Built-ins**: Is it a command native to the shell itself (e.g., `cd`)?
4. **Hash Table**: Has this executable been run before? (The shell caches the path).
5. **PATH Variable**: The shell iterates through each directory listed in the `PATH` environment variable until it finds an executable file with that name.

## 4. Important terms & concepts

- **Alias**: A user-defined shortcut for a command or string of commands.
- **Built-in**: Commands that are part of the shell environment, not separate files.
- **Hash Table**: A cache of previously located executable paths to speed up subsequent command lookups.
- **PATH Variable**: An environment variable containing a list of directory paths where the OS looks for executables.
- **winpty**: A compatibility layer used in Git Bash on Windows to provide a Unix-like TTY environment for interactive applications (like `node`).

## 5. Example(s)

- Toy: Creating an alias `alias cd='ls'` to override the `cd` behavior, demonstrating priority.
- Production: Installing `yt-dlp` or a custom build tool. By adding the directory containing the binary to the `PATH`, you make that tool globally available as a command from any folder.

## 6. Code / commands / API patterns

shell

# Checking what a command is

type <command_name>

# Checking the PATH variable

echo $PATH

# Cleaning the PATH output for readability

echo $PATH | tr ':' '\n'

# Adding a path to PATH (Current session)

PATH=$PATH:/new/directory/path

# Viewing Hash table

hash

- `type`: Tells you the nature of the command (alias, function, built-in, or file).
- `tr ':' '\n'`: Replaces colons in the PATH variable with newlines for a clean, vertical list.

## 7. Edge cases, gotchas, and failure modes

- Gotchas: If you define an alias and a function with the same name, the alias takes precedence.
- Failure modes: If a binary is missing from the `PATH`, you get "command not found." If multiple versions of a binary exist, the shell executes the first one it finds in the `PATH` order.
- Common Mistake: Modifying the `PATH` in a child process (like a sub-shell) does not affect the parent shell's environment.

## 8. Trade-offs and alternatives

- Trade-offs: The `PATH` lookup is flexible but can be slow if there are too many directories; hence the Hash Table optimization.
- Alternatives: Hardcoding absolute paths (e.g., `/usr/bin/node`) is more secure and predictable but lacks portability.

## 9. Questions and doubts while learning

- Question: Why does `node` run via `winpty` in Git Bash?
  - Understanding: It’s a requirement to bridge the gap between Windows console handling and Unix-like terminal expectations for interactive CLI apps.

## 10. Practice tasks from the lecture

- Task: Install `yt-dlp` and `ffmpeg`
  - Goal: Practice setting up global CLI tools.
  - Teaches: Understanding environment variables, PATH management, and dependency management.

## 11. Key takeaways

- The order of command resolution is: Alias > Function > Built-in > Hash > PATH.
- Use `type <command>` to debug why a specific command is behaving the way it is.
- You can modify `PATH` to make your own scripts globally accessible.
- `PATH` modifications should ideally be added to shell profile files (like `.bashrc`) for persistence.

## 12. Minimal self-test

1. What is the search order when you type a command?
2. What is the purpose of the `type` command?
3. What happens if you add a directory to the front of your `PATH` versus the end?
4. Why does the shell use a Hash table?
5. How do you permanently add a directory to your PATH on Linux/Git Bash?
