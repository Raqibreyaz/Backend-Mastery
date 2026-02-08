# 📟 TTL Index in MongoDB

## 📘 What is a TTL Index?

A **TTL (Time-To-Live) index** in MongoDB is a special type of index that **automatically deletes documents** from a collection after a specified amount of time.

It is ideal for managing temporary or expirable data without requiring manual cleanup.

---

## ✅ Key Features

- Works only with fields of type **`Date`**
- Uses the **`expireAfterSeconds`** option to define the expiration period
- Deletes documents using a **background process** that runs every **60 seconds**
- No need to manually schedule deletion or write cleanup scripts

---

## 🔧 Example: Creating a TTL Index

```js
db.sessions.createIndex(
  { "createdAt": 1 },
  { expireAfterSeconds: 3600 }
)
```

This will delete each document **1 hour after its `createdAt` timestamp**.

---

## 🧠 How It Works Internally

- MongoDB includes a background **TTL monitor** thread
- It checks for expired documents every **60 seconds**
- Expired documents are deleted in batches
- MongoDB does **not guarantee exact-time deletion** — delays of a minute or more are normal

---

## 📆 Common Use Cases

- Session expiration
- Temporary tokens or OTPs
- Cache records
- Expiring logs or audit entries

---

## ❌ Limitations

- **Cannot trigger events or callbacks** upon deletion
- No way to track *when* the document was deleted

---