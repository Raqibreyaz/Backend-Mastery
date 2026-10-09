# Multipart Uploads in Amazon S3

## 1. What is a multipart upload?

A multipart upload is a way to upload one large file to Amazon S3 by splitting it into smaller pieces called parts and uploading those parts separately.

Instead of sending a 5 GB file as one enormous request, your application divides it into smaller chunks, uploads them independently, and asks S3 to combine them into the final object.

Imagine uploading a large video:

```text
video.mp4 (5 GB)
       |
       v
 Split into parts
       |
       +---- Part 1: 100 MB
       +---- Part 2: 100 MB
       +---- Part 3: 100 MB
       +---- ...
       +---- Part N: remaining bytes
                    |
                    v
             Upload parts to S3
                    |
                    v
          Complete multipart upload
                    |
                    v
           video.mp4 available in S3
```

S3 assembles the uploaded parts in the specified order when you complete the multipart upload.

The key idea: Multipart upload makes large-file uploads more resilient and allows parts to be uploaded concurrently, retried individually, and resumed without retransmitting the entire file.

## 2. One-sentence summary

S3 multipart upload is a three-stage protocol: initiate an upload, upload numbered parts and collect their identifiers, then complete the upload so S3 creates the final object.

## 3. Why do we need multipart uploads?

Suppose you are building a video-sharing platform. Users upload videos that can be several gigabytes in size.

A naive implementation might send the entire file in one HTTP request.

That creates several problems.

### Problem 1: A failed upload wastes time

Suppose a user uploads a 4 GB file. After 3.8 GB has been transmitted, their internet connection drops.

With a single-request upload, the request may fail, forcing the client to start over.

With multipart upload, completed parts can remain available for reuse until the upload is completed or aborted. The client can retry only the missing or failed parts.

### Problem 2: Uploading takes too long

A single upload generally uses one request stream. A multipart upload can send multiple parts concurrently.

For example:

```text
Sequential upload:

Part 1 ──────>
              Part 2 ──────>
                            Part 3 ──────>


Concurrent upload:

Part 1 ──────>
Part 2 ──────>
Part 3 ──────>
```

Concurrency can improve throughput when the network and S3 can handle multiple requests efficiently.

However, more concurrent parts do not always mean a faster upload. Network bandwidth, CPU usage, memory, connection limits, and part size all matter.

### Problem 3: Retrying a large request is expensive

If a 100 MB part fails, your application may retry that part rather than retransmitting the other successfully uploaded parts.

This is particularly useful for unreliable mobile connections and large video, backup, archive, and data-processing workloads.

### Problem 4: S3 has upload-size constraints

A normal S3 `PutObject` request supports objects up to 5 GB. Multipart upload supports much larger objects.

The commonly documented multipart limits are:

| Property                | S3 multipart upload limit   |
| ----------------------- | --------------------------- |
| Maximum object size     | 50 TiB                      |
| Maximum number of parts | 10,000                      |
| Minimum part size       | 5 MiB, except the last part |
| Maximum part size       | 5 GiB                       |
| Last part               | Can be smaller than 5 MiB   |
| Part numbers            | 1–10,000                    |

These are service limits, not necessarily recommended application settings. Confirm the current limits and API requirements in the official documentation before designing a production uploader.

## 4. How multipart upload works internally

S3 multipart upload is a protocol with three required stages.

**Step 1:** Initiate — `CreateMultipartUpload`

Your application tells S3 that it wants to upload an object. S3 returns a unique `UploadId`.

**Step 2:** Upload parts — `UploadPart`

Each part has a part number and is uploaded using the same `UploadId`. S3 returns an ETag for each successfully uploaded part.

**Step 3:** Complete — `CompleteMultipartUpload`

Your application submits the uploaded parts' numbers and ETags. S3 assembles them into the final object.

There is also an important cleanup operation:

- `AbortMultipartUpload` cancels the upload and removes its uploaded parts, subject to handling any in-flight requests.

The official API reference describes these operations and the role of the upload ID.

### 4.1 Stage 1: Initiate the upload

Your application requests an upload session for a particular S3 object key.

For example:

```text
Bucket: my-video-bucket
Key: videos/intro.mp4
```

S3 returns an upload ID:

