# Database Indexes and the N+1 Problem

> **Consolidated Engineering Guide**  
> *Merged from "Indexes and the N+1 Problem" and "Database Indexes: How Do They Make Reads Faster?"*

---

## 🎯 One-Sentence Summary

**Indexes make lookups fast by reducing the data scanned, avoiding N+1 keeps the number of database round trips small, and both require measuring what the database actually does (`EXPLAIN ANALYZE`) rather than guessing.**

---

## 🧠 The Core Mental Model

```text
                      DATABASE PERFORMANCE
                 ┌──────────────┴──────────────┐
            Data Scanned                Queries Executed
                 │                             │
              Indexes                         N+1
                 │                             │
          Find rows faster             Fewer round trips
          (Reduce disk I/O)           (Reduce network latency)

                 EXPLAIN ANALYZE ──> What actually happened?
```

Two problems make an endpoint feel blazing fast in development but painfully slow in production:

1. **Missing or poorly designed indexes:** Scanning millions of rows instead of navigating a tree.
2. **The N+1 query problem:** Making hundreds of round trips over the network instead of batching or joining.

Both hide on small dev datasets with a local database, and explode when millions of rows are separated from the application by network latency.

---

## 📚 Modular Notes Directory

| # | Chapter File | Core Topics Covered |
|---|---|---|
| **01** | [Introduction and Mental Model](./01-Introduction-and-Mental-Model.md) | Dev vs Prod latency, the Library & Textbook analogies, the two failure modes |
| **02** | [Database Index Internals](./02-Database-Index-Internals.md) | What an index is, B+Tree structure (root, internal, leaf nodes), heap vs clustered storage, index entries |
| **03** | [Index Cost and Sequential Scans](./03-Index-Cost-and-Sequential-Scans.md) | Why Seq Scans aren't always bad, index storage & write amplification (INSERT/UPDATE/DELETE), partial indexes |
| **04** | [Composite Indexes and Leftmost Prefix](./04-Composite-Indexes-and-Leftmost-Prefix.md) | Multi-column indexing, leftmost-prefix rule, column ordering (equality before range/sort) |
| **05** | [Index Pitfalls and Query Plans](./05-Index-Pitfalls-and-Query-Plans.md) | Wrapped functions (`lower(email)`), leading wildcards in `LIKE`, cardinality/selectivity, reading `EXPLAIN ANALYZE` |
| **06** | [The N+1 Problem](./06-The-N-plus-1-Problem.md) | Anatomy of 1+N queries, network round-trip overhead, ORMs and the lazy-loading trap |
| **07** | [Fixing N+1: Joins and Batching](./07-Fixing-N-plus-1-Joins-and-Batching.md) | SQL `JOIN` vs batch fetching (`ANY($1)` / `IN`), deduplication with `Set`, and the `attachAuthors` pattern |
| **08** | [The Hidden COUNT(*) Problem](./08-The-Hidden-Count-Problem.md) | Why pagination totals burn DB CPU, `COUNT(*)` over filtered sets, cursor pagination, `hasNextPage` |
| **09** | [Production Debugging and Mistakes](./09-Production-Debugging-and-Mistakes.md) | 7-step systematic diagnostic workflow, failure modes matrix, 11 common developer mistakes |
| **10** | [Self-Test and Key Takeaways](./10-Self-Test-and-Key-Takeaways.md) | 16 interview & self-check questions with full answers, key takeaways, and what to study next |
