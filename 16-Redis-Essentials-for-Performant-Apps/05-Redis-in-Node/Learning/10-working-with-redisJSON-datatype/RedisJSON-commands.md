# 📘 RedisJSON CLI and JSONPath Guide

## ✅ What is RedisJSON?

RedisJSON is a Redis module that allows you to store, manipulate, and query JSON documents **natively** inside Redis.

Instead of storing JSON as raw strings, you can work with actual structured data using commands like `JSON.SET`, `JSON.GET`, etc.

---

## 🔧 RedisJSON Commands

### 1. **Set JSON Data**

```bash
JSON.SET user:1 $ '{"name":"Anurag","age":25,"location":{"city":"Bangalore"}}'
```

- `user:1` is the Redis key
- `$` means root of the document

### 2. **Get JSON Data**

```bash
JSON.GET user:1
```

Returns the full JSON document.

To get only the name:

```bash
JSON.GET user:1 $.name
```

Returns:

```json
["Anurag"]
```

### 3. **Delete JSON Fields**

```bash
JSON.DEL user:1 $.location
```

Deletes the `location` field.

### 4. **Increment a Number**

```bash
JSON.NUMINCRBY user:1 $.age 1
```

Increments age by 1.

### 5. **Array Operations**

```bash
JSON.ARRAPPEND user:1 $.hobbies '"coding"'
```

Appends to `hobbies` array.

```bash
JSON.ARRPOP user:1 $.hobbies
```

Removes the last element of the `hobbies` array.

```bash
JSON.ARRPOP user:1 $.hobbies 0
```

Removes the element at index 0 of the `hobbies` array.

```bash
JSON.ARRLEN user:1 $.hobbies
```

Returns the length of the `hobbies` array.

---

## 🔍 What is JSONPath?

**JSONPath** is a syntax used to navigate and query parts of a JSON structure. RedisJSON uses it to specify what part of the JSON document you want to operate on.

### ✅ JSONPath Basics

| JSONPath          | Meaning                                  |
| ----------------- | ---------------------------------------- |
| `$`               | Root of the JSON                         |
| `$.name`          | Property named `name`                    |
| `$.location.city` | Nested property `city` inside `location` |
| `$[*]`            | All items in an array                    |
| `$[0]`            | First item in an array                   |
| `$..name`         | All `name` fields at any depth           |

### 🧪 Example JSON

```json
{
  "name": "Anurag",
  "age": 25,
  "location": {
    "city": "Bangalore"
  },
  "hobbies": ["coding", "reading"]
}
```

| JSONPath       | Result      |
| -------------- | ----------- |
| `$.name`       | "Anurag"    |
| `$.hobbies[1]` | "reading"   |
| `$..city`      | "Bangalore" |

---

## ❓ Why Does RedisJSON Return Arrays?

### Example:

```bash
JSON.GET user:10 $.name
```

Returns:

```json
["Anurag"]
```

### Why?

Because:

- `$.name` is a **JSONPath expression**
- JSONPath is designed to return **arrays of matches**, even if there's only **one** match

This ensures consistency when multiple values are matched.

---

## ✅ Summary

| Operation                        | Result Format             | Notes                         |
| -------------------------------- | ------------------------- | ----------------------------- |
| `JSON.GET key`                   | Full JSON                 | Root object                   |
| `JSON.GET key $.field`           | `[value]`                 | Always returned as array      |
| `JSON.GET key $.field1 $.field2` | `{path: [value], ...}`    | Multi-path query              |
| Want raw value                   | Extract `[0]` from result | Use in code or pipe with `jq` |

Let me know if you want advanced JSONPath patterns or to combine with full-text search!
