# Express Response Methods — One-Shot Revision

## 1. One-line Definition

Express response methods build and finish the HTTP response sent to a client.

## 2. Why was it introduced?

They remove low-level header/body boilerplate and make API responses consistent.

## 3. Core Mental Model

Set status/headers, then send exactly one response body—or deliberately send no body.

## 4. Internal Working

The response object extends Node’s `ServerResponse`. Sending methods commit headers and end the response. Once headers/body are sent, trying to change them or send again fails.

## 5. Key APIs / Syntax

```js
res.status(201).json({ id: 1 });
res.send('Hello');
res.sendStatus(404);
res.redirect(303, '/login');
res.sendFile(absolutePath);
res.download(absolutePath, 'report.pdf'); // Content-Disposition: attachment
res.status(204).end();
```

`res.json()` serializes JSON and sets JSON content type. `res.download()` uses attachment disposition so browsers download rather than render the file.

## 6. Comparison

| Method | Best use |
| --- | --- |
| `res.send()` | Text/HTML/buffer/general response |
| `res.json()` | JSON API payload |
| `res.status()` | Set code before another sender |
| `res.sendFile()` | Serve one file |
| `res.download()` | Force download with filename |
| `res.redirect()` | Send 3xx and `Location` |

## 7. Common Mistakes

- Calling `res.send()` then `res.json()`/another sender.
- Sending a body with `204 No Content`.
- Returning success codes for validation/not-found failures.
- Passing unvalidated user paths to `sendFile`/`download`.

## 8. Production Considerations

- Standardize error response shape and appropriate status codes.
- Return `201 Created` for successful creation and consider a `Location` header.
- Avoid leaking internal errors; use centralized error middleware.
- Use streaming/file responses rather than loading large assets into memory.

## 9. Interview Questions

1. `res.send()` vs `res.json()`?
2. Why is double-sending an error?
3. When use 200, 201, and 204?
4. `sendFile()` vs `download()`?

## 10. Memory Triggers

- **Status → headers → one send.**
- **JSON API = `res.json()`.**
- **Download = attachment.**

## 11. Summary

Choose the response helper that matches the representation, pair it with the correct status code, and terminate each request exactly once.
