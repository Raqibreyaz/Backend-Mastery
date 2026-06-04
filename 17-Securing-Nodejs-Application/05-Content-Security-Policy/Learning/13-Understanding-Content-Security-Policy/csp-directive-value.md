## ✅ CSP Directives and Their Possible Values (No Descriptions)

### ✅ 1. Fetch Directives

| Directive      | Possible Values                                                                       |
| -------------- | ------------------------------------------------------------------------------------- |
| `default-src`  | `'self'`, URLs, `'none'`, `'unsafe-inline'`, `'unsafe-eval'`, data:, blob:, https:    |
| `script-src`   | `'self'`, URLs, `'unsafe-inline'`, `'unsafe-eval'`, nonces (`'nonce-abc123'`), hashes |
| `style-src`    | `'self'`, URLs, `'unsafe-inline'`, nonces, hashes                                     |
| `img-src`      | `'self'`, data:, blob:, URLs, `'none'`                                                |
| `font-src`     | `'self'`, URLs, data:, `'none'`                                                       |
| `connect-src`  | `'self'`, URLs, `'none'`, wss:, ws:, https:, http:                                    |
| `media-src`    | `'self'`, URLs, blob:, `'none'`                                                       |
| `object-src`   | `'self'`, `'none'`, URLs                                                              |
| `manifest-src` | `'self'`, URLs, `'none'`                                                              |
| `child-src`\*  | Same as `frame-src`/`worker-src`                                                      |
| `frame-src`    | `'self'`, URLs, `'none'`                                                              |

---

### ✅ 2. Navigation Directives

| Directive         | Possible Values                                |
| ----------------- | ---------------------------------------------- |
| `frame-ancestors` | `'self'`, `'none'`, specific origins           |
| `form-action`     | `'self'`, `'none'`, URLs                       |
| ~~`navigate-to`~~ | ❌ Removed from spec; not supported in browsers |

---

### ✅ 3. Other Directives

| Directive    | Possible Values                    |
| ------------ | ---------------------------------- |
| `worker-src` | `'self'`, `'none'`, URLs           |
| `webrtc`     | Not standardized; browser-specific |

---

### ✅ 4. Reporting Directives

| Directive    | Possible Values                                 |
| ------------ | ----------------------------------------------- |
| `report-uri` | URL (e.g., `/csp-violation-report-endpoint`)    |
| `report-to`  | A reporting group defined in `Report-To` header |

---

### ✅ 5. Document Directives

| Directive                   | Possible Values                               |
| --------------------------- | --------------------------------------------- |
| `sandbox`                   | `allow-scripts`, `allow-same-origin`, etc.    |
| `base-uri`                  | `'self'`, `'none'`, specific URLs             |
| `upgrade-insecure-requests` | No value — just presence enables the behavior |
