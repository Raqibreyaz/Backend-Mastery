## 👥 What Are User Groups in IAM?

In AWS IAM, a **User Group** is a logical grouping of **IAM users** that allows you to manage their **permissions collectively**.

> Instead of assigning permissions to each user individually, you attach **policies to a group**, and all users in that group inherit the permissions.

---

## 🧱 Benefits of Using Groups

* Easy to manage permissions for multiple users
* Ensures consistent access control
* Scales well for teams

---

## ✅ Common IAM User Groups Example

### 👩‍💻 1. `Developer` Group

**Purpose:** Developers need access to deploy, read, and modify services like EC2, S3, Lambda, etc., but not access sensitive billing or admin settings.

#### 🔒 Attach these policies:

* `AmazonEC2FullAccess`
* `AmazonS3FullAccess`
* `AWSLambda_FullAccess`
* `CloudWatchLogsFullAccess`

---

### 🛡 2. `Admin` Group

**Purpose:** Admins need full control over all AWS resources.

#### 🔒 Attach this policy:

* `AdministratorAccess`

This policy gives unrestricted access (`"Action": "*", "Resource": "*"`).
Use with caution — only trusted users should be in this group.

---

### 💰 3. `FinanceTeam` Group

**Purpose:** Finance team members need to view and manage billing, budgets, and cost reports, but **not AWS infrastructure**.

#### 🔒 Attach this policy:

* `Billing` (job function policy)

  * Grants access to billing dashboard, budgets, cost explorer, tax settings, etc.

#### ⚠️ Important:

To use any billing-related policy:

* Root user must enable: **IAM access to Billing and Cost Management**

---

## 📌 Summary Table

| Group         | Purpose                         | Example Policies                      |
| ------------- | ------------------------------- | ------------------------------------- |
| `Developer`   | App development & deployment    | `AmazonEC2FullAccess`, `S3FullAccess` |
| `Admin`       | Full admin access               | `AdministratorAccess`                 |
| `FinanceTeam` | View/manage billing and budgets | `Billing`                             |
