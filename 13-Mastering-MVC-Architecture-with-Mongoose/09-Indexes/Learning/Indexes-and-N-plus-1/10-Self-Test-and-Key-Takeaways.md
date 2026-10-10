# 10 · Self-Test and Key Takeaways

[← Previous: Production Debugging and Mistakes](./09-Production-Debugging-and-Mistakes.md) | [Index](./README.md)

---

## 🧪 Self-Test Questions & Answers

Use these questions to verify your mastery or prepare for senior backend engineering system design interviews.

<details>
<summary><strong>1. Your endpoint is fast locally but slow in production. What are the two main suspects?</strong></summary>

1. **Missing or improper indexes:** Causing the production database to scan millions of rows instead of hundreds.
2. **The N+1 query problem:** Causing dozens or hundreds of sequential network round trips between the app server and production database.
</details>

<details>
<summary><strong>2. Why can a sequential scan be correct on a 200-row table?</strong></summary>

Reading 200 contiguous rows from memory/disk in a single sequential sweep is faster than the two-step overhead of traversing an index B-Tree, reading pointers, and performing random I/O seeks into the table heap.
</details>

<details>
<summary><strong>3. What does an index provide, and what does a typical index entry contain?</strong></summary>

An index provides a secondary lookup structure that bypasses full table scans. A typical index entry contains:
$$\text{Index Entry} = \text{Indexed Column Value} + \text{Row Locator (Tuple ID / Pointer)}$$
</details>

<details>
<summary><strong>4. Why do indexes make writes more expensive, and what happens with ten indexes?</strong></summary>

Every `INSERT`, `UPDATE`, or `DELETE` must physically modify the table heap **and** update every index tree defined on that table. With 10 indexes, a single row insertion requires writing to the table plus 10 independent index page modifications, multiplying write I/O by 11×.
</details>

<details>
<summary><strong>5. With INDEX(user_id, created_at), which query gets little or no benefit?</strong></summary>

* `WHERE user_id = $1` ➔ **Good** (matches leftmost prefix).
* `WHERE user_id = $1 ORDER BY created_at` ➔ **Good** (matches prefix and is pre-sorted).
* `WHERE created_at > $1` ➔ **Little or no benefit**, because it skips the leftmost column (`user_id`).
</details>

<details>
<summary><strong>6. Why doesn't WHERE lower(email) = $1 use INDEX(email)? Name two fixes.</strong></summary>

The index stores original, unmodified values (e.g. `Alice@Example.com`), not the lowercased strings.  
**Fixes:**
1. Create an expression index: `CREATE INDEX idx_users_lower_email ON users(lower(email));`
2. Normalize on write: Lowercase emails in application code before saving, and query `WHERE email = $1`.
</details>

<details>
<summary><strong>7. Why does LIKE '%alice' behave differently from LIKE 'alice%'?</strong></summary>

`LIKE 'alice%'` has a fixed prefix, allowing the B+Tree to navigate directly to the `"alice"` node and scan forward. `LIKE '%alice'` has no fixed starting point; matches are scattered throughout the tree, forcing a full table scan.
</details>

<details>
<summary><strong>8. Why are B+Tree linked leaves useful for range queries?</strong></summary>

All leaf nodes in a B+Tree are joined in a doubly linked list. Once the engine locates the starting key (e.g. `age = 20`) via tree traversal, it traverses horizontally through neighboring leaves to find subsequent keys without re-navigating from the root.
</details>

<details>
<summary><strong>9. What is high vs. low cardinality, and why isn't low cardinality automatically useless?</strong></summary>

* **High cardinality:** Many distinct values (e.g. `email`, `user_id`).
* **Low cardinality:** Few distinct values (e.g. boolean flags, `status`).  
Low cardinality is not useless if a value is **highly selective**—such as `WHERE is_banned = true` when only 0.01% of rows are banned, or when used in partial indexes.
</details>

<details>
<summary><strong>10. With 1M users and 1,000 active, how could a partial index help?</strong></summary>

Creating `CREATE INDEX idx_active_users ON users(email) WHERE status = 'active'` indexes only the 1,000 active rows. It uses a tiny amount of disk/RAM and adds zero write overhead when inserting or updating the 999,000 inactive users.
</details>

