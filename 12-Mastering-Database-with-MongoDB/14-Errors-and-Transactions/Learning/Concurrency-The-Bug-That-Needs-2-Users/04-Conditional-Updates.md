# 04 — Conditional Updates: Let the Database Decide

Sometimes a business operation can be expressed as one conditional `UPDATE`.

This is often simpler than performing a separate check and then updating — and it eliminates the race window entirely.

---

## Example: Booking a Seat

Suppose a seat is available only when `taken_by IS NULL`.

A naive implementation would:

1. Check whether the seat is free.
2. If it is free, assign it to the user.

Two requests could both pass the first check.

Instead, write:

```sql
UPDATE seats
SET taken_by = $1
WHERE id = $2
  AND taken_by IS NULL;
```

Parameters:

- `$1`: the user attempting to book the seat.
- `$2`: the seat ID.

The database updates the row **only if the seat is still available** when the update is evaluated.

---

## How to Interpret the Result

Check the number of affected rows.

| Rows affected | Meaning |
| --- | --- |
| `1` | The seat was available and this request booked it. |
| `0` | No matching available seat was updated. Someone may have booked it first, or the seat ID may not exist. |

The second request cannot successfully overwrite the first user's booking through this statement because its condition no longer matches the updated row.

---

## Why This Pattern Is Useful

You do not need to manually manage a lock for this simple operation.

The condition and update are combined into one database statement, so there is no separate application-level gap between checking availability and changing the record.

### Common use cases

- Reserving seats.
- Claiming jobs from a queue.
- Decrementing inventory.
- Changing a status only if the current status is correct.
- Spending credits only if enough credits remain.

---

## Another Example: Safe Inventory Decrement

```sql
UPDATE products
SET stock = stock - 1
WHERE id = $1
  AND stock > 0
RETURNING stock;
```

A successful update means one item was deducted. If no row is returned, the product either does not exist or has no stock available.
