# 08 — Exercise: Implement `runAll(state, operations)`

This exercise simulates atomicity in application memory — not a replacement for a real database transaction, but a way to deeply understand how rollback works.

---

## The Task

The function receives:

- `state`: An object that operations can modify.
- `operations`: An array of functions, each receiving `state` and potentially changing it.

**Requirements:**

1. Apply every operation in order.
2. If all operations succeed, return `{ ok: true }`.
3. If an operation throws, restore `state` to exactly how it was before the function started.
4. Return `{ ok: false, failedAt }`, where `failedAt` is the index of the operation that threw.

---

## Why the Naive Implementation Fails

```js
function runAll(state, operations) {
  operations.forEach((op) => op(state));

  return { ok: true };
}
```

If the third operation throws, the first two operations may already have modified `state`.

The exception also prevents the function from returning the required failure object.

The fix is to preserve the original state and restore it if an operation fails.

---

## Solution: Shallow-Copy Rollback

```js
function runAll(state, operations) {
  const original = { ...state };

  for (let i = 0; i < operations.length; i++) {
    try {
      operations[i](state);
    } catch (error) {
      for (const key of Object.keys(state)) {
        delete state[key];
      }

      Object.assign(state, original);

      return {
        ok: false,
        failedAt: i
      };
    }
  }

  return { ok: true };
}
```

### How It Works

1. Save a shallow copy of the original state.
2. Run each operation in order.
3. If an operation throws, remove the current object's properties.
4. Restore the original properties.
5. Return the failed operation's index.

---

## Worked Example

```js
const state = {
  balance: 100,
  count: 0
};

const operations = [
  (s) => {
    s.balance -= 20;
  },
  (s) => {
    s.count += 1;
  },
  (s) => {
    s.balance = -999;
    throw new Error("Operation failed");
  }
];

console.log(runAll(state, operations));
```

Result:

```js
{
  ok: false,
  failedAt: 2
}
```

The state is restored to:

```js
{
  balance: 100,
  count: 0
}
```

---

## Important Limitation

The implementation uses a **shallow copy**. It works for the stated exercise when state consists of simple properties whose values are not themselves being mutated.

If the state contains nested objects or arrays that operations mutate in place, the shallow copy retains references to those nested values. It cannot fully restore those mutations.

For arbitrary nested state, you need a suitable deep-copy and restoration strategy, or an immutable update approach. The strategy must match the kinds of state and operations the exercise permits.

---

> This exercise simulates atomicity in application memory. It is not a replacement for a real database transaction, which also coordinates concurrent operations and durable storage.
