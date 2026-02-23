# 🔄 More Redis Topics to Explore

After completing the main Redis section, here are some additional advanced topics students can explore to deepen their understanding of Redis:

---

## 🧵 1. Multi Commands

Redis `MULTI` allows you to execute a group of commands in a single transaction. All commands queued after `MULTI` are executed atomically with `EXEC`.

### Example using Node.js (official `redis` library):

```js
const multi = redisClient.multi();
multi.set("key1", "value1");
multi.set("key2", "value2");
const results = await multi.exec();
console.log(results);
```

Useful when you want to make sure a series of operations happen without interruption.

---

## 🔗 2. Pipelining

Pipelining sends multiple commands to Redis without waiting for the reply of the previous one. This reduces network round trips and improves performance.

```js
const pipeline = redisClient.pipeline();
pipeline.set("key1", "value1");
pipeline.set("key2", "value2");
pipeline.set("key3", "value3");
pipeline.exec();
```

* Improves performance.
* Not atomic.
* Can be combined with `MULTI` if atomicity is needed inside a pipeline.

---

## 🔣 3. Redis Serialization Protocol (RESP)

RESP is the format Redis uses to communicate between the client and server. It defines how commands and their replies are encoded:

* Simple Strings start with `+`
* Errors start with `-`
* Integers start with `:`
* Bulk Strings start with `$`
* Arrays start with `*`

Example:

```
*2
$3
GET
$3
key
```

---

## 🧘 4. Redis OM (Object Mapping)

Redis OM is a library that provides object mapping for Redis, allowing you to work with Redis data like you would with an ORM.

Supports:

* Schemas for Redis hashes
* Full-text search
* Indexing

Available for JavaScript, Python, and other languages.

---

## 🌐 5. Globbing Patterns

Redis supports glob-style pattern matching for commands like `KEYS` and `SCAN`:

* `*` matches any number of characters
* `?` matches a single character
* `[abc]` matches one character in the set

Example:

```bash
KEYS user:*
```

Use carefully, especially `KEYS` in production.

---

## 💾 6. Saving Computed Values in Redis

Redis is often used to cache the result of expensive computations or database queries.

Steps:

1. Check if value exists in Redis
2. If not, compute and store in Redis
3. Return the value

Example:

```js
const cached = await redis.get("expensive:data")
if (!cached) {
  const data = await computeExpensiveStuff()
  await redis.set("expensive:data", data)
}
```

This improves performance and reduces load on backend services.

---

These topics are valuable for building efficient, scalable, and production-ready Redis-powered applications.
