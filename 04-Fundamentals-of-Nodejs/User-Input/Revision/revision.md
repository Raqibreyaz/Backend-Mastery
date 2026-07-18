# User Input in Node.js — One-Shot Revision

## 1. One-line Definition

Node.js receives interactive user input through **standard input** (`process.stdin`) and writes prompts/results through **standard output** (`process.stdout`).

## 2. Why was it introduced?

CLI programs need a way to accept values, commands, and file data without a browser UI—for automation, scripts, setup tools, and developer utilities.

## 3. Core Mental Model

Think in streams:

- **stdin** is an incoming stream of bytes.
- **stdout** is an outgoing stream of bytes.
- `readline` puts a line-oriented interface on top of a stream.
- A file read stream can be used as `readline` input, letting a program process one line at a time without loading the whole file.

## 4. Internal Working

Terminal input arrives asynchronously. `process.stdin` emits a `'data'` event containing a `Buffer`; convert it to text and normalize it when needed. `readline.createInterface()` listens to an input stream, recognizes line endings, and can ask questions or emit one `'line'` event per line.

For file processing, `fs.createReadStream()` supplies data incrementally. Passing it to `readline` allows line-by-line handling; `fs.createWriteStream()` writes results incrementally to an output file.

## 5. Key APIs / Syntax

### Ask one terminal question

```js
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('What is your name? ', (name) => {
  console.log(`My name is ${name}`);
  rl.close();
});
```

### Read stdin directly

```js
process.stdout.write('Enter your name: ');

process.stdin.once('data', (data) => {
  const name = data.toString().trim();
  console.log(name);
  process.stdin.pause();
});
```

### Process a file line by line

```js
import readline from 'node:readline';
import fs from 'node:fs';

const input = fs.createReadStream('input.txt');
const output = fs.createWriteStream('output.txt');
const rl = readline.createInterface({ input, crlfDelay: Infinity });

rl.on('line', (line) => output.write(`Processed: ${line}\n`));
rl.on('close', () => output.end());
```

- `process.argv`: command-line arguments supplied when starting Node.
- `process.stdin` / `process.stdout`: standard input/output streams.
- `process.stdout.write(text)`: writes without automatically adding a newline.
- `readline.question(prompt, callback)`: prompt and receive one answer.
- `'data'`, `'line'`, and `'close'`: common input lifecycle events.
- `fs.createReadStream()` / `fs.createWriteStream()`: stream files instead of loading them all at once.

## 6. Comparison

| Approach | Best for | Important detail |
| --- | --- | --- |
| `readline.question()` | One or a few interactive prompts | Close the interface when finished |
| `process.stdin` `'data'` | Low-level stream handling | Data arrives as a Buffer/chunks, not guaranteed as one logical answer |
| `readline` + file stream | Line-by-line file processing | Efficient for large text files |
| `readFile()` | Small whole-file operations | Loads all content into memory |

## 7. Common Mistakes

- Forgetting to call `rl.close()`, leaving the process open after a question.
- Assuming every `'data'` event contains exactly one complete user response; streams are chunk-based.
- Registering `process.stdin.on('data', ...)` repeatedly for one-time input; use `once()` or carefully remove listeners.
- Forgetting to convert a Buffer to a string or trim the ending newline.
- Mixing `readline` and raw `stdin` listeners on the same input without defining ownership.
- Writing to a file stream after it has ended, or exiting before output has flushed.
- Loading large files with `readFile` when a read stream is more suitable.
- Building file paths relative to an unpredictable working directory.

## 8. Production Considerations

- Prefer `node:readline/promises` with `await` for sequential interactive prompts in modern Node.js.
- Validate, normalize, and safely handle every user-provided value; never treat terminal input as trusted.
- Handle Ctrl+C (`SIGINT`), input errors, missing files, and output-stream errors so a CLI exits cleanly.
- Keep stdout for normal results and stderr for errors so commands can be composed with shell pipes.
- Use streams and backpressure-aware writing for large files; do not ignore `write()` returning `false` in high-volume writers.
- For real CLIs, use a robust argument parser where flags, defaults, help text, and validation become complex.

## 9. Interview Questions

1. What are `process.stdin`, `process.stdout`, and `process.stderr`?
2. Why does stdin data arrive as a Buffer/chunk?
3. When would you use `readline` instead of a raw `'data'` listener?
4. Why must a `readline` interface be closed?
5. How can you process a large text file one line at a time?
6. What is the difference between `console.log()` and `process.stdout.write()`?
7. How would you safely handle Ctrl+C or invalid input in a CLI?

## 10. Memory Triggers

- **stdin in; stdout out; stderr errors.**
- **Streams arrive in chunks, not answers.**
- **`readline` turns chunks into lines/questions.**
- **One prompt: question then close.**
- **Large file: stream it line by line.**
- **`write()` has no automatic newline.**

## 11. Summary

Node CLIs communicate through standard streams. Use `readline` for friendly line-based prompts, treat raw stdin as asynchronous chunks, close resources cleanly, and use file streams for memory-efficient line-by-line processing.
