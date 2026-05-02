## Reverse proxy basics

Nginx can sit in front of apps running on different internal IPs or ports and expose them through normal HTTP/HTTPS hostnames, which is the core reverse-proxy pattern. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
With `proxy_pass`, the browser talks to Nginx first, and Nginx forwards the request to the upstream app. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

```nginx
server {
    listen 80;
    server_name api.local.com;

    location / {
        proxy_pass http://localhost:4000;
    }
}
```

In this example, a request for `http://api.local.com/` is forwarded to the app listening on `http://localhost:4000`. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
By default, the proxied request’s `Host` header is commonly rewritten to the upstream host such as `localhost:4000`, unless you override it. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

## Request and response headers

`add_header` adds headers to the **response** Nginx sends back to the client, while `proxy_set_header` sets headers on the **request** Nginx sends to the upstream server. [nginx](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
So one affects client-facing output, and the other affects upstream-facing input. [nginx](https://nginx.org/en/docs/http/ngx_http_headers_module.html)

```nginx
location / {
    proxy_pass http://localhost:4000;

    add_header hello world;
    proxy_set_header test "test header from nginx";
}
```

Here, the client can receive `hello: world`, while the upstream app can receive `test: test header from nginx`. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
If you want the upstream to see the original hostname instead of `localhost:4000`, use `proxy_set_header Host $host;`. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

```nginx
location / {
    proxy_pass http://localhost:4000;
    proxy_set_header Host $host;
}
```

`$host` is the hostname Nginx uses for the request, usually based on the request host information Nginx resolved for that request. [nginx](https://nginx.org/en/docs/varindex.html)

## Client IP and forwarded headers

`$remote_addr` is the client IP as seen by Nginx, and `$scheme` tells Nginx whether the request arrived over HTTP or HTTPS. [wisdom.gitbook](https://wisdom.gitbook.io/gyan/nginx/deep-dive-into-nginx-variables)
`$proxy_add_x_forwarded_for` builds a value by taking any incoming `X-Forwarded-For` header and appending `$remote_addr`; if no such header exists, it is effectively just `$remote_addr`. [oneuptime](https://oneuptime.com/blog/post/2026-03-20-x-forwarded-for-client-ipv4/view)

```nginx
location / {
    proxy_pass http://localhost:4000;

    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

This is the common production pattern: `X-Real-IP` carries one client IP, `X-Forwarded-For` carries the chain, and `X-Forwarded-Proto` tells the app whether the original request was HTTP or HTTPS. [github](https://github.com/nginxinc/nginx-wiki/blob/master/source/start/topics/examples/forwarded.rst)
The standard header name is `X-Forwarded-For`, but the value from `$proxy_add_x_forwarded_for` can be assigned to any custom header name because the behavior comes from the variable, not from the destination header label. [nginx](https://nginx.org/en/docs/varindex.html)

```nginx
location / {
    proxy_set_header X-Reversed-For $proxy_add_x_forwarded_for;
}
```

If a client sends `X-Forwarded-For: xyz` and Nginx sees the client as `127.0.0.1`, then `$proxy_add_x_forwarded_for` becomes `xyz, 127.0.0.1`, and that exact value can be placed into `X-Reversed-For` or any other custom header. [oneuptime](https://oneuptime.com/blog/post/2026-03-20-x-forwarded-for-client-ipv4/view)
A custom header works for demonstration, but `X-Forwarded-For` is preferred in real systems because frameworks and proxies commonly understand it automatically. [github](https://github.com/nginxinc/nginx-wiki/blob/master/source/start/topics/examples/forwarded.rst)

Example upstream view:

```json
{
  "x-reversed-for": "xyz, 127.0.0.1",
  "x-forwarded-for": "xyz"
}
```

This happens because Nginx wrote the computed value into your custom header, while the original client-sent `X-Forwarded-For` can still remain unchanged unless you explicitly overwrite that header too. [oneuptime](https://oneuptime.com/blog/post/2026-03-20-x-forwarded-for-client-ipv4/view)

## `proxy_pass` slash behavior

For a normal prefix `location`, `proxy_pass http://host;` forwards the request URI as-is, while `proxy_pass http://host/;` replaces the matched location prefix with `/`. [digitalocean](https://www.digitalocean.com/community/questions/i-need-help-understanding-trailing-slash-behaviour-in-nginx)
That is why the trailing slash changes upstream paths so much. [stackoverflow](https://stackoverflow.com/questions/22759345/nginx-trailing-slash-in-proxy-pass-url)

```nginx
location /api/ {
    proxy_pass http://localhost:4000;
}
```

A request to `/api/users` goes upstream as `/api/users`, because there is no URI part in `proxy_pass` after the host. [digitalocean](https://www.digitalocean.com/community/questions/i-need-help-understanding-trailing-slash-behaviour-in-nginx)

```nginx
location /api/ {
    proxy_pass http://localhost:4000/;
}
```

A request to `/api/users` goes upstream as `/users`, because the matched `/api/` prefix is replaced by `/`. [digitalocean](https://www.digitalocean.com/community/questions/i-need-help-understanding-trailing-slash-behaviour-in-nginx)

```nginx
location /api/ {
    proxy_pass http://localhost:4000/api/;
}
```

A request to `/api/users` goes upstream as `/api/users`, because `/api/` is replaced with `/api/`. [oneuptime](https://oneuptime.com/blog/post/2025-12-16-fix-trailing-slash-nginx-proxy-pass/view)

A common trap is mixing `location /api` with `proxy_pass http://localhost:4000/;`, which can create `//users` for a request like `/api/users` because the matched part is `/api` and the leftover path already begins with `/users`. [stackoverflow](https://stackoverflow.com/questions/22759345/nginx-trailing-slash-in-proxy-pass-url)
The safer prefix-stripping pattern is to keep both sides aligned: `location /api/ { proxy_pass http://host/; }`. [oneuptime](https://oneuptime.com/blog/post/2025-12-16-fix-trailing-slash-nginx-proxy-pass/view)

## `Server` header and hardening

You generally cannot truly replace Nginx’s built-in `Server` header using plain `add_header`; doing `add_header Server "Node.js";` can create a duplicate header rather than overriding the native one. [nginx-extras.getpagespeed](https://nginx-extras.getpagespeed.com/modules/headers-more/)
If your goal is simple hardening, `server_tokens off;` removes the Nginx version from the `Server` header and error pages, but it does not remove the `Server` header entirely. [stackoverflow](https://stackoverflow.com/questions/20247184/nginx-server-tokens-off-does-not-remove-the-server-header)

```nginx
server {
    listen 80;
    server_name api.local.com;
    server_tokens off;

    location / {
        proxy_pass http://localhost:4000;
    }
}
```

To clear the `Server` header completely, you typically need the Headers-More module and `more_clear_headers Server;`. [github](https://github.com/openresty/headers-more-nginx-module)

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

## Practical reference

Use this as the default mental model: `location` decides **which block handles the request**, and `proxy_pass` decides **where it is forwarded and how the URI is formed**. [nginx](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)
Use standard forwarded headers unless you are deliberately experimenting, and keep trailing slashes consistent when you want predictable upstream paths. [github](https://github.com/nginxinc/nginx-wiki/blob/master/source/start/topics/examples/forwarded.rst)

A clean starter config:

```nginx
server {
    listen 80;
    server_name api.local.com;
    server_tokens off;

    location /api/ {
        proxy_pass http://localhost:4000/;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

This setup strips the `/api/` prefix, forwards the request to `localhost:4000`, preserves the original host, sends client IP information, and tells the upstream whether the original request used HTTP or HTTPS. [nginx](https://nginx.org/en/docs/varindex.html)

### Quick revision

- `proxy_pass` makes Nginx act as a reverse proxy to an upstream app. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- `add_header` changes the response to the client, while `proxy_set_header` changes the request to the upstream. [nginx](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- `$host` is the hostname Nginx uses for the request. [nginx](https://nginx.org/en/docs/varindex.html)
- `$remote_addr` is the client IP as seen by Nginx. [wisdom.gitbook](https://wisdom.gitbook.io/gyan/nginx/deep-dive-into-nginx-variables)
- `$proxy_add_x_forwarded_for` appends `$remote_addr` to any existing incoming `X-Forwarded-For`. [oneuptime](https://oneuptime.com/blog/post/2026-03-20-x-forwarded-for-client-ipv4/view)
- The value from `$proxy_add_x_forwarded_for` can be written into any header name, but `X-Forwarded-For` is the standard one. [github](https://github.com/nginxinc/nginx-wiki/blob/master/source/start/topics/examples/forwarded.rst)
- `proxy_pass http://host;` keeps the URI, while `proxy_pass http://host/;` replaces the matched prefix for normal prefix locations. [digitalocean](https://www.digitalocean.com/community/questions/i-need-help-understanding-trailing-slash-behaviour-in-nginx)
- `location /api/` with `proxy_pass http://host/;` is the safer prefix-stripping pattern. [stackoverflow](https://stackoverflow.com/questions/22759345/nginx-trailing-slash-in-proxy-pass-url)
