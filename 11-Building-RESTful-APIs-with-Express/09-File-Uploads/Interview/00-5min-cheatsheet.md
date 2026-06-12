# File Uploads – 5 Minute Cheatsheet

## If you get only 3 questions

1. How do you handle file uploads in an Express app (middleware, route shape, `multipart/form-data`)?
2. How do you configure Multer for single/multiple files and access `req.file` / `req.files`?
3. What are the key security concerns with file uploads and how do you mitigate them?

---

## Mental models (1–2 lines each)

- Browsers send files as **`multipart/form-data`**, which `express.json`/`express.urlencoded` cannot parse; you need a dedicated multipart parser like **Multer**.
- Multer is Express middleware that parses incoming multipart requests and populates `req.file` / `req.files` plus `req.body` for text fields.
- In production, the core of secure uploads is: **validate type**, **limit size**, **sanitize filename / generate UUID**, **store outsideweb root or in object storage**, and **never trust client-provided headers**.
- Middleware **order matters**: auth and authorization should run before Multer so you reject unauthorized requests before streaming large files.
- For image-heavy or file-heavy systems, you usually upload to the app, validate, then push to **S3/GCS/other blob storage** and serve via signed URLs or CDN.

---

## Canonical examples to recall

**1. Basic single-file upload with Multer**

```js
const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // temp folder

const app = express();

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file); // metadata about the uploaded file
  console.log(req.body); // other form fields
  res.status(200).json({ message: 'File uploaded' });
});
```

`upload.single('file')` parses a single file from field name `file` and puts info on `req.file`; text fields go into `req.body`.

---

**2. Multiple files & only-form-data**

```js
// Multiple files
app.post('/photos', upload.array('photos', 5), (req, res) => {
  console.log(req.files); // array of files
  res.json({ count: req.files.length });
});

// Only text fields from multipart/form-data (no files)
app.post('/profile', upload.none(), (req, res) => {
  console.log(req.body);
  res.json({ ok: true });
});
```

Multer has helpers like `.array` for multiple files and `.none` for text-only multipart data.

---

**3. Multer with disk storage config, type & size limits**

```js
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = crypto.randomUUID() + ext;
    cb(null, name);
  },
});

const uploadSecure = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'application/pdf'];
    if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid file type'));
    cb(null, true);
  },
});
```

Use Multer’s `storage`, `limits`, and `fileFilter` to control destination, filename, max size, and allowed MIME types.

---

## Links to full notes

- HTTP forms, `multipart/form-data`, and when you need Multer → `../Learning/01-multipart-basics-and-multer.md`
- Multer usage patterns (`single`, `array`, `fields`, `none`) and storage engines → `../Learning/02-multer-api-and-storage.md`
- File upload security: size limits, type validation, path traversal, storage locations → `../Learning/03-file-upload-security-patterns.md`
- Integrating uploads with S3/GCS and serving via signed URLs → `../Learning/04-uploads-to-object-storage.md`