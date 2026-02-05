# Stateful VS Stateless Auth

**Authentication** and **Authorization** mechanisms can be broadly classified into two categories:

## 🧠 Stateful

Stateful methods require the server to maintain user session information between requests.

### 🔐 Authentication (Stateful)

1. **Session-Based Authentication**

- After login, the server creates a session and stores it (usually in memory or database).
- A session ID is sent to the client as a cookie.
- Cookies can be Signed, HttpOnly, Secure, and have an expiration.
- The client sends this cookie on every request to authenticate.

### 🔓 Authorization (Stateful)

1. **Role-Based Access Control (RBAC)**

   - Roles like `admin`, `editor`, or `user` are stored on the server (e.g., in session or database).
   - Server checks role from the session data on every request.

2. **Access Control Lists (ACLs)**
   - Each user or role is associated with a list of permissions.
   - Checked server-side during each request.

---

## ☁️ Stateless

Stateless methods do not require the server to store any user session data. The client provides all necessary information with each request.

### 🔐 Authentication (Stateless)

1. **Token-Based Authentication (e.g., JWT)**

   - After login, the server generates a token (e.g., JSON Web Token) that encodes user identity and possibly permissions.
   - The browser (web) client stores the token (in httpOnly cookie or memory) and sends it automatically on every request.
   - The mobile (app) client stores the token (in secure storage) and sends in the `Authorization: Bearer <token>` header.
   - The server decodes and verifies the token on every request responds with the resources if the the token is valid.

### 🔓 Authorization (Stateless)

1. **Claims-Based Authorization (JWT)**
   - Claims in the token (like role, permissions) are used to authorize access to routes/resources.
   - No need to query the database or store roles in memory.

---

> 🧠 **Note**: In practice, many applications use a hybrid approach (e.g., JWT with refresh tokens and limited server-side session storage). Server to client (browser or mobile) auth you should not use JWT or stateless auth unless you don't care about security and session control.
