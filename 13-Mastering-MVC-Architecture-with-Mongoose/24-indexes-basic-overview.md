# MongoDB Indexes

## What Are Indexes?
Indexes in MongoDB are special data structures that store a small portion of the collection's data in an easy-to-traverse format. They improve the efficiency of queries by reducing the amount of data MongoDB needs to scan.

## Why Should We Create Indexes?
Indexes improve query performance by allowing MongoDB to:
- **Quickly locate documents** without scanning the entire collection.
- **Optimize sorting operations.**
- **Enforce unique constraints** (e.g., ensuring unique email addresses).
- **Support text search** and geospatial queries.
- **Improve performance for specific queries.**

Without indexes, MongoDB performs a **collection scan**, which is inefficient for large datasets.

## Creating Indexes in MongoDB Shell

#### a) Single Field Index
```js
db.users.createIndex({ name: 1 })
```

#### b) Compound Index
```js
db.users.createIndex({ age: 1, name: -1 })
```

#### c) Unique Index
```js
db.users.createIndex({ email: 1 }, { unique: true })
```

## View Existing Indexes
```js
db.users.getIndexes()
```

## Drop an Index
```js
db.users.dropIndex("name_1")
db.users.dropIndex({name:1})
```

## Notes
- Unique Index **fails** when field already has non-unique values across documents