# MongoDB TTL Example – Auto-Deleting Documents

This example shows how to add a fruit to a `fruits` collection in MongoDB and automatically delete it after a set time using a TTL index.

---

## ✅ Step 1: Create a TTL Index on `expiresAt`

```js
db.fruits.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

db.fruits.insertOne({
  name: "Mango",
  createdAt: new Date(),
});
```
