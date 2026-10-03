# Database Cache vs Redis Cache

## The Confusion

You may hear:

> **"Databases already cache frequently accessed data, so why do we need Redis?"**

This is a very reasonable question.

The important thing is that **database caching and Redis caching happen at different layers and solve different problems.**

The simplest mental model is:

> **Database caching makes the database faster.**

> **Redis caching helps you avoid the database altogether.**

---

# 1. What Does the Database Actually Cache?

Consider:

```sql
SELECT * FROM users WHERE id = 42;
```

The database ultimately needs to access data stored on disk.

Reading from disk repeatedly would be expensive, so databases keep frequently accessed **database pages** in memory.

Conceptually:

```text
Application
     ↓
PostgreSQL
     ↓
Database Buffer Cache
     ↓
Disk / SSD
```

For example, a database page might contain:

```text
Page #1827

user 40
user 41
user 42
user 43
...
```

If PostgreSQL already has that page in memory, it doesn't need to read the SSD again.

So subsequent queries can benefit from:

```text
Query 1 → Disk
Query 2 → RAM
Query 3 → RAM
Query 4 → RAM
```

This is a major reason databases can be fast.

---

# 2. What Is the Database Actually Caching?

This distinction is extremely important.

The database buffer cache is primarily caching **database pages**:

```text
Page #1827
Page #1831
Page #2004
...
```

It is not simply storing:

```text
"SELECT * FROM users WHERE id = 42"

→ here is the final result
```

The database may still need to perform work such as:

```text
Parse query
     ↓
Plan query
     ↓
Find relevant index/pages
     ↓
Read pages from buffer cache
     ↓
Apply filters
     ↓
Perform joins
     ↓
Aggregate / sort
     ↓
Construct result
```

Even when the required pages are already in RAM.

---

# 3. Redis Works at a Different Layer

Redis can cache the **application-level result**.

Suppose the application frequently needs:

```sql
SELECT
    u.id,
    u.name,
    COUNT(o.id) AS orders
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE u.id = 42
GROUP BY u.id, u.name;
```

The database may have all the required pages in memory.

But it still has to perform the query and calculate the result.

Instead, the application can store the final result in Redis:

```text
Redis

user:42:order-summary

→ {
    id: 42,
    name: "Raquib",
    orders: 137
}
```

Now the request can be:

```text
Request
   ↓
Redis
   ↓
Cache HIT
   ↓
Return result
```

The database isn't involved at all.

---

# 4. Think in Layers

A useful mental model is:

```text
                 APPLICATION
                      │
                      ↓
                ┌───────────┐
                │   Redis   │
                │           │
                │ Application│
                │ data/results
                └─────┬─────┘
                      │
                 Cache MISS
                      ↓
                ┌───────────┐
                │ PostgreSQL│
                └─────┬─────┘
                      │
                Buffer Cache
                      ↓
                ┌───────────┐
                │    RAM    │
                └─────┬─────┘
                      │
                      ↓
                   SSD/Disk
```

There are multiple caching layers.

Each layer prevents a different kind of work.

---

# 5. What Work Does Each Cache Prevent?

Think about the direction of the request:

```text
Client
  ↓
Application
  ↓
Redis
  ↓
Database
  ↓
Disk
```

Each cache can stop the request from going further.

### Redis

```text
Request
   ↓
Redis HIT
   ↓
Return

Database never sees the request.
```

So Redis can prevent:

* database query execution
* joins
* aggregations
* sorting
* database connections/work

### Database Buffer Cache

```text
Query
   ↓
Database
   ↓
Page already in RAM
   ↓
Avoid disk read
```

The database still executes the query, but it avoids expensive storage access.

So:

> **Redis can eliminate database work.**

> **Database buffer caching can eliminate disk work.**

---

# 6. Example: Why Redis Can Still Matter

Imagine your application receives:

```text
1,000,000 requests/hour
```

for:

```text
product:123
```

Without application-level caching:

```text
1,000,000 requests
        ↓
PostgreSQL
        ↓
1,000,000 query executions
```

Even if PostgreSQL has the relevant pages cached in RAM, it still has to process those queries.

With Redis:

```text
1,000,000 requests
        ↓
      Redis
        │
        ├── 999,000 cache hits
        │
        └── 1,000 cache misses
                  ↓
              PostgreSQL
```

The numbers are just illustrative, but the architectural difference is important.

Redis can prevent a large number of requests from reaching the database at all.

---

# 7. Redis Can Cache More Than Database Data

Redis isn't limited to caching database query results.

It can store application-level information such as:

### Sessions

```text
session:abc123
→ user_id=42
```

### Rate limits

```text
rate:user:42
→ 97
```

### OTPs

```text
otp:user:42
→ 834921
```

### Leaderboards

```text
leaderboard:global
→ ...
```

### Computed results

```text
recommendations:user:42
→ ...
```

### API responses

```text
api:/products/123
→ ...
```

