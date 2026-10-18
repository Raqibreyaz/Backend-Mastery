# 08 — Testing Concurrency: Proving the Bug Is Fixed

Reasoning about concurrent code is not enough. You need to **reproduce the race** and test the final state.

---

## Why Sequential Tests Miss Races

A sequential test might pass:

```js
await withdraw(30);
await withdraw(30);
```

The second request starts only after the first has finished. This does not reproduce the problematic overlap.

---

## Run Requests Concurrently with `Promise.all`

In Node.js, `Promise.all` can start multiple asynchronous operations without waiting for each one to finish first.

```js
await Promise.all([
  withdraw(30),
  withdraw(30)
]);
```

This is a useful starting point, but it does not guarantee that the requests will overlap at the **exact point** needed to reproduce a race. Depending on scheduling and the implementation, the bug may not appear every time.

A stronger test uses a synchronization barrier or a test hook so both requests reach the critical section together.

---

## Assert the Final Database State

Never rely only on HTTP response status codes.

### Withdrawal example

```
Initial balance: 100

Run two withdrawals concurrently.

Expected final balance: 40
```

### Seat booking example

```
Run two booking requests concurrently.

Expected:
    Exactly one booking succeeds.
    The other request reports a conflict.
```

### Optimistic locking example

```
Two users read version 5.

User A saves:
    Success — version becomes 6.

User B saves with expected version 5:
    Conflict — record remains unchanged by B.
```

---

## Use `curl` or a Small Script

Send two HTTP requests simultaneously using `curl` in the background:

```bash
curl -X POST http://localhost:3000/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount":30}' &

curl -X POST http://localhost:3000/accounts/1/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount":30}' &

wait
```

The `&` starts each command in the background. `wait` waits for both to finish.

Check the database afterward. Two HTTP responses that both look successful do **not** prove that the final state is correct.

---

## Document Your Concurrency Test

Keep a reproducible concurrency test in your README. It documents the bug and provides a way to verify that future changes do not reintroduce it.
