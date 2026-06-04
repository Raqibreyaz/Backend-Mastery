# What is Rate Limiting?

**Rate limiting** is a technique used in computer networks and applications to **control the number of requests** a user, device, or client can make to a server within a specified time window.

It helps protect services from abuse, overload, or attacks like **DoS (Denial of Service)** by **limiting traffic** based on defined rules.

---

## 🔧 How Rate Limiting Works

* You define a **time window** (e.g., 1 minute).
* Set a **maximum number of allowed requests** (e.g., 100 requests).
* If a client exceeds the limit within that window, further requests are:

  * Blocked
  * Delayed
  * Or returned with an error like `429 Too Many Requests`

---

## 💡 Why Use Rate Limiting?

* Prevent abuse and spam
* Avoid brute-force login attempts
* Protect APIs from overload
* Ensure fair usage among users
* Stop automated bots from scraping content

---

## 🛡️ Common Use Cases

| Use Case            | Example                                         |
| ------------------- | ----------------------------------------------- |
| Login Protection    | Limit to 5 login attempts per 10 minutes        |
| API Gateway         | 1000 API requests per hour per user             |
| Free Tier Limits    | Different rate limits for free vs premium users |
| Brute-force Defense | Block repeated failed attempts from same IP     |

---

## ⚙️ Rate Limiting Strategies

1. **Fixed Window**: Resets count after each interval.
2. **Sliding Window**: Moves time window with each request.
3. **Token Bucket**: Adds tokens over time; each request consumes one.
4. **Leaky Bucket**: Processes requests at a fixed rate; excess is discarded or queued.

---

## 📌 Example (Express.js)

```js
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use(limiter); // apply to all requests
```

---

## ✅ Benefits

* Protects server performance
* Improves application stability
* Prevents malicious or excessive traffic
* Encourages responsible usage

---

## ⚠️ Limitations

* Not effective alone against **DDoS** (Distributed Denial of Service)
* Needs careful configuration to avoid blocking real users

---

## 📚 Summary

| Feature        | Description                                  |
| -------------- | -------------------------------------------- |
| Definition     | Control the rate of client requests          |
| Response Code  | `429 Too Many Requests`                      |
| Tools          | Express-rate-limit, NGINX, Cloudflare, etc.  |
| Strategy Types | Fixed window, sliding window, token bucket   |
| Real-World Use | Login limits, API usage control, bot defense |
