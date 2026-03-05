# What is a DoS Attack?

A **DoS (Denial of Service)** attack is a type of cyberattack where the attacker attempts to make a machine, network, or service unavailable to its intended users by overwhelming it with traffic or triggering a crash.

---

## 💥 Purpose of a DoS Attack

- To **disrupt normal operations** of a system.
- To **deny access** to legitimate users.
- To **exhaust system resources** like bandwidth, CPU, memory, or disk I/O.

---

## 🛠️ How It Works

In a DoS attack:

- A **single machine** (attacker) sends **a large number of fake or repetitive requests** to the target.
- These requests **consume system resources**, eventually making the service **slow** or completely **unavailable**.

---

## 🧠 Real-Life Analogy

> Imagine a shop where only one customer is allowed inside at a time. A prankster keeps entering and never leaves. Real customers have to wait outside and can't buy anything. That's a DoS attack.

---

## ✅ Prevention Techniques

- **Rate limiting**: Restrict the number of requests per client/IP.
- **Firewalls & WAFs**: Block suspicious traffic patterns.
- **Timeouts**: Close idle connections quickly.
- **Monitoring**: Detect traffic spikes early.

---

## ⚠️ Limitation

A **DoS attack comes from a single source**, so it’s usually **easier to detect and block** compared to DDoS (Distributed Denial of Service) attacks.

---

## 📌 Summary

| Feature        | DoS Attack                         |
| -------------- | ---------------------------------- |
| Origin         | Single machine                     |
| Goal           | Deny service to real users         |
| Method         | Overload or crash the system       |
| Detection      | Easier                             |
| Common Defense | Rate limiting, firewalls, timeouts |
