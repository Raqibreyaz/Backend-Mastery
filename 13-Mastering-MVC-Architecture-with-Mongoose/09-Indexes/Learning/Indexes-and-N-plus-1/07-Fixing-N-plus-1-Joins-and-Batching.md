# 07 · Fixing N+1: Joins and Batching

[← Previous: The N+1 Problem](./06-The-N-plus-1-Problem.md) | [Index](./README.md) | [Next: The Hidden COUNT(*) Problem →](./08-The-Hidden-Count-Problem.md)

---

## Two Ways to Eliminate N+1 Queries

To eliminate N+1 queries, we must replace repetitive per-row queries with a strategy that bounds the number of network round trips to a small constant:

```text
       FIX 1: RELATIONAL JOIN                  FIX 2: BATCH FETCHING
       
     App                   DB                App                   DB
      │                     │                 │                     │
      │ ── 1 JOIN Query ──> │                 │ ── 1. Fetch Posts ─>│
      │ <─ Merged Results ─ │                 │ <─ Returns Posts ── │
      │                     │                 │ ── 2. Batch Users ─>│
      │                     │                 │ <─ Returns Users ── │
   1 Round Trip (Duplicated Data)          2 Round Trips (Zero Duplication)
```

---

## Fix 1: Relational `JOIN`

Instead of querying users individually, instruct the database engine to perform the relational stitching:

```sql
SELECT posts.*, users.name AS author_name, users.avatar_url
FROM posts
JOIN users ON users.id = posts.author_id;
```

### Advantages:
* **Exactly 1 Query:** One network round trip handles the entire dataset.
* **Database Optimization:** Relational engines (PostgreSQL, MySQL) execute Hash Joins or Merge Joins with extreme efficiency.

### Downside: The Join Multiplication Trap
When joining one-to-many relationships (e.g., Posts to Comments):
* If 1 post has 100 comments, the database produces 100 rows containing the complete post body and metadata repeated 100 times.
* This can dramatically bloat the network payload size between database and application.

---

## Fix 2: Application-Level Batch Fetching

Instead of issuing $N$ queries inside a loop, collect all distinct IDs and issue a single bulk query:

```sql
-- PostgreSQL array parameter:
SELECT * FROM users WHERE id = ANY($1);  -- $1 = [10, 20, 30]

-- Standard SQL IN clause:
SELECT * FROM users WHERE id IN (10, 20, 30);
```

### Result:
* Query 1: Fetch posts ($1$ query).
* Query 2: Fetch all relevant unique authors in bulk ($1$ query).
* **Total:** Exactly **2 queries**, whether there are 10 posts or 10,000 posts.

---

## Batch Fetch Implementation: The `attachAuthors` Pattern

Here is the battle-tested pattern for in-memory relational stitching (the core design behind tools like Facebook's DataLoader):

```javascript
/**
 * Attaches authors to an array of posts without causing N+1 queries.
 * @param {Array} posts - Array of post objects with authorId
 * @param {Function} fetchMany - Bulk fetch function: (ids: number[]) => Author[]
 * @returns {Array} Array of posts with attached author objects
 */
function attachAuthors(posts, fetchMany) {
  // 1. Deduplicate author IDs
  const ids = [...new Set(posts.map(p => p.authorId))];

  // 2. Fetch all required authors in ONE call
  const authors = fetchMany(ids);

  // 3. Build an ID-to-object lookup Map
  const byId = new Map(authors.map(a => [a.id, a]));

  // 4. Map over the original posts to preserve array order
  return posts.map(p => ({
    ...p,
    author: byId.get(p.authorId) || null
  }));
}
```

### Architectural Rationale: Why It Is Built This Way

1. **Deduplicate with `new Set`:** If 50 posts are written by only 3 distinct authors, we request 3 authors from the database—not 50.
2. **Use a `Map`, never array zipping:** Databases do not guarantee returning rows in the exact order requested by an `IN` or `ANY` clause. An ID-keyed `Map` guarantees $O(1)$ lookup time regardless of returned row ordering.
3. **Map over the original `posts` array:** Preserves the user-facing sort order and pagination of the original posts list.

---

## Comparison: `JOIN` vs. Batch Fetching

| Characteristic | SQL `JOIN` | Batch Fetching (`ANY` / `IN`) |
|---|---|---|
| **Round Trips** | **1** | **2** |
| **Network Payload** | Can duplicate parent rows | Clean, normalized payloads |
| **Cross-Database Support** | Requires same DB instance | Works across different databases/microservices |
| **Complexity** | Simple SQL query | Requires in-memory map stitching |
| **Best For** | 1-to-1 or Many-to-1 relationships | 1-to-Many relationships or distributed data |

---

[← Previous: The N+1 Problem](./06-The-N-plus-1-Problem.md) | [Index](./README.md) | [Next: The Hidden COUNT(*) Problem →](./08-The-Hidden-Count-Problem.md)
