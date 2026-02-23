# 📚 Redis Hashes and Common Commands

## 🔸 What is a Redis Hash?

A **Redis Hash** is a **map/dictionary** data structure that stores field-value pairs under one key. Think of it as a way to represent an object with properties.

It’s useful for:

* Storing user profiles
* Configuration objects
* Caching rows of a database

## 🔹 Key Properties

* Stores multiple field-value pairs under a single key
* Fields are unique within the hash
* Ideal for storing structured data like JSON objects
* ❗️Both field names and values are **stored as strings**

---

## 🛠 Common Hash Commands

### 1. **HSET** – Set field(s) in a hash

```bash
HSET userHash name "Alice" age "25"
```

Sets multiple fields in the hash `userHash`

### 2. **HGET** – Get the value of a field

```bash
HGET userHash name
```

Returns: `Alice`

### 3. **HGETALL** – Get all fields and values

```bash
HGETALL userHash
```

Returns all fields and values in the hash

### 4. **HMGET** – Get values for multiple fields

```bash
HMGET userHash name age
```

### 5. **HMSET** – Set multiple fields (alias for HSET in Redis ≥ 4.0)

```bash
HMSET userHash2 name "Bob" age "30"
```

### 6. **HDEL** – Delete one or more fields

```bash
HDEL userHash age
```

### 7. **HEXISTS** – Check if a field exists

```bash
HEXISTS userHash name
```

Returns: `1` if exists, `0` otherwise

### 8. **HLEN** – Number of fields in the hash

```bash
HLEN userHash
```

### 9. **HKEYS** – Get all field names

```bash
HKEYS userHash
```

### 10. **HVALS** – Get all field values

```bash
HVALS userHash
```

### 11. **HINCRBY** – Increment a numeric field

```bash
HINCRBY userHash age 1
```

Increases the `age` field by 1

---

## ✅ Notes

* Redis hashes are efficient even with many small fields
* Great for mimicking objects/records
* Prefer hashes over storing JSON strings when querying fields individually
* 🔸 All values and fields are stored as **plain strings**, even numbers