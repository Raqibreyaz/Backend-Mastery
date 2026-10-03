# What Is Caching and Why

## What it is

A **cache** stores a previously computed result so that the next request can get the answer faster instead of doing the expensive work again.

For example:

```text
Without cache:

Request
   ↓
Database
   ↓
Expensive query
   ↓
Response
```

With cache:

```text
Request
   ↓
Cache ── HIT ──→ Response
   │
   └── MISS
        ↓
     Database
        ↓
     Response
        ↓
      Cache
```

The important idea is that a cache trades **freshness for speed**.

The real question behind every caching decision is:

> **How stale is it acceptable for this answer to be?**

If you answer that question first, many cache bugs become much easier to avoid. 

---

## Intuition

Imagine a restaurant menu.

Suppose the waiter has to walk to the kitchen every time you ask:

> "What are today's desserts?"

That is unnecessary if the answer rarely changes.

The waiter can remember:

```text
Desserts today:
- Cake
- Ice cream
- Pudding
```

Now most customers get the answer immediately.

But there is a problem.

If the restaurant changes the dessert menu and the waiter still remembers the old one:

```text
Real menu:
Cake
Ice cream

Waiter's memory:
Cake
Ice cream
Pudding
```

The cache is **fast but stale**.

So caching is fundamentally a trade:

```text
          More caching
               ↓
       Faster responses
               +
       Less expensive work
               ↓
       Potentially older data
```

The hard part is usually not putting something into a cache.

The hard part is deciding:

> **When should this cached answer stop being trusted?**

---

## Why Do We Need Caching?

Suppose an endpoint performs an expensive query:

```sql
SELECT ...
FROM products
WHERE category = 'laptops';
```

If the query takes:

```text
2 ms
```

and receives:

```text
10 requests/sec
```

you might not need a cache at all.

But imagine:

```text
Query time = 500 ms
Requests = 1,000/sec
```

Now repeatedly performing the same expensive work can become a serious bottleneck.

A cache can turn:

```text
1,000 database queries/sec
```

into something closer to:

```text
1 database query
+
many cache reads
```

for a period of time.

But this only makes sense if the cached thing is actually expensive enough to justify the additional complexity.

---

## Cache the Expensive Thing, Not Everything

A common beginner mistake is:

> "Caching makes things faster, so let's cache everything."

That is not a good rule.

Suppose a database query already takes:

```text
2 ms
```

You put Redis in front of it:

```text
Request
   ↓
Redis
   ↓
Database
```

A cache lookup itself requires work:

```text
Request
   ↓
Network
   ↓
Redis
   ↓
Network
```

You may now be adding a network round trip to save almost nothing.

And you have introduced another system that can become stale or unavailable.

So:

```text
Cheap operation
      +
Cache complexity
      =
Possibly worse system
```

The correct approach is:

> **Measure first. Cache because you measured a real cost, not because caching is fashionable.**

The lesson explicitly warns that caching a two-millisecond query can add a network round trip while giving you another source of truth. 

---

## Cache Layers

There are several places where you can cache data.

From the cheapest/simple layer to more involved server-side caching:

```text
Client / Browser
      ↓
CDN / HTTP cache
      ↓
Shared cache (Redis)
      ↓
In-process cache
      ↓
Database
```

Each layer has different properties.

---

**Next:** [HTTP Caching →](./02-HTTP-Caching.md)
