# Installing MongoDB Server on Ubuntu 24.04

MongoDB does not officially support Ubuntu 24.04 yet. However, we can install it by using the **Ubuntu 22.04 (Jammy) repository**.

---

## **Step 1: Import the MongoDB Public Key**
MongoDB packages are signed with a GPG key for security. Import it using:

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
```

**Explanation:**
- `curl -fsSL` downloads the MongoDB GPG key.
- `gpg --dearmor` converts it into a format that can be used by APT.
- `-o /usr/share/keyrings/mongodb-server-7.0.gpg` saves the key in the appropriate location.

---

## **Step 2: Add the MongoDB Repository (Using Ubuntu 22.04 Repo)**
Since Ubuntu 24.04 is not officially supported, we use the **Ubuntu 22.04 (Jammy) repository**:

```bash
echo "deb [signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

**Explanation:**
- `echo "deb ..."` adds the repository for MongoDB.
- `signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg` ensures APT uses the correct key.
- `jammy` is used instead of `noble` (24.04), since MongoDB does not yet support `noble`.
- `tee` writes the repository information to the correct file.

---

## **Step 3: Update the Package Database**
```bash
sudo apt update
```

**Explanation:**
- This refreshes the package list so the system recognizes the newly added MongoDB repository.

---

## **Step 4: Install MongoDB Server**
```bash
sudo apt install -y mongodb-org-server
```

**Explanation:**
- `mongodb-org-server` installs only the **MongoDB server** (`mongod`), without additional tools like `mongosh`.
- `-y` automatically confirms the installation to avoid manual intervention.

---

## **Step 5: Start and Enable MongoDB Service**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Explanation:**
- `systemctl start mongod` starts the MongoDB service.
- `systemctl enable mongod` ensures MongoDB starts automatically at boot.

---

## **Step 6: Verify MongoDB is Running**
```bash
sudo systemctl status mongod
```

**Expected Output:**
```
● mongod.service - MongoDB Database Server
   Loaded: loaded (/lib/systemd/system/mongod.service; enabled; vendor preset: enabled)
   Active: active (running) since ...
```

If MongoDB is running correctly, you should see **"active (running)"** in green.

---

## **Troubleshooting: MongoDB Fails to Start**
If MongoDB fails to start with an error related to the socket file, run the following command:

```bash
sudo rm -f /tmp/mongodb-27017.sock
sudo systemctl restart mongod
```

**Explanation:**
- This removes the stale socket file that may have been left after an improper shutdown.
- Restarting MongoDB should now work correctly.

---

## **Optional: Enable Remote Access**
By default, MongoDB listens **only on localhost**. To allow remote access:

1. Open the MongoDB configuration file:
   ```bash
   sudo nano /etc/mongod.conf
   ```
2. Find the `bindIp` setting and change it to:
   ```yaml
   bindIp: 0.0.0.0
   ```
3. Restart MongoDB:
   ```bash
   sudo systemctl restart mongod
   ```

**Warning:** Allowing remote access may expose your database. Use firewall rules or authentication for security.

---

## **Conclusion**
You have now successfully installed MongoDB Server on Ubuntu 24.04 using the Ubuntu 22.04 repository. 🚀

