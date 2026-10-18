# 09 — Exercise: Implement `saveWithVersion`

This exercise simulates optimistic locking in a single JavaScript process — useful for learning the logic before applying it at the database level.

---

## The Task

Implement:

```js
saveWithVersion(store, id, expectedVersion, patch)
```

The function must update `store[id]` only when the record exists and its current version matches `expectedVersion`.

---

## Requirements

1. If the record does not exist, return:
   ```js
   { ok: false, reason: "not_found" }
   ```
2. If the record exists but the version does not match, return:
   ```js
   { ok: false, reason: "conflict", currentVersion: record.version }
   ```
   Do not change the record.
3. If the version matches:
   - Apply the patch.
   - Increment the version.
   - Return:
   ```js
   { ok: true, version: newVersion }
   ```

---

## Complete Solution

```js
function saveWithVersion(store, id, expectedVersion, patch) {
  const record = store[id];

  if (record === undefined) {
    return {
      ok: false,
      reason: "not_found"
    };
  }

  if (record.version !== expectedVersion) {
    return {
      ok: false,
      reason: "conflict",
      currentVersion: record.version
    };
  }

  Object.assign(record, patch);
  record.version += 1;

  return {
    ok: true,
    version: record.version
  };
}
```

---

## Worked Examples

### Successful save

```js
const store = {
  42: { name: "Keyboard", price: 1000, version: 5 }
};

const result = saveWithVersion(store, 42, 5, { price: 1200 });

console.log(result);
// { ok: true, version: 6 }

console.log(store[42]);
// { name: "Keyboard", price: 1200, version: 6 }
```

The expected version was `5`, so the save succeeded and version incremented to `6`.

### Conflicting save

```js
// store[42].version is now 6 from the save above
const result = saveWithVersion(store, 42, 5, { price: 1500 });

console.log(result);
// { ok: false, reason: "conflict", currentVersion: 6 }
```

The record is already at version `6`. The stale save is rejected; the record is unchanged.

### Missing record

```js
const result = saveWithVersion(store, 99, 1, { price: 500 });

console.log(result);
// { ok: false, reason: "not_found" }
```

No record with ID `99` exists; no update is performed.

---

## Important Limitation

This exercise simulates optimistic locking in a **single JavaScript process**. It is useful for learning the logic, but it is not a substitute for database concurrency control.

In a real backend, the version check and update must be part of one **atomic database operation**. Otherwise, two application requests could both check the version before either one updates the record.

The real equivalent:

```sql
UPDATE products
SET price = $1,
    version = version + 1
WHERE id = $2
  AND version = $3
RETURNING version;
```

If no row is returned, the application can report a conflict or investigate whether the record is missing.
