# ✅ What is AWS CLI?

The **AWS Command Line Interface (CLI)** is a tool that allows you to **interact with AWS services directly from your terminal or command prompt**, instead of using the AWS web console.

### 📌 With AWS CLI, you can:

- Create and manage AWS resources (like S3 buckets, EC2 instances, Lambda functions)
- Automate deployments and operations via scripts
- Monitor, configure, and troubleshoot services

---

## 🛠️ How to Install AWS CLI

### 🔹 On Windows:

1. Download the installer from:
   👉 [https://aws.amazon.com/cli/](https://aws.amazon.com/cli/)
2. Run the `.msi` installer.
3. Open Command Prompt or PowerShell and verify installation:

   ```bash
   aws --version
   ```

---

### 🔹 On macOS (Homebrew):

```bash
brew install awscli
aws --version
```

---

### 🔹 On Linux:

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

---

## 🔐 How to Configure AWS CLI

Before using the CLI, you need AWS **access credentials** (from root user or an IAM user).

### 🔹 Steps:

```bash
aws configure
```

Then enter:

- **AWS Access Key ID**
- **AWS Secret Access Key**
- **Default region name** (e.g., `ap-south-1` for Mumbai)
- **Output format** (e.g., `json`, `table`, or `text`)

🔒 Credentials are saved at:

- `~/.aws/credentials`
- `~/.aws/config`

---

## ✅ Example Usage

### List your S3 buckets:

```bash
aws s3 ls
```

### List your EC2 Instances:

```bash
aws ec2 describe-instances
```

### 🧩 AWS CLI Command Structure:

```bash
aws <service-name> <operation> [options]
```

### 🧩 AWS CLI Help Command:

```bash
aws help
aws <service> help
aws <service> <operation> help
```

---

## ⚠️ Security Tip:

Avoid using **root credentials** long-term.
Instead, create an **IAM user** with the required permissions and use its access keys.


https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html