```text
UploadId = "abc123-upload-session"
```

Think of this ID as a session identifier.

Every part upload must refer to the correct combination of:

```text
Bucket + Object Key + Upload ID
```

The upload ID identifies the particular multipart upload, not the final object's contents.

Two upload sessions can target the same object key. Applications should therefore manage their own upload sessions carefully to avoid completing the wrong upload or overwriting an object unexpectedly.

### 4.2 Stage 2: Upload parts

Suppose the file is 25 MiB and the chosen part size is 5 MiB.

The client creates five parts:

| Part number | Byte range | Size  |
| ----------- | ---------- | ----- |
| 1           | 0–5 MiB    | 5 MiB |
| 2           | 5–10 MiB   | 5 MiB |
| 3           | 10–15 MiB  | 5 MiB |
| 4           | 15–20 MiB  | 5 MiB |
| 5           | 20–25 MiB  | 5 MiB |

The byte ranges above use half-open intervals conceptually: each part starts where the previous one ends, with no duplicated or missing bytes.

The requests identify their parts as follows:

```text
UploadPart
  Bucket: my-video-bucket
  Key: videos/intro.mp4
  UploadId: abc123-upload-session
  PartNumber: 1
  Body: bytes for part 1
```

The second request uses `PartNumber: 2`, and so on.

S3 responds with an ETag for each successfully uploaded part.

For example:

```text
Part 1 → ETag: "etag-1"
Part 2 → ETag: "etag-2"
Part 3 → ETag: "etag-3"
Part 4 → ETag: "etag-4"
Part 5 → ETag: "etag-5"
```

These are illustrative ETags, not actual S3 response values.

Important: If a part is uploaded again with the same part number under the same upload ID, the new part replaces the previously uploaded part with that number.

### 4.3 Stage 3: Complete the upload

Once all required parts have been uploaded successfully, the application sends a completion request containing the part numbers and their corresponding ETags.

Conceptually:

```json
{
  "Bucket": "my-video-bucket",
  "Key": "videos/intro.mp4",
  "UploadId": "abc123-upload-session",
  "MultipartUpload": {
    "Parts": [
      { "PartNumber": 1, "ETag": "\"etag-1\"" },
      { "PartNumber": 2, "ETag": "\"etag-2\"" },
      { "PartNumber": 3, "ETag": "\"etag-3\"" },
      { "PartNumber": 4, "ETag": "\"etag-4\"" },
      { "PartNumber": 5, "ETag": "\"etag-5\"" }
    ]
  }
}
```

S3 assembles the listed parts in ascending order of part number.

If the request succeeds, the object becomes available as the completed S3 object.

A completion request must include the correct part numbers and ETags. You cannot simply tell S3 to concatenate whatever happens to be present in the upload session.

### 4.4 What happens if completion never occurs?

Suppose the client uploads all 100 parts but closes the application before calling `CompleteMultipartUpload`.

The final object has not been assembled. The uploaded parts remain associated with an incomplete multipart upload until it is completed or aborted, or an applicable lifecycle rule removes it.

That means a multipart upload is not complete merely because every part has been transmitted.

```text
CreateMultipartUpload
        |
        v
Upload part 1 ── Success
Upload part 2 ── Success
Upload part 3 ── Success
        |
        v
Client crashes
        |
        v
Incomplete multipart upload
        |
        +---- Resume and complete
        |
        +---- Abort and clean up
```

S3 can charge for the storage consumed by uploaded parts while the upload remains incomplete.

## 5. Multipart upload limits and part-size calculation

The size limits are important because they determine how many parts you need and how much data each request carries.

The AWS limits documentation lists a maximum of 10,000 parts, part sizes from 5 MiB to 5 GiB, and no minimum size for the final part. It lists the maximum object size as 48.8 TiB.

One correction to the rough figures above: use the official maximum object size of 48.8 TiB, rather than assuming the maximum is 50 TiB.

### 5.1 How many parts do we need?

The calculation is:

$$N = \left\lceil \frac{S}{P} \right\rceil$$

Where:

- $N$ = number of parts.
- $S$ = total file size in bytes.
- $P$ = part size in bytes.
- $\lceil x \rceil$ = round up to the next integer.

For a 1 GiB file and 16 MiB parts:

