# Transactions in Databases

## What is a Transaction?

A **transaction** in a database is a sequence of write operations performed as a single unit of work. Transactions ensure **ACID (Atomicity, Consistency, Isolation, and Durability)** properties, which are essential for maintaining data integrity.

INSERT, UPDATE, and DELETE operations are part of the transaction. However, a **READ operation (SELECT or FIND)** does not need to be part of the transaction, as it does not modify data.

### **ACID Properties**

1. **Atomicity**: All operations within a transaction are treated as a single unit. Either all of them execute successfully, or none of them are applied.
2. **Consistency**: Transactions ensure that the database remains in a valid state before and after execution.
3. **Isolation**: Transactions operate independently without interfering with each other.
4. **Durability**: Once a transaction is committed, changes are permanently saved in the database, even in the case of a system failure.

---

## **How Transactions Work in Databases?**

1. A transaction starts when an **INSERT, UPDATE, or DELETE** operation is initiated.
2. All operations inside the transaction are executed.
3. If all operations succeed, the transaction is **committed**.
4. If any operation fails, the transaction is **rolled back**, and no changes are applied.