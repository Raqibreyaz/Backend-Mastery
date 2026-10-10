# 08 · The Hidden COUNT(*) Problem

[← Previous: Fixing N+1: Joins and Batching](./07-Fixing-N-plus-1-Joins-and-Batching.md) | [Index](./README.md) | [Next: Production Debugging and Mistakes →](./09-Production-Debugging-and-Mistakes.md)

---

## The Pagination Anti-Pattern

A standard paginated list endpoint like `GET /posts?page=3` almost always returns a response payload formatted like this:

```json
{
  "page": 3,
  "pageSize": 20,
  "total": 472190,
  "data": [ ...20 items... ]
}
```

To produce this response, the backend application silently executes **two separate queries**:

```sql
-- Query 1: The Page Query (Retrieves 20 items)
SELECT * FROM posts 
WHERE tenant_id = 42 
ORDER BY created_at DESC 
LIMIT 20 OFFSET 40;

-- Query 2: The Total Count Query
SELECT COUNT(*) FROM posts 
WHERE tenant_id = 42;
```

---

## Why `COUNT(*)` Burns Database CPU at Scale

While Query 1 finishes in 2 ms using an index on `(tenant_id, created_at)`, Query 2 can take **hundreds of milliseconds or several seconds**:

```text
Query 1 (Fetch page):  Reads 20 index entries ──> 2 ms
Query 2 (COUNT(*)):    Scans 472,190 rows across table/index ──> 650 ms
```

1. **Counting Requires Traversing the Entire Set:** In multi-version concurrency control (MVCC) engines like PostgreSQL, `COUNT(*)` cannot simply read an internal counter because visibility depends on the current transaction's snapshot. The database must check visibility across the entire filtered set.
2. **Disproportionate Resource Burn:** The query returning the tiny 20-row user slice costs almost nothing; the query returning the single number `472190` saturates database CPU cores.

---

## The Critical Engineering Question

Before writing another `COUNT(*)` query, ask:

> **Does the user interface genuinely require the exact total count down to the single digit?**

In modern web and mobile applications (social feeds, transaction histories, search listings), users rarely care if there are 472,190 results or 450,000 results. Most users never navigate past page 3.

---

## Modern Scalable Alternatives

### 1. The `LIMIT + 1` Pattern (`hasNextPage`)

Instead of computing the full count, fetch **one extra row** beyond your requested page size:

```javascript
// User requested pageSize = 20
const limit = 20;
const results = await db.query(
  'SELECT * FROM posts WHERE tenant_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3',
  [tenantId, limit + 1, offset]
);

const hasNextPage = results.length > limit;
const pageData = hasNextPage ? results.slice(0, limit) : results;

return {
  data: pageData,
  hasNextPage
};
```

* **Cost:** Exactly zero `COUNT(*)` queries!
* **UX:** Renders simple "Next / Previous" buttons or infinite scrolling.

---

### 2. Keyset (Cursor-Based) Pagination

Avoid both `COUNT(*)` and large `OFFSET` values by filtering on a unique sequential key (like `id` or `created_at`):

```sql
SELECT * FROM posts 
WHERE tenant_id = 42 AND id < 184920
ORDER BY id DESC 
LIMIT 20;
```

* Executes in constant $O(\log N)$ time regardless of whether you are on page 1 or page 10,000.
* Immune to data drift (rows being inserted while users paginate).

---

### 3. Estimated Row Counts

For internal admin portals needing ballpark numbers, query system catalog statistics:

```sql
-- PostgreSQL fast estimate:
SELECT reltuples::bigint AS estimate 
FROM pg_class 
WHERE relname = 'posts';
```

Executes in **less than 1 ms** by reading table statistics collected by the database vacuum daemon.

---

[← Previous: Fixing N+1: Joins and Batching](./07-Fixing-N-plus-1-Joins-and-Batching.md) | [Index](./README.md) | [Next: Production Debugging and Mistakes →](./09-Production-Debugging-and-Mistakes.md)
