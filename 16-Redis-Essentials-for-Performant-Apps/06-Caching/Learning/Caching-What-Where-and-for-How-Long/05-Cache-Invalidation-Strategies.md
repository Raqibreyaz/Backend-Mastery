# Cache Invalidation Strategies

## The Real Problem: Cache Invalidation

Caching is easy.

Keeping the cache **correct** is the hard part.

A cache stores a copy of data somewhere faster:

```text
Database:
product:123 → $100

Cache:
product:123 → $100
```

Now the product price changes:

```text
Database:
product:123 → $120
```

But the cache still contains:

```text
Cache:
product:123 → $100
```

We now have:

```text
Database = $120
Cache    = $100  ← stale
```

If the application reads from the cache, it may return incorrect data.

So the real question is:

> **When should a cached value stop being considered valid?**

There are several ways to answer this.

The three important strategies here are:

1. **TTL-based expiration**
2. **Delete on write**
3. **Versioned keys**

---

# 1. TTL-Based Expiration

The simplest approach is:

> **Keep the cached value for a fixed amount of time, then let it expire.**

For example:

```text
TTL = 5 minutes
```

Suppose:

```text
10:00 → Cache stores $100

10:03 → Database changes to $120

10:04 → Cache still contains $100

10:05 → Cache expires

10:06 → Request gets fresh value from DB
```

So the system knowingly accepts some staleness.

The important idea is:

```text
"We don't know exactly when the data changes,
so we'll stop trusting it after some amount of time."
```

### Trade-off

```text
Long TTL
   ↓
Fewer DB/cache recomputations
   ↓
More time during which stale data can be served


Short TTL
   ↓
Less possible staleness
   ↓
More cache misses / recomputation
```

For example:

```http
Cache-Control: public, max-age=300
```

or with Redis:

```text
product:123
TTL = 300 seconds
```

### When TTL makes sense

TTL works well when **slight staleness is acceptable**.

For example:

```text
Weather information
Trending products
Search results
Analytics
Public profiles
```

If the value is five minutes old, that may not matter.

But for something like:

```text
Bank balance
Inventory count
Payment status
```

blindly accepting five minutes of stale data may be unacceptable.

---

# 2. Delete on Write

Another approach is:

> **Whenever the underlying data changes, remove the corresponding cache entry.**

Suppose:

```text
Cache:
product:123 → $100
```

The application updates the database:

```sql
UPDATE products
SET price = 120
WHERE id = 123;
```

Then it invalidates the cache:

```text
DELETE product:123
```

Now:

```text
Database = $120
Cache    = missing
```

The next request does:

```text
Request
   ↓
Cache MISS
   ↓
Database
   ↓
$120
   ↓
Store $120 in cache
```

So instead of waiting five minutes for the old value to expire, we remove it immediately.

---

## The Important Mental Model

Delete-on-write is basically saying:

> **"The database is the source of truth. When I change it, throw away the cached copy."**

The cache is therefore **disposable**.

If Redis completely disappears:

```text
Redis 💥
   ↓
Cache is gone
   ↓
Application reads from DB
   ↓
Application can rebuild the cache
```

That is a useful property.

---

# The Dangerous Part: Every Write Path Matters

This is one of the biggest problems with delete-on-write.

You need to invalidate the cache **wherever the data can be changed**.

Imagine:

```text
                 ┌── Admin API
                 │
                 ├── User API
                 │
                 ├── Background Job
                 │
                 ├── Cron Job
                 │
                 └── Migration
                         ↓
                      Database
```

Suppose the Admin API correctly does:

```text
Admin API
   ↓
UPDATE DB
   ↓
DELETE CACHE ✓
```

But a background job does:

```text
Background Job
   ↓
UPDATE DB
   ↓
Forgot to delete cache ❌
```

Now:

```text
Database = NEW
Cache    = OLD
```

Users may continue receiving stale data.

The dangerous thing is that **nothing necessarily crashes**.

You may have:

```text
Database ✓
Application ✓
Redis ✓
HTTP requests ✓
```

but the application is quietly returning old data.

### The lesson

> **With delete-on-write, every path that changes the data becomes part of your cache-invalidation logic.**

As a system grows, there may be many writers:

```text
API
Worker
Cron
Migration
Another service
Admin tool
```

Forgetting just one of them can introduce stale data.

This is why cache invalidation becomes harder as systems become larger.

---

# Delete-on-Write Has Another Failure Mode

Even if you remember every write path, the database update and cache deletion are usually **two separate operations**.

For example:

```text
UPDATE DB ✓
     ↓
Application crashes 💥
     ↓
DELETE CACHE never happens
```

Now:

```text
Database = NEW
Cache    = OLD
```

Or:

