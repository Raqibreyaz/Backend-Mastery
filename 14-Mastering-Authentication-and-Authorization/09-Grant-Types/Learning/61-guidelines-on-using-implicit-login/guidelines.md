## 🚫 **Critical Guidelines to Avoid Google OAuth "Access Blocked"**

Here's the **exact checklist** to prevent your site from getting blocked during OAuth verification:

## **1. OAuth Consent Screen (MUST Complete)**
```
✅ App name/logo (matches your branding)
✅ User support email (real, monitored email)
✅ App logo (512x512px, PNG)
✅ Privacy Policy URL (publicly accessible)
✅ Terms of Service URL (recommended)
✅ Homepage URL (publicly accessible, no login wall)
✅ Authorized domains (exact match, no wildcards)
```

## **2. Test Users (During Development)**
```
✅ Add ALL test emails to "Test Users" section
✅ Includes your own developer email
✅ Max 100 users before verification required
✅ Test users bypass "unverified app" screen
```

## **3. Scopes (Choose Carefully)**
```
✅ Non-sensitive: openid, email, profile ✅ OK
✅ Sensitive scopes → Verification required
✅ Restricted scopes → Verification + Security Assessment
✅ Only request what you actually use
```

**Scope classification:**
```
Non-sensitive: openid, email, profile
Sensitive: calendar.readonly, drive.readonly
Restricted: gmail.readonly, drive.full
```

## **4. URLs Must Be HTTPS in Production**
```
✅ Redirect URIs: https://yourdomain.com/callback
✅ JavaScript origins: https://yourdomain.com
❌ Never use http://localhost in production
❌ No wildcard (*) URIs
```

## **5. Homepage Requirements**
```
✅ Publicly accessible (no login required)
✅ Explains what your app does
✅ Links to Privacy Policy
✅ No paywall/login wall
✅ Google can crawl it (no robots.txt blocking)
```

## **6. Sign-In Button Compliance**
```
✅ Use Google Identity Services (GSI) button
✅ "Sign in with Google" exact text
✅ Same size as other social login buttons
✅ Official Google "G" logo
✅ White background for logo
❌ Custom Google buttons = verification rejection
```

## **7. Verification Triggers (When You'll Get Blocked)**
```
🚨 Your app hits 100+ users → Must verify
🚨 Uses sensitive/restricted scopes → Must verify
🚨 Production mode + no verification → "Access blocked"
```

## **8. Development Workflow (Avoid Blocks)**
```
Phase 1: Testing (0-100 users)
✅ Add test users
✅ Use localhost URIs
✅ No verification needed

Phase 2: Production (100+ users)
✅ Switch to "Production"
✅ Submit for verification (1-4 weeks)
✅ Users see "unverified app" screen until approved
```

## **9. Common Rejection Reasons**
```
❌ Homepage behind login wall
❌ Missing Privacy Policy
❌ Custom Google button (wrong branding)
❌ localhost in production URIs
❌ Too many/broad scopes
❌ No demo video for sensitive scopes
❌ Privacy Policy doesn't mention Google data usage
```

## **10. Emergency Fix (If Blocked Now)**
```
1. Go to Google Cloud Console → OAuth consent screen
2. Add affected user emails as "Test Users"
3. Users can bypass with "Advanced → Go to app (unsafe)"
4. Submit verification request immediately
```

## **Production Checklist (Copy-Paste)**
```bash
□ OAuth consent screen 100% complete
□ Test users added (development)
□ HTTPS URLs only
□ GSI button (not custom)
□ Homepage publicly accessible
□ Privacy Policy live
□ Only necessary scopes selected
□ Production mode → Submit verification
```

## **Timeline**
```
Testing: 0 users → No verification needed
1-99 users: Add as test users
100+ users: Must verify (1-4 weeks)
Sensitive scopes: 2-6 weeks
Restricted scopes: 4-12 weeks + security assessment
```

**Bottom line:** Use **test users during development**, complete **OAuth consent screen 100%**, use **GSI button**, submit verification **before hitting 100 users**. Non-compliance = instant "Access blocked" for new users.

**Pro tip:** Start verification process at **50 users** to avoid hitting the limit during review.