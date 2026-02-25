# What to Put in Your .env File

## ✅ Secrets & Credentials

Sensitive values that should never be hardcoded:

* `DB_PASSWORD`, `JWT_SECRET`, `SESSION_SECRET`
* `GOOGLE_CLIENT_SECRET`, `SENDGRID_API_KEY`, `STRIPE_SECRET_KEY`

## ✅ Config That Varies by Environment

Useful for dev/staging/production differences:

* `NODE_ENV`, `PORT`, `FRONTEND_URL`
* `MONGO_URI`, `REDIS_URL`, `BASE_URL`

## ✅ Feature Flags & Behavior Controls

Control app logic without touching code:

* `ENABLE_SIGNUP`, `RATE_LIMIT_WINDOW`, `MAX_UPLOAD_SIZE_MB`, `OTP_EXPIRY_MINUTES`

## ✅ Public or Non-Sensitive 3rd-Party Identifiers

Even if public, keep them in `.env` for clarity:

* `GOOGLE_CLIENT_ID`, `STRIPE_PUBLISHABLE_KEY`
* `VITE_GOOGLE_CLIENT_ID`, `MIXPANEL_TOKEN`


## ✅ Sample `.env` File

```env
# Environment and server
NODE_ENV=production
PORT=4000

# MongoDB
MONGO_URI=mongodb+srv://...

# JWT & Session
JWT_SECRET=something-super-secret
SESSION_EXPIRY_MS=604800000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# Redis
REDIS_URL=redis://localhost:6379
REDIS_USER_INDEX=userIdIdx

# App URLs
FRONTEND_URL=https://myapp.com
FILE_STORAGE_DIR=./storage
```

---

## TL;DR

Put only the following in `.env` files:

* 🔐 Secrets
* 🌐 External URLs
* ⚙️ Environment-dependent configs
* 🔄 Runtime behavior flags
