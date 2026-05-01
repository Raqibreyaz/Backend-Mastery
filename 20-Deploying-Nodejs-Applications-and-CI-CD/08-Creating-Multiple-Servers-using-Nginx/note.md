### Nginx multiple servers

Nginx can run **multiple `server` blocks** inside the same `http` block. Each `server` block acts like a virtual host and can serve a different site, app, or backend depending on how requests are matched.

There are two common ways to distinguish servers:
- By **IP address + port**
- By **domain name (`server_name`) + port**

### 1) Multiple servers in one config

You can define multiple `server` blocks in the same config file.

```nginx
http {
    include mime.types;

    server {
        root /path/to/backend;
        listen 127.0.0.1:80;
    }

    server {
        root /path/to/frontend;
        listen 127.0.0.2:80;
    }
}
```

Here, both servers use port \(80\), but they listen on different IPs, so there is no conflict.

### 2) Default listening behavior

If you write only:

```nginx
listen 80;
```

Nginx usually listens on **all available IPv4 interfaces** for port \(80\), effectively like:

```nginx
listen 0.0.0.0:80;
```

So yes, this can cause conflicts if:
- Another process is already using port \(80\)
- Another Nginx config is already bound to the same address and port in an incompatible way

Related forms:
- `listen 80;`
- `listen *:80;`

These both mean “listen on every available IP for port \(80\)” for IPv4.

### 3) Same port, different IPs

Multiple servers can use the same port if they bind to different IP addresses.

```nginx
http {
    include mime.types;

    server {
        root /home/raquib/.../backend;
        listen 127.0.0.1:80;
    }

    server {
        root /home/raquib/.../frontend;
        listen 127.0.0.2:80;
    }

    autoindex on;
}
```

Why this works:
- First server handles requests sent to \(127.0.0.1:80\)
- Second server handles requests sent to \(127.0.0.2:80\)

Even though the port is the same, the full socket binding is different:
- \(127.0.0.1:80\)
- \(127.0.0.2:80\)

### 4) Name-based virtual hosting with `server_name`

In real setups, you usually have **one IP** and want multiple sites on the same port. Then Nginx uses the `Host` header from the request to choose the correct `server` block.

```nginx
http {
    include mime.types;

    server {
        root /home/raquib/.../backend;
        server_name api.local.com;
        listen 80;
    }

    server {
        root /home/raquib/.../frontend;
        server_name local.com;
        listen 80;
    }

    autoindex on;
}
```

How this works:
- Request with `Host: api.local.com` → backend server
- Request with `Host: local.com` → frontend server

This is called **name-based virtual hosting**.

### 5) Important: `server_name` only works if the hostname resolves

If you use names like `local.com` or `api.local.com`, your system must resolve them to your server IP.

For local testing, that usually means adding entries to `/etc/hosts`:

```text
127.0.0.1 local.com
127.0.0.1 api.local.com
```

Without that:
- The browser may not reach your local Nginx at all
- Or it may hit some other destination if DNS resolves differently

You can also test with `curl` by manually setting the `Host` header:

```bash
curl -H "Host: api.local.com" http://127.0.0.1
curl -H "Host: local.com" http://127.0.0.1
```

### 6) Why Nginx may serve the “wrong” site

If Nginx keeps serving the backend even after adding the frontend, the reason is often **not** just “kill processes and restart.” More commonly, one of these is happening:

- The request’s `Host` header does not match the `server_name`
- One server block becomes the **default server**
- Old config was not reloaded
- Browser cache is confusing the test
- Another service is still bound to port \(80\)

A very important Nginx rule: if no `server_name` matches, Nginx serves the **default server** for that address:port pair. If you did not explicitly set one, it is usually the **first matching `server` block** loaded for that socket.

That is why “unexpected pages” often appear.

### 7) Safer default server setup

A cleaner config is to explicitly define a default server.

```nginx
http {
    include mime.types;

    server {
        listen 80 default_server;
        server_name _;
        return 404;
    }

    server {
        listen 80;
        server_name api.local.com;
        root /home/raquib/.../backend;
    }

    server {
        listen 80;
        server_name local.com;
        root /home/raquib/.../frontend;
    }
}
```

Now:
- `api.local.com` goes to backend
- `local.com` goes to frontend
- Any unknown hostname gets \(404\)

This avoids accidental fallback to the wrong app.

### 8) Reloading vs restarting

After changing config, the usual workflow is:

1. Test config
```bash
nginx -t
```

2. Reload Nginx
```bash
nginx -s reload
```

Or with systemd:
```bash
sudo systemctl reload nginx
```

Use a full restart only when needed:
```bash
sudo systemctl restart nginx
```

If port \(80\) is busy, inspect which process owns it:

```bash
sudo lsof -i :80
```

or

```bash
sudo ss -ltnp | grep :80
```

So yes, killing old processes may help in some cases, but the real fix is usually:
- verify config,
- verify listening sockets,
- verify `Host` header,
- then reload cleanly.

### 9) IP-based vs name-based hosting

A good mental model:

- **IP-based virtual hosting**: different IPs, same port is fine
- **Name-based virtual hosting**: same IP, same port is fine, but hostnames must differ via `server_name`

Example:
- \(127.0.0.1:80\) → backend
- \(127.0.0.2:80\) → frontend

or

- `api.local.com:80` → backend
- `local.com:80` → frontend

Both are valid ways to separate apps.

### 10) Clean corrected example for local development

```nginx
http {
    include mime.types;

    server {
        listen 80 default_server;
        server_name _;
        return 404;
    }

    server {
        listen 80;
        server_name api.local.com;
        root /home/raquib/Code/Backend-Mastery/20-Deploying-Nodejs-Applications-and-CI-CD/08-Creating-Multiple-Servers-using-Nginx/backend;
        autoindex on;
    }

    server {
        listen 80;
        server_name local.com;
        root /home/raquib/Code/Backend-Mastery/20-Deploying-Nodejs-Applications-and-CI-CD/08-Creating-Multiple-Servers-using-Nginx/frontend;
        autoindex on;
    }
}
```

And in `/etc/hosts`:

```text
127.0.0.1 local.com
127.0.0.1 api.local.com
```

### Quick 8-point revision

- Nginx can have multiple `server` blocks inside one `http` block.
- A `server` block is selected either by **IP:port** or by **`server_name` + port**.
- `listen 80;` and `listen *:80;` typically mean “listen on all IPv4 interfaces on port \(80\)”.
- Multiple servers can use the same port if they bind to different IPs, like \(127.0.0.1:80\) and \(127.0.0.2:80\).
- When using one IP for multiple sites, Nginx uses the request `Host` header and `server_name` to choose the correct server.
- If no `server_name` matches, Nginx serves the default server for that address:port, often the first one unless `default_server` is set.
- For local domains like `local.com` and `api.local.com`, you usually need `/etc/hosts` entries.
- If the wrong site is being served, check `nginx -t`, reload config, inspect port \(80\), and verify the `Host` header before killing processes.
