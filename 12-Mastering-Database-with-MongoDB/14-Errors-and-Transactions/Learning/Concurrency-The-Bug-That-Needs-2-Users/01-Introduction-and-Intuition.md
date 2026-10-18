# 01 — Introduction and Intuition

## What Concurrency Is

Concurrency means multiple operations are in progress at the same time. In a backend application, this often happens when two users send requests that access or modify the same database record.

A concurrency bug occurs when the result depends on the timing or order of overlapping operations.

These bugs can be difficult to detect because:

- Everything may work correctly when one user uses the application.
- Unit tests may pass when requests execute sequentially.
- No exception may occur.
- Both requests may return success even though the final database state is incorrect.

---

## The Three Problem Types

1. **Lost updates** — one request overwrites another request's change.
2. **Check-then-act races** — a condition becomes invalid between checking it and acting on it.
3. **Conflicting edits** — one user's changes silently overwrite another user's work.

**The key principle:** Let the database decide which concurrent operation succeeds.

---

## Intuition: Two People Withdrawing From the Same Account

Imagine two users trying to withdraw ₹30 from an account containing ₹100.

Both requests read the balance before either writes its result.

### The lost update visualised

```
Initial database balance: ₹100

Request A                    Request B
─────────────────────────    ─────────────────────────
Reads ₹100                   Reads ₹100
Calculates ₹100 − ₹30 = ₹70  Calculates ₹100 − ₹30 = ₹70
Writes ₹70                   Writes ₹70

Final database balance: ₹70
Expected balance:        ₹40
```

One withdrawal was effectively lost.

Two withdrawals happened, but the database reflects only one.

Nothing necessarily crashed. Both requests might have returned success. The bug is in the coordination between requests.
