# SQL and NoSQL Injection — One-Shot Revision

## 1. One-line Definition

Injection occurs when untrusted input changes the meaning of a database query instead of being treated only as data.

## 2. Why was it introduced?

Query languages are powerful; combining request input directly with query syntax can bypass login checks, expose records, or alter/delete data.

## 3. Core Mental Model

Build query *structure* in trusted code and pass user values only through typed parameters or a strict allowlist—never let a client submit a query object.

## 4. Internal Working

SQL injection exploits concatenated query strings. NoSQL injection can occur when an API passes request objects straight to Mongo-style queries: an object where a string was expected may contain operators such as `$ne`, `$gt`, or `$regex`, changing query meaning. Dynamic filters, projections, operator keys, and `$where`-style code are especially risky.

## 5. Key APIs / Syntax

```js
// SQL: parameterize values; never concatenate user input
await db.query('SELECT * FROM users WHERE email = $1', [email]);

// NoSQL: construct a known query after validating a primitive value
const input = LoginSchema.parse(req.body);
const user = await User.findOne({ email: input.email });
```

Validate schemas with Zod or equivalent: required fields, strings/numbers, length/format/ranges, and `strict()`/allowlisted keys where appropriate.

## 6. Comparison

| SQL injection | NoSQL injection |
| --- | --- |
| Query text is altered by string concatenation | Query object/operators are altered by untrusted shapes |
| Use prepared/parameterized queries | Validate primitive types; construct query objects server-side |
| Placeholder values separate data from syntax | Do not pass `req.body`/raw filters into query APIs |

## 7. Common Mistakes

- Building SQL with template strings/concatenation.
- `find(req.body)` or accepting arbitrary filter/projection/sort objects.
- Assuming JSON parsing means input is safe.
- Treating a field expected as a string as valid when it is an object/array.
- Exposing dynamic regex or database-side JavaScript.

## 8. Production Considerations

- Use least-privileged database accounts and separate read/write permissions.
- Allowlist filterable/sortable fields and map external inputs to internal query structures.
- Add input limits and safe regex design to prevent ReDoS.
- Log suspicious validation failures without logging secrets; test injection cases in CI.

## 9. Interview Questions

1. Explain SQL versus NoSQL injection.
2. Why do parameterized queries prevent SQL injection?
3. Why is `find(req.body)` dangerous?
4. How does validation reduce operator injection?

## 10. Memory Triggers

- **Code builds query; user supplies values.**
- **Parameterized SQL; allowlisted NoSQL objects.**
- **Never pass raw request objects to the database.**

## 11. Summary

Prevent injection by separating query structure from untrusted data, validating typed input, allowlisting dynamic behavior, and using least-privileged database access.
