# Design Checklist and Common Mistakes

## A Complete Cache Flow

Put everything together:

```text
                    Request
                       │
                       ▼
                    Cache
                 /          \
              HIT            MISS
               │               │
               ▼               ▼
           Return value      Database
                               │
                               ▼
                         Fresh result
                               │
                               ▼
                             Cache
                               │
                               ▼
                            Response
```

But now add expiration:

```text
Cache
  │
  ├── valid → HIT
  │
  └── expired → delete → MISS
```

And add failure handling:

```text
Cache unavailable
       ↓
Fallback to database
       ↓
Slower, but still works
```

And add stampede protection:

```text
Many simultaneous MISSes
       ↓
Only one refresh
       ↓
Others wait
OR
serve stale data
```

This is the complete mental model of a production-oriented cache.

---

## Cache Design Questions

Before adding a cache, ask these questions.

### 1. What am I caching?

```text
Database query?
API response?
Computed result?
File?
Rendered page?
```

### 2. How expensive is the original operation?

If it is already extremely cheap:

```text
Don't automatically cache it.
```

### 3. How stale can the data be?

For example:

```text
5 seconds?
5 minutes?
1 hour?
Never?
```

### 4. Where should the cache live?

```text
Browser?
CDN?
Redis?
Process memory?
```

### 5. How will invalidation happen?

```text
TTL?
Delete on write?
Versioned key?
```

### 6. What happens when many requests miss?

```text
Lock?
Serve stale?
```

### 7. What happens when the cache is down?

```text
Fallback?
Fail?
```

For normal performance caching, fallback is usually preferable.

### 8. What happens with negative results?

```text
Cache "not found"?
How long?
```

---

## Common Mistakes / Gotchas

### 1. Caching user-specific responses as public

Danger:

```http
Cache-Control: public
```

for:

```text
/my-profile
```

A shared cache can potentially give one user's response to another.

Use:

```http
Cache-Control: private
```

when appropriate.

---

### 2. Forgetting that cache entries become stale

This is wrong thinking:

```text
"Redis contains it, so it must be correct."
```

Instead:

```text
Cache contains it
      ↓
Is it still valid?
      ↓
Check TTL/version/invalidation policy
```

---

### 3. Caching everything

Caching has a cost:

```text
Cache infrastructure
+
Network calls
+
Invalidation logic
+
Stale data
+
Failure modes
```

Cache measured bottlenecks.

---

### 4. Forgetting a write path

If you use delete-on-write:

```text
Every write path
      ↓
Must invalidate
```

That includes:

* API writes
* admin operations
* background jobs
* other services
* potentially migrations or scripts

---

### 5. Ignoring the thundering herd

A cache can reduce database load most of the time and then suddenly cause a huge spike when a popular key expires.

Use:

```text
locking
```

or:

```text
stale-while-refresh
```

when appropriate.

---

### 6. Caching negative results forever

Danger:

```text
NOT_FOUND
   ↓
cache forever
```

A record created later may remain invisible.

Use a short TTL for negative results.

---

### 7. Making Redis a hard dependency accidentally

Bad:

```text
Redis timeout = 10 sec
Request timeout = 2 sec
```

The cache can prevent the fallback path from ever running in time.

---

### 8. Forgetting in-process caches are per-instance

With:

```text
Server A
Server B
Server C
```

each can have different local cache contents.

Do not assume:

```text
local cache = shared state
```

It is not.

---

## Comparison: The Main Cache Layers

| Layer                 | Example         | Shared? | Main advantage                 | Main concern             |
| --------------------- | --------------- | ------: | ------------------------------ | ------------------------ |
| Browser/HTTP          | `Cache-Control` | Depends | Can eliminate request entirely | Freshness/privacy        |
| CDN/shared HTTP cache | CDN             |     Yes | Fast and close to users        | Correct cache directives |
| Shared server cache   | Redis           |     Yes | Shared between instances       | Network/dependency       |
| In-process            | `Map`           |      No | Extremely fast                 | Instances disagree       |

---

## Comparison: Invalidation Strategies

| Strategy        | Example                      | Simplicity | Freshness       |
| --------------- | ---------------------------- | ---------- | --------------- |
| TTL             | Expire after 5 minutes       | High       | Limited by TTL  |
| Delete on write | Delete cache after DB update | Medium     | Better          |
| Versioned keys  | `product:123:v7` → `v8`      | Medium     | Very controlled |

The choice depends on how fresh your application needs to be and how complicated its write paths are.

---

**Next:** [Self-Test and Key Takeaways →](./10-Self-Test-and-Key-Takeaways.md)