$$N = \left\lceil \frac{1024}{16} \right\rceil = 64$$

So the client uploads 64 parts.

For a 1 GiB file and 5 MiB parts:

$$N = \left\lceil \frac{1024}{5} \right\rceil = 205$$

The final part is smaller than 5 MiB because the total size is not an exact multiple of 5 MiB. That is allowed for the final part.

### 5.2 Choosing a part size

A good part size depends on file size, bandwidth, reliability, concurrency, and memory constraints.

| Part size       | Benefit                                         | Trade-off                                           |
| --------------- | ----------------------------------------------- | --------------------------------------------------- |
| 5 MiB           | Small retries; low per-part memory requirements | More requests for large files                       |
| 16–32 MiB       | Reasonable starting point for many workloads    | More data to retransmit when a part fails           |
| 64–128 MiB      | Fewer requests for large files                  | More memory or buffering per active upload          |
| Hundreds of MiB | Can suit high-bandwidth workloads               | Expensive retries and potentially high memory usage |

These are example tuning ranges, not universal performance recommendations.

For very large objects, the 10,000-part limit becomes important. Increasing the part size helps keep the part count below that limit.

### 5.3 Why part size and concurrency must be tuned together

Suppose:

```text
Part size = 32 MiB
Concurrency = 4
```

A rough upper estimate of the payload data held by four active parts is:

$$32 \text{ MiB} \times 4 = 128 \text{ MiB}$$

This is not a guaranteed memory measurement. Real memory usage depends on whether the client streams or buffers parts, how the SDK reads input, and other runtime allocations.

If you increase concurrency to 16, the corresponding rough payload estimate becomes:

$$32 \text{ MiB} \times 16 = 512 \text{ MiB}$$

This illustrates why high concurrency can consume substantial memory in an application that buffers active parts.

## 6. Multipart upload vs a normal S3 upload

| Property                    | `PutObject`                     | Multipart upload                                          |
| --------------------------- | ------------------------------- | --------------------------------------------------------- |
| Number of requests          | Usually one                     | Initiation, multiple part requests, completion            |
| Best suited for             | Small and moderate objects      | Large objects                                             |
| Independent part retries    | No                              | Yes                                                       |
| Parallel part uploads       | No                              | Yes                                                       |
| Resume from completed parts | No multipart session to resume  | Possible while the session and part data remain available |
| Complexity                  | Lower                           | Higher                                                    |
| Cleanup requirements        | No incomplete multipart session | Must complete or abort the session                        |
| Maximum object size         | 5 GB                            | 48.8 TiB, according to the cited AWS limits page          |

AWS generally recommends considering multipart upload for objects around 100 MB or larger. The exact crossover depends on the workload.

Do not use multipart upload just because it exists. For a 200 KB image, a normal upload is usually simpler.

## 7. Building multipart uploads in Node.js

There are two main approaches:

1. Managed upload using the AWS SDK — the SDK handles the multipart workflow for you.
2. Manual multipart upload — your application explicitly initiates the upload, uploads parts, and completes or aborts it.

For most Node.js backend applications, start with the managed approach. Learn the manual approach when you need resumable uploads, direct browser-to-S3 uploads, or detailed control over upload state.

### 7.1 Install the AWS SDK

Use AWS SDK for JavaScript v3.

```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage
```

Configure AWS credentials using an IAM role or the standard AWS credential provider chain. Avoid hardcoding access keys in your source code.

For local development, AWS profiles or environment-based credentials can be used. In production, prefer an appropriately scoped IAM role.

### 7.2 The simplest managed upload

```js
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream } from "node:fs";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

async function uploadFile(filePath, key) {
  const uploader = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: createReadStream(filePath),
      ContentType: "video/mp4",
    },
    partSize: 16 * 1024 * 1024,
    queueSize: 4,
    leavePartsOnError: false,
  });

  uploader.on("httpUploadProgress", progress => {
    console.log("Upload progress:", progress);
  });

  return await uploader.done();
}

uploadFile("./video.mp4", "videos/video.mp4")
  .then(result => console.log("Upload completed:", result))
  .catch(error => console.error("Upload failed:", error));
```

This example uses a local file stream to avoid loading the entire file into a JavaScript buffer.

