## 🔒 Static Throttling

### 📌 Definition:

**Static throttling** is a throttling strategy where the delay between incoming requests is **fixed and predefined**, regardless of the system’s load or external conditions.

### 🛠️ How it works:

- Uses a **constant wait time** (e.g., 2 seconds between requests per IP).
- Does **not adapt** based on server performance, error rates, or response times.
- Simple to implement and easy to reason about.
- Applies the **same delay** every time, for every client (or based on simple rules like IP).

### 🎯 Use Cases:

- For simple APIs with predictable traffic.
- When you want to prevent request flooding **without overcomplicating** your system.

---

## 🔁 Dynamic Throttling

### 📌 Definition:

**Dynamic throttling** adjusts the throttling limits based on pre-defined conditions like current server load, time of day, or traffic volume.

### 🛠️ How it works:

- Thresholds are **manually defined** or configured.
- Throttle levels can **increase or decrease** depending on environment status.
- For example:

  - Allow 100 req/min when CPU < 60%
  - Reduce to 50 req/min when CPU > 80%

### 🎯 Use Case:

When you want **predictable** and **config-driven** scaling of limits based on metrics like CPU, memory, or request queue.

---

## 🧠 Adaptive Throttling

### 📌 Definition:

**Adaptive throttling** uses **real-time feedback** to make decisions. It adapts on the fly based on system responses or failures, often using heuristics or even ML.

### 🛠️ How it works:

- Learns from **actual API success/failure** or latency.
- If downstream services are failing or timing out, it **automatically slows down** request flow.
- No need for pre-set thresholds — it’s **self-adjusting**.

### Example:

- AWS SDK uses adaptive throttling for retry logic.

### 🎯 Use Case:

Best for **resilient systems** that must gracefully back off under unpredictable load or failures, especially in **distributed systems**.

---

## 🧾 Summary Table

| Feature     | Dynamic Throttling              | Adaptive Throttling                    |
| ----------- | ------------------------------- | -------------------------------------- |
| Trigger     | Pre-defined metrics (CPU, load) | Real-time feedback (errors, latency)   |
| Adjustments | Based on configs or rules       | Based on system behavior               |
| Flexibility | Semi-automatic                  | Fully automatic                        |
| Complexity  | Moderate                        | Higher, sometimes needs ML/algorithms  |
| Ideal for   | Traffic-based scaling           | Resilient microservices, auto-recovery |

---

## 🧠 Analogy:

- **Static**: Like a fan that runs at the same speed all the time, no matter how hot the room is.
- **Dynamic**: Like a smart AC—adjusts cooling based on the set temperature.
- **Adaptive**: Like your body—sweats more automatically when it’s really hot, without needing you to set anything.
