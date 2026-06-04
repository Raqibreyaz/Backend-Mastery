# AWS SDK for S3 in Node.js

This guide explains how to use the **AWS SDK for JavaScript v3** in **Node.js** to perform bucket and object operations in Amazon S3.

---

## 📦 Installation

```bash
npm install @aws-sdk/client-s3
```

---

## 🔧 S3 Client Setup

```js
// s3Client.js
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "your-region",
  credentials: {
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
  },
});

export default s3Client;
```

---

## 1. ListBucketsCommand

```js
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client();

const command = new ListBucketsCommand({});
const response = await s3Client.send(command);
console.log(response.Buckets);
```
