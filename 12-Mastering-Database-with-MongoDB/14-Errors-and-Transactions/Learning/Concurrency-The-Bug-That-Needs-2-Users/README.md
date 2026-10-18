# Concurrency: The Bug That Needs Two Users

> **Engineering Guide** — *Lost Updates, Race Conditions, Locking Strategies, and Testing Concurrency*

---

## 🎯 One-Sentence Summary

**Concurrency bugs happen when multiple requests read and modify shared data at overlapping times — the fix is to make important decisions atomic or let the database detect conflicts.**

---

## 🧠 Mental Model

```
Two requests, one shared row:

Request A: Read → Compute → Write
Request B: Read → Compute → Write
                ↑
         Race window here

Solution: Push the decision INTO the database
```

---

## 📚 Modular Notes Directory

| # | File | Topics |
|---|------|--------|
| **01** | [Introduction and Intuition](./01-Introduction-and-Intuition.md) | What concurrency is, why bugs hide, the 3 problem types, bank-transfer intuition |
| **02** | [Lost Updates](./02-Lost-Updates.md) | Read-modify-write danger, timeline table, atomic SQL fix, conditional UPDATE with RETURNING |
| **03** | [Check-Then-Act Race](./03-Check-Then-Act-Race.md) | Race window between check and action, username example, unique constraint fix |
| **04** | [Conditional Updates](./04-Conditional-Updates.md) | One-statement check+update, seat booking, inventory, interpreting affected rows |
| **05** | [Optimistic Locking](./05-Optimistic-Locking.md) | Version column, stale-edit detection, when to use it vs unique constraint |
| **06** | [Pessimistic Locking](./06-Pessimistic-Locking.md) | SELECT FOR UPDATE, when to use it, trade-offs, keep it short |
| **07** | [Concurrency Solutions Compared](./07-Concurrency-Solutions-Compared.md) | Technique comparison table, practical decision flowchart |
| **08** | [Testing Concurrency](./08-Testing-Concurrency.md) | Why sequential tests miss races, Promise.all, curl, asserting final DB state |
| **09** | [Exercise: saveWithVersion](./09-Exercise-saveWithVersion.md) | Optimistic locking in JS — requirements, solution, 3 worked examples, limitation |
| **10** | [Self-Test and Key Takeaways](./10-Self-Test-and-Key-Takeaways.md) | 7 common mistakes, 12 key takeaways, 10 self-test questions, what to learn next |
