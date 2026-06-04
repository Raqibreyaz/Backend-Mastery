# Installing MongoDB Tools on Ubuntu 24.04

MongoDB Tools include utilities like `mongodump`, `mongorestore`, `mongoexport`, and `mongoimport`. Since MongoDB does not officially support Ubuntu 24.04 yet, we will use the **Ubuntu 22.04 (Jammy) repository** to install the tools.

---

## **Step 1: Import the MongoDB Public Key**
Before adding the MongoDB repository, import the public key:

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
```

**Explanation:**
- This command downloads and saves the MongoDB GPG key to verify the package signature.

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
- Updates the system’s package list to recognize the newly added MongoDB repository.

---

## **Step 4: Install MongoDB Tools**
```bash
sudo apt install -y mongodb-database-tools
```

**Explanation:**
- Installs the MongoDB database tools package, which includes:
  - `mongodump`: Backup MongoDB databases.
  - `mongorestore`: Restore MongoDB backups.
  - `mongoexport`: Export MongoDB data to JSON/CSV.
  - `mongoimport`: Import data into MongoDB.

---

## **Step 5: Verify Installation**
After installation, verify that the tools are installed correctly:

```bash
mongodump --version
mongorestore --version
mongoexport --version
mongoimport --version
```

If the commands return their respective version numbers, the installation was successful.

---

## **Conclusion**
You have successfully installed MongoDB Tools on Ubuntu 24.04 using the Ubuntu 22.04 repository. 🚀 These tools allow you to manage and manipulate MongoDB data efficiently.