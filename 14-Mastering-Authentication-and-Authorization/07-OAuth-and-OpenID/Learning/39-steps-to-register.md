## Registering on Google Developer Console for OAuth 2.0 and OpenID Connect

Follow these steps to register your application for OpenID Connect (OIDC) using Google Developer Console:

---

### ✅ Step 1: Go to Google Cloud Console

- Open: [https://console.cloud.google.com/](https://console.cloud.google.com/)

---

### ✅ Step 2: Create or Select a Project

- Click the project dropdown on the top-left.
- Choose **"New Project"** or select an existing one.
- Provide a **name** (e.g., `Storage App`).
- Click **Create**.

---

### ✅ Step 3: Configure OAuth Consent Screen

- Go to **APIs & Services → OAuth consent screen**.
- Select **"External"** (for users outside your organization).
- Click **Create**.
- Fill in:
  - **App name** (e.g., `ProCodrr Login`)
  - **User support email**
  - **Developer contact email**
- Optionally add branding details like a logo, privacy policy URL, etc.
- Click **Save and Continue**.

---

### ✅ Step 4: Create OAuth Credentials

- Navigate to **APIs & Services → Credentials**.
- Click **"Create Credentials" → "OAuth 2.0 Client ID"**.
- Choose **Application type**: `Web application`
- Fill in:
  - **Name** (e.g., `Frontend OIDC`)
  - **Authorized redirect URIs**:
    - Example: `http://localhost:5173`
- Click **Create**.

---

### ✅ Step 5: Copy Your Credentials

- Once created, you’ll receive:
  - **Client ID**
  - **Client Secret**
- Save them securely. You'll use these in your frontend and backend code.
