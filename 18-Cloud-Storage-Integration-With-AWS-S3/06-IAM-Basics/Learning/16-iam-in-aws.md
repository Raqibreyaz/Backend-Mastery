## 🔐 What is IAM in AWS?

**IAM (Identity and Access Management)** is a **security service** in AWS that lets you **control who can access your AWS resources** and **what actions they can perform**.

Think of IAM as the **gatekeeper of your AWS account**.

---

## 🧱 Key Building Blocks of IAM

| Component  | What it is                                                   | Example                        |
| ---------- | ------------------------------------------------------------ | ------------------------------ |
| **User**   | A person or system that interacts with AWS                   | A developer who logs in to AWS |
| **Group**  | A collection of users with shared permissions                | `Developers`, `Admins`         |
| **Policy** | A JSON document that defines what actions are allowed/denied | `Allow S3 read-only`           |
| **Role**   | A temporary set of permissions that **others can assume**    | EC2 instance role to access S3 |

---

## ✅ What You Can Do with IAM

* Create and manage **users** and **groups**
* Define **permissions** using policies
* Assign **roles** to AWS services (like EC2 or Lambda)
* **Secure your account** with MFA and least privilege

---

## 🛡️ Why IAM is Important

* **Security**: Protects your AWS resources from unauthorized access
* **Granular Control**: You decide exactly who can do what
* **Auditability**: Track and log every action via CloudTrail
* **Scalability**: Manage permissions for large teams and services easily

---

## 🧠 Simple Analogy

> IAM is like the **security system of a building**:

* Users = People with key cards
* Policies = Rules for what doors they can open
* Roles = Guest passes for temporary access
* Groups = Departments like HR, IT, etc.