<details>
<summary><strong>11. Why might the optimizer choose a sequential scan even when an index exists?</strong></summary>

If the query is expected to return a large percentage of the table (e.g., >20–30%), random I/O seeks via index pointers cost more than a sequential sweep of all contiguous table pages.
</details>

<details>
<summary><strong>12. What does EXPLAIN ANALYZE help you discover?</strong></summary>

It executes the query and shows what the database **actually did**: the real execution time per step, row counts processed, memory used, and whether it performed a `Seq Scan`, `Index Scan`, or `Bitmap Scan`.
</details>

<details>
<summary><strong>13. You fetch 50 posts then query each author. How many queries run?</strong></summary>

$1 + 50 = \mathbf{51}$ queries ($1$ initial query + $50$ child queries).
</details>

<details>
<summary><strong>14. Why can N+1 be invisible on a dev machine?</strong></summary>

Dev runs on `localhost` with loopback latency under $0.05\text{ ms}$, making 50 queries finish in $\approx 2.5\text{ ms}$. In production over a network ($1\text{–}2\text{ ms}$ round trip), 50 queries add $50\text{–}100\text{ ms}$ of pure idle waiting.
</details>

<details>
<summary><strong>15. Name two ways to eliminate N+1, and why batch fetching may beat a join when the joined side is large.</strong></summary>

1. **SQL `JOIN`**
2. **Batch Fetching (`WHERE id = ANY($1)` / `IN (...)`)**  
Batch fetching beats a `JOIN` for one-to-many relations because a join duplicates the parent record across every matching child row, drastically inflating network payload size.
</details>

<details>
<summary><strong>16. Why can COUNT(*) be unexpectedly expensive on a paginated endpoint?</strong></summary>

Even if the page query fetches only 20 rows, `SELECT COUNT(*)` must check visibility and count every single row across the filtered dataset (potentially millions of rows), burning heavy database CPU.
</details>

---

## 📌 Key Takeaways

* **An index is a secondary lookup structure:** B-Trees provide $O(\log N)$ tree traversal and support equality, range, and ordered retrieval.
* **Sequential scans are not always bad:** On small tables (~200 rows) or large result sets, sequential reads are cheaper than random index lookups.
* **Indexes have real write costs:** Every index slows down `INSERT`, `UPDATE`, and `DELETE`. Unused indexes are pure waste.
* **Composite index order matters:** Always place equality columns first, followed by range or sort columns (`[Equality] -> [Range/Sort]`).
* **Avoid defeating indexes:** Never wrap indexed columns in arbitrary functions, and avoid leading wildcards in `LIKE` queries.
* **`EXPLAIN ANALYZE` is ground truth:** Never guess how a query runs. An unexpected `Seq Scan` on a large table is your primary diagnostic signal.
* **The N+1 problem is about round trips:** 1 query for the parent collection plus $N$ child queries adds massive network delay, often triggered silently by ORM lazy loading.
* **Fix N+1 with batching or joins:** Batch fetching using `WHERE id = ANY($1)` bounds round trips to 2, avoids parent row duplication, and easily stitches objects via an ID-keyed `Map`.
* **Rethink `COUNT(*)` in pagination:** Use `hasNextPage` (`LIMIT + 1`) or cursor pagination instead of forcing the database to count millions of rows.

---

## 🚀 What to Learn Next

1. **`EXPLAIN (ANALYZE, BUFFERS)` in Depth:** Inspecting shared buffer hits vs. disk reads.
2. **B+Tree Disk Page Internals:** Page headers, fill factors, and page split overhead.
3. **Clustered vs. Non-Clustered Indexes:** Storage layout differences between PostgreSQL (Heap) and MySQL InnoDB (Clustered PK).
4. **PostgreSQL Specialized Indexes:** GiST, GIN (Trigrams & Full-Text Search), and BRIN (Block Range Indexes for time-series).
5. **Cursor / Keyset Pagination:** Implementing high-performance cursor pagination in REST and GraphQL APIs.
6. **DataLoader Pattern:** How batching and per-request memoization work in production Node.js services.

---

[← Previous: Production Debugging and Mistakes](./09-Production-Debugging-and-Mistakes.md) | [Index](./README.md)
