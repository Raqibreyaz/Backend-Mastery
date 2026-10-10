# 03 · Index Cost and Sequential Scans

[← Previous: Database Index Internals](./02-Database-Index-Internals.md) | [Index](./README.md) | [Next: Composite Indexes and Leftmost Prefix →](./04-Composite-Indexes-and-Leftmost-Prefix.md)

---

## How Many Entries Does an Index Hold?

In a conventional non-unique index, there is roughly **one index entry per table row**. If two rows share the same email or category, two separate entries are stored in the index tree pointing to their respective row locators.

### Handling `NULL` Values

* In **PostgreSQL** and **MySQL (InnoDB)** B-Trees, `NULL` values are indexed. Queries like `WHERE email IS NULL` can utilize the index.
* In some database engines (like Oracle with standard B-Trees), rows with completely `NULL` indexed columns are omitted from the index unless part of a composite key.

---

## Partial (Filtered) Indexes

A **partial index** indexes only rows that satisfy a specific `WHERE` predicate.

```sql
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
```

### The Power of Subset Indexing

Imagine an e-commerce platform with **1,000,000 user accounts**, where only **1,000 users** are currently marked as `active`:

| Property | Full Index (`email`) | Partial Index (`email` WHERE `status = 'active'`) |
|---|---|---|
| **Entries Indexed** | ~1,000,000 entries | ~1,000 entries |
| **Disk Footprint** | Tens of Megabytes | A few Kilobytes |
| **Maintenance on Inactive Writes** | Every insert/update updates the index | **Zero** overhead for inactive users |
| **Lookup Speed** | Shallow tree | Tiny tree cached entirely in L1/L2 CPU cache |

Any query that includes `WHERE status = 'active' AND email = $1` can use this tiny, hyper-fast index.

---

## Sequential Scans Are Not Always Bad

A common misconception among junior backend engineers is:

> *"I see a `Seq Scan` in my `EXPLAIN` output—this must be a bug or an error!"*

**This is false.** Sequential table scans are often the optimal choice for the database planner.

### When a Sequential Scan Beats an Index Scan

1. **Small Tables (~200 to 1,000 rows):**  
   Reading all sequential pages of a small table in one contiguous read is faster than:
   - Traversing the index tree,
   - Finding the pointer,
   - Making random I/O seeks back into the table heap.
2. **Low Selectivity (Fetching a large fraction of the table):**  
   If a query requests 50% or 80% of all rows in a table (e.g., `WHERE created_at > '1970-01-01'`), doing random I/O seeks for 80% of rows via an index is vastly slower than reading the whole table sequentially from start to finish.

### The Guiding Question

The right question is never *"Is it doing a sequential scan?"*  
The right question is:

> **Is the chosen execution plan expensive for this specific dataset size and query frequency?**

An index existing does not force the optimizer to use it. The query planner calculates mathematical cost estimates and picks the cheapest path.

---

## The True Cost of Indexes: Write Amplification

Indexes are not free speed boosters. Every index imposes a concrete performance tax:

```text
More indexes = Faster specific reads + Slower all writes + Higher disk/memory usage
```

### The Three Costs

1. **Storage Overhead:** Indexes consume significant disk space and, more importantly, RAM (buffer cache).
2. **Write Amplification on `INSERT`:** Inserting a single row requires writing the row to the table heap, plus updating **every single index** defined on that table.
3. **Overhead on `UPDATE` & `DELETE`:** Modifying an indexed column or deleting a row requires rebalancing B+Tree pages and maintaining pointers.

### High-Throughput Example

Consider an events or audit table receiving **10,000 inserts per second**:

* **With 1 index (Primary Key):** The database handles 10,000 heap writes + 10,000 index writes = **20,000 operations/sec**.
* **With 5 secondary indexes:** The database handles 10,000 heap writes + 50,000 index writes = **60,000 operations/sec**!

This write amplification can saturate disk write bandwidth, trigger frequent page splits, and slow down your application writes.

> [!WARNING]
> **Unused indexes are pure cost.** They consume RAM, take up disk, and slow down every insert and update, while providing zero benefit. Never create speculative indexes "just in case." Only index query patterns proven by application traffic.

---

[← Previous: Database Index Internals](./02-Database-Index-Internals.md) | [Index](./README.md) | [Next: Composite Indexes and Leftmost Prefix →](./04-Composite-Indexes-and-Leftmost-Prefix.md)
