## Frontend serving

In production, you do **not** need a dedicated app server just to serve the frontend build output. You also do not need the development server on port 5173 or the preview server on port 4173, because those are mainly for development and local verification.

Nginx can serve the built static files directly from disk, which is usually faster and more resource-efficient for HTML, JS, CSS, images, and fonts. The normal flow is: build the frontend, copy the generated files to a directory, and point Nginx `root` to that directory.

Example:

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/frontend/dist;
    index index.html;
}
```

If your build output is from Vite, `dist` is the usual production folder.

## SPA routing

For a React SPA, routing is handled by the application in the browser, not by Nginx. That means a URL like `/dashboard/settings` is usually **not** a real file or directory on disk, so if Nginx tries to find it literally, it may return 404.

The usual fix is to let Nginx:

- serve real files if they exist,
- serve real directories if they exist,
- otherwise fall back to `index.html`.

That is why this pattern is standard:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Meaning:

- try the exact file path,
- then try a directory,
- if neither exists, serve `index.html`.

This lets React Router or another client-side router take over after the HTML loads.

## Why `try_files` works

Suppose the browser requests `/assets/logo.svg`. If that file exists, Nginx serves it directly. Suppose the browser requests `/about`; if there is no real `/about` file or directory, Nginx serves `/index.html`, and the React app decides what `/about` means.

This is the key production rule for SPAs:

- static assets should be served normally,
- client routes should fall back to `index.html`.

A practical full config looks like this:

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Static assets and caching

Frontend build tools usually generate hashed asset filenames such as `app.a13f9c.js` or `style.8b21d1.css`. Those are safe to cache aggressively because a content change creates a new filename.

A common pattern is:

- `index.html` → shorter cache
- hashed static assets → long cache

Example:

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

This is optional, but it is a very common optimization.

## CORS and S3

CORS is not a frontend setting; it is enforced by the browser based on the **server response** from the cross-origin resource. So if your frontend loads images, fonts, files, or other resources from an S3 bucket on a different origin, then the S3 bucket must return the proper CORS headers for your frontend domain.

Important rule:

- same origin → no CORS issue,
- different origin → configure CORS on the resource server, such as S3 or your API.

So if:

- frontend is served from `https://app.example.com`
- files are loaded from `https://my-bucket.s3.amazonaws.com`

then S3 must allow `https://app.example.com` in its CORS policy.

Example S3 CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://app.example.com"],
    "ExposeHeaders": []
  }
]
```

If your frontend is calling an API instead of just fetching static files, then the API server must send the correct CORS headers instead.

## Quick revision

- In production, React frontend files can be served directly by Nginx; you do not need the dev server or preview server.
- Dev server on 5173 is for development, and preview on 4173 is mainly for local build testing.
- Point Nginx `root` to the frontend build output directory, usually `dist`.
- Set `index index.html;` so the main HTML file is the default entry point.
- For SPA routing, use `try_files $uri $uri/ /index.html;`.
- Real files like JS, CSS, images, and fonts should be served normally; unknown app routes should fall back to `index.html`.
- CORS must be configured on the cross-origin server, such as S3 or an API, not in the frontend code.
- If frontend and resources are served from the same origin, CORS is usually not needed.

A clean production starter config is:

```nginx
server {
    listen 80;
    server_name example.com;

    root /var/www/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```
