# HTTP Caching

HTTP caching is often forgotten, even though it can be extremely cheap.

The browser or CDN can cache an HTTP response.

For example:

```http
Cache-Control: public, max-age=300
```

This means the response can be considered fresh for:

```text
300 seconds = 5 minutes
```

So suppose:

```text
GET /products
```

returns a list that rarely changes.

First request:

```text
Browser
   ↓
Server
   ↓
Database
   ↓
Response
   ↓
Browser stores response
```

For the next five minutes:

```text
Browser
   ↓
Cached response
```

The request may not even reach your server.

That is a huge difference.

The lesson describes HTTP caching as a very inexpensive optimization because you can sometimes eliminate the request entirely for the cache duration. 

---

## `Cache-Control`

One important HTTP header is:

```http
Cache-Control: public, max-age=300
```

Break it down:

### `public`

The response may be stored by shared caches such as CDNs.

### `max-age=300`

The response can be treated as fresh for 300 seconds.

So:

```text
Cache-Control: public, max-age=300
```

means approximately:

```text
This response can be publicly/shared cached
and is fresh for 5 minutes.
```

---

## `private` Is Critical for User-Specific Data

Suppose you have:

```http
GET /profile
```

and the response contains:

```json
{
  "name": "Raquib",
  "email": "raquib@example.com"
}
```

This response is user-specific.

You **do not** want a shared CDN to cache it as public data.

Otherwise:

```text
User A
   ↓
GET /profile
   ↓
CDN caches response
   ↓
User A's data
```

Then:

```text
User B
   ↓
GET /profile
   ↓
CDN
   ↓
User A's cached response
```

That is a serious privacy/security bug.

For user-specific content, use:

```http
Cache-Control: private
```

rather than:

```http
Cache-Control: public
```

The lesson explicitly warns that `private` should be used for user-specific responses because a shared cache could otherwise serve one user's response to another user. 

---

## `public` vs `private`

| Directive     | Meaning                                  | Typical use                               |
| ------------- | ---------------------------------------- | ----------------------------------------- |
| `public`      | Shared caches may store the response     | Public product list                       |
| `private`     | Response is intended for a specific user | User profile                              |
| `max-age=300` | Fresh for 300 seconds                    | Data that can tolerate 5-minute staleness |

### Example

Public:

```http
Cache-Control: public, max-age=300
```

Good candidate:

```text
GET /popular-products
```

Private:

```http
Cache-Control: private, max-age=300
```

Potential candidate:

```text
GET /my-profile
```

The exact caching policy depends on whether stale or shared data is acceptable.

---

## `ETag` and `If-None-Match`

Not every cache strategy requires sending the complete response repeatedly.

HTTP provides another useful mechanism:

```text
ETag
+
If-None-Match
```

The idea is:

> "Has this resource changed since the version I already have?"

---

### First request

Server returns:

```http
HTTP/1.1 200 OK
ETag: "abc123"
```

with the response body:

```json
{
  "products": ["Laptop", "Mouse"]
}
```

The client stores:

```text
Body
+
ETag = "abc123"
```

---

### Later request

The client sends:

```http
If-None-Match: "abc123"
```

The server checks:

```text
Has the resource changed?
```

If not:

```http
HTTP/1.1 304 Not Modified
```

There is no response body.

So instead of sending:

```text
Large response body
```

again, the server effectively says:

> "Your cached version is still valid."

---

## `304 Not Modified`

Important distinction:

```text
200 OK
    ↓
Here is the resource again.
```

versus:

```text
304 Not Modified
    ↓
Your cached resource is still valid.
```

The client can continue using its cached copy.

This saves bandwidth.

The server still handled the request, but it did not need to send the full response body. 

---

**Next:** [Server-Side Caches →](./03-Server-Side-Caches.md)
