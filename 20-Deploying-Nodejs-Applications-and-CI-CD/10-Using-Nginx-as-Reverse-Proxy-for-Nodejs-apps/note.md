## Reverse proxy idea

Nginx can accept a request for a public hostname and forward that request to an internal app like `http://localhost:4000`, which is exactly what `proxy_pass` does. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
That means the browser talks to Nginx, and Nginx talks to your Node, Python, Java, or other backend service running on any reachable IP:port. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

```nginx
server {
    listen 127.0.0.1:80;
    server_name api.local.com;

    location / {
        proxy_pass http://localhost:4000;
    }
}
```

In this config, requests for `api.local.com` are forwarded to the app listening on `localhost:4000`. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

## Header behavior
by default, Nginx changes the proxied request’s `Host` header to `$proxy_host`, changes `Connection` to `close`, and removes headers whose value is an empty string. [linuxize](https://linuxize.com/post/nginx-reverse-proxy/)
So if you use `proxy_pass http://localhost:4000;`, the backend commonly sees `Host: localhost:4000`, which matches the header dump you captured. [linuxize](https://linuxize.com/post/nginx-reverse-proxy/)

That does **not** mean “every browser header is lost”; many normal request headers such as `User-Agent`, `Accept`, and `Accept-Language` are still forwarded unless you explicitly override or clear them. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
The main surprise is usually the `Host` header, because Nginx rewrites it unless you set it yourself with `proxy_set_header`. [linuxize](https://linuxize.com/post/nginx-reverse-proxy/)

## Preserve original host

If you want the backend to know that the original request was for `api.local.com`, set the `Host` header explicitly. [bugsink](https://www.bugsink.com/docs/proxy-headers/)

```nginx
server {
    listen 80;
    server_name api.local.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
    }
}
```

With `proxy_set_header Host $host;`, the upstream app receives the original hostname instead of `localhost:4000`. [oneuptime](https://oneuptime.com/blog/post/2025-12-16-nginx-host-vs-http-host/view)
This is useful when the app builds absolute URLs, does host-based routing, checks allowed hosts, or needs to know which domain the user requested. [bugsink](https://www.bugsink.com/docs/proxy-headers/)

## Common proxy headers

A more complete reverse-proxy setup usually also forwards the client IP and original scheme. [oneuptime](https://oneuptime.com/blog/post/2025-12-16-nginx-host-vs-http-host/view)

```nginx
server {
    listen 80;
    server_name api.local.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`X-Real-IP` and `X-Forwarded-For` help the backend identify the real client instead of just seeing Nginx as the caller. [bugsink](https://www.bugsink.com/docs/proxy-headers/)
`X-Forwarded-Proto` tells the backend whether the original client used HTTP or HTTPS, which matters for redirects, cookies, and generated links. [oneuptime](https://oneuptime.com/blog/post/2025-12-16-nginx-host-vs-http-host/view)

## Quick revision

- Nginx can expose apps running on different internal IPs or ports through normal HTTP/HTTPS URLs by acting as a reverse proxy. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- `proxy_pass` forwards the incoming request from Nginx to another server such as `http://localhost:4000`. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- By default, Nginx rewrites `Host` to `$proxy_host`, so the backend often sees `localhost:4000`. [linuxize](https://linuxize.com/post/nginx-reverse-proxy/)
- By default, Nginx also sets `Connection` to `close`. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- Normal browser headers are not all removed; many still pass through unless you override them. [linuxize](https://linuxize.com/post/nginx-reverse-proxy/)
- Use `proxy_set_header Host $host;` when you want the backend to see the original requested hostname like `api.local.com`. [bugsink](https://www.bugsink.com/docs/proxy-headers/)
- Use `X-Real-IP` or `X-Forwarded-For` so the backend can see the real client IP. [oneuptime](https://oneuptime.com/blog/post/2025-12-16-nginx-host-vs-http-host/view)
- Use `X-Forwarded-Proto $scheme` so the backend knows whether the original request came over HTTP or HTTPS. [bugsink](https://www.bugsink.com/docs/proxy-headers/)