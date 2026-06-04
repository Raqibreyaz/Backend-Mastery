# 🧭 Understanding Top-Level Navigations

## 🌐 What is a Top-Level Navigation?

A **top-level navigation** refers to any change that affects the **main address bar (URL)** of the browser — i.e., when the **topmost browsing context** (the main tab or window) is redirected or loaded to a new page.

It is considered a **user-initiated full-page navigation**.

---

## 📘 Examples of Top-Level Navigations

1. **Clicking a link:**

   ```html
   <a href="https://example.com/profile">Go to Profile</a>
   ```

   This navigates the entire page to `https://example.com/profile`.

2. **Submitting a form:**

   ```html
   <form action="https://example.com/submit" method="GET">
     <button type="submit">Submit</button>
   </form>
   ```

   If the form is not inside an iframe and no `target` attribute is used, it changes the main page URL.

3. **Programmatic navigation:**

   ```js
   window.location.href = "https://example.com/dashboard";
   ```

   JavaScript navigation that causes the browser to load a new URL.

4. **Entering a URL manually:**
   The user types a new address into the browser's address bar and presses Enter.

---

## 🧪 What Is Not Top-Level Navigation

1. **Iframe navigations:**

   ```html
   <iframe src="https://example.com/child"></iframe>
   ```

   The main page stays the same — only the iframe's content changes.

2. **AJAX / `fetch()` / `XMLHttpRequest`:**
   These make network requests but do **not change** the visible URL or load a new page.

3. **Image, script, or video loads:**

   ```html
   <img src="https://example.com/image.jpg">
   ```

   Loading resources doesn’t affect the top-level page.

---

## 🔐 Why It Matters for Security

Browser cookie policies (like `SameSite=Lax`) **allow cookies on top-level GET navigations**, even if they’re cross-site. But they block cookies for other types of cross-origin requests, helping defend against CSRF.

---

## ✅ TL;DR

* Top-level navigation changes the main browser URL or page.
* It can be triggered by link clicks, form submissions, or JavaScript.
* It’s **important** in how browsers decide whether or not to send cookies during a request.