```text
UPDATE DB ✓
     ↓
DELETE CACHE ❌ Redis/network failure
```

Same result:

```text
Database = NEW
Cache    = OLD
```

So delete-on-write improves freshness, but it does **not automatically give you perfect consistency**.

---

# Another Subtle Problem: Concurrent Reads

There is an even more interesting race condition.

Suppose:

```text
Database = A
Cache    = A
```

A writer changes the database to `B` while another request is reading.

A possible sequence is:

```text
Writer                         Reader

UPDATE DB → B
                               Cache MISS
                               ↓
                               READ DB
                               ↓
                               A
DELETE CACHE
                               ↓
                               SET CACHE = A
```

Depending on timing, the reader can repopulate the cache with an older value.

You can therefore end up with:

```text
Database = B
Cache    = A  ← stale again
```

This is why cache invalidation is not simply:

```text
"Just call DEL."
```

Once concurrency and distributed systems enter the picture, ordering matters.

---

# 3. Versioned Cache Keys

The third approach is to put a version into the cache key.

Instead of:

```text
product:123
```

use:

```text
product:123:v1
```

Suppose the first version contains:

```text
product:123:v1 → $100
```

When the product changes, the application moves to:

```text
product:123:v2 → $120
```

Now the old entry may still exist:

```text
product:123:v1 → $100  ← old
product:123:v2 → $120  ← current
```

But the application no longer asks for:

```text
product:123:v1
```

It asks for:

```text
product:123:v2
```

So the old entry becomes **unreachable**.

Eventually, its TTL can remove it.

---

# The Mental Model for Versioned Keys

Think of the version as:

> **"Which generation of this data am I asking for?"**

For example:

```text
user:42:v7
```

means:

```text
User 42
Generation 7
```

After an update:

```text
v7 → v8
```

Readers now use:

```text
user:42:v8
```

The old:

```text
user:42:v7
```

can remain temporarily without affecting correctness, because normal reads no longer use it.

This is called making the old entry **unreachable**.

---

# But Versioned Keys Don't Magically Remove Complexity

There is an important question:

> **How does the application know that the current version is v8?**

You need some source of truth for the version.

For example:

```text
Database
   ↓
current_version = 8

Cache
   ↓
user:42:v8
```

So versioning moves some of the complexity from:

```text
"Which cache entries should I delete?"
```

toward:

```text
"How do I determine the current version?"
```

This is an important systems-design lesson:

> **Different invalidation strategies move complexity around; they don't eliminate it.**

---

# Comparing the Three

| Strategy            | Basic idea                             | Main benefit                     | Main difficulty                  |
| ------------------- | -------------------------------------- | -------------------------------- | -------------------------------- |
| **TTL**             | Let cached data expire after some time | Extremely simple                 | Data can remain stale            |
| **Delete on write** | Delete cache when data changes         | Freshness is usually much better | Every write path must invalidate |
| **Versioned keys**  | Change the cache key when data changes | Old values become unreachable    | Need to manage versions          |

---

# How to Choose

There is no universally correct strategy.

Ask four questions:

### 1. How fresh must the data be?

```text
Can it be 5 minutes old?
        ↓
TTL may be enough.

Must it change almost immediately?
        ↓
Consider explicit invalidation.
```

### 2. How frequently does the data change?

```text
Rarely changes
    ↓
TTL may work very well.

Changes constantly
    ↓
Think carefully about invalidation cost.
```

### 3. How expensive is recomputation?

If generating the cached value requires:

```text
10 database queries
+ expensive aggregation
+ external API calls
```

then a cache miss is expensive.

A simple TTL or aggressive deletion strategy may have very different performance implications.

### 4. How many places can modify the data?

This question is especially important for delete-on-write.

```text
One controlled writer
    ↓
Easy to invalidate.


10 different writers
    ↓
Much easier to forget one.
```

---

# The Bigger Lesson

Cache invalidation is fundamentally a **consistency problem**.

You have:

```text
Source of truth
      ↓
   Database
      ↓
    copied
      ↓
    Cache
```

The moment you create a copy, you now have two versions of the same information.

When the original changes, you need a strategy for dealing with the copy.

```text
                 DATA CHANGES
                      │
          ┌───────────┼────────────┐
          ↓           ↓            ↓
         TTL       Delete        Version
                      │           keys
                      │
                invalidate
                every writer
```

So the important thing to remember is not merely:

> "There are three cache invalidation strategies."

Instead remember:

> **Caching creates a second copy of your data. Cache invalidation is the problem of deciding when that copy can no longer be trusted.**

And as the number of writers, readers, dependencies, and servers increases, that problem becomes increasingly difficult.

---

**Next:** [Thundering Herd →](./05-Thundering-Herd.md)
