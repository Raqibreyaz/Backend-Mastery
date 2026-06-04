# What is AWS S3 Bucket?

An **S3 bucket** is a **storage container** provided by **Amazon S3 (Simple Storage Service)** — part of Amazon Web Services (AWS). It is used to **store and organize files (called objects)** in the cloud.

---

### 🔹 In Simple Terms:

* Think of a **bucket as a folder** in the cloud.
* You can **upload any type of file** to it (images, videos, documents, code, etc.).
* These files are stored as **objects**, each having a unique key (name).

---

### 🔹 Key Features of an S3 Bucket:

| Feature               | Description                                              |
| --------------------- | -------------------------------------------------------- |
| ✅ **Scalable**        | Automatically handles petabytes of data.                 |
| ✅ **Durable**         | 99.999999999% (11 9’s) durability.                       |
| ✅ **Secure**          | Supports encryption, access control, and IAM policies.   |
| ✅ **Accessible**      | Files can be public or private, and accessible via URLs. |
| ✅ **Versioning**      | Keeps track of file changes if enabled.                  |
| ✅ **Lifecycle Rules** | Automatically move or delete files based on rules.       |

---

### 🔹 How It Works:

1. You **create a bucket** in an AWS region.
2. You **upload files (objects)** to that bucket.
3. Each object is stored with:

   * A **key** (unique name),
   * **Metadata**,
   * And optional **tags** or **permissions**.

---

### 🔹 Example Use Cases:

* Hosting static websites
* Storing images/videos for an app
* Backing up data
* Log file storage
* Delivering files via CDN (CloudFront)
