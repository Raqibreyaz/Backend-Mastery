# OAuth Explained

## What is OAuth?

**OAuth (Open Authorization)** is an open standard for access delegation. It allows a third-party application to access a user's resources (like files, photos, or emails) without exposing their credentials (like username or password).

OAuth is commonly used to grant websites or applications limited access to a user's information on another website, without exposing passwords.

---

## How OAuth Works

### 1. **Resource Owner (User)**
The person who owns the data or resources, like Google Drive files or GitHub repositories.

### 2. **Client (Application)**
The third-party app that wants to access the user’s data (e.g., a calendar app accessing Google Calendar).

### 3. **Authorization Server**
The server that authenticates the user and provides authorization (e.g., Google, Facebook).

### 4. **Resource Server**
The API server that holds the user’s data (e.g., Google Calendar API).

### OAuth 2.0 Authorization Code Flow (Most Common)
1. **User clicks connect** on the client app.
2. The client redirects the user to the **authorization server** with a request for access.
3. **User logs in and grants permissions** (scope of access).
4. The authorization server sends an **authorization code** back to the client via a redirect URL.
5. The client then **exchanges the authorization code** for an **access token** by making a POST request to the authorization server.
6. The client uses the **access token** to make **API calls** to the resource server.

---

## Why OAuth is Used

### ✅ Enhanced Security
- No need to share passwords with third-party apps.
- Tokens can be short-lived and scoped (limited access).

### ✅ User Control
- Users explicitly approve what data can be accessed.
- Permissions can be revoked any time.

### ✅ Widely Adopted
- Major platforms like Google, GitHub, Facebook, and Twitter support OAuth.

---

## Use Cases of OAuth
- Connecting third-party apps like calendar integrations, email sync, etc.
- Granting access to smart home devices, fitness data, etc.

---

## Real-World Example: Google Drive Access
One of the most popular applications that uses Google OAuth to access Google Drive data is **Canva**.

**Canva** is a graphic design platform that lets users create presentations, social media graphics, and more. When you connect your Google Drive account with Canva:

1. Canva uses OAuth to redirect you to the Google sign-in page.
2. You grant Canva permission to access your Google Drive files.
3. Canva receives an access token and uses it to **browse**, **import**, or even **embed** files like images, videos, and documents directly into your design projects.

This allows users to easily pull assets stored in their Drive without ever sharing their Google password with Canva. It also respects user privacy by only accessing data the user has permitted.

---

## Summary
OAuth is a powerful and flexible standard that allows secure, delegated access to user resources without sharing credentials. It is widely used in modern web and mobile applications to protect user data while enabling seamless integration across platforms.

