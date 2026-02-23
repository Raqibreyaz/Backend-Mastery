# 🔐 Redis Eviction Policy Explained

## 📌 What is an Eviction Policy?

An **eviction policy** in Redis determines **which keys to remove** from memory **when the maximum memory limit is reached**. Redis uses these policies to make room for new data when operating within a memory-constrained environment.

By default, Redis has **no memory limit** set and thus **no eviction happens**, which may lead to memory overuse unless configured explicitly.

---

## 🔍 How to Check Current Max Memory Limit

### Redis CLI Command:

```bash
CONFIG GET maxmemory
```

### Output:

```
1) "maxmemory"
2) "0"
```

A value of `0` means **no memory limit is set**.

---

## 🛠️ How to Set Max Memory and Eviction Policy

### ✅ Option 1: Set via Redis Config File

1. **Open your redis.conf file:**

   ```bash
   sudo nano /etc/redis/redis.conf
   ```

2. **Locate and modify/add these lines:**

   ```conf
   maxmemory 100mb
   maxmemory-policy allkeys-lru
   ```

3. **Save and restart Redis:**

   ```bash
   sudo service redis-server restart
   # Or for some systems:
   sudo systemctl restart redis-server
   ```

---

### ✅ Option 2: Set at Runtime (Temporary)

Run these commands in the Redis CLI:

```bash
CONFIG SET maxmemory 100mb
CONFIG SET maxmemory-policy allkeys-lru
```

> 🔁 Note: These runtime changes are **not persistent** and will be lost after a Redis restart.

---

## 📜 Common Redis Eviction Policies

| Policy            | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| `noeviction`      | Default. Returns an error when memory is full.                |
| `allkeys-lru`     | Evicts least recently used (LRU) key from all keys.           |
| `volatile-lru`    | Evicts least recently used (LRU) key from keys with expiry.   |
| `allkeys-random`  | Removes a random key from all keys.                           |
| `volatile-random` | Removes a random key from keys with expiry.                   |
| `volatile-ttl`    | Evicts keys with the nearest expiration time.                 |
| `allkeys-lfu`     | Evicts least frequently used (LFU) key from all keys.         |
| `volatile-lfu`    | Evicts least frequently used (LFU) key from keys with expiry. |

> **LRU** = Least Recently Used
> **LFU** = Least Frequently Used

---

## 🚫 What Happens If `maxmemory-policy` is Set to `noeviction`?

When `maxmemory-policy` is set to `noeviction` (which is the default), Redis **will not remove any keys** when the memory limit is reached.

Instead:

- Redis **refuses to accept new write operations** that require more memory.
- It throws an **OOM (Out Of Memory) error**:

  ```
  (error) OOM command not allowed when used memory > 'maxmemory'.
  ```

- Read operations will still succeed.

This is useful when you want **strict control over key deletion**, but it requires careful memory monitoring.

---

## ✅ Final Tips

- Use `INFO memory` to check memory usage.
- Combine `maxmemory` with a suitable eviction policy for best performance.
- Persistent changes go in `redis.conf`; runtime changes are for temporary testing.