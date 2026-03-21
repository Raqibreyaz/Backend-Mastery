# Managing Bucket Policy

## 🔹 1. ✅ Get Public Access Block Configuration

```bash
aws s3api get-public-access-block --bucket my-bucket-name
```

> 📌 Shows the current public access block settings (if any).

---

## 🔹 2. 🗑️ Delete Public Access Block Configuration

```bash
aws s3api delete-public-access-block --bucket my-bucket-name
```

> ❗ This removes the entire public access block configuration, allowing public ACLs or policies to take effect.

---

## 🔹 3. ✅ Put Public Access Block Configuration

### 🔒 (Block Public Access – Recommended for Private Buckets)

```bash
aws s3api put-public-access-block \
  --bucket my-bucket-name \
  --public-access-block-configuration '{
    "BlockPublicAcls": true,
    "IgnorePublicAcls": true,
    "BlockPublicPolicy": true,
    "RestrictPublicBuckets": true
  }'
```

### 🔓 (Unblock Public Access – For Public Websites)

```bash
aws s3api put-public-access-block \
  --bucket my-bucket-name \
  --public-access-block-configuration '{
    "BlockPublicAcls": false,
    "IgnorePublicAcls": false,
    "BlockPublicPolicy": false,
    "RestrictPublicBuckets": false
  }'
```

---

## 🔹 4. ✅ Get Bucket Policy

```bash
aws s3api get-bucket-policy --bucket my-bucket-name
```

> 📌 Fetches the currently attached bucket policy (if any).

---

## 🔹 5. ✅ Put (Set/Update) Bucket Policy

```bash
aws s3api put-bucket-policy \
  --bucket my-bucket-name \
  --policy file://policy.json
```

> 📝 `policy.json` should contain a valid IAM policy. Example for public read:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket-name/*"
    }
  ]
}
```

---

## 🔹 6. 🗑️ Delete Bucket Policy

```bash
aws s3api delete-bucket-policy --bucket my-bucket-name
```

> ❌ Removes the custom bucket policy, reverting to IAM-only access rules.
