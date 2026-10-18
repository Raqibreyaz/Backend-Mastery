# Database Transactions: All or Nothing

> **Engineering Guide** — *Transactions, ACID, Isolation Levels, Deadlocks, and Application Patterns*

---

## 🎯 One-Sentence Summary

**A transaction is a group of database operations that either all succeed together (COMMIT) or leave no trace (ROLLBACK) — protecting the database from half-finished changes.**

---

## 🧠 Mental Model

```
         BEGIN
           |
           v
     SQL operations
           |
    +------+------+
    |             |
 Success        Error
    |             |
    v             v
 COMMIT        ROLLBACK
    |             |
    v             v
Keep changes  Discard changes
```

---

## 📚 Modular Notes Directory

| # | File | Topics |
|---|------|--------|
| **01** | [What is a Transaction](./01-What-is-a-Transaction.md) | Definition, bank-transfer example, READ vs WRITE, BEGIN/COMMIT/ROLLBACK, 4-step flow |
| **02** | [ACID Properties](./02-ACID-Properties.md) | Atomicity, Consistency, Isolation, Durability — with quick-reference cheatsheet |
| **03** | [Isolation Levels](./03-Isolation-Levels.md) | Read Committed, Repeatable Read, Serializable, comparison table |
| **04** | [Keep Transactions Short](./04-Keep-Transactions-Short.md) | Lock contention, HTTP-inside-transaction anti-pattern, rule of thumb |
| **05** | [Deadlocks](./05-Deadlocks.md) | Lock cycles, detection, consistent-order prevention |
| **06** | [Lost Updates](./06-Lost-Updates.md) | Read-compute-write race, limits of transactions alone |
| **07** | [Rollback in Application Code](./07-Rollback-in-Application-Code.md) | Safe try/catch pattern, try/finally gotchas, production guidance |
| **08** | [Exercise: runAll](./08-Exercise-runAll.md) | Simulating atomicity in memory, shallow-copy rollback, limitations |
| **09** | [Self-Test and Key Takeaways](./09-Self-Test-and-Key-Takeaways.md) | 3 self-check questions, 14 key takeaways, what to learn next |
| **10** | [MongoDB Implementation](./10-MongoDB-Implementation.js) | Replica set setup, `startSession`, `startTransaction`, commit/abort in Node.js |
