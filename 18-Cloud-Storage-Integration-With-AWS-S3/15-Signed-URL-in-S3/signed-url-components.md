### ✅ Sample Signed GET URL

```txt
https://my-bucket.s3.us-east-1.amazonaws.com/video.mp4?
X-Amz-Algorithm=AWS4-HMAC-SHA256&
X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20250730%2Fus-east-1%2Fs3%2Faws4_request&
X-Amz-Date=20250730T152116Z&
X-Amz-Expires=3600&
X-Amz-SignedHeaders=host&
X-Amz-Signature=abc123def456...
```

---

## 🧩 Components of a Signed URL

| **Component**             | **Purpose / Meaning**                                                                                                                                                |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base URL**              | `https://my-bucket.s3.us-east-1.amazonaws.com/video.mp4`<br>Points to the S3 object (bucket + key).                                                                  |
| **`X-Amz-Algorithm`**     | Always `AWS4-HMAC-SHA256` — the signing algorithm used (HMAC with SHA-256).                                                                                          |
| **`X-Amz-Credential`**    | Format: `AccessKey/Date/Region/Service/aws4_request`<br>E.g., `AKIA.../20250730/us-east-1/s3/aws4_request`<br>Identifies the credentials and scope of the signature. |
| **`X-Amz-Date`**          | Timestamp (UTC) of when the signature was created.<br>Format: `YYYYMMDD'T'HHMMSS'Z'`<br>e.g., `20250730T152116Z`                                                     |
| **`X-Amz-Expires`**       | Duration (in seconds) for which the signed URL is valid. E.g., `3600` = 1 hour.                                                                                      |
| **`X-Amz-SignedHeaders`** | Headers that are included in the signature — usually just `host`.                                                                                                    |
| **`X-Amz-Signature`**     | The actual **HMAC-SHA256 signature** of the request, created using your Secret Access Key.                                                                           |

---

## 🔐 What AWS Checks When You Use the URL

When someone opens the signed URL:

1. AWS reads all the query parameters
2. Recalculates the signature using the same rules
3. Validates:

   * The **timestamp** is not expired
   * The **signature** matches
   * The IAM credentials used have `s3:GetObject` permission
4. If all checks pass: ✅ file is served

---

## ❗ Important Notes

| Thing                | Explanation                                                      |
| -------------------- | ---------------------------------------------------------------- |
| Secret Key           | Never included in the URL — only used to generate the signature. |
| Access Key           | Public part — included in `X-Amz-Credential`.                    |
| Safe to Share?       | Yes, if short-lived and for read-only access.                    |
| Invalid after expiry | Yes — expires exactly after `X-Amz-Expires` seconds.             |
| IP Restriction       | Not included by default, but can be added via signed policies.   |