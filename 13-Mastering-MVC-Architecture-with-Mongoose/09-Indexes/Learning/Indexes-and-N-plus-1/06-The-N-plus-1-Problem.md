# 06 · The N+1 Problem

[← Previous: Index Pitfalls and Query Plans](./05-Index-Pitfalls-and-Query-Plans.md) | [Index](./README.md) | [Next: Fixing N+1: Joins and Batching →](./07-Fixing-N-plus-1-Joins-and-Batching.md)

---

## What the N+1 Problem Is

The **N+1 query problem** occurs when an application executes **1 query** to fetch a list of parent records, followed by **N additional queries** to fetch related child records for each individual parent item:

```javascript
// 1 query to fetch posts
const posts = await db.query('SELECT * FROM posts LIMIT 50');

// N queries to fetch author for each post (N = 50)
for (const post of posts) {
  post.author = await db.query('SELECT * FROM users WHERE id = $1', [post.authorId]);
}
```

### The Math:
$$\text{Total Queries} = 1 + N = 1 + 50 = 51 \text{ queries}$$

Where $N$ is the number of parent records retrieved. If your page size increases to 500 posts, the endpoint executes **501 database queries** for a single HTTP request!

---

## Why N+1 Hides in Development

During local development, this flaw almost never shows up as a noticeable performance issue:

```text
Local Development:
  App Server ──── localhost (0.05 ms) ────> Local DB
  51 queries × 0.05 ms = 2.5 ms  ───> Feels instantaneous!

Production Environment:
  App Server (AWS EC2) ──── VPC Network (1.5 ms) ────> Database (AWS RDS)
  51 queries × 1.5 ms = 76.5 ms of pure idle network waiting!
```

* **Network Latency:** Even in the same AWS data center, cross-instance round trips cost between 0.5 ms and 2 ms.
* **Connection Pool Saturation:** Each query acquires a database connection from the pool. Making 50 queries sequentially ties up connections, blocks other concurrent HTTP requests, and degrades overall server throughput.
* **The Root Cause:** N+1 is fundamentally about **repeated network round trips caused by application logic loops**, not just excessive SQL complexity.

---

## ORMs and the Lazy-Loading Trap

Object-Relational Mappers (ORMs) and ODMs (e.g., Prisma, TypeORM, Hibernate, Sequelize) make the N+1 problem remarkably easy to introduce unintentionally.

### The Illusion of Free Property Access

In an ORM with **lazy loading enabled**, related records are loaded transparently on demand the moment a property is read:

```javascript
// Looks like innocent property reading:
for (const post of posts) {
  console.log(post.author.name); 
  // Under the hood: triggers a silent `SELECT * FROM users WHERE id = ...`
}
```

Because the code looks like normal synchronous JavaScript object access, developers often fail to realize they are hammering the database with dozens or hundreds of independent network queries.

### Eager vs. Lazy Loading

| Strategy | Behavior | Risk |
|---|---|---|
| **Lazy Loading** | Related entities are fetched only when accessed in code. | Extremely prone to silent N+1 queries inside loops and templates. |
| **Eager Loading** | Related entities are fetched up-front alongside the parent query. | Can fetch unnecessary data if relationships are not needed for that endpoint. |

> [!IMPORTANT]
> Always verify whether relationships in your data layer are loaded **lazily** or **eagerly**. In production API endpoints, prefer explicit eager loading or batch loading strategies.

---

[← Previous: Index Pitfalls and Query Plans](./05-Index-Pitfalls-and-Query-Plans.md) | [Index](./README.md) | [Next: Fixing N+1: Joins and Batching →](./07-Fixing-N-plus-1-Joins-and-Batching.md)
