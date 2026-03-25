## 🧱 🔍 Key Differences in IAM and S3 Bucket Policy

## 🧾 Example 1: IAM Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

> ✅ No `Principal` needed — this is attached **to an IAM identity**, so AWS knows **who** it applies to.

---

## 🧾 Example 2: S3 Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:user/John"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

> ✅ `Principal` is **required** because this policy is attached to a **bucket**, so AWS needs to know **who** is being granted access.