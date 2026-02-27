# Content Security Policy (CSP) Directives Categorized

A comprehensive list of **Content Security Policy (CSP)** directives, categorized by their purpose.

---

## ✅ 1. Fetch Directives

These control where different types of resources can be loaded from.

| Directive      | Description                                                     |
| -------------- | --------------------------------------------------------------- |
| `default-src`  | Fallback for other resource types unless overridden             |
| `script-src`   | Controls JavaScript loading (e.g., `<script>`)                  |
| `style-src`    | Controls CSS loading (e.g., `<style>`, `link rel="stylesheet"`) |
| `img-src`      | Controls image loading (e.g., `<img>`, CSS `url()`)             |
| `font-src`     | Controls font loading (e.g., from `@font-face`)                 |
| `connect-src`  | Controls connections (e.g., `fetch`, `XHR`, `WebSocket`)        |
| `media-src`    | Controls `<audio>` and `<video>` sources                        |
| `object-src`   | Controls `<object>`, `<embed>`, `<applet>` loading              |
| `manifest-src` | Controls web app manifest file loading                          |
| `child-src`    | Deprecated, use `frame-src` or `worker-src`                     |
| `frame-src`    | Controls embedding via `<iframe>` or `<frame>`                  |

---

## ✅ 2. Navigation Directives

Control how and where navigation can occur.

| Directive         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| `frame-ancestors` | Restrict which sources can embed your content via `<iframe>`                                    |
| `form-action`     | Restrict where forms can submit data to                                                         |
| `navigate-to`     | Restrict where anchor tags can redirect (Removed from the spec and not implemented in browsers) |

---

## ✅ 3. Other Directives

| Directive    | Description                                             |
| ------------ | ------------------------------------------------------- |
| `worker-src` | Controls loading of `Web Workers` and `Service Workers` |
| `webrtc`     | Controls WebRTC communication (not widely supported)    |

---

## ✅ 4. Reporting Directives

Allow monitoring of policy violations.

| Directive    | Description                                            |
| ------------ | ------------------------------------------------------ |
| `report-uri` | (Deprecated) Sends CSP violation reports to this URI   |
| `report-to`  | Modern alternative to `report-uri` using Reporting API |

---

## ✅ 5. Document Directives

Control document behavior and structure.

| Directive                   | Description                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `sandbox`                   | Applies sandbox restrictions to the page (like `<iframe sandbox>`) |
| `base-uri`                  | Restricts URLs used by `<base>` element                            |
| `upgrade-insecure-requests` | Automatically upgrade HTTP requests to HTTPS                       |

---

> Tip: Always start with a restrictive policy like `default-src 'none';` and open only what’s required.
