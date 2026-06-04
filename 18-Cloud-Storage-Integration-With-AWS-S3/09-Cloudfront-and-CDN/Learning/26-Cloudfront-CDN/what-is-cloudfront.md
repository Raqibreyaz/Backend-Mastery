# ☁️ What is Amazon CloudFront?

**Amazon CloudFront** is a **Content Delivery Network (CDN)** service provided by AWS. It securely delivers content like images, videos, APIs, and other web assets to users with **low latency** and **high transfer speeds**.

---

## 🚀 How CloudFront Works

1. **User Request**

   * A user tries to access your content (e.g., `video.mp4`).

2. **Nearest Edge Location**

   * CloudFront routes the request to the closest **edge location** (a server in AWS’s global network).

3. **Cache or Origin Fetch**

   * If the content is cached at that edge, it’s served immediately.
   * If not, CloudFront retrieves it from the **origin** (like an S3 bucket or EC2 server), caches it at the edge, and serves it.

4. **Future Requests**

   * Subsequent users in that region get the cached version — making delivery faster.

---

## 🎯 Key Benefits

* **Faster Delivery** – Content is served from the nearest location.
* **Global Reach** – Uses AWS’s worldwide network of edge locations.
* **Security** – Supports HTTPS, AWS WAF integration, and signed URLs/cookies.
* **Scalability** – Handles sudden traffic spikes without slowing down.
* **Cost Optimization** – Reduces load on your origin server and lowers data transfer costs.

---

## 🛠 Common Uses

* Delivering websites and APIs.
* Streaming live or on-demand videos.
* Serving software downloads.
* Distributing game updates and patches.

---

## 💡 In Short

Amazon CloudFront acts like a **network of delivery hubs** for your content. Instead of every request going to your main server, it serves users from the closest hub, making your app faster, more reliable, and secure.
