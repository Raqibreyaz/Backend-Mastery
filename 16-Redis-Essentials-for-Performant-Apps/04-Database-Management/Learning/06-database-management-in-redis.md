# Redis Database Management

## 📦 View the Number of Databases

To find out how many databases your Redis server is configured to use:

```bash
CONFIG GET databases
```

or

```bash
redis-cli CONFIG GET databases
```

This will return the configured number of databases (default is `16`).

---

## 🔁 Select or Switch Databases

Redis databases are indexed numerically, starting from `0`. The default configuration allows databases from `0` to `15`.

### 🔹 `SELECT index`

Use the `SELECT` command to switch to a specific database by its index:

```bash
SELECT 1  # Switch to database 1
```

---

## 📏 Check the Number of Keys in a Database

### 🔹 `DBSIZE`

Returns the number of keys in the currently selected database:

```bash
DBSIZE
```

### 🔹 Check the size of a specific database

Use the `-n` option with `redis-cli` to specify the database index:

```bash
redis-cli -n 2 DBSIZE  # Returns number of keys in DB 2
```

---

## ⚙️ Configure the Number of Databases

By default, Redis supports up to 16 databases (`0` to `15`). You can change this limit by editing the Redis configuration file.

### 🔹 Modify `redis.conf`:

```conf
databases 4
```

This restricts Redis to use only databases `0` to `3`.

**Note:** In modern Redis usage, most applications rely solely on database `0` and use **namespacing** (e.g., `user:123`, `session:abc`) to logically separate data.

---

## 📝 Key Points to Remember

- Redis supports **numbered databases only** — no custom names.
- All databases share the **same memory space**.
- Redis does **not** track memory usage per database.
- Consider using **key namespacing** instead of multiple databases.

---

📚 For more details, refer to the [official Redis configuration documentation](https://redis.io/docs/latest/operate/oss_and_stack/management/config/).
