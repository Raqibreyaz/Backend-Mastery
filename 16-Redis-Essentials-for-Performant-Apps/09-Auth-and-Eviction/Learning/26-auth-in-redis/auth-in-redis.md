# 🔒 Enabling Password-Based Authentication in Redis

## 🚨 Why Enable Authentication?

By default, Redis does **not require a password**, which can be risky in production environments. Enabling password-based authentication helps secure your Redis server from unauthorized access.

---

## 🔧 Step-by-Step: Enable Redis Authentication

### 1. Open the Redis Configuration File

Use the following command to edit the Redis config file:

```bash
sudo nano /etc/redis/redis.conf
```

> 📝 `nano` is a simple terminal-based text editor. You can use `vim` or `gedit` if you prefer.

---

### 2. Find the `requirepass` Setting

Inside the config file, search (Ctrl + W) for this line:

```conf
# requirepass foobared
```

Uncomment it and set your desired password:

```conf
requirepass yourStrongPassword123
```

---

### 3. Save and Exit

* In `nano`, press `Ctrl + X`, then `Y`, then `Enter` to save and exit.

---

### 4. Restart Redis Server

```bash
sudo service redis-server restart
# Or use this if the above doesn't work:
sudo systemctl restart redis-server
```

---

## ✅ How to Authenticate in Redis CLI

Once authentication is enabled, you must use the `AUTH` command:

```bash
AUTH yourStrongPassword123
```

If successful, you'll see:

```
OK
```
