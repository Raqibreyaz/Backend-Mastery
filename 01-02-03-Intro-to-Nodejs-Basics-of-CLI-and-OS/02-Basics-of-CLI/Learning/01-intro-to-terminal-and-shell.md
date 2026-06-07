# Topic: Terminal and Shell Basics

- Lecture: Introduction to Terminal and Shell | Node.js Fundamentals Course | S2 Ep.1
- Date: 2026-06-06
- Source: [YouTube Video](https://www.youtube.com/watch?v=k5UHzcKs-C4&list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr&index=11)
- Area: Tooling
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture covers the essential concepts of terminals and shells for backend developers, including installing Git Bash on Windows and configuring it within VS Code.

## 1. What is this topic?

- Definition: A terminal is an application that allows users to interact with the operating system through text-based commands, while a shell is the program that interprets those commands.
- Why it exists: Backend developers need direct access to servers (often Linux-based) to deploy, manage, and debug applications; a graphical user interface (GUI) is often not available or sufficient on remote servers.
- Where it’s used: Server deployment, file system navigation, running scripts, and managing development environments.

## 2. Mental model & intuition

Think of a **terminal** like a web browser—it’s just the "window" or the application that displays information. Think of the **shell** like a specific website you visit inside that browser (e.g., Bash, PowerShell). Just as you can open multiple tabs in a browser to visit different sites, you can run different types of shells within one terminal application.

## 3. Internal working (mechanism)

- Key steps:
  1. User types a command in the terminal application.
  2. The terminal sends the input to the shell (the command interpreter).
  3. The shell translates the command into system actions.
  4. The result is sent back to the terminal for display.
- Data flow: User input → Terminal App → Shell (Command Interpreter) → OS Kernel → Execution → Output back to Terminal.

## 4. Important terms & concepts

- Term: **Terminal**
  - Definition: The interface/application used to input and view command-line interactions.
- Term: **Shell**
  - Definition: The program that interprets and executes commands (e.g., Bash, Zsh, PowerShell).
- Term: **Git Bash**
  - Definition: A bash-based shell environment for Windows that mimics the Linux command-line experience.

## 5. Example(s)

- Minimal example: Typing `git --version` to check if Git is installed.
- Production-like example: Using a terminal to SSH into a remote Linux server to update code or restart a Node.js process.

## 6. Code / commands / API patterns

shell
# Checking the version of git
git --version

# Opening terminal in VS Code
# Control + J (or Control + `)


- Note: To install Bash on Windows, download and install Git for Windows, which includes Git Bash.

## 7. Edge cases, gotchas, and failure modes

- Gotchas: Installing software (like Git) often requires restarting VS Code for the terminal to recognize the new path/commands.
- Common mistakes: Confusing the terminal application (the window) with the shell (the interpreter).

## 8. Trade-offs and alternatives

- Alternatives:
  - **PowerShell/Command Prompt:** Native to Windows but differs from the standard Linux environment used on production servers.
  - **Git Bash:** Recommended for developers because it provides a Linux-like environment, ensuring consistency between development and production.

## 9. Questions and doubts while learning

- Question: Does the terminal application matter if the shell is the same?
  - My current understanding: No, as long as the terminal supports the shell you need (like Bash), the specific terminal app (VS Code vs. Windows Terminal) is a matter of preference.

## 10. Practice tasks from the lecture

- Task: Setup Terminal
  - Goal: Install Git, open a new terminal in VS Code, and set Git Bash as the default profile.

## 11. Key takeaways

- The terminal is just an app; the shell is the environment that executes commands.
- Backend developers should use Bash (or similar Linux-compatible shells) to stay consistent with server environments.
- Always configure your editor (VS Code) to use your preferred shell by default.

## 12. Minimal self-test

1. What is the difference between a terminal and a shell?
2. Why is Bash preferred for backend development?
3. How do you set a default terminal in VS Code?
4. What command checks if Git is properly installed?

## 13. Links to related materials

- Course Curriculum: [procodrr.com/nodejs/](https://procodrr.com/nodejs/)
- Git Download: [git-scm.com/downloads](https://git-scm.com/downloads)