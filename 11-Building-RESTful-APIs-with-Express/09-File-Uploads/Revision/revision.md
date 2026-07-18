# File Uploads with Express — One-Shot Revision

## 1. One-line Definition

File uploading accepts `multipart/form-data`, parses its fields and binary parts, and stores/forwards files under controlled rules.

## 2. Why was it introduced?

JSON and URL-encoded bodies are unsuitable for binary files. Multipart lets a request carry ordinary fields and file bytes together.

## 3. Core Mental Model

An upload is untrusted binary input. Parse it with dedicated middleware, validate it, give it a server-owned name/location, and store only what the application allows.

## 4. Internal Working

Browsers create multipart bodies separated by boundaries. Express’s JSON/urlencoded parsers do not parse file uploads. Multer is route middleware built on multipart parsing; it makes text fields available on `req.body` and file metadata available on `req.file`/`req.files`. Disk storage chooses a destination and filename as streams arrive.

## 5. Key APIs / Syntax

```js
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, crypto.randomUUID() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.post('/upload', upload.fields([{ name: 'profilePic', maxCount: 1 }]), handler);
```

Use `upload.single('avatar')` for one file, `array(name, maxCount)` for multiple same-name files, and `fields()` for named fields.

## 6. Comparison

| Content type | Suitable for files? | Typical Express parser |
| --- | --- | --- |
| `application/json` | No | `express.json()` |
| `application/x-www-form-urlencoded` | No file bytes | `express.urlencoded()` |
| `multipart/form-data` | Yes | Multer/another multipart parser |

## 7. Common Mistakes

- Expecting `express.json()` to parse multipart uploads.
- Trusting `file.originalname`, file extension, MIME type, or client-provided `Content-Type`.
- Using memory storage for unbounded/large uploads.
- Applying upload middleware globally rather than only to intended routes.
- Returning uploaded files from a public directory without access controls.
- Forgetting size/count/type limits and cleanup on failed processing.

## 8. Production Considerations

- Authenticate/authorize before accepting uploads; set strict size, count, field, and rate limits.
- Verify file signatures/content server-side, allowlist types, and generate opaque filenames.
- Store outside the web root or in object storage; scan files when threat model requires it.
- Avoid wildcard CORS with credentials; configure browser upload origins deliberately.
- Treat virus scanning, image processing, and external storage as asynchronous jobs for larger workloads.

## 9. Interview Questions

1. Why doesn’t `express.json()` handle file uploads?
2. What do `req.body`, `req.file`, and `req.files` contain?
3. Why generate server-side filenames?
4. Disk vs memory storage trade-offs?

## 10. Memory Triggers

- **Files = multipart boundary.**
- **Multer parses; fields go body; files go file(s).**
- **Upload input is untrusted.**

## 11. Summary

Use route-scoped multipart middleware for uploads, then validate and store files under strict server-controlled limits. An upload endpoint is a security boundary, not just a form handler.
