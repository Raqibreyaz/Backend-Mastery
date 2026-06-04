## 📦 Commands to Install and Enable NGINX on Ubuntu

Follow these essential steps to get NGINX running as a background service on your Ubuntu server:

---

### 🔧 1. Update the package list

```bash
sudo apt update
```

---

### 🌐 2. Install NGINX

```bash
sudo apt install nginx -y
```

---

### 🔁 3. Enable NGINX to start on system boot

```bash
sudo systemctl enable nginx
```

---

### ▶️ 4. Start the NGINX service

```bash
sudo systemctl start nginx
```

---

### 🩺 5. Check the status of the NGINX service

```bash
sudo systemctl status nginx
```

---

Once completed, NGINX will be running in the background and will automatically start on boot 🎉
