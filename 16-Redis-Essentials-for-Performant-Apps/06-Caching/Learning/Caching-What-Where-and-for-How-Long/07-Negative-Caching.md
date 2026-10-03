# Negative Caching

Caching does not only apply to successful results.

You can also cache:

> **Not found**

Suppose:

```http
GET /users/999999999
```

and that user does not exist.

Maybe checking the database is expensive.

Without negative caching:

```text
Request
 ↓
DB
 ↓
not found

Request
 ↓
DB
 ↓
not found

Request
 ↓
DB
 ↓
not found
```

An attacker or buggy client repeatedly requesting nonexistent IDs could cause unnecessary database work.

---

## Cache "Not Found"

Instead:

```text
user:999999999 → NOT_FOUND
```

Now:

```text
Request
   ↓
Cache
   ↓
NOT_FOUND
```

The database is not queried every time.

This is called **negative caching**.

The lesson explicitly recommends considering it when missing-ID lookups are expensive. 

---

## Negative Cache Entries Need Short TTLs

There is an important trap.

Suppose:

```text
10:00
GET /users/999
```

User doesn't exist.

You cache:

```text
user:999 → NOT_FOUND
```

At:

```text
10:01
```

someone creates user 999.

But your negative cache still says:

```text
NOT_FOUND
```

So:

```text
Database:
user 999 exists ✓

Cache:
user 999 does not exist ✗
```

Your application may incorrectly continue returning "not found."

Therefore negative results should generally have a **short TTL**.

The source explicitly warns that otherwise a newly created record can remain invisible for as long as the negative cache entry remains valid. 

---

**Next:** [Cache Availability and Resilience →](./07-Cache-Availability-and-Resilience.md)
