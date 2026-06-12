# Response Methods – 5 Minute Cheatsheet

## If you get only 3 questions

1. Difference between `res.send()`, `res.json()`, and `res.end()` – when to use which?
2. How do you set status codes and headers correctly before sending a response?
3. How do you redirect, send files, or render views using the response object?

---

## Mental models (1–2 lines each)

- The `res` object is your **HTTP response handle**; you configure headers/status, then send a body and finish the response.
- `res.send()` is the **generic “send anything”** method (string, buffer, object) with automatic `Content-Type` inference.
- `res.json()` is a **specialized JSON helper** that always sends JSON with `Content-Type: application/json`.
- `res.status(code)` is chainable and sets the **HTTP status code** for the next send.
- `res.redirect()` sends a **3xx redirect** with a `Location` header; the browser then makes a new request to that URL.
- `res.sendFile()` / `res.download()` stream a file from disk; `res.download()` also sets `Content-Disposition: attachment`.

---

## Canonical examples to recall

**1. Basic JSON API response**

```js
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});
```

`res.status` sets the status code; `res.json` serializes the object to JSON and sets `Content-Type: application/json`.

---

**2. Sending HTML / text with `res.send()`**

```js
app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello, world</h1>');
});
```

`res.send` accepts strings, buffers, and objects; it infers `Content-Type` (string → `text/html`, object → JSON, etc.).

---

**3. Redirect and send file**

```js
app.get('/old-home', (req, res) => {
  res.redirect(301, '/new-home');
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});
```

`res.redirect` sets a 3xx status and `Location` header; `res.sendFile` resolves the path and streams the file as the response body.

---

## Links to full notes

- Overview of the `res` object and lifecycle → `../Learning/01-response-object-basics.md`
- `res.send` / `res.json` / `res.end` differences → `../Learning/02-send-json-end-differences.md`
- Status codes, headers, and content negotiation → `../Learning/03-status-and-headers.md`
- Redirects, file downloads, and streaming responses → `../Learning/04-redirects-and-files.md`