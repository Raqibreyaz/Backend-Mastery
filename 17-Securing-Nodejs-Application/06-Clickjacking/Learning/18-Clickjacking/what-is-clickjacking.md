# 🛡️ What is Clickjacking?

**Clickjacking** (short for "click hijacking") is a malicious technique where an attacker tricks a user into clicking on something different from what the user perceives. This is usually done by embedding a legitimate website or UI element inside an invisible frame on the attacker's website, thereby hijacking user clicks.

---

## 🚨 How Clickjacking Works

1. The attacker creates a **malicious webpage**.
2. The attacker embeds a legitimate site (e.g., a bank, email provider, or social media) using an `<iframe>`.
3. The iframe is styled to be **invisible** or **partially transparent**.
4. The attacker overlays fake buttons or content to trick users into clicking on the iframe.
5. When the user clicks, the action is performed on the **legitimate site**, but the user is unaware.

---

## 🧨 Potential Impacts of Clickjacking

- **Changing security settings** without the user’s knowledge
- **Liking/following pages** on social media without consent
- **Triggering money transfers** in banking apps
- **Enabling camera/mic** access in poorly secured apps
- **Authorizing app permissions** in OAuth flows

---

## 🔒 How to Prevent Clickjacking

### 1. **Use `X-Frame-Options` Header**

This HTTP response header tells the browser whether a page can be embedded in frames.

- `DENY`: Completely blocks framing.
- `SAMEORIGIN`: Allows framing only from the same domain.

**Example:**

```http
X-Frame-Options: SAMEORIGIN
```

### 2. **Use Content Security Policy (CSP)**

CSP provides more flexible control via the `frame-ancestors` directive.

**Example:**

```http
Content-Security-Policy: frame-ancestors 'none';
```

---

Protecting your website with proper headers ensures your users can't be tricked into unintended actions by malicious websites.