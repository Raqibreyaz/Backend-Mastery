# Thundering Herd

## The Problem

One of the important cache failure modes is the **thundering herd**.

Suppose a popular cache key is:

```text
homepage
```

and thousands of users request it.

Normally:

```text
1000 requests
      ↓
Cache HIT
      ↓
1000 cheap responses
```

The cache protects the database nicely.

But eventually the cached value becomes unusable.

Suppose:

```text
homepage → expired
```

Now imagine 200 requests arrive at almost the same time.

Every request sees:

```text
MISS
```

and every request tries to generate the same expensive result:

```text
                 ┌── Request 1 ── DB
                 │
                 ├── Request 2 ── DB
Cache MISS ──────┼── Request 3 ── DB
                 │
                 ├── Request 4 ── DB
                 │
                 └── ...200...
```

The problem is that all 200 requests are doing **the same work**.

Instead of:

```text
1 expensive computation
+
199 cache hits
```

we get:

```text
200 expensive computations
```

This sudden burst of identical work is the **thundering herd problem**.

---

# Why Is It Especially Bad?

Notice the timing:

```text
Cache becomes unusable
        ↓
Many requests miss
        ↓
Many requests regenerate the same data
        ↓
Database / backend gets a sudden spike
```

The cache was supposed to protect the database.

But when a popular key becomes unavailable, the protection disappears suddenly:

```text
Normal:

Requests → Cache → Database
              ↑
          protects DB


Thundering herd:

Requests ───────────────→ Database
  │ │ │ │ │ │ │ │ │ │
  └─┴─┴─┴─┴─┴─┴─┴─┴── huge burst
```

This can become especially dangerous when the database is already under load.

---

# Solution 1: Lock During Recalculation

The first approach is:

> **Only one request is allowed to regenerate the value.**

Suppose the cache misses:

```text
Request 1 ── MISS ── acquire lock ── recompute
Request 2 ── MISS ── wait
Request 3 ── MISS ── wait
Request 4 ── MISS ── wait
```

Only Request 1 talks to the database:

```text
Request 1
   ↓
Database
   ↓
New value
   ↓
Cache
```

Then the waiting requests can use the newly populated cache.

```text
                 ┌── wait
                 │
Request 1 ── lock ┼── wait
                 │
                 └── wait
                      ↓
                cache populated
                      ↓
                 all requests
```

### What does this solve?

Without the lock:

```text
200 requests
     ↓
200 DB queries
```

With the lock:

```text
200 requests
     ↓
1 DB query
+
199 requests wait
```

So we have eliminated the **duplicate work**.

### But there is a trade-off

The other requests are waiting for the regeneration:

```text
Request
   ↓
Cache MISS
   ↓
WAIT
   ↓
Fresh value
```

If regeneration takes 500 ms, those requests may experience roughly that additional latency.

So the lock approach trades:

```text
Many expensive DB requests
```

for:

```text
One expensive request
+
Other requests waiting
```

This is often acceptable when **serving stale data is not allowed**.

---

# Solution 2: Serve Stale While Refreshing

The second approach is different:

> **Don't make requests wait for fresh data if a usable old value is available.**

This is commonly called **stale-while-revalidate**.

The important thing to understand is:

> **"Expired" does not necessarily mean "deleted."**

A cache implementation can keep an old value around even after it is no longer considered fresh.

Instead of thinking:

```text
TTL expires
    ↓
DELETE value
```

think:

```text
             Cache entry
                  │
          ┌───────┴────────┐
          ↓                ↓
       FRESH              STALE
          │                │
       use normally     can still serve
                           │
                           ↓
                     background refresh
```

For example:

```text
Fresh TTL = 5 minutes
Stale window = 10 minutes
```

Then:

```text
10:00 ───────── 10:05 ───────────── 10:15
  │                │                  │
  │                │                  │
  ↓                ↓                  ↓
FRESH            STALE              DEAD
  │                │                  │
  │                │                  │
serve normally   serve old value      must
                 + refresh           regenerate
```

So the cache value might look like:

```text
homepage → old data
```

even though it is technically **stale**.

---

# What Happens During the Stale Period?

Suppose:

```text
Cache:
homepage → Version A
```

The value becomes stale.

Now 200 requests arrive:

```text
200 requests
      ↓
Stale cache value
      ↓
Return Version A immediately
```

At the same time, one request/background worker starts refreshing:

```text
                  ┌── Request 1 → return stale
                  │
                  ├── Request 2 → return stale
Stale cache ──────┼── Request 3 → return stale
                  │
                  ├── Request 4 → return stale
                  │
                  └── ...
                           │
                           ↓
                    one refresh
                           ↓
                       Database
                           ↓
                       Version B
                           ↓
                         Cache
```

Now the next requests receive:

```text
Version B
```

So users don't have to wait for the database refresh.

---

# Why Doesn't This Cause 200 Background Refreshes?

Good stale-while-revalidate implementations still need to prevent every request from refreshing simultaneously.

Usually, only **the refresh operation** is protected by a lock or single-flight mechanism.

The important difference is:

### Lock-only approach

```text
MISS
 ↓
ONE request refreshes
 ↓
OTHERS WAIT
```

### Stale-while-revalidate

```text
STALE
 ↓
EVERYONE gets stale value immediately
 ↓
ONE request refreshes
 ↓
Cache becomes fresh
```

So the lock is no longer making hundreds of user requests wait.

It is only making sure that **one request performs the expensive refresh**.

That is a much better way to think about the two approaches.

---

# Fresh, Stale, and Dead

A useful mental model is to give a cache entry three states:

```text
                    CACHE ENTRY
                         │
          ┌──────────────┼──────────────┐
          ↓              ↓              ↓
       FRESH           STALE           DEAD
          │              │              │
       return          return          cannot
       normally        immediately     use
                       + refresh
```

For example:

```text
Fresh TTL:       5 minutes
Stale window:   10 minutes
```

So:

```text
0–5 min
   ↓
FRESH
   ↓
Normal cache hit


5–15 min
   ↓
STALE
   ↓
Serve old value
+
refresh in background


15+ min
   ↓
DEAD
   ↓
Must regenerate
```

This solves the confusion between **expiration** and **deletion**.

---

# Important Trade-off

Stale-while-revalidate only works when the application can tolerate some stale data.

For example, stale data may be acceptable for:

```text
Search results
News feeds
Recommendations
Product listings
Social feeds
Analytics
```

But stale data may be dangerous for:

```text
Bank balance
Payment status
Available inventory
Seat availability
```

So the question becomes:

> **How much staleness can this particular piece of data tolerate?**

---

# The Two Approaches Compared

| Approach                      | What happens after cache miss/staleness? | DB load |       Request latency | Can serve stale data? |
| ----------------------------- | ---------------------------------------- | ------: | --------------------: | --------------------- |
| **Lock during recalculation** | One request refreshes, others wait       |     Low | Higher during refresh | No                    |
| **Stale-while-revalidate**    | Serve old value while one refreshes      |     Low |              Very low | Yes                   |

The key difference is **where you put the cost**:

```text
Lock:

Duplicate work ❌
Waiting        ✓


Stale-while-revalidate:

Duplicate work ❌
Waiting        ❌
Temporary staleness ✓
```

---

# One More Technique: Refresh Before Expiration

We don't always have to wait until the cache becomes stale.

A system can refresh a popular value **before** its fresh TTL expires:

```text
             Refresh early
                  ↓
10:00 ───────── 10:04 ───────── 10:05
  │                │              │
  │                │              │
  ↓                ↓              ↓
FRESH          background       old value
               refresh          would expire
                  │
                  ↓
              new value
```

The goal is to have the new value ready before many requests discover that the old value is unusable.

This can reduce synchronized expiration for very popular keys.

---

# The Bigger Mental Model

The thundering herd problem is not really about TTL itself.

It is about:

> **Many requests simultaneously discovering that they need the same expensive work.**

The solutions attack that problem in different ways:

```text
                 Cache needs refresh
                         │
             ┌───────────┴────────────┐
             ↓                        ↓
       Don't duplicate            Don't make
          the work              requests wait
             │                        │
             ↓                        ↓
        Lock / single-          Serve stale +
        flight refresh          background refresh
             │                        │
             ↓                        ↓
       1 computation             1 computation
       others wait              others get old data
```

So remember:

> **Locking controls duplicate computation.**

> **Stale-while-revalidate controls user-facing latency.**

And the two can be combined:

```text
STALE VALUE
    ↓
Serve stale immediately
    +
Acquire refresh lock
    ↓
Only one refresh
    ↓
Update cache
    ↓
Future requests get fresh data
```

That's often the cleanest mental model for understanding how production caching systems avoid a thundering herd.

---

**Next:** [Negative Caching →](./06-Negative-Caching.md)
