# Topic: Threads and Node.js Concurrency

- Lecture: What is Thread? | Is Node.js Single Threaded or Multi-Threaded? | Node.js Course | S3 Ep.4
- Date: 2026-06-06
- Source: [Youtube](https://youtu.be/1kCgiLuyF4c?si=N2-BYPZyRnGyZJfW)
- Area: OS / Language
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture explains the concept of threads, the difference between concurrency and parallelism, and clarifies that Node.js supports multi-threading through the Worker Threads module.

## 1. What is this topic?

- Definition: A thread is the smallest unit of execution within a process. A single process can contain multiple threads that share the same memory space.
- Why it exists: Processes are "heavy" to spawn (they require their own memory space). Threads are "lightweight" and allow tasks to run concurrently within a single process, making better use of CPU resources.
- Where it’s used: Any modern application (browsers, servers) that needs to handle multiple tasks (e.g., downloading files while playing video) simultaneously.

## 2. Mental model & intuition

Think of a **Process** as a house (with its own resources/memory). Think of **Threads** as the people living in that house. If one person is cooking and another is cleaning, they are working concurrently within the same house. If you had to build a whole new house just to clean a room, that would be a new **Process**. Spawning a new house (Process) is slow; letting a new person (Thread) into the existing house is fast.

## 3. Internal working (mechanism)

- Key steps:
  1. The Main Process starts.
  2. The OS manages the allocation of CPU cores to threads.
  3. Threads share the process's memory space, which allows for fast communication but requires caution regarding shared state.
- Assumptions: The design assumes that threads should be used to offload heavy computations to avoid blocking the main event loop.

## 4. Important terms & concepts

- **Spawning**: The act of triggering or starting a new process or thread.
- **Concurrency**: The ability of a system to handle multiple tasks by switching between them quickly (gives the illusion of running at the same time on a single core).
- **Parallelism**: When multiple tasks are physically running on different CPU cores at the exact same instant.
- **Worker Thread**: A Node.js module that allows executing JavaScript code in parallel on separate threads.

## 5. Example(s)

- Minimal example: Running a `for` loop that performs a heavy mathematical operation. Running three of these sequentially takes triple the time; running them in three separate worker threads cuts the execution time significantly.
- Realistic example: In a web server, you might use a thread to perform image compression or heavy video processing without freezing the main server thread that handles incoming HTTP requests.

## 6. Code / commands / API patterns

js
// Using Worker Threads to run tasks in parallel
const { Worker } = require('worker_threads');

new Worker('./a.js');
new Worker('./b.js');
new Worker('./c.js');

- Explanation: This code imports the `Worker` class from the `worker_threads` module. Each `new Worker()` call spawns a separate thread to execute the specified file, allowing the operations to run in parallel.

## 7. Edge cases, gotchas, and failure modes

- Gotchas: Node.js was historically perceived as "single-threaded" because, before 2019 (Worker Threads introduction), developers couldn't easily manage parallel threads in JS code.
- Common mistakes: Creating too many threads can lead to overhead and context-switching performance penalties.

## 8. Trade-offs and alternatives

- Performance: Multi-threading significantly improves performance for CPU-intensive tasks.
- Complexity: Managing multiple threads (communication, shared memory, race conditions) is much more complex than single-threaded programming.
- Alternatives: Clustering (scaling by spawning multiple Node.js processes) is an alternative for scaling across multiple cores.

## 9. Questions and doubts while learning

- Question: Is Node.js truly single-threaded?
  - Understanding: Node.js uses a single main event loop, but the engine (Libuv) and the developer (via Worker Threads) can leverage multiple threads.

## 10. Key takeaways

- A process is a container with its own memory; threads are lightweight execution units inside that container.
- Node.js is NOT just single-threaded; it supports multi-threading via the `worker_threads` module.
- Concurrency (interleaved execution) is different from Parallelism (true simultaneous execution on multiple cores).

## 11. Minimal self-test

1. What is the difference between a process and a thread?
2. What does "spawning" a process mean?
3. When should you use worker threads in Node.js?
4. What is the difference between concurrency and parallelism?
5. Why did people think Node.js was only single-threaded?
