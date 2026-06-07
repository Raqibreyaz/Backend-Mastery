# Topic: Processes in Operating Systems

- Lecture: What is Process? | Node.js Fundamentals Course | S3 Ep.3
- Date: 2026-06-06
- Source: [Youtube](https://youtu.be/xcUoEIUMcn4?si=piFnHczxbl3cfvNv)
- Area: OS
- Confidence after lecture (1–5): 5
- One-sentence summary: A process is a program in execution that consumes system resources like CPU time and RAM, managed by the operating system.

## 1. What is this topic?

- Definition: A unit of execution. Any program that is currently running and consuming memory (RAM) and CPU time.
- Why it exists: To manage and isolate multiple programs so the processor can perform computations for different applications efficiently.
- Where it’s used: In every modern multitasking operating system (Windows, macOS, Linux) to run applications like browsers, code editors, and servers.

## 2. Mental model & intuition

Think of a process as a physical "app" or "program." If you are at home and decide to go to the market, you are "ready." If you get stuck in traffic, you are in a "waiting" state. If you are actively shopping, you are "running." Once you finish, you are "terminated." The OS acts as the traffic controller, moving programs between these states to ensure the CPU is always doing something useful.

## 3. Internal working (mechanism)

- Key steps:
  1. The OS loads the program into RAM.
  2. The process is assigned a unique Process ID (PID).
  3. The OS scheduler moves the process into a "Running" state on a CPU core.
  4. The process may perform "context switches" (moving in and out of the CPU) based on priority and system needs.
- Data flow: Data moves between Disk (storage) and RAM (active memory). The CPU processes data directly from RAM/cache.
- Assumptions: The OS assumes it needs to manage resources (CPU, RAM) fairly among all active processes.

## 4. Important terms & concepts

- **PID (Process ID):** A unique identifier for every running process.
- **PPID (Parent Process ID):** The ID of the process that launched the current process.
- **Context Switch:** The process of the OS saving the state of one task and loading another so that multiple programs appear to run simultaneously.
- **States:** Ready, Running, Waiting, Terminated, and Sleep (waiting for an external event/request).

## 5. Example(s)

- Toy: A simple infinite `while(true)` loop in Node.js. This forces the process to stay in a running state, allowing us to observe its CPU usage.
- Production: A web server (like Node.js) that stays in a "Sleep" state until an incoming HTTP request triggers it into a "Running" state to handle the request.

## 6. Code / commands / API patterns

shell

# Launching a process from terminal

node app.js

# Listing processes (OS specific)

taskmgr # Windows
activity monitor # macOS

- `process` object in Node.js: A global object that provides information about the current Node.js process (e.g., `process.pid`, `process.ppid`).

## 7. Edge cases, gotchas, and failure modes

- Gotchas: Some apps (like Chrome) launch multiple processes for a single browser window to isolate tabs and extensions.
- Failure modes: If a process has an infinite loop with a high priority (Real-Time), it can consume 100% of a CPU core, causing the system to freeze or overheat.

## 8. Trade-offs and alternatives

- Trade-offs: More processes increase isolation but consume more RAM and require more frequent context switching, which can degrade performance.
- Alternatives: Threads (lighter-weight units of execution within a process, to be discussed next).

## 9. Questions and doubts while learning

- Question: Why does Node.js sometimes show two processes when I run one file?
  - My understanding: It might be internal handling, extensions, or a parent process spawning a child for internal management.

## 10. Practice tasks from the lecture

- Task: Identify if Node.js is single-threaded or multi-threaded.
  - Goal: Understand process vs. thread architecture.
  - Approach: Research Node.js event loop and libuv.

## 11. Key takeaways

- A process is just a running program.
- Every process has a PID and a Parent PID.
- The OS manages processes through context switching.
- We can monitor processes using tools like Task Manager or System Informer.
- Node.js provides a global `process` variable to interact with its own execution environment.

## 12. Minimal self-test

1. What is the difference between memory (RAM) and disk (SSD)?
2. What is a context switch?
3. How can you find the Parent Process ID of a running program?
4. What happens when you set a process priority to "Real Time"?
5. Why is `setImmediate` or `setInterval` needed to keep a Node.js process alive?

## 13. Links to related materials

- Course Link: https://procodrr.com/nodejs/
- Tool: System Informer (formerly Process Hacker)