These are application-level concepts rather than database pages.

---

# 8. Redis Gives the Application Explicit Control

With Redis, the application can explicitly decide:

```text
What is the key?
What is the value?
How long should it live?
When should it be invalidated?
What should happen on a cache miss?
```

For example:

```text
SET product:123 "$120" EX 300
```

Conceptually:

```text
Key       = product:123
Value     = $120
TTL       = 300 seconds
```

The application is explicitly controlling the cache.

With the database's internal buffer cache, the database itself decides which pages should remain in memory according to its own caching mechanisms and workload.

---

# 9. Another Important Difference: Final Result vs Raw Pages

Suppose the application needs:

```text
Homepage for user 42
```

Generating it requires:

```text
10 database queries
3 joins
aggregation
sorting
business logic
```

PostgreSQL might have all the underlying pages in RAM.

That's good.

But it still has to perform the computation.

With Redis, the application can cache:

```text
homepage:user:42
```

containing the already-computed result.

Then:

```text
Request
   ↓
Redis
   ↓
homepage:user:42
   ↓
Return
```

The expensive computation is skipped entirely.

This is a key difference:

```text
Database cache:

"Keep the data needed to execute queries in memory."


Redis:

"Keep the result the application actually wants."
```

---

# 10. There Are Many Caches in a Real System

A real system may contain several caching layers:

```text
Browser Cache
      ↓
CDN Cache
      ↓
Redis / Application Cache
      ↓
Database Buffer Cache
      ↓
OS Page Cache
      ↓
SSD
```

They are not necessarily redundant.

Each one prevents work at a different layer.

For example:

```text
Browser cache
→ Don't make the HTTP request.

CDN cache
→ Don't hit the application server.

Redis
→ Don't hit the database.

Database buffer cache
→ Don't hit disk.

OS page cache
→ Avoid physical storage reads.
```

The closer the cache is to the client, the more work it can potentially eliminate.

---

# 11. Then Why Not Always Use Redis?

Because Redis introduces its own costs.

You now have:

```text
Application
    ↓
Redis
    ↓
Database
```

instead of:

```text
Application
    ↓
Database
```

Redis introduces additional complexity:

* another service to operate
* network communication
* cache invalidation
* stale data
* memory usage
* cache misses
* cache stampedes
* consistency problems
* monitoring and failure handling

So Redis should not automatically be added just because it is faster.

If the database already handles the workload comfortably, Redis may provide little benefit while increasing system complexity.

---

# 12. Database Cache and Redis Cache Are Complementary

It's not:

```text
Database cache VS Redis
```

It's often:

```text
Database cache + Redis
```

They can work together:

```text
Request
   ↓
Redis
   │
   ├── HIT ──→ Return
   │
   └── MISS
         ↓
     PostgreSQL
         │
         ↓
    Buffer Cache
         │
         ↓
       Disk
```

A Redis miss doesn't necessarily mean PostgreSQL has to hit the disk.

PostgreSQL may already have the required pages in its own memory.

So you can have:

```text
Redis HIT
    ↓
No DB work


Redis MISS
    ↓
DB query
    ↓
DB buffer cache HIT
    ↓
No disk read
```

Multiple caches can therefore protect different layers simultaneously.

---

# 13. The Simplest Mental Model

Remember these two sentences:

> **Database caching makes the database faster.**

> **Redis caching can make the database unnecessary for that request.**

Or:

```text
Database Buffer Cache
        ↓
"Don't read these pages from disk."


Redis
        ↓
"Don't ask the database for this result."
```

That's the fundamental distinction.

---

# 14. Connection to Cache Invalidation

This also explains why Redis introduces the cache-invalidation problems we studied earlier.

The database is the source of truth:

```text
Database
   ↓
Source of truth
```

Redis contains a copy:

```text
Redis
   ↓
Cached application data
```

When the database changes:

```text
Database = NEW
Redis    = OLD
```

you now have to decide how to invalidate or refresh Redis.

That's where the strategies we studied come in:

```text
TTL
Delete on write
Versioned keys
Stale-while-revalidate
```

The database's internal buffer cache generally doesn't create this same application-level problem because the database itself controls that cache as part of its storage engine.

---

# Final Mental Model

```text
                    REQUEST
                       │
                       ↓
                  ┌─────────┐
                  │  Redis  │
                  └────┬────┘
                       │
                Cache MISS
                       ↓
                ┌───────────┐
                │ Database  │
                └─────┬─────┘
                      │
                Buffer Cache
                      ↓
                    Disk
```

Think of it as:

```text
Redis
 ↓
Caches application-level results
 ↓
Can avoid database work


Database Buffer Cache
 ↓
Caches database pages
 ↓
Can avoid disk I/O
```

So the question isn't:

> **"If the database has a cache, why do we need Redis?"**

The better question is:

> **"At which layer do I want to eliminate expensive work?"**

That is the reason multiple caching layers can coexist.
