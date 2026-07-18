# Node.js File System (FS) — One-Shot Revision

## 1. One-line Definition

The Node.js **`fs`** core module reads, writes, changes, and watches files and directories.

## 2. Why was it introduced?

Server-side programs need to work with files: configuration, logs, uploads, generated output, automation, and local data processing.

## 3. Core Mental Model

`fs` is Node’s bridge to the operating system’s filesystem. Synchronous operations make JavaScript wait; asynchronous APIs let the event loop serve other work while I/O completes.

## 4. Internal Working

File operations request work from the OS (and, for many APIs, Node’s I/O facilities). Completion is returned through callbacks or promises. File contents are bytes, so `readFile()` returns a `Buffer` unless an encoding such as `'utf8'` is supplied.

`readFile` and `writeFile` load the whole content into memory. For large inputs/outputs, streams process chunks and avoid large memory spikes.

## 5. Key APIs / Syntax

```js
import * as fs from 'node:fs/promises';

const text = await fs.readFile('input.txt', 'utf8');
await fs.writeFile('output.txt', 'replacement content'); // overwrites
await fs.appendFile('app.log', 'finished\n');             // appends
await fs.rename('old.txt', 'new.txt');                    // rename or move
await fs.copyFile('source.txt', 'copy.txt');
await fs.mkdir('reports', { recursive: true });
await fs.rm('reports', { recursive: true, force: true });
await fs.unlink('unwanted.txt');
```

```js
import { watch } from 'node:fs';

watch('config.json', (eventType, filename) => {
  console.log(eventType, filename); // usually 'change' or 'rename'
});
```

- `node:fs/promises`: promise API—usually the clearest async style.
- `readFileSync` / `writeFileSync`: block JavaScript until finished.
- `writeFile`: replaces existing contents; `appendFile` preserves and adds.
- `rename`: renames, and can move within the filesystem.
- `unlink`: removes a file; `rm` removes files/directories.

## 6. Comparison

| Need | Use | Key point |
| --- | --- | --- |
| Read a small text file | `readFile(path, 'utf8')` | Returns a string |
| Read binary data | `readFile(path)` | Returns a `Buffer` |
| Replace a file | `writeFile` | Existing content is overwritten |
| Add a log entry | `appendFile` | Add `\n` yourself if needed |
| Delete a file | `unlink` | Permanent OS-level removal |
| Remove a folder tree | `rm(path, { recursive: true })` | Destructive; validate path |
| Process huge data | Read/write streams | Avoid whole-file memory use |

## 7. Common Mistakes

- Using `readFileSync` or `writeFileSync` in request-handling paths and blocking all concurrent requests.
- Forgetting error handling for missing paths, permissions, full disks, or invalid encodings.
- Accidentally overwriting a file with `writeFile` when `appendFile` was intended.
- Assuming `appendFile` inserts a newline automatically.
- Reading large files fully into RAM instead of streaming.
- Deleting recursively without confirming the resolved target; `fs` deletion bypasses a desktop Trash/Recycle Bin.
- Treating `fs.watch` events as perfectly portable or exhaustive; event semantics differ by OS and events can be coalesced.
- Splitting word-count input only on spaces; normalize case and tokenize punctuation deliberately.

## 8. Production Considerations

- Prefer `node:fs/promises` with `async`/`await` and `try`/`catch` for normal application I/O.
- Validate and constrain paths, especially when users supply filenames; prevent directory traversal outside an allowed base directory.
- Use streams for large files and apply backpressure-aware designs.
- For important writes, consider atomic-write patterns (write temporary file, then rename) to avoid leaving partially written files.
- Treat `fs.watch` as a trigger to re-check state, not as a durable audit log; use a more robust watcher or polling strategy when requirements demand it.
- A word-counter CLI should validate `process.argv`, report errors to stderr, normalize words as needed, and stream very large files.

## 9. Interview Questions

1. What is the difference between `readFile`, `readFileSync`, and `createReadStream`?
2. Why does `readFile()` return a Buffer without an encoding?
3. Compare `writeFile` and `appendFile`.
4. How do you delete a file versus a non-empty directory?
5. Why are streams preferable for multi-gigabyte files?
6. What risks come with recursive removal?
7. What are the limitations of `fs.watch`?
8. What is the role of `process.argv` in a CLI?

## 10. Memory Triggers

- **FS = bytes first; text needs `'utf8'`.**
- **Sync stops; promises continue.**
- **Write replaces; append adds.**
- **Unlink file; rm tree.**
- **Large file = stream, not RAM.**
- **Watch means re-check.**

## 11. Summary

The `fs` module lets Node interact with the filesystem. Use promise-based APIs and explicit error handling for normal work, streams for large data, careful path validation for safety, and destructive operations only after validating the exact target.
