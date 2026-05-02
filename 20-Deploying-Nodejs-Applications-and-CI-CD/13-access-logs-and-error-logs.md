## 🧩Error Logs and Access Logs in NGINX

NGINX writes two main types of logs by default:

1. **Access logs** → contain information about every request.
2. **Error logs** → contain warnings, config errors, and runtime failures.

---

## 📁 1. Default Log File Locations (Linux)

| Log Type       | Default Path                |
| -------------- | --------------------------- |
| **Access Log** | `/var/log/nginx/access.log` |
| **Error Log**  | `/var/log/nginx/error.log`  |

> These paths can vary depending on your distro, but most Debian/Ubuntu and RHEL-based systems use these exact paths.

---

## 🧠 2. How to View Logs

### **View latest entries**

```bash
sudo tail -n 50 /var/log/nginx/access.log
sudo tail -n 50 /var/log/nginx/error.log
```

### **Follow logs live (like a stream)**

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

Press **Ctrl + C** to stop watching.

## ⚙️ 3. Configure or Change Log Paths

In your main NGINX config (`/etc/nginx/nginx.conf`) or in any `server` block, you can define where to write logs:

```nginx
http {
    access_log /var/log/nginx/access.log;
    error_log  /var/log/nginx/error.log warn;
}
```

You can even set **per-site logs**:

```nginx
server {
    server_name example.com;

    access_log /var/log/nginx/example_access.log;
    error_log  /var/log/nginx/example_error.log;
}
```

### Log Levels for `error_log`

You can control how detailed error logging is:

```
error_log /var/log/nginx/error.log [debug|info|notice|warn|error|crit|alert|emerg];
```

Example:

```nginx
error_log /var/log/nginx/error.log warn;
```

(default is `error`)

---

## 🧩 4. Log Rotation

On Linux, NGINX logs are rotated automatically by **logrotate**, usually daily.
You can see the config here:

```bash
cat /etc/logrotate.d/nginx
```

Rotated logs will appear like:

```
/var/log/nginx/access.log.1
/var/log/nginx/error.log.1
```