# Self-Test and Key Takeaways

## Self-Test Questions

Answer these before checking the concepts in the other notes.

### 1.

You send:

```http
Cache-Control: public, max-age=600
```

for a response containing the signed-in user's name.

What can go wrong?

---

### 2.

A popular cache key expires and database traffic suddenly spikes.

What is happening?

---

### 3.

Your Redis instance becomes unavailable.

What should a normal cache-backed service ideally do?

---

### 4.

Why can a two-millisecond database query actually become worse after adding Redis?

---

### 5.

Why is an in-process cache different from Redis when your application has multiple instances?

---

### 6.

What are the three main cache invalidation strategies discussed here?

---

### 7.

Why can delete-on-write become difficult in a system with background jobs?

---

### 8.

What is the thundering herd problem?

---

### 9.

How does a lock prevent a cache stampede?

---

### 10.

What does "serve stale while refreshing" mean?

---

### 11.

Why would you cache a `NOT_FOUND` result?

---

### 12.

Why should negative cache entries usually have a short TTL?

---

### 13.

Why is a cache timeout longer than the HTTP request timeout dangerous?

---

### 14.

What should happen when `cacheGet()` finds an expired entry?

---

### 15.

Why does the exercise delete expired entries instead of merely returning `{ hit: false }`?

---

## Key Takeaways

* A cache trades **freshness for speed**.
* Always decide **how stale the data may be** before deciding how to cache it.
* HTTP caching is often the cheapest caching layer.
* `Cache-Control: public, max-age=300` can allow a response to be cached for five minutes.
* Use `private` for user-specific responses when shared caching would be unsafe.
* `ETag` + `If-None-Match` allows the client to ask whether its cached representation is still current.
* `304 Not Modified` means the client can keep using its existing cached body.
* Redis is a **shared cache** across application instances.
* An in-process cache is **local to one instance**, so different servers can disagree.
* Do not cache everything. **Measure first.**
* Cache invalidation is difficult because cached data can become stale.
* Three useful invalidation strategies are:

  * TTL
  * delete on write
  * versioned keys
* Delete-on-write requires finding **every write path**, including background jobs.
* A **thundering herd** occurs when many requests miss the same expired key simultaneously and all recompute it.
* Prevent it with:

  * a lock around recomputation, or
  * serving stale data while one refresh runs.
* Negative caching can prevent repeated expensive lookups for nonexistent records.
* Negative cache entries should generally be short-lived.
* A cache should normally be an **optimization**, not a single point of failure.
* If Redis is unavailable, falling back to the database is usually preferable to failing.
* Cache timeouts should be short enough that they do not turn the cache into a required dependency.
* TTL means **time to live**.
* An expired entry should be treated as a miss **and removed from the store**.

---

## What to Learn Next

A natural progression from this topic is:

```text
Caching
   ↓
HTTP caching
   ↓
Cache-Control + ETag
   ↓
Redis
   ↓
TTL + eviction
   ↓
Cache invalidation
   ↓
Cache stampede / thundering herd
   ↓
Distributed locking
   ↓
CDNs
   ↓
Cache consistency
   ↓
Distributed systems
```

For deeper reference, the lesson points to MDN's documentation on **HTTP caching** and **ETag**. 
