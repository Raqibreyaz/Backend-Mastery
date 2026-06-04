# MongoDB Query and Projection Operators

This document covers the most commonly used **Query and Projection Operators** in MongoDB with **Node.js examples**.

---

## 📌 1. Query Operators

Query operators are used to filter documents based on specific conditions.

### 🔹 `$eq` (Equal)

Finds documents where a field is equal to a specified value.

```js
const result = await db
  .collection("users")
  .find({ age: { $eq: 25 } })
  .toArray();
console.log(result);
```

### 🔹 `$ne` (Not Equal)

Finds documents where a field is **not** equal to a specified value.

```js
const result = await db
  .collection("users")
  .find({ status: { $ne: "inactive" } })
  .toArray();
console.log(result);
```

### 🔹 `$gt`, `$gte`, `$lt`, `$lte` (Greater Than, Less Than)

```js
const result = await db
  .collection("users")
  .find({ age: { $gt: 18 } })
  .toArray();
console.log(result);
```

### 🔹 `$in`, `$nin` (Match any of the specified values / Not in)

```js
const result = await db
  .collection("users")
  .find({ country: { $in: ["India", "USA"] } })
  .toArray();
console.log(result);
```

### 🔹 `$exists` (Check if a field exists)

```js
const result = await db
  .collection("users")
  .find({ phone: { $exists: true } })
  .toArray();
console.log(result);
```

### 🔹 `$regex` (Pattern Matching)

```js
const result = await db
  .collection("users")
  .find({ name: { $regex: /^A/i } })
  .toArray();
console.log(result);
```

### 🔹 `$or`, `$and`, `$not`, `$nor` (Logical Operators)

```js
const result = await db
  .collection("users")
  .find({
    $or: [{ age: { $gt: 30 } }, { status: "active" }],
  })
  .toArray();
console.log(result);
```

---

## 📌 2. Projection Operators

Projection operators control which fields are returned in the result.

### 🔹 Inclusion (`1`) and Exclusion (`0`)

```js
const result = await db
  .collection("users")
  .find({}, { projection: { name: 1, age: 1, _id: 0 } })
  .toArray();
console.log(result);
```

### 🔹 `$elemMatch` (Match elements in an array)

```js
const result = await db
  .collection("users")
  .find({
    hobbies: { $elemMatch: { type: "sports" } },
  })
  .toArray();
console.log(result);
```

### 🔹 `$slice` (Limit array fields in results)

```js
const result = await db
  .collection("users")
  .find({}, { projection: { posts: { $slice: 2 } } })
  .toArray();
console.log(result);
```

---

## 📌 3. Array Query Operators

### 🔹 `$all` (Match all values in an array)

```js
const result = await db
  .collection("users")
  .find({ skills: { $all: ["MongoDB", "Node.js"] } })
  .toArray();
console.log(result);
```

### 🔹 `$size` (Find arrays with a specific number of elements)

```js
const result = await db
  .collection("users")
  .find({ skills: { $size: 3 } })
  .toArray();
console.log(result);
```

---

## 📌 4. Evaluation Operators

### 🔹 `$expr` (Compare two fields)

```js
const result = await db
  .collection("users")
  .find({
    $expr: { $gt: ["$credits", "$debits"] },
  })
  .toArray();
console.log(result);
```

### 🔹 `$mod` (Modulo operation)

```js
const result = await db
  .collection("users")
  .find({ age: { $mod: [2, 0] } })
  .toArray();
console.log(result);
```