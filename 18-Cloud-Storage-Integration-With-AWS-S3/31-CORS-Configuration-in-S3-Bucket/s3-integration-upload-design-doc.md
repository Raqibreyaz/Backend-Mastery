# S3 Direct Uploads with Presigned URLs — Design Document

## Goals

* Let the browser upload file bytes **directly to S3** using a short‑lived presigned URL.
* Keep the backend responsible for **auth**, **quota checks**, **directory ownership**, and **bookkeeping**.

---

## High‑level flow

1. **User selects a file** in the browser.
2. **Frontend → Backend**: request a presigned URL to upload (`/uploads/initiate`). Backend validates, creates a pending file document in the DB, and returns the URL.
3. **Frontend → S3**: upload file bytes to the returned URL.
4. **Frontend → Backend**: notify completion (`/uploads/complete`). Backend verifies object in S3, finalizes the DB row (sets `isUploading: false`), and updates directory sizes.

---

### 1) POST /uploads/initiate

Request body:

```json
{
  "name": "report.pdf",
  "size": 1234567,
  "contentType": "application/pdf",
  "parentDirId": "<optional; defaults to req.user.rootDirId>"
}
```

Validation:

* `name` non‑empty, `size > 0`, `contentType` present (fallback `application/octet-stream`).
* `parentDirId` belongs to `req.user` (or default to root).
* Quota: `user.maxStorageInBytes - rootDir.size >= size`.

Actions:

* Derive `extension` from `name`.
* Insert pending DB row (see schema) with `isUploading: true`.
* Build S3 object key: `${fileId}${extension}`.
* Create presigned **PUT** URL with AWS SDK v3.

Response:

```json
{
  "fileId": "66a...",
  "uploadUrl": "https://bucket.s3.region.amazonaws.com/...."
}
```

### 2) POST /uploads/complete

Request body:

```json
{
  "fileId": "66a…"
}
```

Backend steps:

* Look up the pending file by `fileId`, `userId`, `isUploading: true`.
* `HeadObject` on S3 for `key`: verify `ContentLength` equals `expected size` from DB.
* Update DB row: set `isUploading: false`.
* Call `updateDirectoriesSize(parentDirId, size)`.
* Respond `201`.

Response:

```json
{ "message": "File uploaded successfully", "fileId": "66a…" }
```