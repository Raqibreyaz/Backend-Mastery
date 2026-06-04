## 🧩 How to Remove the `Server: nginx` Header Completely

### **1. Install the module**

```bash
sudo apt update
sudo apt install -y libnginx-mod-http-headers-more-filter
```

---

### **2. Load the module**

Edit your main NGINX config file:

```bash
sudo nano /etc/nginx/nginx.conf
```

At the **very top of the file** (before `events {}`), add:

```nginx
load_module /usr/lib/nginx/modules/ngx_http_headers_more_filter_module.so;
```

Save and close the file.

---

### **3. Edit your NGINX configuration**

Inside the `http {}` block (or `server {}` block if you prefer), add:

```nginx
more_clear_headers Server;  # removes Server header completely
```

Example:

```nginx
http {
    more_clear_headers Server;

    server {
        listen 80;
        server_name example.com;

        location / {
            proxy_pass http://127.0.0.1:3000;
        }
    }
}
```

---

### **4. Test and reload**

```bash
sudo nginx -t
sudo nginx -s reload
```

---

✅ Done!
The `Server` header will now be completely removed from all responses.