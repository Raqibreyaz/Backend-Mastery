# 05 · Index Pitfalls and Query Plans

[← Previous: Composite Indexes and Leftmost Prefix](./04-Composite-Indexes-and-Leftmost-Prefix.md) | [Index](./README.md) | [Next: The N+1 Problem →](./06-The-N-plus-1-Problem.md)

---

## Things That Defeat an Index

Just because an index exists on a column does not mean your query will use it. Several common coding patterns completely prevent the database optimizer from utilizing an index.

---

### 1. Functions Wrapped Around Indexed Columns

```sql
-- Plain index exists on: email
SELECT * FROM users WHERE lower(email) = 'alice@example.com';
```

**Why it fails:**  
The index stores the raw column values (`Alice@Example.com`), not the lowercased transformation. The database engine cannot guess the output of an arbitrary function without evaluating it row-by-row across the entire table.

#### The Two Solutions:

1. **Expression (Functional) Index:**
   ```sql
   CREATE INDEX idx_users_lower_email ON users(lower(email));
   ```
   Now the index stores the evaluated values of `lower(email)`.

2. **Normalize on Write (Application-Level):**  
   Always lowercase strings before persisting them to the database. Then query the unmodified column directly:
   ```sql
   SELECT * FROM users WHERE email = 'alice@example.com';
   ```

---

### 2. Leading Wildcards in `LIKE` Queries

```sql
-- Index exists on: username

-- Uses index:
SELECT * FROM users WHERE username LIKE 'alice%';

-- CANNOT use plain B-Tree index (falls back to Seq Scan):
SELECT * FROM users WHERE username LIKE '%alice';
```

* **Trailing wildcard (`alice%`):** Has a fixed prefix. The B+Tree navigates down to the entry `"alice"` and scans sequentially until keys no longer match `"alice"`.
* **Leading wildcard (`%alice`):** Has no fixed starting point. The entry could be `"superalice"`, `"bob_alice"`, or `"123alice"`, which are scattered randomly across every node of the B+Tree.
* **Alternative:** For substring or full-text searches, use specialized inverted indexes such as PostgreSQL **GIN (trigram) indexes** (`pg_trgm`) or dedicated search engines (Elasticsearch, RedisSearch).

---

### 3. Cardinality and Selectivity

* **Cardinality:** The number of unique values in a column.
  - High cardinality: `email`, `user_id`, `uuid` (nearly every row is unique). Excellent for indexes.
  - Low cardinality: `gender`, `is_active`, `boolean_flag` (only 2–3 distinct values).
* **Selectivity:** The fraction of table rows returned by a query.
  - If a column has low cardinality and a query matches 80% of rows (e.g., `is_active = true`), the optimizer skips the index and executes a `Seq Scan`.
  - **Exception:** If a value is rare (e.g., `is_banned = true` matches only 0.05% of rows), an index or partial index will be heavily favored and extremely fast.

---

### 4. Indexes Are Not $O(1)$

A B-Tree lookup is $O(\log N)$, not constant time $O(1)$. Furthermore, once matching index entries are identified, the database still has to fetch the actual rows from disk. If a query matches 500,000 rows, returning that data is slow regardless of whether an index was present.

---

## Comparison: Full Table Scan vs. B-Tree vs. Hash Index

| Feature | Full Table Scan (`Seq Scan`) | B-Tree / B+Tree Index | Hash Index |
|---|---|---|---|
| **Lookup Mechanism** | Inspect all pages sequentially | Navigate balanced hierarchical tree | Hash key to bucket |
| **Time Complexity** | $O(N)$ | $O(\log N)$ | Average $O(1)$ |
| **Equality (`=`)** | Yes (slow) | Yes (fast) | Yes (fastest) |
| **Range Queries (`<`, `>`, `BETWEEN`)** | Yes (scans all rows) | **Well suited** | **Not supported** |
| **Prefix Matching (`LIKE 'a%'`)** | Yes | **Supported** | **Not supported** |
| **Ordered Retrieval (`ORDER BY`)** | Requires explicit memory sort | **Pre-sorted by default** | No order |
| **Storage / Write Penalty** | None | Yes | Yes |

---

## Don't Guess: Read the Query Plan with `EXPLAIN ANALYZE`

Never guess whether your query is using an index. Ask the database engine directly:

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'alice@example.com';
```

### Understanding the Output

* **`EXPLAIN`:** Shows the execution plan chosen by the query optimizer based on statistical heuristics.
* **`EXPLAIN ANALYZE`:** Actually executes the query in the database and shows **what really happened**:
  - Actual elapsed runtime in milliseconds per step.
  - Number of rows processed vs. estimated.
  - Plan node used: `Index Scan`, `Index Only Scan`, `Bitmap Index Scan`, or `Seq Scan`.

```text
                                QUERY PLAN (Example)
Index Scan using idx_users_email on users  (cost=0.42..8.44 rows=1 width=128) 
                                           (actual time=0.031..0.032 rows=1 loops=1)
  Index Cond: ((email)::text = 'alice@example.com'::text)
Planning Time: 0.114 ms
Execution Time: 0.048 ms
```

> [!CAUTION]
> **Key Signal:** If you see a `Seq Scan` on a table with 1,000,000+ rows where you expected an `Index Scan`, investigate immediately. Look for column type mismatches, functions wrapping columns, or composite index ordering errors.

---

[← Previous: Composite Indexes and Leftmost Prefix](./04-Composite-Indexes-and-Leftmost-Prefix.md) | [Index](./README.md) | [Next: The N+1 Problem →](./06-The-N-plus-1-Problem.md)
