# Topic: File System (fs) Operations in Node.js

- Lecture: File Operations in Node.js: Rename, Delete, Copy & More! | Node.js Fundamentals Course | S4 Ep.22
- Date: 2026-06-06
- Source: https://youtube.com/playlist?list=PLfEr2kn3s-bqrqEzlQXbrFwisqlYspmRr
- Area: Language (Node.js)
- Confidence after lecture (1–5): 5
- One-sentence summary: This lecture covers programmatic file system manipulations in Node.js including renaming, copying, moving, deleting, and watching files/directories using the `fs` module's Promise API.

## 1. What is this topic?

- Definition: Programmatic manipulation of the host operating system's file structure using Node.js `fs` module methods.
- Why it exists: To automate file-based tasks that would otherwise require manual intervention or CLI commands, essential for server-side applications.
- Where it’s used: Automation scripts, CMS backends, logging systems, and data processing pipelines.

## 2. Mental model & intuition

Think of the `fs` module as your Node.js "remote control" for the file system. Instead of manually opening folders, clicking delete, or renaming files, you write scripts that act as a "robot" to perform these tasks asynchronously when specific conditions are met (e.g., when a user uploads a file or a system timer triggers).

## 3. Internal working (mechanism)

- Key steps:
  1. Import the `promises` API from the `fs` module.
  2. Use `await` to perform operations, ensuring code execution waits for the I/O task to complete.
  3. Handle errors using `try/catch` (implicit in Node's async nature).
- Data flow: The Node.js Event Loop handles these I/O requests by handing them off to the underlying OS and resuming once the file system reports completion.

## 4. Important terms & concepts

- **Promise API**: Asynchronous methods returning promises, allowing for cleaner code using `async/await`.
- **Recursive Flag**: A setting required for `cp` or `rm` operations to work on non-empty directories.
- **Unlink**: The specific method used to delete files, rather than a generic "delete" function.

## 5. Example(s)

- **Minimal**: Deleting a file using `await fs.unlink('filename.txt')`.
- **Production-like**: A watch script that detects when a config file changes and automatically triggers a process restart or data re-read.

## 6. Code / commands / API patterns

javascript
// Renaming / Moving a file
await fs.rename('oldName.png', 'newName.png');

// Copying a file
await fs.copyFile('source.png', 'dest.png');

// Creating a directory
await fs.mkdir('myFolder');

// Recursive deletion of a directory
await fs.rm('folderName', { recursive: true });

// Watching a file for changes
fs.watch('file.txt', (eventType, filename) => {
  console.log(eventType); // 'change' or 'rename'
});


## 7. Edge cases, gotchas, and failure modes

- **Edge cases**: Deleting a non-empty directory with `rmdir` will fail (use `rm` with `{recursive: true}`).
- **Gotchas**: Deletions performed via code skip the Recycle Bin/Trash; they are permanent.
- **Common mistakes**: Forgetting the `recursive: true` flag when copying or deleting directories.
- **Failure modes**: Permissions errors if the script runs with lower privileges than the target file owner.

## 8. Trade-offs and alternatives

- **Performance**: `fs` methods are non-blocking (asynchronous), which is critical for high-concurrency Node.js servers.
- **Alternatives**: Using the `child_process` module to run OS-native shell commands (like `mv`, `cp`, `rm`), though this is generally less idiomatic and less cross-platform compatible than `fs`.

## 9. Questions and doubts while learning

- Question: Why does `fs.watch` fire 'rename' events for deletions?
  - Current understanding: The OS often handles deletions by moving files to internal system bins or tracking metadata changes that mirror a rename-like operation.

## 10. Practice tasks from the lecture

- Task: Typing Speed Calculator
  - Goal: Use `fs.watch` to read a file in real-time and calculate how fast a user types into it.

## 11. Key takeaways

- Never rely on memory for `fs` methods; refer to the official Node.js docs.
- `rename` acts as both move and rename.
- `unlink` deletes files; `rm` is for deleting files/directories (use `recursive: true` for folders).
- `fs.watch` is powerful for real-time reactivity to file system changes.

## 12. Minimal self-test

1. How do you delete a non-empty directory programmatically?
2. What is the difference between `fs.rename` and `fs.copyFile`?
3. Why shouldn't you use `fs.rmdir` for non-empty folders?
4. What event types does `fs.watch` primarily emit?
5. How do you handle file permissions issues in `fs` operations?

## 13. Links to related materials

- Docs: https://nodejs.org/api/fs.html