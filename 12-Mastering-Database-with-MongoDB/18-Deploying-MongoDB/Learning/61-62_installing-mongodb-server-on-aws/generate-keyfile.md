# Creating a MongoDB Keyfile in Ubuntu

A **MongoDB keyfile** is required for **internal authentication** in **replica sets and sharded clusters**. Follow these steps to **generate, store, and configure** the keyfile securely.

---

## **📌 Step 1: Generate a Secure Keyfile**
Run the following command to generate a **secure 756-byte keyfile**:
```bash
openssl rand -base64 756 | sudo tee /etc/mongodb-keyfile > /dev/null
```
**Explanation:**
- `openssl rand -base64 756` → Generates a **random** 756-byte **base64-encoded** key.
- `sudo tee /etc/mongodb-keyfile > /dev/null` → Saves the key to `/etc/mongodb-keyfile` while preventing unnecessary output.

---

## **📌 Step 2: Set Correct Permissions**
MongoDB requires **strict permissions** for security:
```bash
sudo chown mongodb:mongodb /etc/mongodb-keyfile
sudo chmod 600 /etc/mongodb-keyfile
```
**Why?**
- `chown mongodb:mongodb /etc/mongodb-keyfile` → Ensures MongoDB **owns the file**.
- `chmod 600 /etc/mongodb-keyfile` → Allows **only MongoDB to read the file**.

---

## **📌 Step 3: Configure MongoDB to Use the Keyfile**
Edit MongoDB's configuration file:
```bash
sudo nano /etc/mongod.conf
```
Add the following under the `security` section:
```yaml
security:
  keyFile: /etc/mongodb-keyfile
```
Save and exit (`CTRL + X`, then `Y`, then `Enter`).

---

## **📌 Step 4: Restart MongoDB to Apply Changes**
```bash
sudo systemctl restart mongod
```

---

## **✅ MongoDB is Now Secure with Internal Authentication!**
- All **replica set members** will use this keyfile to authenticate each other.
- Unauthorized connections will be **blocked**.
- You can now safely **enable authentication** and **deploy a secure MongoDB cluster**.

Let me know if you need further assistance! 🚀