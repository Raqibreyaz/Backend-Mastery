## 🧭 What Is a Proxy Server?

A **proxy server** acts as an intermediary between a **client** (like your browser) and a **server** (like Google.com).
Instead of communicating directly with the destination server, your request first goes to the proxy.
The proxy then forwards that request to the real server, gets the response, and sends it back to you.

---

## 🔁 **Forward Proxy**

### 🧩 Definition

A **forward proxy** sits **in front of clients** (like users’ devices) and hides or modifies their identity when connecting to servers on the internet.

In short:

> **Client → Forward Proxy → Internet / Destination Server**

---

### ⚙️ How It Works (Step-by-Step)

1. **Client configuration:**
   The client (like a browser or OS) is configured to use a specific proxy server (e.g., `proxy.company.com:8080`).

2. **DNS resolution & routing:**

   * When the client requests `https://example.com`, it doesn’t contact example.com directly.
   * Instead, it sends the entire request to the proxy server.

3. **Proxy processes the request:**
   The forward proxy:

   * Makes a request **on behalf of the client** to the destination.
   * Optionally modifies headers (e.g., hides the original IP).
   * Caches responses for reuse (if configured).

4. **Response delivery:**
   The destination server sends the response to the proxy, and the proxy forwards it to the client.

---

### 🌐 Where It’s Used

| Use Case                  | Description                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------ |
| **Corporate Networks**    | To monitor, log, and control employees’ web access (e.g., block social media sites). |
| **Privacy / Anonymity**   | To hide users’ IP addresses (e.g., using VPN-like setups or Tor).                    |
| **Caching / Performance** | To store frequently accessed data close to clients.                                  |
| **Geolocation Bypass**    | To access region-restricted content (e.g., setting proxy in another country).        |

---

### 🧠 Example Scenario

If your browser is set to use a proxy:

```
Browser (Client) → Forward Proxy (e.g., 123.45.67.89) → Google Server
```

To Google, it looks like **the proxy** made the request, not you.

---

## 🔄 **Reverse Proxy**

### 🧩 Definition

A **reverse proxy** sits **in front of servers** and handles requests **on behalf of them**.
It hides the servers’ internal structure from the outside world.

In short:

> **Client → Forward Proxy → Reverse Proxy → One or more Backend Servers**

---

### ⚙️ How It Works (Step-by-Step)

1. **Client request:**
   The client sends a request to a domain (e.g., `https://example.com`).

2. **Reverse proxy intercepts it:**
   The reverse proxy (e.g., **Nginx**, **Apache**, or **HAProxy**) receives the request instead of the actual application server.

3. **Routing to backend:**
   Based on rules, it decides which internal server to send it to — for example:

   * `app1.example.com → 10.0.0.11`
   * `app2.example.com → 10.0.0.12`

4. **Response:**
   The backend server responds to the proxy, which forwards it back to the client.

---

### 🌐 Where It’s Used

| Use Case                  | Description                                                                        |
| ------------------------- | ---------------------------------------------------------------------------------- |
| **Load Balancing**        | Distribute traffic among multiple backend servers for performance and reliability. |
| **TLS Termination**       | The proxy handles HTTPS encryption/decryption instead of backend servers.          |
| **Security**              | Hides internal servers’ IP addresses and prevents direct exposure.                 |
| **Caching / Compression** | Speeds up responses and reduces server load.                                       |
| **Centralized Logging**   | Easier monitoring and access control.                                              |

---

### 🧠 Example Scenario

You deploy your Node.js app on multiple instances and put **Nginx** in front:

```
Client → Nginx (Reverse Proxy) → Node.js App 1
                               → Node.js App 2
```

Nginx decides which app server to send each request to.

---

## ⚖️ **Forward Proxy vs Reverse Proxy**

| Feature           | Forward Proxy                  | Reverse Proxy                            |
| ----------------- | ------------------------------ | ---------------------------------------- |
| Location          | In front of **clients**        | In front of **servers**                  |
| Who configures it | The **client**                 | The **server admin**                     |
| Hides             | The **client’s** identity      | The **server’s** identity                |
| Example Software  | Squid, Privoxy                 | Nginx, Apache, HAProxy                   |
| Typical Use Case  | Security, anonymity, filtering | Load balancing, caching, SSL termination |

---

✅ **In summary:**

* **Forward Proxy** protects or controls **clients**.
* **Reverse Proxy** protects and optimizes **servers**.