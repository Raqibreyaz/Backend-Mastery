# 02 · Database Index Internals

[← Previous: Introduction and Mental Model](./01-Introduction-and-Mental-Model.md) | [Index](./README.md) | [Next: Index Cost and Sequential Scans →](./03-Index-Cost-and-Sequential-Scans.md)

---

## What an Index Is

An **index** is a secondary lookup data structure maintained alongside a database table. Its purpose is to allow the database engine to find specific rows without reading the entire table from disk.

```sql
CREATE INDEX idx_users_email ON users(email);
-- Optimizes: SELECT * FROM users WHERE email = 'alice@example.com';
```

### Common Index Data Structures

* **B-Tree / B+Tree:** The industry default across PostgreSQL, MySQL (InnoDB), and MongoDB (WiredTiger). Excels at equality (`=`), range queries (`<`, `<=`, `>`, `>=`, `BETWEEN`), prefix matching (`LIKE 'foo%'`), and pre-sorted retrieval (`ORDER BY`).
* **Hash Index:** Maps keys to hash buckets in $O(1)$ average time. Supports **only** exact-match equality queries (`=`). Cannot perform range scans or ordered retrieval.

---

## Why Indexes Are Faster: The Physics of Disk I/O

The performance difference between a sequential scan and an indexed lookup is governed by **Disk I/O**:

1. **Tables are split into disk pages (blocks):** In databases like PostgreSQL, pages are typically 8 KB; in MySQL InnoDB, 16 KB.
2. **A full table scan must read all pages:** If a table has 10,000,000 rows across 500,000 pages (approx. 4 GB), a full scan must load all 4 GB into memory or read them from disk.
3. **An index navigates a compact tree:** An index stores only the indexed column and a pointer. Because index pages are densely packed, navigating from the root to a leaf requires reading only 3 or 4 pages.
4. **Latency comparison at scale:** Roughly **2 ms vs. 2 seconds** (a 1,000× speedup).

> [!NOTE]
> Indexes do not eliminate all disk access—they prevent the database engine from reading vast oceans of irrelevant data.

---

## Internal Anatomy: Heap vs. Clustered Storage

How rows and indexes sit on physical storage depends on the database engine:

```text
              HEAP TABLE DESIGN (e.g., PostgreSQL)
┌─────────────────────────────────┐   ┌─────────────────────────────────┐
│           INDEX TREE            │   │           TABLE HEAP            │
│  [Key: alice@example.com]       │   │  (Unordered collection of rows) │
│  [Pointer: Page 42, Slot 5] ────┼───┼──> [Row: id=10, email=alice...] │
└─────────────────────────────────┘   └─────────────────────────────────┘
```

* **Heap Storage (PostgreSQL default):** Table rows are placed in pages wherever space is available (unordered). The index entry contains the indexed value plus a **tuple ID (TID / CTID)** pointing to the exact physical page and slot in the heap.
* **Clustered Storage (MySQL InnoDB default):** The table itself is organized physically as a B+Tree ordered by the Primary Key. Secondary indexes store the indexed value plus the Primary Key value as the locator.

### What is an Index Entry?

Every index entry consists of two pieces:
$$\text{Index Entry} = \text{Indexed Column Value} + \text{Row Locator}$$

When a query runs:
1. The engine traverses the index to find the entry matching the search value.
2. It reads the row locator (pointer).
3. It fetches the full row from the heap or clustered table if additional columns are needed.

### Index-Only Scans

If a query requests **only** the columns that already exist inside the index itself:

```sql
SELECT email FROM users WHERE email = 'alice@example.com';
```

The database answers the query directly from the index leaf node and **never touches the table heap at all**. This is known as an **Index-Only Scan** and represents the fastest possible read pattern.

---

## B+Tree Architecture

Almost all production databases implement a **B+Tree** (a variant of the B-Tree):

```text
                           ┌──────────────┐
                           │  Root Node   │
                           │  [ M | T ]   │
                           └──┬────────┬──┘
                  ┌───────────┘        └───────────┐
                  ▼                                ▼
         ┌────────────────┐               ┌────────────────┐
         │ Internal Node  │               │ Internal Node  │
         │   [ D | H ]    │               │   [ P | R ]    │
         └──┬──────────┬──┘               └──┬──────────┬──┘
    ┌───────┘          └───────┐             │          └───────┐
    ▼                          ▼             ▼                  ▼
┌────────┐    linked      ┌────────┐    ┌────────┐    linked      ┌────────┐
│ Leaf 1 │ ─────────────> │ Leaf 2 │ ──>│ Leaf 3 │ ─────────────> │ Leaf 4 │
│ A ... C│                │ E ... G│    │ N ... O│                │ S ... Z│
└────────┘                └────────┘    └────────┘                └────────┘
```

### Key Components

1. **Root Node:** The starting point in memory/disk. Contains separator keys that partition search ranges.
2. **Internal Nodes:** Router nodes containing separator keys and child page pointers. They guide traversals down tree levels.
3. **Leaf Nodes:** The bottom layer. Holds the indexed keys alongside their corresponding row locators.
4. **Sequentially Linked Leaves:** Unlike standard search trees, all leaf nodes in a B+Tree are linked together as a **doubly linked list**.

### Why Linked Leaves Make Range Queries Blazing Fast

Consider a range query:

```sql
SELECT * FROM users WHERE age BETWEEN 20 AND 30;
```

1. The database navigates down from the root to find the leaf containing `age = 20` in $O(\log N)$ time.
2. Once the starting leaf is reached, the engine does not traverse the tree again!
3. It simply walks horizontally along the neighboring leaf nodes until it hits `age > 30`.

### B-Tree vs. Binary Search

Why don't databases use Binary Search Trees (like Red-Black Trees or AVL Trees)?

* A binary tree has a fan-out of 2 (each node has at most 2 children). For 10,000,000 rows, tree height is $\log_2(10^7) \approx 24$. That would require up to **24 separate disk page reads**.
* A B+Tree node fits an entire 8 KB or 16 KB disk page, holding **hundreds or thousands of keys per node** (high fan-out).
* With a fan-out of 500, a 3-level B+Tree can index $500^3 = 125,000,000$ rows! The database traverses at most **3 to 4 pages**, usually cached in RAM.

---

[← Previous: Introduction and Mental Model](./01-Introduction-and-Mental-Model.md) | [Index](./README.md) | [Next: Index Cost and Sequential Scans →](./03-Index-Cost-and-Sequential-Scans.md)
