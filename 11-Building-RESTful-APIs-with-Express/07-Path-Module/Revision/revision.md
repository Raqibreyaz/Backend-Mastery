# Node.js Path Module — One-Shot Revision

## 1. One-line Definition

The `node:path` module safely manipulates filesystem path strings in an OS-aware way.

## 2. Why was it introduced?

Hard-coded separators and string concatenation break across platforms and can create malformed paths.

## 3. Core Mental Model

Paths are filesystem locations, not URLs. Let `path` join, normalize, and resolve their segments instead of manually adding `/`.

## 4. Internal Working

`path.join()` joins then normalizes segments. `path.normalize()` cleans `.`/`..` and duplicate separators. `path.resolve()` processes right-to-left until it reaches an absolute segment, then returns an absolute path; relative inputs are based on `process.cwd()`.

## 5. Key APIs / Syntax

```js
import path from 'node:path';

path.join('uploads', 'avatars', 'a.png');
path.normalize('./uploads/../images//a.png');
path.resolve('config', 'app.json');
path.basename('/srv/app/report.pdf'); // report.pdf
path.dirname('/srv/app/report.pdf');  // /srv/app
path.extname('report.pdf');           // .pdf

const publicFile = path.join(import.meta.dirname, 'public', 'index.html');
```

## 6. Comparison

| API | Purpose |
| --- | --- |
| `join()` | Combine path segments; may remain relative |
| `normalize()` | Clean an existing path string |
| `resolve()` | Produce an absolute path |
| `basename()` / `dirname()` / `extname()` | Extract filename, parent, extension |

## 7. Common Mistakes

- Assuming `path.resolve('x')` is relative to the current source file—it is relative to `process.cwd()`.
- Confusing URL paths with filesystem paths.
- Using user-provided path segments without validating containment inside an allowed root.
- Assuming `join(root, userInput)` alone prevents traversal; resolve and verify the result stays below root.

## 8. Production Considerations

- Use module-relative absolute roots for static files/uploads.
- For user filenames, generate server-side names and enforce allowed extensions/paths.
- Use `path.posix`/`path.win32` only when deliberately handling another platform’s path format.
- Keep URL handling separate; use `URL` and `import.meta.url` for URLs.

## 9. Interview Questions

1. Compare `join()` and `resolve()`.
2. What is `process.cwd()` and why can it surprise you?
3. How do you prevent path traversal?
4. Why not concatenate paths manually?

## 10. Memory Triggers

- **Join combines; resolve roots.**
- **Resolve starts from cwd unless given an absolute base.**
- **Filesystem path ≠ URL.**

## 11. Summary

Use `node:path` for portable filesystem locations. Anchor application paths deliberately and treat client-provided path fragments as security-sensitive.
