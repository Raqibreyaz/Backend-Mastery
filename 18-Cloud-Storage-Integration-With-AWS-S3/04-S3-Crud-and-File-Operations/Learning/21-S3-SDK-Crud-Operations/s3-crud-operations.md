# 🪣 BUCKET COMMANDS

---

## 1. ListBucketsCommand

```js
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new ListBucketsCommand({});
const response = await s3Client.send(command);
console.log(response.Buckets);
```

---

## 2. CreateBucketCommand

```js
import { S3Client, CreateBucketCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new CreateBucketCommand({
  Bucket: "procodrr-nodejs-bucket",
});
await s3Client.send(command);
console.log("Bucket created");
```

---

## 3. Unblock Public Access (BlockPublicAccess = false)

```js
import { S3Client, DeletePublicAccessBlockCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new DeletePublicAccessBlockCommand({
  Bucket: "procodrr-nodejs-bucket",
});

await s3Client.send(command);
console.log("✅ Public access block configuration deleted.");
```

or

```js
import { S3Client, PutPublicAccessBlockCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new PutPublicAccessBlockCommand({
  Bucket: "procodrr-nodejs-bucket",
  PublicAccessBlockConfiguration: {
    BlockPublicAcls: false,
    IgnorePublicAcls: false,
    BlockPublicPolicy: false,
    RestrictPublicBuckets: false,
  },
});
await s3Client.send(command);
console.log("Unblocked public access");
```

---

## 4. Update Bucket Policy (Make Bucket Public)

```js
import { S3Client, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const policy = {
  Version: "2012-10-17",
  Statement: [
    {
      Sid: "PublicReadGetObject",
      Effect: "Allow",
      Principal: "*",
      Action: "s3:GetObject",
      Resource: "arn:aws:s3:::procodrr-nodejs-bucket/*",
    },
  ],
};

const command = new PutBucketPolicyCommand({
  Bucket: "procodrr-nodejs-bucket",
  Policy: JSON.stringify(policy),
});

await s3Client.send(command);
console.log("Bucket policy updated to public");
```

---

## 5. DeleteBucketCommand

```js
import { S3Client, DeleteBucketCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new DeleteBucketCommand({
  Bucket: "procodrr-nodejs-bucket",
});
await s3Client.send(command);
console.log("Bucket deleted");
```

---

# 📁 OBJECT COMMANDS

---

## 1. ListObjectsV2Command

```js
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new ListObjectsV2Command({
  Bucket: "procodrr-nodejs-bucket",
  Prefix: "optional/path/",
});

const response = await s3Client.send(command);
console.log(response.Contents);
```

---

## 2. HeadObjectCommand (Get Metadata)

```js
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new HeadObjectCommand({
  Bucket: "procodrr-nodejs-bucket",
  Key: "file.txt",
});

const response = await s3Client.send(command);
console.log(response); // Metadata like ContentType, ContentLength, etc.
```

---

## 3. GetObjectCommand (Download)

```js
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { pipeline } from "stream/promises";
const s3Client = new S3Client();

const command = new GetObjectCommand({
  Bucket: "procodrr-nodejs-bucket",
  Key: "file.txt",
});

const response = await s3Client.send(command);
await pipeline(response.Body, process.stdout); // or pipe to file
```

---

## 4. PutObjectCommand (Upload)

```js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "fs/promises";
const s3Client = new S3Client();

const fileBuffer = await readFile("./local-file.txt");

const command = new PutObjectCommand({
  Bucket: "procodrr-nodejs-bucket",
  Key: "upload/file.txt",
  Body: fileBuffer,
  ContentType: "text/plain",
});

await s3Client.send(command);
console.log("File uploaded");
```

---

## 5. DeleteObjectCommand

```js
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new DeleteObjectCommand({
  Bucket: "procodrr-nodejs-bucket",
  Key: "upload/file.txt",
});
await s3Client.send(command);
console.log("File deleted");
```

## 6. DeleteObjectsCommand

```js
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new DeleteObjectsCommand({
  Bucket: "your-bucket-name",
  Delete: {
    Objects: [
      { Key: "uploads/file1.jpg" },
      { Key: "uploads/file2.jpg" },
      { Key: "uploads/file3.jpg" },
    ],
    Quiet: false, // set true to skip individual delete responses
  },
});

const response = await s3Client.send(command);
console.log("Deleted:", response.Deleted);
console.log("Errors:", response.Errors);
```

---

## 🌐 Public URL (If object is public)

```js
const getPublicUrl = (bucket, key) => {
  return `https://${bucket}.s3.amazonaws.com/${key}`;
};

console.log(getPublicUrl("procodrr-nodejs-bucket", "upload/file.txt"));
```