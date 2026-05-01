***

### Nginx notes

### 1) Directory listing and `autoindex`

By default, Nginx does **not** show directory contents. If a request maps to a directory, Nginx first looks for an index file such as `index.html`. If it does not find one, it usually returns a forbidden/error response unless directory listing is enabled.

With `autoindex on;`, Nginx can list files inside a directory.

```nginx
http {
    include mime.types;

    server {
        root /var/www/simple-website;
        autoindex on;
    }
}
```

Key points:
- Requesting `/images` usually redirects to `/images/` if `/images` is a real directory.
- After reaching `/images/`, Nginx checks for an index file.
- If no index file exists and `autoindex on;` is enabled, Nginx lists the directory contents.

Example:
- `/images/` + `images/index.html` exists → serves that file.
- `/images/` + no index file + `autoindex on;` → shows file listing.

### 2) Basic `location` matching

A `location` block tells Nginx how to handle requests for certain URIs.

```nginx
server {
    root /var/www/simple-website;

    location / {
        return 200 "Hello World";
    }
}
```

This matches every route because `/` is the broadest prefix match.

If you use:

```nginx
location /hello {
    return 200 "Hello World";
}
```

then it matches:
- `/hello`
- `/hello/abc`
- `/hello-world` (because prefix match is literal prefix matching)

So `location /hello` is not “only `/hello`”; it is “anything starting with `/hello`”.

### 3) Exact match vs prefix match

Use `=` when you want **only one exact path**.

```nginx
server {
    root /var/www/simple-website;

    location = /hello {
        return 200 "Hello World";
    }
}
```

This matches only:
- `/hello`

It does **not** match:
- `/hello/`
- `/hello/world`
- `/hello123`

This is useful when you want strict route handling.

### 4) File vs `location` priority

If a real file exists on disk and a matching `location` block also exists, the `location` logic wins.

```nginx
server {
    root /var/www/simple-website;

    location /hello {
        return 200 "Hello World";
    }
}
```

Even if `/var/www/simple-website/hello` exists as a file, Nginx will use the matching `location` block for `/hello`.

A good mental model:
- Nginx first chooses how to process the request using `location`.
- Then, inside that chosen handling path, it may serve files.

### 5) `204 No Content`

If you return HTTP status `204`, the browser ignores the body.

```nginx
location = /empty {
    return 204;
}
```

Important:
- `204` means “success, but no response body”.
- Even if you try to send text, the browser will not render it.

### 6) Trailing slash and directory-style routes

Nginx treats directory URIs more naturally when they end with `/`.

Example approach:

```nginx
server {
    root /var/www/simple-website;

    location = /about {
        return 301 /about/;
    }

    location = /about/ {
        index /about.html;
    }
}
```

This works, but it is a bit manual. You are essentially normalizing `/about` to `/about/`, then serving a file.

### 7) `try_files` is usually a better approach

`try_files` checks whether files exist and falls back if they do not.

```nginx
server {
    root /var/www/simple-website;

    location = /about {
        try_files /about.html =404;
    }
}
```

How it works:
- First try `/about.html`
- If not found, return `404`

Important nuance:
- In `try_files`, the **last argument** is usually the fallback URI, named location, or `=code`.
- So in a config like `try_files /about.html /he;`, `/he` is treated as a fallback URI, not just “another file check” in the same sense.

A more realistic multi-check example:

```nginx
location = /about {
    try_files /about.html /about/index.html =404;
}
```

### 8) Custom error pages

If you do this:

```nginx
location / {
    index /custom-error.html;
}
```

then Nginx serves `custom-error.html` as a normal file with status `200`, which is **not** a real error response.

To return a real error page with the correct status, use `error_page`.

```nginx
server {
    root /var/www/simple-website;

    location = /about {
        try_files /about.html =404;
    }

    location = /index {
        try_files /index.html =404;
    }

    error_page 404 /custom-error.html;
}
```

What happens:
- If a file is missing and Nginx produces `404`, it internally serves `/custom-error.html`
- The response status remains `404`

You can also set `error_page` inside a specific `location`, but if the same rule applies globally, defining it once at the `server` level is cleaner.

### 9) `sendfile on`

`sendfile` improves static file serving performance by letting the kernel move file data from disk to the network socket more efficiently.

```nginx
http {
    include mime.types;
    sendfile on;

    server {
        root /var/www/simple-website;
        autoindex on;

        location = /about {
            try_files /about.html =404;
        }

        error_page 404 /custom-error.html;
    }
}
```

Why it helps:
- Reduces user-space copying
- Lowers memory overhead inside Nginx
- Improves performance for static files

This is especially useful for:
- HTML
- CSS
- JS
- images
- downloadable files

### 10) Serving media by extension

Your last example needs one correction: `^~` is for **prefix** locations, not regex. For file extensions, use `~` or `~*`.

Correct version:

```nginx
location ~* \.(mp3|mp4)$ {
    root /media;
    try_files $uri =404;
}
```

Notes:
- `~*` means case-insensitive regex match
- This matches requests ending in `.mp3` or `.mp4`
- With `root /media;`, a request like `/song.mp3` maps to `/media/song.mp3`

If your URLs are actually under `/media/...`, then a prefix location may be better:

```nginx
location ^~ /media/ {
    root /var/www;
    try_files $uri =404;
}
```

Use:
- `~` or `~*` for regex matching
- `^~` for prefix matching

### Location priority

A simple priority order to remember:

1. Exact match: `location = /path`
2. Prefix marked with `^~`
3. Regex matches: `location ~ ...` or `location ~* ...`
4. Longest normal prefix match: `location /abc`, `location /`

This is why route handling can override an actual file on disk.

### Clean revision version

```nginx
http {
    include mime.types;
    sendfile on;

    server {
        root /var/www/simple-website;
        autoindex on;

        location = /about {
            try_files /about.html =404;
        }

        location = /index {
            try_files /index.html =404;
        }

        location ~* \.(mp3|mp4)$ {
            root /media;
            try_files $uri =404;
        }

        error_page 404 /custom-error.html;
    }
}
```

### Quick revision

- Nginx does not list directory contents by default; `autoindex on;` enables listing.
- Requesting a real directory without trailing slash, like `/images`, usually redirects to `/images/`.
- Inside a directory, Nginx first looks for an index file; if none exists and `autoindex` is on, it shows the directory listing.
- `location /hello` is a prefix match, so it matches `/hello`, `/hello/abc`, and similar paths.
- `location = /hello` is an exact match and only handles `/hello`.
- If both a real file and a matching `location` exist, the `location` handling takes priority.
- `try_files` checks for file existence and the last argument is the fallback URI, named location, or `=code`.
- Use `error_page` for custom error pages with the correct status code; use `sendfile on;` for faster static file serving.

***