## ✅ How to Install AWS CLI v2 on Ubuntu

### 1. **Install required dependencies**

```bash
sudo apt update
sudo apt install unzip curl -y
```

---

### 2. **Download the AWS CLI installer (v2)**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
```

---

### 3. **Unzip the installer**

```bash
unzip awscliv2.zip
```

---

### 4. **Run the install script**

```bash
sudo ./aws/install
```

---

### 5. **Verify the installation**

```bash
aws --version
```

✅ You should see something like:

```
aws-cli/2.x.x Python/3.x.x Linux/x86_64
```

---

### 📦 Optional: Clean up installation files

```bash
rm -rf aws awscliv2.zip
```