The SDK's `Upload` abstraction manages multipart operations when necessary and exposes configurable part size, concurrency, and progress reporting.

#### Understand the configuration

| Option              | Meaning                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `client`            | The configured S3 client                                               |
| `Bucket`            | The destination bucket                                                 |
| `Key`               | The destination object's key                                           |
| `Body`              | The file contents or supported stream                                  |
| `ContentType`       | The MIME type stored with the object                                   |
| `partSize`          | The target size of each part                                           |
| `queueSize`         | Maximum number of concurrent upload workers managed by the abstraction |
| `leavePartsOnError` | Whether to leave uploaded parts behind after a failed upload           |

With `queueSize: 4` and `partSize: 16 MiB`, the uploader can have up to four part uploads in progress. The rough active payload size may therefore be around 64 MiB, although actual memory use depends on stream buffering and implementation details.

Setting `leavePartsOnError: false` asks the abstraction to clean up incomplete multipart work after an error. If you intentionally preserve parts for recovery, you must implement cleanup and recovery yourself.

## 8. Implementing multipart upload manually

Managed upload is convenient, but manually implementing the protocol helps you understand exactly what is happening.

The following example uploads a file using the low-level SDK commands. It is intended for learning and controlled backend use; a production implementation needs additional validation, recovery, and lifecycle management.

### 8.1 The low-level commands

```js
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
```

Each command corresponds to an S3 API operation.

```text
CreateMultipartUploadCommand
             |
             v
         UploadId
             |
             v
UploadPartCommand × N
             |
             v
 PartNumber + ETag list
             |
             v
CompleteMultipartUploadCommand
             |
             v
        Final object
```

### 8.2 A complete small-file example

This version reads a file into memory and divides it into parts. It demonstrates the protocol clearly, but for large files prefer a streaming uploader or carefully bounded streaming implementation.

```js
import { readFile } from "node:fs/promises";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

const MiB = 1024 * 1024;

async function uploadMultipart(filePath, key) {
  const Bucket = process.env.S3_BUCKET;
  const file = await readFile(filePath);

  const partSize = 8 * MiB;
  let uploadId;

  try {
    const initiated = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket,
        Key: key,
        ContentType: "application/octet-stream",
      })
    );

    uploadId = initiated.UploadId;

    if (!uploadId) {
      throw new Error("S3 did not return an upload ID");
    }

    const parts = [];

    for (
      let offset = 0, partNumber = 1;
      offset < file.length;
      offset += partSize, partNumber++
    ) {
      const body = file.subarray(
        offset,
        Math.min(offset + partSize, file.length)
      );

      const result = await s3.send(
        new UploadPartCommand({
          Bucket,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
          Body: body,
        })
      );

      if (!result.ETag) {
        throw new Error(`Missing ETag for part ${partNumber}`);
      }

      parts.push({
        PartNumber: partNumber,
        ETag: result.ETag,
      });

      console.log(`Uploaded part ${partNumber}`);
    }

    const completed = await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      })
    );

    uploadId = undefined;

    return completed;
  } catch (error) {
    if (uploadId) {
      try {
        await s3.send(
          new AbortMultipartUploadCommand({
            Bucket,
            Key: key,
            UploadId: uploadId,
          })
        );
      } catch (abortError) {
        console.error("Abort failed; cleanup may still be needed", abortError);
      }
    }

    throw error;
  }
}

uploadMultipart("./sample.bin", "uploads/sample.bin")
  .then(console.log)
  .catch(console.error);
```

### 8.3 What this example teaches

- `CreateMultipartUploadCommand` creates the upload session.
- `UploadPartCommand` sends a specific portion of the file.
- `PartNumber` determines the part's position.
- The ETag from each successful response is saved.
- `CompleteMultipartUploadCommand` assembles the final object.
- `AbortMultipartUploadCommand` attempts cleanup after a failure.

This example uploads parts sequentially. To upload concurrently, you can run a bounded set of part-upload promises, collect their results, and sort them by part number before completion.

Do not simply replace the loop with `Promise.all()` for an enormous file. That can schedule thousands of requests and consume excessive memory. Use bounded concurrency.

## 9. Direct browser-to-S3 multipart uploads

This is one of the most important production architectures for applications that upload large files.

Suppose you are building a video platform with this flow:

