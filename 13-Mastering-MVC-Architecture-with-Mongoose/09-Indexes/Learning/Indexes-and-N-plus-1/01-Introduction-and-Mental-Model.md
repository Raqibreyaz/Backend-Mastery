# 01 · Introduction and Mental Model

[Index](./README.md) | [Next: Database Index Internals →](./02-Database-Index-Internals.md)

---

## One-Sentence Summary

**Indexes make lookups fast by reducing the data scanned, avoiding N+1 keeps the number of database round trips small, and both require measuring what the database actually does (`EXPLAIN ANALYZE`) rather than guessing.**

---

## Why Performance Problems Hide in Development

Two widespread backend problems make an endpoint feel instant on a developer's laptop, yet bring production to a crawl under real traffic:

1. **Missing or poorly designed indexes** (too much data scanned).
2. **The N+1 query problem** (too many database round trips).

```text
Development Environment:
  - Small dataset (50-100 rows)
  - Database runs locally on localhost (socket / loopback latency ≈ 0.05 ms)
  - Result: Unindexed scans and dozens of round trips appear instantaneous (< 5 ms).

Production Environment:
  - Large dataset (hundreds of thousands or millions of rows)
  - Database runs on a dedicated server over a network (round-trip latency ≈ 1–5 ms)
  - Concurrent user traffic competing for connection pools, CPU, and disk I/O
  - Result: Queries timeout, connections pool starves, and endpoints spike to seconds.
```

---

## Intuition & Real-World Analogies

### 1. The Library Analogy

Imagine a physical library holding **1,000,000 books**, and you want to locate a book written by *Alice*:

* **Without an index (Sequential Scan, $O(N)$):**  
  The librarian walks down every aisle, pulling out book 1, book 2, book 3... all the way to book 1,000,000. If the book is near the end, they must inspect nearly a million books.
  
* **With an index (B-Tree Lookup, $O(\log N)$):**  
  The library provides a card catalog or digital lookup structure:
  ```text
  "Alice" ──> Shelf 4, Books #182, #931, #5421
  ```
  The librarian skips straight to those three exact locations without inspecting the remaining 999,997 books.

### 2. The Textbook Analogy

Imagine reading an 800-page computer science textbook looking for the definition of *Idempotency*:

* **Without an index:** You read through pages 1 to 800 until you happen to find the word.
* **With an index:** You flip to the alphabetical index at the back of the textbook, find *Idempotency*, see "page 412", and immediately jump straight to page 412.

---

## The Two Failure Modes

Backend performance bottlenecks at the database layer generally fall into two distinct categories:

```text
               DATABASE PERFORMANCE BOTTLENECKS
         ┌─────────────────────┴─────────────────────┐
         ▼                                           ▼
  TOO MUCH DATA SCANNED                      TOO MANY QUERIES
         │                                           │
  Root Cause:                                 Root Cause:
  Missing or improper indexes                 N+1 loops / lazy loading
         │                                           │
  Remedy:                                     Remedy:
  Secondary index structures                  Batching / SQL JOINs
  (B-Tree, composite, partial)                (WHERE id = ANY($1))
```

* **Data Scanned:** ONE query is issued, but the database must sift through gigabytes of table pages from disk to find a handful of rows.
* **Queries Executed:** The queries themselves might each be fast, but the application makes tens or hundreds of individual network round trips inside an iteration loop.

---

## The Golden Rule: Don't Guess, Measure

Neither missing indexes nor N+1 issues can be solved by guessing. Modern relational and document databases provide execution profilers:

```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'alice@example.com';
```

`EXPLAIN ANALYZE` executes the query and reports **what the database engine actually did**—the exact query plan chosen, the buffer cache hits, disk reads, and the actual elapsed time.

---

[Index](./README.md) | [Next: Database Index Internals →](./02-Database-Index-Internals.md)
