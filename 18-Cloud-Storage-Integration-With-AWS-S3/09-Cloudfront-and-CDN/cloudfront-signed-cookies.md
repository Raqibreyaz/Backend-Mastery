# 🍪 A Quick Guide to Signed Cookies

Signed cookies are your secret weapon for securely delivering private content over the web, especially through a Content Delivery Network (CDN) like AWS CloudFront. Let's break down the What, Why, and How.

## 🤔 What Are Signed Cookies?

Think of signed cookies as **VIP wristbands for your web content**. 

Instead of leaving your files wide open on the internet, you configure your CDN to reject any request that doesn't have a valid, cryptographically signed cookie. When an authenticated user requests access, your backend generates this secure "wristband" (cookie) and attaches it to their browser.

## 🛡️ Why Use Signed Cookies?

> [!TIP]
> **Why not just use Signed URLs?**
> - **HLS Video Complexity**: HLS streaming uses a master playlist (`.m3u8`) which in turn requests hundreds of individual video segments (`.ts`). If you use a Signed URL for the master playlist, the player doesn't know how to append that massive signature to every subsequent `.ts` file request.
> - **URL Clutter**: Signed URLs append a massive string of query parameters to the end of your URLs, making them messy and easily breakable if copied/pasted incorrectly. 
> - **Client-Side Headaches**: Getting standard video players (like MediaChrome or Video.js) to intercept segment requests and append the CloudFront signature tokens is complex and error-prone. Signed Cookies solve this elegantly by keeping the URL clean and letting the browser attach the token automatically!

1. **Access Control**: Prevent unauthorized users or competitors from hotlinking to your expensive video streams.
2. **Time-Limited Access**: You can set an exact expiration date/time (e.g., "this stream is only valid for 1 hour").
3. **Folder-Level Access**: You grant access to an *entire directory* (like all segments of a video) without needing to sign every single individual file.
4. **Seamless UX**: The browser and media player (like MediaChrome) automatically send the cookie with every request, keeping the URL clean.

## 🛠️ How to Use Them (Real-World Example)

Let's look at how this is implemented in your **Video-Streaming** project (`httpLambda/src/controllers/streamVideo.controllers.ts`):

### 1. The Setup 
We use the `@aws-sdk/cloudfront-signer` package to handle the complex cryptography. We need our CDN domain, Key Pair ID, and a Private Key (securely loaded from environment variables).

```typescript
import { getSignedCookies } from "@aws-sdk/cloudfront-signer";

const cloudfrontDomain = process.env["CLOUDFRONT_DOMAIN"]!;
const cloudfrontKeyPairId = process.env["CLOUDFRONT_KEY_PAIR_ID"]!;
// Decode the private key from base64
const cloudfrontPrivateKey = atob(process.env["CLOUDFRONT_PRIVATE_KEY_BASE64"]!);
```

### 2. Define the Policy
When a user requests to watch a video, we define **what** they can access and **how long** they can access it. In this case, we grant access to *all files* inside the specific video's directory for exactly 1 hour.

```typescript
const now = Date.now();
// Access to the entire video folder: /*
const baseUrl = `https://${cloudfrontDomain}/${video.videoId}/*`;
// Valid from now...
const dateGreaterThan = new Date(now).toISOString();
// ... until 1 hour from now!
const dateLessThan = new Date(now + 3600 * 1000).toISOString();
```

### 3. Generate the Cookies
We pass these rules to the signer, which generates three specific values required by CloudFront.

```typescript
const cookies = getSignedCookies({
  keyPairId: cloudfrontKeyPairId,
  privateKey: cloudfrontPrivateKey,
  url: baseUrl,
  dateLessThan,
  dateGreaterThan,
});
```

### 4. Send to the Client
Finally, we attach these values as `Set-Cookie` headers in our HTTP response. Notice we use `HttpOnly` (for security against XSS) and `SameSite=Lax`.

```typescript
const cookieDomain = cloudfrontDomain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
const cookieAttrs = `Domain=${cookieDomain}; Path=/; HttpOnly; SameSite=Lax`;

const setCookieHeaders = [
  `CloudFront-Policy=${cookies["CloudFront-Policy"]};${cookieAttrs}`,
  `CloudFront-Signature=${cookies["CloudFront-Signature"]};${cookieAttrs}`,
  `CloudFront-Key-Pair-Id=${cookies["CloudFront-Key-Pair-Id"]};${cookieAttrs}`,
];

// Attach to the response!
setCookieHeaders.forEach((header) => res.append("Set-Cookie", header));

// Send the Master Playlist URL
res.json({
  success: true,
  videoUrl: `https://${cloudfrontDomain}/${video.videoId}/master.m3u8`,
});
```

### 🎬 The Result
When the frontend player requests the `master.m3u8` file and subsequent `.ts` video chunks, the browser automatically includes these three CloudFront cookies. CloudFront validates the signature and policy at the edge, serving your video securely!
