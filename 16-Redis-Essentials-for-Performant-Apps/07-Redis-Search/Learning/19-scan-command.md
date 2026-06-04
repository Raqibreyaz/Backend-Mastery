# How to Use SCAN Command in Redis

## 🔹 What is SCAN?

The `SCAN` command in Redis is used to **incrementally iterate** over a collection of keys in the database without blocking the server.

---

## 📟 Using SCAN in Redis CLI

### 🔸 Basic Syntax

```bash
SCAN <cursor> [MATCH pattern] [COUNT count]
```

* **Default MATCH**: `*` (matches all keys)
* **Default COUNT**: `10` (approximate number of keys per batch)

### 🔸 Example

```bash
SCAN 0 MATCH user:* COUNT 10
```

### 🔸 Explanation

* `0` – initial cursor
* `MATCH user:*` – filter keys starting with `user:`
* `COUNT 10` – request up to 10 keys per batch (not guaranteed)

### 🔸 Full Scan Loop (Manual)

Repeat the command using the cursor returned by the previous call until the cursor returned is `0`:

```bash
SCAN 0
SCAN 25
SCAN 97
... until cursor is 0
```

---

## 🧑‍💻 Using SCAN in Node.js (Official `redis` Module)

### 🔸 Setup

```js
import { createClient } from 'redis';

const client = createClient();
await client.connect();
```

### 🔸 SCAN with Loop

```js
let cursor = 0;
do {
  const { cursor: nextCursor, keys } = await client.scan(cursor, {
    MATCH: '*',
    COUNT: 10
  });

  console.log('Found keys:', keys);
  cursor = nextCursor;
} while (cursor !== 0);
```

### ✅ Output

Logs all keys in batches of up to 10 until the scan is complete.

---

## 📝 Notes

* `SCAN` is **non-blocking** and safe for large datasets.
* Always combine with `MATCH` to avoid scanning the entire keyspace unnecessarily.
* The `COUNT` is a **hint**, not a strict limit.
* If `MATCH` and `COUNT` are not provided, Redis uses:

  * `MATCH *` as the default pattern
  * `COUNT 10` as the default batch size

---

## ✅ Use Cases

* Cleaning up old or expired keys.
* Migrating or exporting subsets of data.
* Analyzing or monitoring key patterns.