```text
Browser → Node.js backend → S3
```

A naive design sends the entire file through your backend. That makes your backend handle all incoming file bytes, which consumes bandwidth, network connections, and possibly memory or disk space.

A more scalable design is:

```text
                    Control requests
Browser ──────────────────────────────> Node.js backend
   ^                                         |
   |                                         |
   |       Presigned URLs                    |
   +─────────────────────────────────────────+
   |
   | File parts uploaded directly
   |
   +────────────────────────────────────────> Amazon S3
```

The Node.js backend controls the upload session and permissions. The browser sends the actual file parts directly to S3.

This reduces the data traffic passing through your application server.

### 9.1 What is a presigned URL?

A presigned URL is a time-limited URL that grants permission to perform a specific S3 operation using credentials belonging to the principal that generated it.

The browser can use the URL without possessing AWS access keys.

For multipart uploads, the backend can create a presigned URL for an individual `UploadPart` operation. Each URL is scoped to the relevant bucket, object key, upload ID, part number, and request signing requirements.

A presigned URL is a temporary capability. Anyone who obtains it may be able to use the permitted operation until it expires or the underlying permissions become invalid.

### 9.2 Recommended request flow

1\. Browser → Backend

Request permission to upload a file, including file size, name, and content type.

2\. Backend → S3

Validate the request and call `CreateMultipartUpload`. Store the resulting upload ID in your database.

3\. Backend → Browser

Generate presigned URLs for the requested part numbers. Return them to the browser.

4\. Browser → S3

Upload the parts directly to S3, with bounded concurrency. Collect each part number and the ETag from the response.

5\. Browser → Backend

Submit the completed part list. The backend validates it and calls `CompleteMultipartUpload`.

6\. Backend

Mark the upload as completed in your database and allow the application to use the resulting object.

The database update and S3 completion are separate operations. Your application should handle cases where one succeeds and the other fails.

### 9.3 Why must the backend be involved?

If the browser can freely choose any bucket, object key, or upload ID, users could abuse your storage permissions.

Your backend should enforce:

- User authentication and authorization.
- A unique, controlled object key.
- Maximum file size and allowed content types.
- Allowed part numbers and upload ownership.
- Upload expiration and cleanup policies.
- Validation before completing the upload.
- Limits on active uploads and generated presigned URLs.

Never expose AWS secret access keys to the browser.

## 10. How to generate presigned part URLs in Node.js

Install the presigner package:

```bash
npm install @aws-sdk/s3-request-presigner
```

Here is the core backend logic for generating a presigned URL.

```js
import {
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

async function createPartUrl({
  key,
  uploadId,
  partNumber,
}) {
  const command = new UploadPartCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  return getSignedUrl(s3, command, {
    expiresIn: 900,
  });
}
```

`expiresIn: 900` means the URL is intended to expire after 15 minutes, subject to the lifetime and permissions of the credentials used to sign it.

The backend must first create the multipart upload and store its upload ID. It should also ensure that the requested key and upload ID belong to the authenticated user.

A production API might look like:

```text
POST /uploads
POST /uploads/:id/parts
POST /uploads/:id/complete
POST /uploads/:id/abort
```

The exact endpoint structure is your application design, not something required by S3.

## 11. Uploading a part from the browser

Once the backend returns a presigned URL, the browser can upload a slice of the file.

```js
async function uploadPart(file, start, end, url) {
  const chunk = file.slice(start, end);

  const response = await fetch(url, {
    method: "PUT",
    body: chunk,
  });

  if (!response.ok) {
    throw new Error(`Part upload failed: ${response.status}`);
  }

  const etag = response.headers.get("ETag");

  if (!etag) {
    throw new Error("ETag was not exposed by the S3 CORS configuration");
  }

  return etag;
}
```

Here:

- `file.slice(start, end)` creates a `Blob` representing the requested byte range.
- `fetch()` sends that part to S3 using the presigned URL.
- The ETag is collected for the completion request.

The backend must not assume that a client-supplied ETag proves a part was uploaded correctly. Before completion, it should validate the part list against S3's actual uploaded parts.

### 11.1 CORS configuration

For browser uploads, S3 needs an appropriate CORS configuration.

