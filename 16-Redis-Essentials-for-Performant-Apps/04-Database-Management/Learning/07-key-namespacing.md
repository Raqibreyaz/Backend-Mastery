# 🗂️ Redis Key Namespacing

In Redis, **key namespacing** is a convention used to logically organize and group keys. Since Redis stores all keys in a flat keyspace (like a big global dictionary), it's up to the developer to structure key names in a meaningful way.

---

## 🔑 What is Key Namespacing?

Key namespacing is the practice of **prefixing keys** with a category or group name, typically separated by a colon `:`. This helps you:

* Organize data logically
* Avoid key collisions
* Enable efficient data access and cleanup

### 🔧 Common Pattern

```txt
<namespace>:<subcategory>:<identifier>
```

### 📌 Example

```txt
user:1001:name       # Name of user with ID 1001
user:1001:email      # Email of user with ID 1001
cart:1001:items      # Cart items of user 1001
session:abc123       # Session data
```

---

## 🎯 Benefits of Namespacing

| Benefit            | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| Organization       | Groups related keys together                                   |
| Easier Debugging   | Helps in inspecting keys in the CLI                            |
| Efficient Deletion | You can easily delete a group using `SCAN` + `DEL`             |
| Avoid Collisions   | Prevents accidental overwriting of keys from different domains |

---

## 🔍 Usage with Commands

### 🔹 Get all keys under a namespace

```bash
KEYS user:*
```

### 🔹 Delete all keys under a namespace (use with care)

```bash
SCAN 0 MATCH user:* COUNT 100
DEL <matched keys>
```

In practice, use `SCAN` to avoid blocking Redis in production environments.

---

## 💡 Best Practices

* Use clear, consistent prefixes (e.g., `user:`, `cart:`, `session:`)
* Use colons `:` as separators — this is a common Redis convention
* Don’t overuse deeply nested namespaces
* Use short, meaningful namespaces

---

## 🚫 Limitations

* Namespacing is **manual** — Redis doesn’t enforce it
* Requires discipline and consistency in your application code

---

By following a structured namespacing strategy, you can keep your Redis data clean, manageable, and scalable.
