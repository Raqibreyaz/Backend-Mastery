# 03 — The Check-Then-Act Race Condition

## What It Is

A check-then-act race occurs when an application checks whether an operation is allowed and performs the operation later.

Another request can change the situation between those two steps.

This creates a **time gap** in which the original decision may become invalid.

---

## Example: Username Registration

Suppose two users try to register the username `raquib`.

A naive implementation might do this:

```js
const existing = await findUserByUsername("raquib");

if (!existing) {
  await createUser("raquib");
}
```

The application checks whether the username exists and inserts it if it does not.

The problem is that the **check and insertion are separate database operations**.

### How the race happens

```
Request A                         Request B
─────────────────────────────     ─────────────────────────────
SELECT username                   SELECT username
Username not found                Username not found

INSERT username                   INSERT username
          \                       /
           Both attempt insertion
```

Both requests can observe that the username is available.

Without a database constraint, both may insert it.

Even if the application checks the username correctly, the check can become outdated immediately afterward.

---

## The Fix: A Unique Constraint

Make the database enforce the rule that usernames must be unique.

```sql
ALTER TABLE users
ADD CONSTRAINT users_username_unique
UNIQUE (username);
```

Then attempt the insertion directly:

```sql
INSERT INTO users (username)
VALUES ('raquib');
```

The database decides which insertion succeeds.

- The first valid insertion succeeds.
- The competing insertion fails with a **unique-constraint violation**.

The application catches that specific error and tells the second user that the username is already taken.

---

## Why the Database Is the Right Place

An application-level check is not enough because multiple application servers or requests can run concurrently.

A unique constraint is enforced **centrally** by the database. It protects the rule even when requests reach different application instances.

> **General rule:** If a condition must always remain true, enforce it with a database constraint whenever possible.

Examples:

- Usernames must be unique.
- An email address must not be registered twice.
- An order must reference a valid customer.
- A required value must not be `NULL`.
