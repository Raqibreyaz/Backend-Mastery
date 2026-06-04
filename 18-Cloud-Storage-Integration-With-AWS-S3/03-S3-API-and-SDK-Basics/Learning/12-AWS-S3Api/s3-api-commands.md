## 🪣 BUCKET OPERATIONS (with `s3api`)

### ✅ List all buckets

```bash
aws s3api list-buckets
```

### ✅ Create a bucket

```bash
aws s3api create-bucket --bucket my-bucket-name --region us-east-1
```

For other locations except `us-east-1`
```bash
aws s3api create-bucket --bucket my-bucket-name --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1
```

### ✅ Delete a bucket

```bash
aws s3api delete-bucket --bucket my-bucket-name
```

---

## 📄 FILE & FOLDER OPERATIONS (with `s3api`)

S3 doesn't have real **folders**, just key prefixes. So these are **object-level** operations.

### ✅ List files (list-objects-v2)

```bash
aws s3api list-objects-v2 --bucket my-bucket-name
```

### ✅ List only a “folder”

```bash
aws s3api list-objects-v2 --bucket my-bucket-name --prefix folder1/
```

### ✅ Upload a file (put-object)

```bash
aws s3api put-object --bucket my-bucket-name --key folder1/file.txt --body ./localfile.txt
```

### ✅ Download a file (get-object)

```bash
aws s3api get-object --bucket my-bucket-name  --key folder1/file.txt ./localfile.txt
```

### ✅ Delete a file (delete-object)

```bash
aws s3api delete-object --bucket my-bucket-name --key folder1/file.txt
```

### ✅ Rename a file (copy + delete)

```bash
# Step 1: Copy the file to new name
aws s3api copy-object \
  --bucket my-bucket-name \
  --copy-source my-bucket-name/folder1/old.txt \
  --key folder1/new.txt

# Step 2: Delete the old file
aws s3api delete-object --bucket my-bucket-name --key folder1/old.txt
```
