## Header directions

`add_header` adds a response header from Nginx to the client, and `proxy_set_header` sets or overrides a request header that Nginx forwards to the proxied app. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
One useful nuance is that `add_header` is not applied to every status code by default; Nginx documents specific response codes unless you add the `always` parameter. [nginx](https://nginx.org/en/docs/http/ngx_http_headers_module.html)

```nginx
location / {
    proxy_pass http://localhost:4000;

    add_header hello world;
    proxy_set_header test "test header from nginx";
}
```

In this example, `hello: world` goes back in the client response, while `test: test header from nginx` is sent to the upstream app on `localhost:4000`. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)

## `Server` header

You generally cannot replace Nginx’s built-in `Server` header with plain `add_header`; adding `add_header Server "Node.js";` does not override the native header and can result in an additional `Server` header instead. [nginx-extras.getpagespeed](https://nginx-extras.getpagespeed.com/modules/headers-more/)
So this does **not** truly make Nginx identify itself as Node.js in the normal built-in way. [stackoverflow](https://stackoverflow.com/questions/246227/how-do-you-change-the-server-header-returned-by-nginx)

```nginx
location / {
    proxy_pass http://localhost:4000;
    add_header Server "Node.js";
}
```

If your goal is only to reduce exposure, the built-in directive to know first is `server_tokens off;`. [stackoverflow](https://stackoverflow.com/questions/20247184/nginx-server-tokens-off-does-not-remove-the-server-header)

## Hide version

`server_tokens off;` removes the Nginx version from error pages and from the `Server` response header, but the header still remains as something like `Server: nginx`. [stackoverflow](https://stackoverflow.com/questions/20247184/nginx-server-tokens-off-does-not-remove-the-server-header)
That means it improves disclosure slightly, but it does not fully suppress the header. [stackoverflow](https://stackoverflow.com/questions/20247184/nginx-server-tokens-off-does-not-remove-the-server-header)

```nginx
server {
    listen 127.0.0.1:80;
    server_name api.local.com;
    server_tokens off;

    location / {
        proxy_pass http://localhost:4000;
    }
}
```

This is the simplest built-in hardening step when you want less server fingerprinting without extra modules. [stackoverflow](https://stackoverflow.com/questions/20247184/nginx-server-tokens-off-does-not-remove-the-server-header)

## Remove header fully

To clear the `Server` header completely, you typically need the **Headers-More** module, which extends Nginx’s standard header handling and supports `more_clear_headers Server;`. [github](https://github.com/openresty/headers-more-nginx-module)
On Debian/Ubuntu-based systems, that is commonly installed via the `libnginx-mod-http-headers-more-filter` package. [gist.github](https://gist.github.com/X448NAX/4ec53b4501b3dc5cfb430617c9d09660)

```bash
sudo apt update
sudo apt install -y libnginx-mod-http-headers-more-filter
```

After the module is loaded, `more_clear_headers Server;` can be placed in `http`, `server`, or `location` context to clear that output header. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/headers-more/)

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

## Quick revision

- `add_header` modifies the **response** from Nginx to the client. [nginx](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- `proxy_set_header` modifies the **request** Nginx sends to the upstream server. [docs.nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
- By default, `add_header` does not apply to every status code; use `always` when needed. [nginx](https://nginx.org/en/docs/http/ngx_http_headers_module.html)
- `add_header Server "Node.js";` does not properly replace Nginx’s built-in `Server` header. [nginx-extras.getpagespeed](https://nginx-extras.getpagespeed.com/modules/headers-more/)
- It can produce an extra `Server` header instead of overriding the original one. [stackoverflow](https://stackoverflow.com/questions/246227/how-do-you-change-the-server-header-returned-by-nginx)
- `server_tokens off;` hides the Nginx **version** in the `Server` header and error pages. [stackoverflow](https://stackoverflow.com/questions/20247184/nginx-server-tokens-off-does-not-remove-the-server-header)
- `server_tokens off;` does **not** remove the `Server` header entirely. [stackoverflow](https://stackoverflow.com/questions/20247184/nginx-server-tokens-off-does-not-remove-the-server-header)
- To fully clear `Server`, use the Headers-More module and `more_clear_headers Server;`. [github](https://github.com/openresty/headers-more-nginx-module)