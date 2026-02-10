# OpenID Connect Explained

## What is OpenID Connect?

**OpenID Connect (OIDC)** is a simple identity layer built on top of OAuth 2.0. It helps apps verify who the user is and get basic information like name, email, and profile picture.

While **OAuth 2.0** is used for **authorization** (granting access to resources), **OIDC** is used for **authentication** (verifying who the user is).

---

## How OpenID Connect Works

OIDC uses the OAuth 2.0 flows, with some extensions:

1. **User clicks login with xyz** on the client app.
2. The client redirects the user to the **authorization server** with a request for access.
3. **User logs in and grants permissions** (scope of openid).
4. The authorization server sends an **authorization code** back to the client via a redirect URL.
5. The client then **exchanges the authorization code** for an **ID token** by making a POST request to the authorization server.
6. The client decodes the **ID token** to get user's identity (e.g., name, email).

---

## Components of OpenID Connect

- **ID Token**: A JWT that contains information like user ID, name, email, picture, etc.
- **UserInfo Endpoint**: An API endpoint that returns additional user profile info.
- **Scopes**: Standard scopes include `openid`, `profile`, `email`, etc.

---

## Why OpenID Connect is Useful

- ✅ Easy and secure login (like "Login with Google")
- ✅ No need to manage passwords
- ✅ Works with many providers (Google, Microsoft, etc.)

---

## Summary

OpenID Connect extends OAuth 2.0 by adding an authentication layer, enabling applications not just to get permission to access resources, but also to verify and identify users. It's a widely adopted protocol for secure, federated identity across the web.
