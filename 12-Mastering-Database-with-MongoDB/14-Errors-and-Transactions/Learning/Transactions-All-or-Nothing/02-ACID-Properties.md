# 02 — ACID Properties

Database transactions are commonly described using four properties: **ACID**.

---

## A — Atomicity

All operations succeed together, or none of their changes are committed.

**Example:** A bank transfer must not subtract money without crediting the recipient.

---

## C — Consistency

A transaction must preserve the database's defined integrity rules when it completes successfully.

**Example:** A database constraint prevents an account balance from becoming negative, if negative balances are prohibited by the schema.

---

## I — Isolation

Controls how concurrent transactions interact and what data they can observe.

**Example:** Two users attempting to purchase the last item in stock must not both successfully claim it when the business rule allows only one purchase.

---

## D — Durability

Once a transaction is committed, its changes survive failures covered by the database's durability guarantees.

**Example:** After a successful bank transfer is committed, a power failure should not simply erase the transfer.

---

## Comparison Table

| Property    | Main question                                  |
| ----------- | ---------------------------------------------- |
| Atomicity   | Were the changes applied all together?         |
| Consistency | Were the database's integrity rules preserved? |
| Isolation   | How did concurrent transactions interact?      |
| Durability  | Will committed changes survive a failure?      |

These properties solve different problems. A transaction can provide atomicity without automatically preventing every concurrency bug.

---

## ⚡ Quick Reference Cheatsheet

```
ACID = Atomicity, Consistency, Isolation, Durability

-> Atomicity:
   All steps in a transaction happen, or none happen.
   "All or nothing."

-> Consistency:
   The database follows rules before and after the transaction.
   "Data stays valid."

-> Isolation:
   Transactions don't interfere with each other.
   "No mix-ups when multiple users act at once."

-> Durability:
   Once a transaction is saved, it stays saved — even after a crash.
   "It's permanent."
```
