# HTTPS — One-Shot Revision

## 1. One-line Definition

HTTPS is HTTP carried over TLS, providing authenticated encryption and integrity protection between client and server.

## 2. Why was it introduced?

Plain HTTP lets network attackers read or alter traffic. TLS protects credentials, cookies, API data, and server identity in transit.

## 3. Core Mental Model

HTTPS proves the server identity through a certificate, negotiates session keys, then encrypts and integrity-protects HTTP traffic.

## 4. Internal Working

During the TLS handshake, the server presents a certificate chain for its hostname; the client validates it and negotiates cryptographic parameters. Afterward, HTTP is encrypted. In production, TLS commonly terminates at a reverse proxy/load balancer, which forwards trusted traffic to Node internally.

## 5. Key APIs / Syntax

```js
import https from 'node:https';
import fs from 'node:fs';

https.createServer({
  key: fs.readFileSync(process.env.TLS_KEY_PATH),
  cert: fs.readFileSync(process.env.TLS_CERT_PATH),
}, app).listen(443);
```

For local learning use development certificates; browsers will not trust self-signed certificates by default.

## 6. Comparison

| HTTP | HTTPS |
| --- | --- |
| Plaintext, no server authentication | TLS-encrypted, integrity-protected, authenticated server |
| Vulnerable to passive sniffing/modification | Protects in-transit data when certificate validation succeeds |
| `http://` | `https://` |

## 7. Common Mistakes

- Treating HTTPS as protection against XSS, SQL injection, or authorization bugs.
- Serving login/session endpoints over HTTP or retaining mixed HTTP assets.
- Committing private keys or deploying self-signed certificates for public users.
- Trusting forwarded proxy headers without configuring proxy trust correctly.

## 8. Production Considerations

- Terminate TLS with managed certificates/automatic renewal and redirect HTTP to HTTPS.
- Enable HSTS only after HTTPS is working everywhere, including subdomains if included.
- Secure cookies, enforce modern TLS configuration through managed infrastructure, and protect private keys/secrets.
- Monitor certificate expiration and TLS handshake errors.

## 9. Interview Questions

1. What properties does HTTPS/TLS provide?
2. What happens during certificate validation?
3. Why use a reverse proxy for TLS termination?
4. Does HTTPS prevent application-layer attacks?

## 10. Memory Triggers

- **TLS = identity + encryption + integrity.**
- **HTTPS protects transit, not unsafe code.**
- **Redirect HTTP; protect keys; plan HSTS.**

## 11. Summary

HTTPS is mandatory for modern applications. Use trusted certificates, automated lifecycle management, secure cookies/HSTS, and remember that TLS complements—not replaces—application security.
