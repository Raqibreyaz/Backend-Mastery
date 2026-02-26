# 🛡️ Same-Origin Policy (SOP)

## 🔐 What is Same-Origin Policy?

The **Same-Origin Policy (SOP)** is a fundamental security rule **enforced by web browsers by default**. It restricts how documents or scripts loaded from one origin can interact with resources from another origin.

> SOP is automatically enabled in all modern browsers. You do not need to set it manually.

---

## 🧾 What is an "origin"?

An **origin** is defined as:

```
Origin = Protocol + Hostname + Port
```

Any difference in **protocol**, **hostname**, or **port** makes it a different origin.

---

## ✅ What SOP Blocks

- Reading cookies, `localStorage`, or `sessionStorage` of another origin
- Reading response body from `fetch()` or `XMLHttpRequest` to a different origin
- Accessing cross-origin iframe DOM or content

---

## ✅ What SOP Allows

- Sending requests (e.g., `fetch`, `<img src=...>`, `<script src=...>`) to other origins
- Loading styles, fonts, scripts, and images from other origins (read-only)
- Embedding cross-origin content in iframes (read-only access)

---

## 🎯 Why Was SOP Created?

To protect users from malicious websites. For example:

1. You're logged into `https://yourbank.com`.
2. You visit `https://hacker.com`, which tries to fetch data from your bank using JavaScript.
3. SOP prevents `hacker.com` from reading the response, accessing your cookies, or stealing your session.

---

## 🧠 Key Facts

| Feature              | Answer                       |
| -------------------- | ---------------------------- |
| Who enforces SOP?    | Browser                      |
| Is SOP optional?     | ❌ No — always enabled       |
| Can you disable it?  | ❌ No — not in real browsers |
| Who does it protect? | The user and their data      |

---

## 🔐 Summary

- Same-Origin Policy is **enabled by default** in all browsers.
- It ensures that scripts from one origin **cannot access** sensitive data from another.
- It is one of the most important browser security mechanisms.

> SOP is a core reason why websites can't freely read your data from other tabs or cookies from unrelated domains.
