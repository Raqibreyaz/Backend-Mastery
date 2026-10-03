# Cache Availability and Resilience

## Cache Availability Is a Design Decision

A cache is often an optimization.

Your database is usually the source of truth.

So ask:

> **What happens when the cache disappears?**

For example:

```text
Application
    ↓
Redis
    X
Redis unavailable
```

What should happen?

There are two broad possibilities.

### Option A: Fail

```text
Redis unavailable
      ↓
500 error
```

### Option B: Fall back

```text
Redis unavailable
      ↓
Database
      ↓
slower response
```

For an ordinary cache, the lesson recommends the second behavior:

> **Prefer being slower over failing completely.** 

---

## Cache Should Usually Be Optional

Think of the architecture as:

```text
                  ┌── Cache ── HIT ──→ Response
                  │
Request → Service ┤
                  │
                  └── Cache unavailable/MISS
                            ↓
                         Database
                            ↓
                         Response
```

The database remains the source of truth.

The cache improves performance.

So:

```text
Cache failure
    ↓
Performance degradation
```

rather than:

```text
Cache failure
    ↓
Entire application failure
```

---

## The Timeout Trap

There is an important subtle problem.

Suppose:

```text
HTTP request timeout = 2 seconds
```

but:

```text
Redis timeout = 5 seconds
```

Your request can get stuck waiting for Redis:

```text
Request
  ↓
Redis
  ↓
waiting...
  ↓
waiting...
  ↓
waiting...
```

The request may already have timed out before Redis gives up.

This means the cache, which was supposed to be optional, has become a required dependency.

The source states this directly:

> A cache client's timeout that is longer than the request timeout can turn an optional dependency into a required one. 

---

## Better Failure Flow

Prefer something like:

```text
Request timeout = 2s

Redis timeout = short
       ↓
Redis unavailable
       ↓
quickly fall back
       ↓
Database
       ↓
Response
```

Rather than:

```text
Request timeout = 2s

Redis timeout = 5s
       ↓
wait 5 seconds
       ↓
request already dead
```

The broader principle is:

> **Optional dependencies must fail quickly enough that the primary path can still operate.**

---

**Next:** [TTL Implementation →](./08-TTL-Implementation.md)
