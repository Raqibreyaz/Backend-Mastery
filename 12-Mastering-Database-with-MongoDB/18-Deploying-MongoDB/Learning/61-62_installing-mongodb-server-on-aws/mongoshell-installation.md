# Installing MongoDB Shell (mongosh) on Ubuntu 24.04

MongoDB Shell (`mongosh`) is the modern command-line tool for interacting with MongoDB databases. Since MongoDB does not officially support Ubuntu 24.04 yet, we will use the **Ubuntu 22.04 (Jammy) repository** to install `mongosh`.

---

## **Step 1: Import the MongoDB Public Key**
Before adding the MongoDB repository, import the public key:

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
```

**Explanation:**
- This downloads and saves the MongoDB GPG key to verify the package signature.

---

## **Step 2: Add the MongoDB Repository**
Since Ubuntu 24.04 is not officially supported, we will use the Ubuntu 22.04 (Jammy) repository:

```bash
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

**Explanation:**
- Adds the official MongoDB repository to the system package manager.
- Uses `jammy` (Ubuntu 22.04) since `noble` (Ubuntu 24.04) is not yet supported.

---

## **Step 3: Update the Package Database**
```bash
sudo apt update
```

**Explanation:**
- Refreshes the package list so the system recognizes the newly added MongoDB repository.

---

## **Step 4: Install MongoDB Shell (mongosh)**
```bash
sudo apt install -y mongodb-mongosh
```

**Explanation:**
- Installs `mongosh`, the interactive shell for MongoDB.
- `-y` automatically confirms the installation.

---

## **Step 5: Verify Installation**
After installation, check the version to confirm that `mongosh` is installed correctly:

```bash
mongosh --version
```

If the command returns the version number, the installation was successful.

---

## **Step 6: Connect to MongoDB**
Once installed, you can connect to your MongoDB server by running:

```bash
mongosh
```

If your MongoDB server is running on a different host, use:
```bash
mongosh "mongodb://your-mongodb-server-ip:27017"
```

---

## **Conclusion**
You have successfully installed MongoDB Shell (`mongosh`) on Ubuntu 24.04 using the Ubuntu 22.04 repository. 🚀 Now you can use it to interact with your MongoDB databases efficiently.

