# Nginx Configuration Notes

Practical, example-driven notes on the core nginx config concepts. Config file lives at `/etc/nginx/nginx.conf`.

---

## 1. CLI Cheatsheet

| Command | What it does |
|---|---|
| `sudo nginx` | Start the server |
| `sudo nginx -s stop` | Stop the server immediately |
| `sudo nginx -s reload` | Reload config gracefully (no downtime) |
| `sudo nginx -t` | Test if the config syntax is valid before reloading |
| `nginx -V` | Show version + compiled-in modules |
| `nginx --help` | List all available flags |

**Golden rule:** always run `sudo nginx -t` before `sudo nginx -s reload`. A bad config on a live reload won't take effect, but catching it early is cleaner.

---

## 2. Default Document Paths

Nginx ships with two default HTML files. Which one is served depends on whether your config defines `root` / `index`:

- `/var/www/html/index.nginx-debian.html` → served when your config explicitly points `root` here (Debian/Ubuntu default landing page).
- `/usr/share/nginx/html/index.html` → fallback when **no `root`** is defined inside `server {}`. Nginx uses its compiled-in default.

---

## 3. Minimal Configs — From Bare to Working

### 3a. Syntactically valid but incomplete (errors at runtime)

```nginx
events {}
```
Parses fine, but nginx needs an `http` block to actually serve HTTP traffic — so it fails to start meaningfully.

### 3b. Valid and runs, but serves nothing on `localhost:80`

```nginx
events {}
http {}
```
Nginx starts using all defaults. No `server` block means no virtual host is listening for content.

### 3c. Empty `server {}` — serves the compiled-in default

```nginx
events {}
http {
    server {}
}
```
Now `http://localhost:80` returns `/usr/share/nginx/html/index.html` (nginx's built-in default).

### 3d. Custom document root

```nginx
events {}

http {
    server {
        root /var/www/html;
    }
}
```
Without `index`, nginx looks for `index.html` inside `root` by default.

### 3e. Custom root + custom index file

```nginx
events {}

http {
    server {
        root /var/www/html;
        index index.nginx-debian.html;
    }
}
```
Now `/var/www/html/index.nginx-debian.html` is served at `/`.

> **`root` vs `index`:** `root` is the directory on disk; `index` is the filename to serve when the URL ends in `/`. They work together.

---

## 4. The Master / Worker Process Model

Nginx runs as **one master + N workers**:

```
root       10228  nginx: master process /usr/sbin/nginx ...
nobody     10229  nginx: worker process
```

- **Master** — runs as `root`, reads config, binds privileged ports (like 80/443), manages workers. Doesn't handle requests itself.
- **Workers** — run as an unprivileged user (`nobody` / `www-data`), actually accept and serve connections.

### Killing workers vs killing master
- Kill **only workers** → master immediately respawns them. Self-healing.
- Kill the **master** → workers are orphaned and the server is effectively down.

This is also why `nginx -s reload` works without dropping connections: master spawns new workers with the new config and old workers finish their in-flight requests before exiting.

---

## 5. `worker_processes` — How Many Workers?

By default nginx spawns **1 worker** per master.

```nginx
worker_processes 4;

events {}
http {
    server {
        root /var/www/html;
        index index.nginx-debian.html;
    }
}
```

Or let nginx match the logical CPU core count automatically:

```nginx
worker_processes auto;
```

`auto` is the recommended production setting — one worker per core lets nginx use all CPUs without context-switching overhead.

After a reload, `ps aux | grep [n]ginx` shows the new worker count:

```
root     17510  nginx: master process ...
nobody   17511  nginx: worker process
nobody   17512  nginx: worker process
nobody   17513  nginx: worker process
nobody   17514  nginx: worker process
```

---

## 6. `worker_connections` — Capacity Per Worker

```nginx
events {
    worker_connections 1024;
}
```

This is the **max simultaneous connections each worker can handle** — not exactly "max file descriptors per process", though connections do consume file descriptors under the hood.

- Each connection = at least 1 FD (2 if proxying upstream).
- The OS-level limit is `ulimit -n` (open files per process). `worker_connections` must stay below this, or you'll hit `accept() failed (24: Too many open files)`.

**Total max concurrent clients ≈ `worker_processes × worker_connections`.**
With `auto` (say 4 cores) × `1024` = ~4096 simultaneous connections.

---

## 7. `user` — Who Workers Run As

The master is always `root`, but workers drop privileges. Default is usually `nobody` or `www-data`.

```nginx
worker_processes auto;
user www-data;

http { ... }
```

- If the user (e.g. `www-data`) doesn't already exist, you create it — but it doesn't need a home directory or login shell, it just owns the worker processes.
- You can set it to your own user (`user raquib;`) during local dev so workers can read files in your home dir without permission errors.
- In production, **never** run workers as `root` — that defeats the privilege separation.

---

## 8. MIME Types — Telling the Browser What It's Receiving

Without explicit content types, nginx serves most files as `text/plain`, so CSS won't style and JS won't execute.

### 8a. Manually declaring types (verbose)

```nginx
http {
    server {
        types {
            text/html       html;
            text/css        css;
            text/javascript js;
            image/webp      webp;
        }
        root /var/www/simple-website;
    }
}
```

> **Catch:** if you define a `types {}` block but forget `text/html html;`, your HTML files start rendering as plain text. Manual lists are fragile.

### 8b. The clean way — include `mime.types`

Nginx ships a comprehensive mapping file — just include it:

```nginx
http {
    include mime.types;          # resolves to /etc/nginx/mime.types
    # or use absolute path:
    # include /etc/nginx/mime.types;

    server {
        root /var/www/simple-website;
    }
}
```

This single line registers hundreds of `extension → MIME type` mappings (html, css, js, png, webp, woff2, json, svg, mp4…). It's the standard pattern in every real-world config.

A useful companion directive:

```nginx
http {
    include mime.types;
    default_type application/octet-stream;   # fallback for unknown extensions
    ...
}
```

---

## Quick Revision — 8 Bullets

1. **Test before reload:** `sudo nginx -t` validates syntax; `sudo nginx -s reload` applies changes with zero downtime.
2. **Minimum working config:** `events {}` + `http { server {} }` — empty `server` serves `/usr/share/nginx/html/index.html`.
3. **`root` is the directory, `index` is the file** served when the URL ends in `/`. Both live inside `server {}`.
4. **One master + N workers.** Master runs as `root` (binds port 80/443), workers run as `nobody`/`www-data` and serve traffic. Killing workers → master respawns them.
5. **`worker_processes auto;`** matches the number of logical CPU cores — the production default.
6. **`worker_connections N;`** caps simultaneous connections per worker. Total capacity ≈ `worker_processes × worker_connections`, bounded by OS `ulimit -n`.
7. **`user www-data;`** drops worker privileges — never run workers as root in production.
8. **Always `include mime.types;`** inside `http {}` — never hand-roll a `types {}` block, or HTML, CSS, and JS will misrender.
