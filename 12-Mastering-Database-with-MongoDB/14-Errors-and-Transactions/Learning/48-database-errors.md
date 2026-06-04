# Common MongoDB Error Codes and Messages

## Error Code 121

**Error Message:** "Document failed validation"

**Cause:** The document does not meet schema validation rules.

**Fix:** Ensure the data adheres to the JSON schema defined in MongoDB.

**Example:**

```json
{
  "code": 121,
  "errmsg": "Document failed validation"
}
```

---

## Error Code 11000

**Error Message:** "E11000 duplicate key error collection: <collection> index: <index> dup key: { <field>: \"value\" }"

**Cause:** Inserting a document with a duplicate value in a unique index.

**Fix:** Ensure uniqueness before inserting or update the existing document.

**Example:**

```json
{
  "code": 11000,
  "errmsg": "E11000 duplicate key error collection: users index: email_1 dup key: { email: 'test@example.com' }"
}
```

---

## Error Code 13

**Error Message:** "not authorized on <database> to execute command"

**Cause:** The user lacks necessary permissions for the database operation.

**Fix:** Grant the correct roles/privileges to the user.

**Example:**

```json
{
  "code": 13,
  "errmsg": "not authorized on test to execute command"
}
```

---

## Error Code 7

**Error Message:** "Server selection timed out after <time>ms"

**Cause:** The database server is unresponsive or slow.

**Fix:** Increase timeout settings or diagnose database performance.

**Example:**

```json
{
  "code": 7,
  "errmsg": "Server selection timed out after 30000ms"
}
```

---

These are some of the most common MongoDB errors. If you encounter an error not listed here, refer to the [official MongoDB documentation](https://www.mongodb.com/docs/) for more details.
