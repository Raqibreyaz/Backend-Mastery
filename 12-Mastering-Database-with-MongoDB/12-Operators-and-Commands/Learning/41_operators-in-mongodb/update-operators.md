# MongoDB Update Operators

This document categorizes and explains the most commonly used **Update Operators** in MongoDB with **Node.js examples**.

---

## 📌 1. Field Update Operators

### 🔹 `$set` (Update or Add a Field)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $set: { age: 30 } }
);
console.log(result);
```

### 🔹 `$unset` (Remove a Field)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $unset: { age: "" } }
);
console.log(result);
```

### 🔹 `$rename` (Rename a Field)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $rename: { "oldField": "newField" } }
);
console.log(result);
```

---

## 📌 2. Arithmetic Operators

### 🔹 `$inc` (Increment a Numeric Field)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $inc: { score: 5 } }
);
console.log(result);
```

### 🔹 `$mul` (Multiply a Numeric Field)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $mul: { salary: 1.1 } }
);
console.log(result);
```

---

## 📌 3. Array Update Operators

### 🔹 `$push` (Add an Element to an Array)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $push: { skills: "MongoDB" } }
);
console.log(result);
```

### 🔹 `$pop` (Remove First or Last Element from an Array)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $pop: { skills: -1 } } // -1 removes first, 1 removes last
);
console.log(result);
```

### 🔹 `$pull` (Remove Specific Elements from an Array)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $pull: { skills: "Java" } }
);
console.log(result);
```

### 🔹 `$addToSet` (Add an Element Only If It Does Not Exist)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $addToSet: { skills: "JavaScript" } }
);
console.log(result);
```

---

## 📌 4. Upsert Operations

### 🔹 `upsert: true` (Insert if Not Found)
```js
const result = await db.collection("users").updateOne(
  { name: "Jane" },
  { $set: { age: 25 } },
  { upsert: true }
);
console.log(result);
```

---

## 📌 5. Date Operators

### 🔹 `$currentDate` (Set Field to Current Date)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $currentDate: { lastLogin: true } }
);
console.log(result);
```

---

## 📌 6. Bitwise Operators

### 🔹 `$bit` (Bitwise Operations on Integer Fields)
```js
const result = await db.collection("users").updateOne(
  { name: "John" },
  { $bit: { permissions: { or: 5 } } }
);
console.log(result);
```

