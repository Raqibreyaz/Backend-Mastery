# Important Security Headers for Web Applications

Security headers help protect your website from common attacks like **XSS**, **clickjacking**, **data injection**, and more. Here's a list of the most important ones, starting with the most critical.

---

## 🛡️ 1. Content-Security-Policy (CSP)

**Purpose**: Prevents **Cross-Site Scripting (XSS)** and other code injection attacks.

**Example:**

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.example.com
```

**What it does:**

- Restricts the sources from which content (scripts, styles, images, etc.) can be loaded.
- Helps mitigate XSS by blocking unauthorized script execution.

---

## 🧱 2. X-Frame-Options

**Purpose**: Prevents **clickjacking attacks** by controlling whether a page can be embedded in an `<iframe>`.

**Example:**

```http
X-Frame-Options: DENY
```

**Values:**

- `DENY`: Disallows all framing.
- `SAMEORIGIN`: Allows framing from the same origin only.
- `ALLOW-FROM uri`: (deprecated) Allowed from specific URI.

---

## 🚫 3. X-Content-Type-Options

**Purpose**: Prevents **MIME type sniffing** by browsers.

**Example:**

```http
X-Content-Type-Options: nosniff
```

**What it does:**

- Forces the browser to honor the declared content type.
- Prevents scripts or styles from being interpreted incorrectly.

---

## 🔐 4. Strict-Transport-Security (HSTS)

**Purpose**: Enforces **HTTPS** by instructing browsers to connect securely only.

**Example:**

```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

**What it does:**

- Prevents protocol downgrade attacks.
- Ensures future connections are HTTPS-only.

---

## 🕵️‍♂️ 5. Referrer-Policy

**Purpose**: Controls how much referrer information is sent when navigating away from a page.

**Example:**

```http
Referrer-Policy: no-referrer-when-downgrade
```

**Other values:**

- `no-referrer`, `strict-origin`, `same-origin`, `origin-when-cross-origin`, etc.

---

## 🔐 6. Permissions-Policy (formerly Feature-Policy)

**Purpose**: Controls access to browser features like camera, geolocation, microphone, etc.

**Example:**

```http
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

---

## 📦 7. Cross-Origin-Embedder-Policy (COEP)

**Purpose**: Used with **COOP** and **CORS** to control cross-origin resource loading securely.

**Example:**

```http
Cross-Origin-Embedder-Policy: require-corp
```

---

## 📦 8. Cross-Origin-Opener-Policy (COOP)

**Purpose**: Isolates the browsing context to mitigate cross-origin attacks.

**Example:**

```http
Cross-Origin-Opener-Policy: same-origin
```

---

## 📦 9. Cross-Origin-Resource-Policy (CORP)

**Purpose**: Prevents other origins from loading your resources.

**Example:**

```http
Cross-Origin-Resource-Policy: same-origin
```

---

## ✅ Summary Table

| Header                        | Purpose                                 |
| ----------------------------- | --------------------------------------- |
| Content-Security-Policy (CSP) | Prevent XSS and code injection          |
| X-Frame-Options               | Prevent clickjacking                    |
| X-Content-Type-Options        | Prevent MIME type sniffing              |
| Strict-Transport-Security     | Enforce HTTPS                           |
| Referrer-Policy               | Control referrer data leakage           |
| Permissions-Policy            | Control browser feature access          |
| Cross-Origin-Embedder-Policy  | Control cross-origin resource embedding |
| Cross-Origin-Opener-Policy    | Protect browsing context                |
| Cross-Origin-Resource-Policy  | Restrict resource loading to origins    |
