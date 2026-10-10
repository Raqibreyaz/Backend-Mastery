# 09 · Production Debugging and Mistakes

[← Previous: The Hidden COUNT(*) Problem](./08-The-Hidden-Count-Problem.md) | [Index](./README.md) | [Next: Self-Test and Key Takeaways →](./10-Self-Test-and-Key-Takeaways.md)

---

## The Reality Gap: Development vs. Production

```text
Development Environment:
  50 rows · localhost DB · 0.05 ms round trips  ──> Everything runs under 5 ms

Production Environment:
  1,000,000 rows · Cloud VPC · 2 ms round trips ──> Severe endpoint degradation
```

Performance testing on small development seed data is fundamentally misleading. Bottlenecks that are completely invisible at 50 rows become catastrophic when tables grow to 100,000 or 1,000,000 rows under concurrent traffic.

---

## Database Failure Modes Matrix

| Failure Mode | What Goes Wrong Internally | Typical Symptom | Recommended Fix |
|---|---|---|---|
| **Missing Index** | Engine performs full table scan on every request | Single query gets progressively slower as rows increase | Add targeted B-Tree index |
| **Bad Composite Order** | Query violates the leftmost-prefix rule | Query planner ignores the index | Reorder columns: equality columns first, then range/sort |
| **Function on Column** | Column wrapped in expression (`lower(email)`) | Index ignored; engine falls back to `Seq Scan` | Create expression index or normalize on write |
| **Leading Wildcard `LIKE`** | No fixed starting prefix (`LIKE '%term'`) | Engine cannot traverse B+Tree | Use trigram/GIN index or full-text engine |
| **The N+1 Problem** | Repeated network round trips inside loop | Endpoint time scales linearly with items returned | Use SQL `JOIN` or batch fetch (`ANY($1)`) |
| **Expensive `COUNT(*)`** | Entire filtered set counted on every page call | Pagination endpoints consume high database CPU | Replace with `hasNextPage` or cursor pagination |

---

## 7-Step Systematic Debugging Workflow

When an endpoint slows down in production, **never guess or immediately rewrite code**. Follow this systematic protocol:

```text
  1. Count Queries
         │
         ▼ (Expected 2, saw 51? ──> N+1 query problem)
  2. Run EXPLAIN ANALYZE
         │
         ▼ (Inspect actual execution times and buffer hits)
  3. Look for Unintended Seq Scans on large tables
         │
         ▼ (Found Seq Scan on 1M rows? ──> Index issue)
  4. Verify Composite Index Column Order
         │
         ▼ (Check leftmost-prefix matching)
  5. Check for Functions Wrapping Indexed Columns
         │
         ▼ (e.g., lower(), DATE(), typecasting)
  6. Audit ORM Relationship Loading
         │
         ▼ (Check loops touching lazy-loaded properties)
  7. Audit Pagination Count Queries
         └─> (Verify if COUNT(*) is saturating database workers)
```

---

## 11 Common Developer Mistakes

1. **Believing "Sequential Scan is always bad":** On tables with ~200 rows, reading sequential pages in RAM is faster than navigating index trees and fetching heap rows.
2. **Believing "More indexes always speed things up":** Every additional index slows down `INSERT`, `UPDATE`, and `DELETE` operations and wastes memory.
3. **Assuming an index exists means it is used:** The query optimizer may choose not to use an index if cardinality is poor or table statistics are stale. Always verify with `EXPLAIN ANALYZE`.
4. **Ignoring composite index column order:** Putting a range column before an equality column breaks index tree navigation for subsequent columns.
5. **Wrapping indexed columns in functions:** Writing `WHERE lower(email) = ...` or `WHERE DATE(created_at) = ...` defeats plain B-Tree indexes.
6. **Trusting ORM property access to be free:** Accessing `post.author` inside a template or loop often triggers synchronous background network calls.
7. **Fetching related records inside a loop:** Doing `await fetchAuthor(id)` inside `posts.map(...)` or a `for` loop is an instant N+1 bug.
8. **Forgetting to deduplicate IDs in batch fetches:** Passing duplicate foreign keys to `IN (...)` wastes database work and memory.
9. **Assuming batch results return in the exact order requested:** Databases return bulk query results in arbitrary order. Always build an ID-to-object `Map`.
10. **Running `COUNT(*)` automatically:** Paying the heavy price of counting millions of rows just because a pagination template had a `total` field.
11. **Assuming an index provides $O(1)$ performance:** B-Trees provide $O(\log N)$ traversal; retrieving large quantities of matching rows still takes measurable time and I/O.

---

## The Unified Performance Mental Model

```text
                           DATABASE PERFORMANCE
                     ┌──────────────┴──────────────┐
                Data Scanned                Queries Executed
                     │                             │
                  Indexes                         N+1
                     │                             │
              Find rows faster             Fewer round trips
              (Minimize disk I/O)         (Minimize network latency)
                     │                             │
        ┌────────────┴────────────┐                │
   Proper Order     Selective /   │                ▼
   (Leftmost)       Partial       │          Batch Fetching
                                  ▼          (ANY($1) / IN)
                           EXPLAIN ANALYZE
```

---

[← Previous: The Hidden COUNT(*) Problem](./08-The-Hidden-Count-Problem.md) | [Index](./README.md) | [Next: Self-Test and Key Takeaways →](./10-Self-Test-and-Key-Takeaways.md)