At minimum, configure the permitted frontend origin and the `PUT` method. You must also expose the `ETag` response header if your browser code needs to read it.

Conceptually:

```json
[
  {
    "AllowedOrigins": ["https://app.example.com"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

This is an illustrative policy. Restrict origins and headers to what your application actually needs.

CORS is a browser access policy. It is not a replacement for S3 authentication or authorization.

## 12. Upload progress and bounded concurrency

For a large file, you generally do not want to upload every part sequentially. You also do not want to launch unlimited requests.

Suppose a file has 100 parts.

Sequential execution:

```js
for (const part of parts) {
  await upload(part);
}
```

Only one part upload is active at a time.

Unbounded execution:

```js
await Promise.all(parts.map(upload));
```

This can start all 100 uploads immediately.

A safer design uses a fixed number of concurrent workers.

```js
async function runWithConcurrency(items, limit, task) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) return;

      results[index] = await task(items[index], index);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(limit, items.length) },
      () => worker()
    )
  );

  return results;
}
```

Usage:

```js
const results = await runWithConcurrency(
  parts,
  4,
  async (part, index) => {
    return uploadPart(part);
  }
);
```

This simple helper stops scheduling additional tasks if one of its workers throws an error, but other tasks already in progress may continue. A production uploader should also coordinate cancellation and cleanup.

Keep the completed-part list indexed by part number. Concurrent requests can finish out of order, so completion order is not the same as part order.

## 13. ETags, checksums, and data integrity

This is a particularly important detail.

An ETag is an entity tag returned by S3. Multipart upload requires you to retain the ETag returned for each part and include it in the completion request.

However:

Do not assume that the final multipart object's ETag is the MD5 hash of the entire file.

For multipart uploads, S3's ETag is generally derived from the part checksums and can have a suffix indicating the number of parts. Encryption and checksum modes can also affect its interpretation.

### What should you use for integrity verification?

S3 supports checksum algorithms such as CRC32, CRC32C, CRC64/NVME, SHA-1, and SHA-256, subject to supported checksum types and operation requirements.

Checksums help detect corruption or unintended changes in uploaded data.

For example:

```text
Original file
     |
     v
Compute checksum
     |
     v
Upload parts
     |
     v
S3 validates applicable checksums
     |
     v
Verify stored checksum when needed
```

The exact workflow depends on whether you use a full-object checksum or a composite checksum. Some algorithms support one type but not the other. When using additional multipart checksums, follow the required part-number sequencing and completion-request rules for that checksum mode.

Keep these concepts separate:

- ETag: Needed for multipart completion and useful as an entity identifier.
- Checksum: Used to verify data integrity.
- File size: Used to validate expected upload length.
- Content type: Describes the media type, not the integrity of the bytes.

An ETag is not an authorization token and does not establish that a file is safe to process.

## 14. Resumable uploads: what happens after a failure?

Multipart upload makes resumability possible, but it does not automatically provide a complete resumable-upload product.

Suppose a 2 GB file is divided into 32 parts.

After uploading 20 parts, the browser closes.

The application needs enough information to continue:

```text
Upload ID
Bucket and object key
File size
Part size
Part numbers already uploaded
ETags and checksums
Upload owner and status
```

The backend should persist the upload session and its state in a database or another durable store.

### 14.1 Resume strategy

When the user returns:

1. Authenticate the user.
2. Retrieve the saved upload session.
3. Verify that the upload is still valid.
4. Query S3 using `ListParts` to identify the parts that currently exist.
5. Reconcile S3's part list with the expected file layout.
6. Generate new presigned URLs for missing or expired part uploads.
7. Upload missing parts.
8. Complete the upload using the validated part list.

`ListParts` returns at most 1,000 parts per request, so very large uploads require pagination.

### 14.2 Does S3 remember the local file?

No.

S3 stores the uploaded parts, but it does not keep the original file on your user's computer.

The browser needs access to the file again to upload missing parts. Your application must also ensure that the file being resumed is the same file, with the same size and expected content.

For example, a user might select a different file with the same name. A robust system should not blindly reuse an upload session just because the filenames match.

### 14.3 What if the presigned URL expires?

The upload session and the presigned URL have different lifetimes.

An expired URL may be replaced with a newly generated URL for the same valid upload ID and part number, provided the backend still has permission to sign the request and the upload has not been completed or aborted.

This is why the application should persist the upload ID, not just the temporary URLs.

## 15. Failure handling and cleanup

Multipart upload has several failure scenarios worth planning for.

| Failure                          | Recommended response                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| A part upload fails              | Retry that part with bounded exponential backoff                                   |
| A presigned URL expires          | Request a new URL for the same part                                                |
| Browser disconnects              | Persist state and resume when the user returns                                     |
| Completion fails                 | Inspect the error, reconcile the uploaded parts, and retry safely when appropriate |
| Backend crashes after initiation | Recover the saved session or abort it                                              |
| Upload is abandoned              | Abort the upload or rely on a configured lifecycle cleanup rule                    |
| Abort request fails              | Retry cleanup and monitor incomplete uploads                                       |
| File changes during resume       | Reject the session or restart the upload                                           |

### 15.1 Retry with exponential backoff

Instead of retrying immediately in a tight loop, increase the delay between attempts.

For example:

```text
Attempt 1 → failure
Wait 500 ms

