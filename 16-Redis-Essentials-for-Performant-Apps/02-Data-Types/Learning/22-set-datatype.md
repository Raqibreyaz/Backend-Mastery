# 📚 Redis Sets and Common Commands

## 🔸 What is a Redis Set?

A **Redis Set** is an **unordered collection of unique strings**. It’s similar to a mathematical set and is optimized for fast membership checks and set operations like unions and intersections.

You can use sets for:

* Tagging systems
* Unique collections (e.g., unique visitors)

## 🔹 Key Properties

* **No duplicates** allowed
* **Unordered** (no indexing like lists)
* Optimized for **O(1)** add/remove/check operations

---

## 🛠 Common Set Commands

### 1. **SADD** – Add one or more members

```bash
SADD myset "apple"
SADD myset "banana" "cherry"
```

### 2. **SREM** – Remove one or more members

```bash
SREM myset "banana"
```

### 3. **SMEMBERS** – Get all members

```bash
SMEMBERS myset
```

Returns: All elements in the set (unordered)

### 4. **SISMEMBER** – Check if a value exists

```bash
SISMEMBER myset "apple"
```

Returns: `1` if exists, `0` otherwise

### 5. **SCARD** – Count the number of elements

```bash
SCARD myset
```

Returns: Number of unique elements. The term `CARD` stands for cardinality. In simple terms, cardinality refers to the number of elements in a mathematical set or a database column.

### 6. **SPOP** – Remove and return a random element

```bash
SPOP myset
```

Returns: Random element

### 7. **SRANDMEMBER** – Get a random element without removing

```bash
SRANDMEMBER myset
```
---

## 🧪 Example

```bash
DEL myset
SADD myset "a" "b" "c"
SISMEMBER myset "b"
SMEMBERS myset
```

---

## ✅ Notes

* Sets are great for **ensuring uniqueness**.
* Use `SISMEMBER` to efficiently test membership.