# Serving Static Files — One-Shot Revision

## 1. One-line Definition

Static-file serving delivers existing files—HTML, CSS, JS, images, downloads—directly over HTTP without a custom route body for each file.

## 2. Why was it introduced?

Web applications need assets delivered efficiently with correct content types and caching behavior.

## 3. Core Mental Model

`express.static(root)` maps URL paths to files below one safe root directory. `res.sendFile()` sends one explicitly chosen file.

## 4. Internal Working

The static middleware checks whether a requested path maps to a readable file under its root; if yes it streams it with relevant headers, otherwise it calls `next()`. `sendFile` resolves and transfers a particular file; video seeking needs HTTP Range handling, which should be tested rather than assumed from a naive `createReadStream().pipe(res)` implementation.

## 5. Key APIs / Syntax

```js
import express from 'express';
import path from 'node:path';
const app = express();

app.use('/assets', express.static(path.join(import.meta.dirname, 'public')));
app.get('/download', (req, res, next) =>
  res.sendFile(path.join(import.meta.dirname, 'public', 'report.pdf'), next));
```

## 6. Comparison

| `express.static()` | `res.sendFile()` |
| --- | --- |
| Directory-to-URL mapping | One selected file |
| Best for public assets | Best for a deliberate endpoint |
| Falls through if no file matches | Can return an error through callback/next |

## 7. Common Mistakes

- Using a relative root that changes with `process.cwd()`.
- Exposing uploads, source files, `.env`, or secrets through a public static root.
- Building a path from raw user input without containment checks (path traversal).
- Writing a basic stream response for media and expecting reliable Range/seek behavior.

## 8. Production Considerations

- Use an absolute root based on the module location and expose only intended public files.
- Set caching policy/versioned asset names; serve large static assets through a CDN or reverse proxy when appropriate.
- Authorize protected downloads before `sendFile`; never mount the whole project root.
- Add correct `Content-Disposition` using `res.download()` when the browser should download rather than display.

## 9. Interview Questions

1. How does `express.static()` differ from `sendFile()`?
2. How do you prevent path traversal in downloads?
3. Why are byte ranges important for video?
4. Why use an absolute static root?

## 10. Memory Triggers

- **Static = directory map.**
- **sendFile = one explicit file.**
- **Public root must be narrow.**

## 11. Summary

Serve public assets through a constrained static root and explicit downloads through controlled routes. Use absolute paths, safe caching, and authorization where files are not truly public.
