# Topic: Terminal Prompt Customization

- Lecture: What is a Prompt in the Terminal? | Node.js Fundamentals Course | S2 Ep.7
- Date: 2026-06-06
- Source: https://www.youtube.com/watch?v=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr
- Area: Tooling
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture explains how terminal prompts work and how to customize the PS1 and PS2 environment variables in a Bash shell.

## 1. What is this topic?

- Definition: A prompt is a string of characters displayed by the terminal to indicate that the system is ready to receive input or commands.
- Why it exists: It provides visual feedback to the user about their current state (e.g., directory, user, hostname) and signals that the system is waiting for instructions.
- Where it’s used: In every Command Line Interface (CLI) environment, including Bash, Zsh, Command Prompt, and PowerShell.

## 2. Mental model & intuition

Think of the prompt as a "greeting card" from your terminal. It tells you where you are and who you are. The system stores this greeting in a special variable (PS1). By changing the value of that variable, you are effectively telling the terminal to print a different "greeting card" every time it finishes a task.

## 3. Internal working (mechanism)

- Key steps:
  1. The shell checks the value of environment variables like PS1 (Primary Prompt) and PS2 (Secondary Prompt).
  2. When the shell is ready for input, it looks at the string stored in PS1 and renders it.
  3. If you type a partial command and hit enter, the shell uses the string in PS2 to show that the command is not yet complete.
- Data flow: Changing the variable value in the current session immediately affects the UI, but it does not persist once the terminal window is closed (unless saved in config files).

## 4. Important terms & concepts

- Term: PS1 (Prompt String 1)
  - Definition: The variable that defines the appearance of the main command prompt.
  - Why it matters: It is the primary way users identify their context in the terminal.
- Term: PS2 (Prompt String 2)
  - Definition: The variable that defines the prompt shown when a command is incomplete (e.g., waiting for more input).
  - Why it matters: It provides feedback that the terminal is waiting for further syntax to complete a command.

## 5. Example(s)

- Minimal example: Setting the prompt to your name.
- Realistic example: Configuring the prompt to show only the current directory path for a cleaner workspace.

## 6. Code / commands / API patterns

bash
# Check the current prompt value
echo $PS1

# Modify the primary prompt
PS1="Anurag: "

# Modify the secondary prompt
PS2="Input needed: "


- `echo $PS1`: Displays the current configuration string.
- `PS1="..."`: Overwrites the variable with a new string. This change is local to the current session.

## 7. Edge cases, gotchas, and failure modes

- Gotchas: Changes are temporary and disappear when the terminal session ends.
- Common mistakes: Thinking that changing the variable inside a sub-process will update the main shell prompt globally.

## 8. Trade-offs and alternatives

- Trade-offs: Over-customizing prompts can lead to confusion if they don't clearly indicate the current working directory or system state.
- Alternatives: Using shell themes (like Oh My Zsh or Starship) for more advanced, persistent configuration.

## 9. Questions and doubts while learning

- Question: How can I make these changes permanent?
  - Current understanding: I need to add these variable assignments to shell configuration files (like .bashrc) that run every time a terminal is opened.

## 10. Practice tasks from the lecture

- Task: Customize your PS1
  - Goal: Create a custom prompt that includes an arrow character or your name.
  - What it teaches: How to handle string variables in the shell.

## 11. Key takeaways

- PS1 controls the primary prompt; PS2 controls the secondary (continuation) prompt.
- Environment variables can be changed dynamically by assigning values directly.
- Shell changes are volatile; they do not persist after the session terminates unless added to startup scripts.

## 12. Minimal self-test

1. What is the difference between PS1 and PS2?
2. How do you view the current value of your prompt string?
3. What happens to your custom prompt after you close the terminal window?
4. Why might you want to customize your prompt?
5. Is it possible to use non-standard characters in a prompt?

## 13. Links to related materials

- Course Website: https://procodrr.com/nodejs/