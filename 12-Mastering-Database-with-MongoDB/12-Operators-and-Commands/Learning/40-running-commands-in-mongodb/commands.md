# MongoDB Commands Categorized

## 1. **Database Commands**

### 📌 General Database Operations

- **List Databases**
  ```js
  db.runCommand({ listDatabases: 1 });
  ```
- **List Available Commands**
  ```js
  db.runCommand({ listCommands: 1 });
  ```
- **Get Database Stats**
  ```js
  db.runCommand({ dbStats: 1 });
  ```
- **Drop Database**
  ```js
  db.runCommand({ dropDatabase: 1 });
  ```

---

## 2. **Collection Commands**

### 📌 Collection Management

- **Create Collection**
  ```js
  db.runCommand({ create: "myCollection" });
  ```
- **Drop Collection**
  ```js
  db.runCommand({ drop: "myCollection" });
  ```
- **List Collections**
  ```js
  db.runCommand({ listCollections: 1 });
  ```
- **Rename Collection**
  ```js
  db.runCommand({ renameCollection: "oldName", to: "newName" });
  ```
- **Validate Collection**
  ```js
  db.runCommand({ validate: "myCollection" });
  ```

---

## 3. **CRUD (Create, Read, Update, Delete) Commands**

### 📌 Insert Documents

- **Insert One or Multiple Documents**
  ```js
  db.runCommand({
    insert: "myCollection",
    documents: [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 22 },
    ],
  });
  ```

### 📌 Read Documents

- **Find Documents**
  ```js
  db.runCommand({
    find: "myCollection",
    filter: { age: { $gt: 18 } },
    projection: { _id: 0, name: 1, age: 1 },
    limit: 5,
  });
  ```

### 📌 Update Documents

- **Update One or Multiple Documents**
  ```js
  db.runCommand({
    update: "myCollection",
    updates: [{ q: { name: "Alice" }, u: { $set: { age: 35 } }, upsert: true }],
  });
  ```

### 📌 Delete Documents

- **Delete One or Multiple Documents**
  ```js
  db.runCommand({
    delete: "myCollection",
    deletes: [{ q: { age: { $lt: 25 } }, limit: 0 }],
  });
  ```

---

## 4. **Index Commands**

### 📌 Index Management

- **Create Index**
  ```js
  db.runCommand({
    createIndexes: "myCollection",
    indexes: [{ key: { name: 1 }, name: "name_index" }],
  });
  ```
- **List Indexes**
  ```js
  db.runCommand({ listIndexes: "myCollection" });
  ```
- **Drop Index**
  ```js
  db.runCommand({ dropIndexes: "myCollection", index: "name_index" });
  ```

---

## 5. **Replication Commands**

### 📌 Replica Set Status & Configuration

- **Get Replica Set Status**
  ```js
  db.runCommand({ replSetGetStatus: 1 });
  ```
- **Get Replica Set Configuration**
  ```js
  db.runCommand({ replSetGetConfig: 1 });
  ```
- **Step Down Primary Node**
  ```js
  db.runCommand({ replSetStepDown: 60 });
  ```

---

## 6. **Sharding Commands**

### 📌 Shard Management

- **Enable Sharding for a Database**
  ```js
  db.runCommand({ enableSharding: "myDatabase" });
  ```
- **Shard a Collection**
  ```js
  db.runCommand({
    shardCollection: "myDatabase.myCollection",
    key: { _id: 1 },
  });
  ```
- **Get Shard Status**
  ```js
  db.runCommand({ getShardMap: 1 });
  ```

---

## 7. **Server & Performance Monitoring Commands**

### 📌 Server Status & Diagnostics

- **Get Server Status**
  ```js
  db.runCommand({ serverStatus: 1 });
  ```
- **Get Host Information**
  ```js
  db.runCommand({ hostInfo: 1 });
  ```
- **Get Running Operations**
  ```js
  db.runCommand({ currentOp: 1 });
  ```
- **Kill Running Operation**
  ```js
  db.runCommand({ killOp: 1, op: <opid> });
  ```
- **Rotate Logs**
  ```js
  db.runCommand({ logRotate: 1 });
  ```

---

## 8. **Security & Access Control Commands**

### 📌 User & Role Management

- **Create User**
  ```js
  db.runCommand({
    createUser: "admin",
    pwd: "securepassword",
    roles: ["readWrite", "dbAdmin"],
  });
  ```
- **Drop User**
  ```js
  db.runCommand({ dropUser: "admin" });
  ```
- **List Users**
  ```js
  db.runCommand({ usersInfo: 1 });
  ```
- **Grant a Role to a User**
  ```js
  db.runCommand({ grantRolesToUser: "admin", roles: ["read"] });
  ```

---

## 9. **Logging & Debugging Commands**

### 📌 Logs & Configuration

- **Get Log Data**
  ```js
  db.runCommand({ getLog: "global" });
  ```
- **List Available Logs**
  ```js
  db.runCommand({ getLog: "startupWarnings" });
  ```
- **Get Server Parameters**
  ```js
  db.runCommand({ getParameter: "*" });
  ```

---

## 🎯 **Final Notes**

- The `db.runCommand()` method in **Mongo shell** and `db.command()` in **Node.js driver** work the same way.
- Some commands are **administrative** and require proper permissions.
- **For CRUD operations**, the standard `insertOne()`, `find()`, `updateOne()`, `deleteOne()` methods are more convenient.

This document categorizes all the essential MongoDB commands for managing databases, collections, and server operations.
