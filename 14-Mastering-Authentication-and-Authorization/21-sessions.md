# What is a Session?

A **session** is a mechanism that allows a server to recognise a specific user—whether authenticated or not—across multiple requests. This is done by issuing a **unique identifier** to the client. Depending on the implementation, this identifier either:

- **References session data stored on the server** (**stateful**), or
- **Contains all necessary information itself** (**stateless**)

enabling the server to recognize and maintain continuity for the user's interactions over time.

---

## Types of Sessions

### 🟦 Stateless Sessions

These sessions store all the session-related data directly in the client-side identifier (usually a token). The server does not need to maintain any session state.

#### 1. Token-Based Session

- Stateless authentication using tokens (e.g., JWT).
- The token is passed with each request and contains all necessary claims.

**Pros**:

- Fully stateless
- Easily scalable

**Cons**:

- Hard to revoke before expiry
- Must protect token on the client

---

### 🟩 Stateful Sessions

These sessions store user-related data on the server side. The client receives only a reference (usually a session ID), and the actual session data is kept in a storage backend like memory, file, or database.

#### 1. In-Memory Session

- Session data is stored in the server's RAM.
- Fast, but lost on server restart.
- Not scalable or persistent.

**Example**: `express-session` with default MemoryStore.

---

#### 2. File-Based Session

- Session data is stored in files on the server.
- More persistent than in-memory, but slower.
- Rarely used in production for large-scale apps.

---

#### 3. Database-Backed Session

- Session data is stored in external databases like MongoDB, Redis, or PostgreSQL.
- Accessible by multiple servers.
- Scalable, persistent, and production-ready.

**Examples**:

- Redis session store (`connect-redis`)
- MongoDB session documents
