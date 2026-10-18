# 05 — Optimistic Locking: Detect Conflicting Edits

Conditional updates are ideal for simple business operations. But what happens when a user edits a record over several seconds or minutes?

For example, two administrators open the same product:

- Administrator A changes the product description.
- Administrator B changes the price.
- Both save their forms.

If both save without checking whether the record changed, the later save may overwrite the earlier save.

**Optimistic locking** detects this conflict rather than silently allowing stale data to overwrite newer data.

---

## The Idea: Add a Version Column

A record contains a version number.

```
Product:
    id: 42
    name: "Keyboard"
    price: 1000
    version: 5
```

When a user reads the record, the application remembers its version.

When the user saves, the application updates the record **only if the version is still the same**.

---

## Example SQL

```sql
UPDATE products
SET price = $1,
    version = version + 1
WHERE id = $2
  AND version = $3;
```

Parameters:

- `$1`: the new price.
- `$2`: the product ID.
- `$3`: the version originally read by the user.

### How it plays out

Suppose both administrators read version `5`.

1. Administrator A saves first.
2. The update matches version `5`.
3. The database saves the change and increments the version to `6`.
4. Administrator B tries to save using expected version `5`.
5. B's update matches **no rows** because the current version is `6`.

The application knows that another user modified the record after B read it.

Instead of silently discarding someone's work, it can show a message such as:

> This record was modified by another user. Reload the latest version and try again.

---

## When to Use Optimistic Locking

Use it when:

- Conflicts are possible but not extremely frequent.
- Users may edit a record for a long time.
- You want to avoid holding database locks while users work.
- Losing another user's changes would be a serious problem.

Examples: document editors, product administration panels, profile editing, settings pages.

---

## Optimistic Locking vs. Unique Constraint

These solve different problems:

- A **unique constraint** prevents two records from violating a uniqueness rule.
- **Optimistic locking** prevents a stale update from overwriting a newer version of the same record.

You may need both in the same application.
