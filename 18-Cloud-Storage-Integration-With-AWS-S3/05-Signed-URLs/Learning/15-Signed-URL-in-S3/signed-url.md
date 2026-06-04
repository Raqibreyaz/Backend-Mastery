## ✅ What is a Signed URL in S3?

A **signed URL** is a **temporary, secure link** to access a **private object** in your S3 bucket.

### 🔐 It allows:

* Access to **private files** without making the bucket public.
* File downloads (GET), uploads (PUT/POST), or deletions (DELETE).
* **Time-limited access** using a cryptographic signature.

---

## ✅ When to Use Signed URLs

| Use Case                  | Method                     |
| ------------------------- | -------------------------- |
| Download a private file   | `GET` signed URL           |
| Upload a file to S3       | `PUT` or `POST` signed URL |
| Temporary, secure sharing | Signed URL (short expiry)  |

---

## ✅ How to Generate a GET Signed URL using AWS CLI

### ✅ Prerequisites:

* AWS CLI v2 installed
* IAM credentials configured with `s3:GetObject` permission
* Object already exists in the bucket

---

### 📦 Example Command:

```bash
aws s3 presign s3://your-bucket-name/path/to/file.mp4 --expires-in 3600
```

🔗 Output:

```
https://your-bucket-name.s3.us-east-1.amazonaws.com/networking.webm?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=...&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=...
```

You can share or open this link in a browser — and it will download the file, **even if it’s private**.

---

## 🔐 Key Properties of GET Signed URLs

| Property                | Explanation                                     |
| ----------------------- | ----------------------------------------------- |
| **Secure**              | Uses HMAC-SHA256 signature with your secret key |
| **Temporary**           | Valid only for the time set in `--expires-in`   |
| **Read-only (GET)**     | You can't upload using this URL                 |
| **Globally Accessible** | Works from any IP, unless restricted via policy |
