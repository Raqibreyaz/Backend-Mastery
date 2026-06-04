### 🔹 **1. Bucket Commands**

#### ✅ List all buckets

```bash
aws s3 ls
```

* Lists all S3 buckets in your account.

#### ✅ Create a bucket

```bash
aws s3 mb s3://my-bucket-name
```

* `mb` stands for **make bucket**.

#### ✅ Delete a bucket

```bash
aws s3 rb s3://my-bucket-name
```

* `rb` stands for **remove bucket** (fails if not empty).

#### ✅ Delete a bucket **forcefully** (with all contents)

```bash
aws s3 rb s3://my-bucket-name --force
```

---

### 🔹 **2. Upload and Download**

#### ✅ Upload a file to bucket

```bash
aws s3 cp localfile.txt s3://my-bucket-name/
```

#### ✅ Upload a folder recursively

```bash
aws s3 cp ./my-folder s3://my-bucket-name/ --recursive
```

#### ✅ Download a file from bucket

```bash
aws s3 cp s3://my-bucket-name/file.txt ./localfile.txt
```

#### ✅ Download a folder recursively

```bash
aws s3 cp s3://my-bucket-name/folder-name ./local-folder --recursive
```

---

### 🔹 **3. Sync Folders**

#### ✅ Sync local folder with S3 bucket

```bash
aws s3 sync ./local-folder s3://my-bucket-name/
```

#### ✅ Sync S3 bucket with local folder

```bash
aws s3 sync s3://my-bucket-name/ ./local-folder
```

---

### 🔹 **4. List Contents of a Bucket or Folder**

#### ✅ List files in a bucket

```bash
aws s3 ls s3://my-bucket-name/
```

#### ✅ List files in a folder inside bucket

```bash
aws s3 ls s3://my-bucket-name/folder-name/
```

---

### 🔹 **5. Delete Files and Folders**

#### ✅ Delete a file

```bash
aws s3 rm s3://my-bucket-name/file.txt
```

#### ✅ Delete all files in a folder

```bash
aws s3 rm s3://my-bucket-name/folder-name/ --recursive
```

---

### 🔹 **6. Move or Rename Files**

#### ✅ Move (rename) a file

```bash
aws s3 mv s3://my-bucket-name/old.txt s3://my-bucket-name/new.txt
```

#### ✅ Move entire folder

```bash
aws s3 mv s3://my-bucket-name/folder1/ s3://my-bucket-name/folder2/ --recursive
```

---

### 🔹 **7. Presigned URLs**

#### ✅ Generate a presigned URL to access a file

```bash
aws s3 presign s3://my-bucket-name/file.txt
```

#### ✅ Set custom expiry (default is 3600s)

```bash
aws s3 presign s3://my-bucket-name/file.txt --expires-in 900
```

---

### 🔹 **8. Advanced Options**

#### ✅ Set output format as JSON (or text, table)

```bash
aws s3 ls s3://my-bucket-name/ --output json
```

#### ✅ Use a specific profile

```bash
aws s3 ls --profile my-profile
```

#### ✅ Set region explicitly

```bash
aws s3 ls --region us-east-1
```

---

### 🔹 **9. Help for Each Command**

```bash
aws s3 help
aws s3 cp help
aws s3 ls help
```