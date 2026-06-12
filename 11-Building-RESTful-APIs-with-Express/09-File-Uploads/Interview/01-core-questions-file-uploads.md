# Core Questions – File Uploads

---

### Q1. How do you handle file uploads in an Express.js application?

Type: Concept | Difficulty: Easy | Asked: High

**Hook:** “User uploads a profile picture from a form – what happens on the backend?”

**Answer (max 4 bullets):**
- Browsers send files using `multipart/form-data`, which requires a multipart parser; in Express, **Multer** is the most common middleware.
- You install and configure Multer (`npm install multer`), then apply it to routes with `upload.single('fieldName')` or `upload.array('fieldName')`.
- After Multer runs, uploaded file metadata is available on `req.file` or `req.files`, and other form fields are in `req.body`.
- Your route handler can then validate, move, or upload the file to persistent storage.

**See also:** `../Learning/01-multipart-basics-and-multer.md`

---

### Q2. What is Multer and how does it work?

Type: Concept | Difficulty: Easy–Medium | Asked: High

**Hook:** “What exactly does Multer do for you?”

**Answer:**
- Multer is Express middleware specifically for handling `multipart/form-data`, primarily used for file uploads.
- It parses incoming multipart requests as the request streams in and writes files to memory or disk based on its configuration.
- It then populates `req.file`/`req.files` with file metadata (path, size, mimetype, etc.) and `req.body` with non-file fields.
- You can configure it with different storage engines (disk, memory, custom) and limits (file size, number of files).

**See also:** `../Learning/02-multer-api-and-storage.md`

---

### Q3. How do you configure Multer for single, multiple, and mixed uploads?

Type: API usage | Difficulty: Medium | Asked: Medium–High

**Hook:** “How would you allow one avatar image and many gallery images in a single form?”

**Answer:**
- `upload.single('avatar')` – one file under field name `avatar`, accessible as `req.file`.
- `upload.array('photos', maxCount)` – multiple files under the same field name, accessible as `req.files`.
- `upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 10 }])` – multiple named fields, available as `req.files.avatar` and `req.files.gallery`.
- `upload.none()` – parse text-only `multipart/form-data` (no files), with fields in `req.body`.

**See also:** `../Learning/02-multer-api-and-storage.md`

---

### Q4. What are the main security risks with file uploads?

Type: Security | Difficulty: Medium–High | Asked: High

**Hook:** “Why are unrestricted file uploads considered a critical vulnerability?”

**Answer:**
- Attackers can upload **malicious scripts** (e.g. `.php`, `.jsp`) or disguised executables and get them executed if they’re served from a web-accessible directory.
- They can perform **path traversal** to write outside the intended directory if filenames or paths are not validated.
- Large or numerous uploads can exhaust disk space or memory, causing Denial of Service.
- Uploaded files can contain malware or sensitive data; if stored insecurely or exposed, this can lead to data breaches and compromise.

**See also:** `../Learning/03-file-upload-security-patterns.md`

---

### Q5. How do you validate file types and sizes server-side?

Type: Security | Difficulty: Medium–High | Asked: High

**Hook:** “Why is checking the `Content-Type` header or file extension not enough?”

**Answer:**
- Headers like `Content-Type` and the file extension are **user-controlled** and can be spoofed; you must not rely on them for security decisions.
- Use a server-side allowlist of permitted MIME types and extensions and, ideally, inspect the file’s **magic bytes** (e.g. with libraries like `file-type`).
- In Multer, use the `fileFilter` callback to reject disallowed types:

  ```js
  const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid type'));
      cb(null, true);
    },
  });
  ```

- Enforce file size limits at both the reverse proxy (e.g. Nginx `client_max_body_size`) and in Multer’s `limits.fileSize` to stop oversized uploads early.

**See also:** `../Learning/03-file-upload-security-patterns.md`

---

### Q6. How should you name and store uploaded files?

Type: Security / Architecture | Difficulty: Medium | Asked: Medium–High

**Hook:** “Is it safe to store uploads with the original filename in `public/uploads`?”

**Answer:**
- Do **not** trust user-supplied filenames; generate your own (e.g., UUID + validated extension) to avoid path traversal and overwrite attacks.
- Store files outside the web root or in dedicated object storage (S3, GCS) rather than directly under static assets served by the web server.
- For web access, serve via signed URLs or a controlled downloads endpoint that enforces auth, headers, and `Content-Disposition`.
- This separation limits the blast radius if uploads are misused or compromised.

**See also:** `../Learning/04-uploads-to-object-storage.md`

---

### Q7. How do you integrate authentication/authorization with file uploads?

Type: Applied | Difficulty: Medium–High | Asked: Medium

**Hook:** “How do you prevent unauthenticated users from uploading files?”

**Answer:**
- As with any route, you should run **auth middleware before Multer** in the Express chain so unauthorized requests are rejected before file data is read.
- Example: `app.post('/upload', authMiddleware, upload.single('file'), handler);` – `authMiddleware` populates/validates `req.user` before Multer writes anything.
- In the handler, you can also apply authorization (e.g., check roles or ownership) before processing or persisting the uploaded file.
- Avoid global Multer on the entire app; scope it to only the routes that actually need uploads.

**See also:** `../Learning/02-multer-api-and-storage.md`

---

### Q8. How would you design a robust file upload flow end-to-end?

Type: Design | Difficulty: High | Asked: Medium–High

**Hook:** “Walk me through the architecture of secure uploads for a production app.”

**Answer:**
- Frontend sends a `multipart/form-data` POST to `/uploads` (or uses a pre-signed S3 URL pattern in advanced setups).
- Express route stack: `auth` → `rateLimiter` → `upload` (Multer with limits/fileFilter) → `validation + AV scan` → `store in S3/DB` → response with metadata or URL.
- Files are validated by type, extension, size, and possibly scanned for malware; filenames are randomized and stored outside web root or in blob storage.
- Access to uploaded files is controlled (e.g. signed URLs or protected download endpoints), not just open static file serving.

**See also:** `../Learning/03-file-upload-security-patterns.md`