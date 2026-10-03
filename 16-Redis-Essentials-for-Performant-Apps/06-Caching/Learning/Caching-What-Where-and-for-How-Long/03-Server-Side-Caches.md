# Server-Side Caches

## Shared Cache: Redis

The next layer is a **shared cache**, such as Redis.

Imagine you have:

```text
          ┌── Server 1
Client ───┼── Server 2
          └── Server 3
```

All three application instances can access:

```text
        Redis
       /  |  \
      /   |   \
Server1 Server2 Server3
```

So the cache is shared across instances.

Example:

```text
Request
   ↓
Server 1
   ↓
Redis
   ↓
HIT
```

Later:

```text
Request
   ↓
Server 3
   ↓
Redis
   ↓
HIT
```

Server 3 can use the value that Server 1 stored.

---

## In-Process Cache

An in-process cache lives inside the application process itself.

For example:

```javascript
const cache = new Map();
```

Imagine:

```text
Server 1
 └── local cache

Server 2
 └── local cache

Server 3
 └── local cache
```

These caches are **not shared**.

So:

```text
Server 1:
user:42 → "Raquib"

Server 2:
user:42 → "Old value"

Server 3:
user:42 → missing
```

The servers can disagree.

---

## Shared vs In-Process Cache

| Property                               | Shared cache    | In-process cache    |
| -------------------------------------- | --------------- | ------------------- |
| Example                                | Redis           | `Map` inside server |
| Shared between instances               | Yes             | No                  |
| Speed                                  | Very fast       | Usually faster      |
| Memory                                 | External system | Application memory  |
| Consistency between instances          | Easier          | Harder              |
| Each instance can have different value | Usually no      | Yes                 |

The source specifically highlights this distinction:

* Redis-like shared cache → every service instance can read it.
* In-process cache → fastest, but every instance has its own copy and they can disagree. 

---

**Next:** [Cache Invalidation Strategies →](./04-Cache-Invalidation-Strategies.md)
