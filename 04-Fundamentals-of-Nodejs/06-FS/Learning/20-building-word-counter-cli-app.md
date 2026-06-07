# Topic: Word Counter CLI App in Node.js

- **Lecture:** S4 Ep.20: Build a Word Counter CLI App in Node.js
- **Date:** 2026-06-06
- **Source:** [YouTube](https://youtu.be/ScFK3tphRVY?si=1pTjf83k5cluqtBQ)
- **Area:** Node.js / Tooling
- **Confidence after lecture (1–5):** 5
- **One-sentence summary:** This lecture teaches how to build a CLI application in Node.js that reads local files, tokenizes text using Regex, and counts word occurrences dynamically.

## 1. What is this topic?

- **Definition:** Building a command-line interface (CLI) tool using Node.js's built-in `fs` (file system) module and `process` object.
- **Why it exists:** To automate text processing tasks such as counting word frequencies in local files, which is a fundamental task for understanding CLI interactions.
- **Where it’s used:** Log analysis, data processing scripts, and automation tools.

## 2. Mental model & intuition

Think of the CLI as a factory: You provide a raw material (the text file path), the Node.js process acts as the machine that breaks the material into pieces (tokenization), and finally, an object (dictionary) acts as the container where you store the tally of each unique piece found.

## 3. Internal working (mechanism)

- **Key steps:**
  1. Read the input file using `fs.promises.readFile`.
  2. Normalize and tokenize the text content using Regex to remove punctuation and non-word characters.
  3. Filter out empty strings created by the splitting process.
  4. Iterate through the array of words and update a frequency counter object.

## 4. Important terms & concepts

- **`process.argv`:** An array containing command-line arguments. `argv[0]` is Node, `argv[1]` is the script path, and `argv[2]` is the user-provided file path.
- **Tokenization:** Breaking a string into a list of words. Using regex `/[^\w]+/` is more effective than splitting by space to handle punctuation.
- **Regex `\w`:** Matches any word character (alphanumeric + underscore).

## 5. Example(s)

- **Minimal:** Reading a file and printing it to the console to ensure data is successfully fetched.
- **Production-like:** Processing a file via CLI arguments, identifying words, and outputting a frequency map like `{"hello": 1, "world": 2}`.

## 6. Code / commands / API patterns

javascript
// Reading file with promises
import { readFile } from 'node:fs/promises';
const content = await readFile(path, 'utf-8');

// Tokenizing using Regex to split by non-word characters
const words = content.split(/[^\w]+/).filter(w => w !== "");

// Counting logic
const wordCount = {};
words.forEach(word => {
  wordCount[word] = (wordCount[word] || 0) + 1;
});


- **Command:** `node app.js file.txt`

## 7. Edge cases, gotchas, and failure modes

- **Edge cases:** Handling case sensitivity (e.g., "The" vs "the"), handling large files (memory limit concerns).
- **Gotchas:** `split` creating empty strings if there are multiple delimiters in a row (e.g., spaces and commas together).

## 8. Trade-offs and alternatives

- **Performance:** For massive files, reading the entire file into memory (as shown in the lecture) is inefficient; a **Stream-based approach** would be better.
- **Alternatives:** Using external libraries like `commander` or `yargs` for professional CLI argument parsing.

## 9. Questions and doubts while learning

- **Question:** How do I handle very large files?
  - **Understanding:** Currently reading the whole string. Need to switch to `ReadStream` if the file size exceeds RAM.

## 10. Practice tasks from the lecture

- **Task 1:** Implement case-insensitive counting (convert all words to lowercase).
- **Task 2:** Add functionality to search for a specific word's count instead of printing the whole object.
- **Task 3:** Publish the script as an NPM package that can be run via `npx`.

## 11. Key takeaways

- `process.argv` is the gateway to making Node.js scripts dynamic.
- Regex is essential for clean text processing.
- `fs/promises` simplifies asynchronous file handling compared to callback-based methods.

## 12. Minimal self-test

1. What is the difference between `argv[1]` and `argv[2]`?
2. Why is `/[^\w]+/` better than `" "` for splitting a sentence?
3. How do you handle non-existent files?
4. What does `type: "module"` in `package.json` enable?
5. How do you make a CLI tool run via `npx`?

## 13. Links to related materials

- [Official Node.js fs docs](https://nodejs.org/api/fs.html)
- [ProCodrr Full Course](https://procodrr.com/nodejs/)