Attempt 2 → failure
Wait 1 second

Attempt 3 → failure
Wait 2 seconds

Attempt 4 → success
```

Add random jitter to prevent many clients from retrying simultaneously.

Retry only errors that are likely to be transient. Authentication errors, invalid part numbers, and other permanent errors should generally be fixed rather than retried indefinitely.

For timeouts during completion, be careful: the server might have completed the operation even if the client did not receive the response. Reconcile the upload state and inspect the resulting object before blindly restarting the entire workflow.

### 15.2 Why abort matters

Uploaded parts consume storage until the multipart upload is completed or aborted, or until an applicable cleanup mechanism removes them.

S3 supports lifecycle rules to abort incomplete multipart uploads after a configured period. This is an important safety net, but it should not replace normal application cleanup.

## 16. Production architecture: recommended database model

For a real upload service, store the upload's state separately from the final file's metadata.

An example relational table:

```sql
CREATE TABLE uploads (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    object_key TEXT NOT NULL,
    upload_id TEXT,
    original_filename TEXT,
    expected_size BIGINT NOT NULL,
    part_size BIGINT NOT NULL,
    content_type TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Possible statuses:

```text
INITIATED
UPLOADING
COMPLETING
COMPLETED
ABORTING
ABORTED
FAILED
```

The status field helps the backend decide which operations are valid.

For example:

```text
INITIATED → UPLOADING → COMPLETING → COMPLETED
                    \
                     → ABORTING → ABORTED
```

A production design should handle partial failures between S3 operations and database updates.

For instance, S3 might successfully complete the object while the database update fails. Your recovery process should detect the completed object and reconcile the database state instead of assuming the upload failed completely.

For part metadata, you can either store the part list in a separate table or query S3 with `ListParts` when resuming and completing an upload. S3 should remain the source of truth for which parts actually exist.

## 17. Security considerations

Multipart upload introduces temporary permissions and long-running upload sessions. Treat both carefully.

- Use least privilege: Grant the backend only the S3 operations and bucket access it needs.
- Use unique object keys: Avoid unintended overwrites of another user's file.
- Authenticate every control request: A user must not be able to complete or abort another user's upload.
- Validate part numbers: Reject values outside the allowed range and parts not associated with the upload.
- Limit upload sizes: Calculate the expected number of parts and reject unreasonable requests before creating a session.
- Expire sessions: Define how long an upload can remain active.
- Protect presigned URLs: Do not log them indiscriminately or expose them to unrelated clients.
- Validate the completed object: Check its actual size, metadata, and required checksums before processing it.
- Scan uploaded files where appropriate: A valid S3 upload does not guarantee that a video, document, or archive is safe.
- Restrict CORS: Allow only the frontend origins and methods required by the application.
- Encrypt data: Use appropriate S3 encryption settings and IAM/KMS permissions for your requirements.

For applications handling user-generated files, the upload should generally be marked complete only after the backend has verified the S3 object and updated its own durable state.

## 18. Performance tuning checklist

When optimizing multipart uploads, consider the entire path from the client to S3.

| Parameter           | What to investigate                                                        |
| ------------------- | -------------------------------------------------------------------------- |
| Part size           | Does it balance request overhead and retry cost?                           |
| Concurrency         | Is the network saturated, or are requests competing for resources?         |
| Memory              | Are too many active parts being buffered?                                  |
| Retry policy        | Are transient failures retried without excessive traffic?                  |
| URL expiration      | Can slow uploads finish before their URLs expire?                          |
| File size           | Is the expected part count below 10,000?                                   |
| Connection handling | Are requests being throttled or delayed by connection limits?              |
| Checksum strategy   | Are checksums being validated appropriately?                               |
| Lifecycle rules     | Are abandoned parts cleaned up?                                            |
| Metrics             | Are failures, throughput, completion time, and abandoned sessions tracked? |

A useful way to think about throughput is:

$$\text{Throughput} \approx \frac{\text{Successfully uploaded bytes}}{\text{Elapsed time}}$$

Measure successful bytes, not merely the number of requests started.

## 19. Common mistakes

1. Assuming multipart upload is automatically resumable. You still need to persist session state and reconcile parts.
2. Forgetting the upload ID. Every part must belong to the correct multipart upload.
3. Forgetting the ETags. Completion requires the appropriate part numbers and ETags.
4. Assuming the ETag is always the file's MD5. Multipart ETags generally are not full-file MD5 hashes.
5. Uploading all parts without a concurrency limit. This can exhaust memory or overload the client.
6. Forgetting to abort failed uploads. Incomplete parts can continue to incur storage charges.
7. Trusting the browser's completion list blindly. Validate uploaded parts with S3 before completing.
8. Passing the whole file through the backend unnecessarily. Direct-to-S3 uploads can reduce backend bandwidth and resource usage.
9. Using a part size that produces too many parts. Remember the 10,000-part limit.
10. Treating CORS as security. CORS does not replace IAM or authorization.
11. Ignoring completion ambiguity. A lost response does not prove S3 failed to complete the upload.
12. Assuming `Promise.all()` is safe for thousands of parts. Use bounded concurrency and cancellation-aware error handling.

## 20. Key takeaways

- Multipart upload divides a large object into independently uploaded parts.
- The protocol consists of initiation, uploading parts, and completion.
- Each upload session has a unique upload ID.
- Each part has a number, and the ETag from its successful upload is needed for completion.
- Parts can be uploaded concurrently and retried individually.
- Part size and concurrency affect performance, memory use, and retry cost.
- The Node.js SDK's `Upload` abstraction handles much of the multipart workflow.
- For browser applications, presigned part URLs let clients upload directly to S3 without receiving AWS credentials.
- Resumability requires persistent application state and reconciliation with S3.
- Checksums and ETags have different purposes.
- Failed or abandoned multipart uploads should be aborted or cleaned up by a lifecycle rule.
- Production systems must handle retries, URL expiration, validation, authorization, and failures between S3 and database operations.

## 21. Minimal self-test

Try answering these without looking back:

1. What are the three main stages of multipart upload?
2. Why does every part request need an upload ID?
3. What information is required to complete an upload?
4. Why is uploading a part with the same part number again useful?
5. How do part size and concurrency affect memory and throughput?
6. What does a presigned URL allow a browser to do?
7. Why should a backend validate the part list before completion?
8. How would you resume an upload after the browser closes?
9. Why is an S3 ETag not always the full-file MD5 checksum?
10. How would you prevent abandoned uploads from accumulating?
11. What should happen if the completion request times out?
12. How would you design a secure direct-to-S3 upload flow for a video-sharing application?

## 22. Official references

- [S3 multipart upload overview](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) — workflow, part uploads, completion, and checksums.
- [S3 multipart upload limits](https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html) — object size, part size, and part-count limits.
- [Aborting incomplete multipart uploads](https://docs.aws.amazon.com/AmazonS3/latest/userguide/abort-mpu.html) — cleanup and storage considerations.
- [S3 presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) — temporary upload and download permissions.
- [AWS SDK v3 managed uploads](https://github.com/aws/aws-sdk-js-v3/blob/main/lib/lib-storage/README.md) — Node.js SDK configuration and upload progress.
- [Checking S3 object integrity](https://docs.aws.amazon.com/AmazonS3/latest/userguide/checking-object-integrity.html) — checksum algorithms and multipart ETag behavior.
