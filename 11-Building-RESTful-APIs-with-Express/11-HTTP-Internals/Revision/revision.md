# HTTP Internals — One-Shot Revision

## 1. One-line Definition

HTTP is an application protocol in which clients send requests and servers return responses containing a start line, headers, and an optional body.

## 2. Why was it introduced?

It provides a common, interoperable way for browsers, APIs, proxies, and servers to exchange representations of resources.

## 3. Core Mental Model

The start line says what happened/requested, headers describe it, and the body carries content. Status codes tell clients what to do next.

## 4. Internal Working

HTTP/1.1 usually reuses persistent TCP connections (keep-alive) for multiple requests. Headers such as `Content-Type`, `Accept`, `Authorization`, `Cache-Control`, `Location`, and `Set-Cookie` control interpretation and behavior. Content negotiation compares client preferences (`Accept`, language, encoding) with what a server can send.

Body parsers depend on `Content-Type`: JSON for `express.json()`, URL encoded fields for `express.urlencoded()`, text for `express.text()`, and multipart middleware for files. `extended: true` URL-encoded parsing supports nested/array notation; `false` treats keys more simply.

## 5. Key APIs / Syntax

```js
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

res.status(201).location('/users/42').json({ id: 42 });
res.redirect(303, '/thanks');
```

| Status | Meaning |
| --- | --- |
| 200 / 201 / 204 | Success / created / successful no body |
| 301 / 302 / 303 | Redirects that may change request method (303 becomes GET) |
| 307 / 308 | Temporary/permanent redirect that preserves method/body |
| 304 | Cache validation: use stored representation; not a normal redirect body |
| 400 / 401 / 403 / 404 / 422 | Client input/auth/permission/missing/validation failures |
| 500 / 503 | Unexpected server failure / temporary unavailability |

## 6. Comparison

| Encoding | Shape | Parser |
| --- | --- | --- |
| JSON | JSON text | `express.json()` |
| URL encoded | `a=1&b=2` | `express.urlencoded()` |
| Multipart | boundaries + binary parts | Multer/etc. |
| Plain text | raw text | `express.text()` |

| Redirect | Method/body behavior |
| --- | --- |
| 301/302 | Clients may rewrite to GET; avoid for method-sensitive APIs |
| 303 | Follow-up GET; useful after form submission (PRG) |
| 307/308 | Preserve method and body |

## 7. Common Mistakes

- Parsing the same request body manually after body middleware has consumed it.
- Selecting the wrong parser/content type.
- Calling 300 or 304 a normal redirect; 300 provides choices and 304 validates cache.
- Using 301/302 when a POST/PUT body must survive; use 307/308 when preservation is required.
- Treating `401 Unauthorized` as authorization failure—it means authentication is absent/invalid; `403` means authenticated but forbidden.
- Caching personalized/sensitive responses in shared caches.

## 8. Production Considerations

- Use correct content types, status codes, size limits, parser order, and consistent error payloads.
- Configure server/proxy keep-alive and request/header/body timeouts deliberately to resist slow-client resource exhaustion.
- Set safe caching (`Cache-Control`, validators such as ETag) based on freshness and privacy.
- Validate URL-encoded nesting/depth and request sizes; never trust any request body encoding.
- Use a reverse proxy/load balancer’s forwarding headers only after configuring Express trust proxy correctly.

## 9. Interview Questions

1. Name the parts of an HTTP request/response.
2. What are status-code classes and common API codes?
3. 301/302 versus 307/308?
4. What does keep-alive do?
5. How does content negotiation work?
6. Compare JSON, URL-encoded, and multipart parsing.
7. What does `extended` change in `express.urlencoded()`?

## 10. Memory Triggers

- **Start line, headers, body.**
- **Accept asks; Content-Type tells.**
- **HTTP/1.1 reuses connections.**
- **303 becomes GET; 307/308 preserve.**
- **Parser follows Content-Type.**

## 11. Summary

Reliable Express APIs depend on HTTP fundamentals: match body parser to content type, use status/redirect semantics correctly, configure caching and persistent connections intentionally, and keep client input bounded and validated.
