# 03 — Isolation Levels: How Concurrent Transactions See Data

Isolation is one of the most important transaction concepts because it involves trade-offs between concurrency, correctness, and performance.

PostgreSQL provides several isolation levels.

---

## 6.1 Read Committed

`Read Committed` is PostgreSQL's default isolation level.

A transaction sees committed data, but two separate reads within the same transaction can return different results if another transaction commits changes between them.

Consider this sequence:

```
Transaction A                 Transaction B
-------------                 -------------
BEGIN                         BEGIN

Read balance = ₹1,000

                              Update balance to ₹800
                              COMMIT

Read balance = ₹800

COMMIT
```

Transaction A sees two different values:

```
First read:  ₹1,000
Second read: ₹800
```

Why?

Under `Read Committed`, each ordinary `SELECT` generally sees a snapshot of data committed before that statement began.

The two reads use different statement snapshots, so the second read can observe Transaction B's committed update.

This does not mean Transaction A read uncommitted data. Both values were committed when they were observed.

---

## 6.2 Repeatable Read

`Repeatable Read` provides a stable snapshot for the transaction.

Using the same example:

```
Transaction A                 Transaction B
-------------                 -------------
BEGIN                         BEGIN

Read balance = ₹1,000

                              Update balance to ₹800
                              COMMIT

Read balance = ₹1,000

COMMIT
```

Transaction A continues to see the same snapshot for ordinary reads, even after Transaction B commits its update.

In PostgreSQL, `Repeatable Read` uses snapshot isolation. It prevents non-repeatable reads and, unlike some implementations of the SQL isolation standard, also prevents phantom reads for ordinary snapshot-based queries.

However, it does not eliminate every possible concurrency anomaly. In particular, snapshot isolation alone does not guarantee full serializability.

---

## 6.3 Serializable

`Serializable` provides the strongest standard isolation level.

Its goal is to make successfully committed concurrent transactions behave as if they had executed one after another in some serial order.

For example:

```
Transaction A
      |
      v
Transaction B
      |
      v
Consistent final outcome
```

The database does not necessarily execute every transaction sequentially in real time. It may allow concurrent execution while detecting situations that cannot safely be serialized.

When PostgreSQL detects a serialization conflict, it can abort a transaction with a serialization failure.

The application must then retry the transaction when appropriate.

---

## Isolation Level Comparison

| Isolation level | Main behavior                                            | Important consideration                                                                  |
| --------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Read Committed  | Each statement generally sees its own committed snapshot | Separate reads can return different values                                               |
| Repeatable Read | Reads use a stable transaction snapshot                  | Some concurrent updates can still conflict or produce anomalies under snapshot isolation |
| Serializable    | Successful transactions behave as if executed serially   | Serialization failures require retries                                                   |

Higher isolation does not mean fewer errors. It means stronger correctness guarantees, sometimes at the cost of rejecting transactions that must be retried.
