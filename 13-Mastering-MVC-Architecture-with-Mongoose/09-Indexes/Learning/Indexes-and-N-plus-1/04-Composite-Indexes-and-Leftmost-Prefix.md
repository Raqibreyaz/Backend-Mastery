# 04 · Composite Indexes and Leftmost Prefix

[← Previous: Index Cost and Sequential Scans](./03-Index-Cost-and-Sequential-Scans.md) | [Index](./README.md) | [Next: Index Pitfalls and Query Plans →](./05-Index-Pitfalls-and-Query-Plans.md)

---

## What a Composite Index Is

A **composite (compound / multi-column) index** indexes two or more columns together within a single B+Tree structure:

```sql
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);
```

### Column Order Matters Completely

Creating an index on `(user_id, created_at)` is **not** equivalent to creating one on `(created_at, user_id)`. 

The columns are sorted hierarchical-first: all entries are sorted primarily by `user_id`, and only when `user_id` values are identical are they sorted by `created_at`.

---

## The Leftmost-Prefix Model

Think of a traditional paper telephone directory sorted by:

$$\text{(Last Name, First Name)}$$

* Searching for **"Smith"**: Trivial. You flip directly to the "S" section and find "Smith".
* Searching for **"Smith, John"**: Trivial. You find "Smith", then immediately locate "John".
* Searching for only **"John"** (without knowing the last name): The phonebook is almost useless! You must read through every single page from cover to cover because "John" is scattered randomly across every last name.

### Query Benefit Matrix for `(user_id, created_at)`

| Query Pattern | Uses `(user_id, created_at)`? | Efficiency & Rationale |
|---|:---:|---|
| `WHERE user_id = $1` | **YES** | High. Matches the leading leftmost column. |
| `WHERE user_id = $1 AND created_at > $2` | **YES** | High. Jumps to `user_id`, then traverses range of `created_at`. |
| `WHERE user_id = $1 ORDER BY created_at DESC` | **YES** | Maximum. Traverses to `user_id`; rows are **already pre-sorted** in the index leaf nodes. Eliminates in-memory sorting. |
| `WHERE created_at > $1` | **NO** (or poor) | Skips the leftmost prefix. The engine cannot navigate the tree directly without inspecting all user groups. |

---

## The Golden Rule of Thumb: Equality First, Then Range/Sort

When designing composite indexes for multi-clause queries:

$$\text{Index Order: } [\text{Equality Columns}] \longrightarrow [\text{Range or Sort Column}]$$

### Example

Consider this frequent application query:

```sql
SELECT * FROM posts 
WHERE tenant_id = 12 
  AND status = 'published' 
ORDER BY created_at DESC 
LIMIT 20;
```

#### Correct Index Design:
```sql
CREATE INDEX idx_posts_perf ON posts(tenant_id, status, created_at DESC);
```

#### Why this works:
1. `tenant_id` and `status` are exact equality matches (`=`), zooming the tree traversal down to the exact subset.
2. Within that exact subset, `created_at` provides pre-sorted ordering.
3. The database reads the first 20 index entries in reverse order and finishes without sorting a single byte in memory!

If you placed `created_at` first (`created_at, tenant_id, status`), any query filtering by a range of dates would prevent the database from efficiently navigating to specific `tenant_id` and `status` values in the tree.

---

## Candidates for Indexing

When analyzing your database schema, prioritize columns that appear in:

1. **`WHERE` filtering clauses:** Primary lookup identifiers, status flags, timestamps.
2. **`JOIN ... ON` foreign keys:** Columns linking parent and child tables (e.g., `orders.user_id = users.id`).
3. **`ORDER BY` and `GROUP BY` clauses:** Eliminates expensive disk-backed Sort (`Sort` / `Tempdb`) operations in the execution plan.

---

[← Previous: Index Cost and Sequential Scans](./03-Index-Cost-and-Sequential-Scans.md) | [Index](./README.md) | [Next: Index Pitfalls and Query Plans →](./05-Index-Pitfalls-and-Query-Plans.md)
