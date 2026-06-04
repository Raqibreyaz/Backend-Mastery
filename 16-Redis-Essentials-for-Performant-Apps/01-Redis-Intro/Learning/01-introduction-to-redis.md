# Introduction to Redis

Redis (REmote DIctionary Server) is an open-source, in-memory data structure store used as a database, cache, and message broker. It is known for its speed, simplicity, and support for a wide range of data structures.

Redis stores data in **key-value pairs**, where each key is unique and maps to a specific value. These values can be simple strings or more complex data structures like lists, hashes, and sets.

Redis is one of the most **popular** in-memory databases in the world.

---

## Key Features of Redis

* **In-Memory Storage**: Stores data in RAM, enabling extremely fast read and write operations.
* **Persistence Options**: Supports snapshotting and append-only file (AOF) for data persistence.
* **TTL Support**: Allows automatic expiration of keys, useful for sessions and caches.
* **Pub/Sub**: Supports publish/subscribe messaging pattern.
* **Atomic Operations**: All operations are atomic by default.
* **Replication and Clustering**: Enables high availability and horizontal scalability.

---

## Common Use Cases

1. **Session Storage**: Store user sessions with expiration.
2. **Caching**: Cache frequently accessed data (e.g., API responses, database queries).
3. **Message Queues**: Use Lists or Streams for implementing queues.
4. **Rate Limiting**: Implement IP/user-based rate limiting using atomic counters.
5. **Leaderboard Systems**: Use Sorted Sets to manage ranking systems.

---

## Example Usage

### Storing and Retrieving Data

```bash
SET user:1 "Anurag"
GET user:1
```

### Working with Hashes (like objects)

```bash
HSET user:1 name "Anurag" age "25"
HGETALL user:1
```

### Using Redis in Node.js (with `redis` library)

```js
import { createClient } from 'redis';

const client = createClient();
await client.connect();

await client.set('key', 'value');
const value = await client.get('key');
console.log(value); // "value"

await client.quit();
```

---

## Conclusion

Redis is a powerful, flexible tool for handling high-speed data operations. Whether you're building a real-time chat app, a caching layer, or session management, Redis is often the go-to solution for its speed, versatility, and ease of use.
