# Node.js Security Basics — One-Shot Revision

## 1. One-line Definition

Application security is the ongoing practice of protecting systems, data, and users against misuse, unauthorized access, and disruption.

## 2. Why was it introduced?

Web applications handle credentials, money, personal data, and business operations; a single weakness can cause breaches, downtime, legal exposure, and loss of trust.

## 3. Core Mental Model

Security is a system property, not one middleware: reduce attack surface, validate every boundary, give least privilege, and assume layers can fail.

## 4. Internal Working

Threats target different layers: injected database queries, browser script execution, forged authenticated requests, weak auth/session design, unauthorized object access, misconfiguration, dependency flaws, and traffic exhaustion. Defenses belong at input, application, transport, deployment, and monitoring layers.

Environment variables place secrets/configuration outside source code. Node can load a local file with `node --env-file=.env app.js`; values are then read through `process.env`.

## 5. Key APIs / Syntax

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=...
SESSION_SECRET=...
```

```js
const port = Number(process.env.PORT ?? 3000);
if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is required');
```

## 6. Comparison

| Configuration | Secret management |
| --- | --- |
| Port, feature flags, service URLs | Passwords, API keys, signing/session secrets |
| May be safe to expose depending on value | Never commit, log, or expose client-side |
| Environment-specific | Use managed secret storage in production |

## 7. Common Mistakes

- Committing `.env` or hardcoding secrets.
- Treating environment variables as encrypted or access-controlled by themselves.
- Logging credentials/tokens or returning detailed production errors.
- Relying on a single control instead of validation, authz, transport security, and monitoring.
- Forgetting authorization checks for every resource (IDOR risk).

## 8. Production Considerations

- Keep `.env` in `.gitignore`; use a secret manager and least-privilege service credentials in deployed environments.
- Validate required configuration at startup and rotate secrets after exposure.
- Maintain an asset inventory, patch dependencies, log security-relevant events safely, and define incident response.
- Apply threat modeling and secure defaults before adding features.

## 9. Interview Questions

1. Why is security a layered concern?
2. What belongs in environment variables?
3. Are environment variables a secret-management solution?
4. What are IDOR and least privilege?

## 10. Memory Triggers

- **Validate boundaries; authorize actions; protect secrets.**
- **`.env` keeps secrets out of code, not magically safe.**
- **Defense in depth.**

## 11. Summary

Secure Node applications through layered controls: safe configuration, strict input/authorization, secure transport, dependency hygiene, monitoring, and operational readiness.
