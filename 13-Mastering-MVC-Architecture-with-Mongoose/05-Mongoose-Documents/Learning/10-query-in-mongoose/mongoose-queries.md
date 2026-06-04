# Mongoose Query and Query Chaining

## What is a Mongoose Query?

A **Mongoose query** is an object that represents an operation on a MongoDB collection. It is **thenable but not a Promise**; however, it behaves like a Promise.

### Example:

```javascript
const users = User.find({ age: { $gte: 18 } });
console.log(users instanceof Promise); // false

await users; // Works because it's thenable
```

## Chaining Queries in Mongoose

Mongoose allows **query chaining**, enabling you to refine the query step by step before execution. Since queries return query objects, you can keep adding methods before execution.

### Example of Chaining Queries:

```javascript
const users = await User.find({ age: { $gte: 18 } })
  .sort({ name: 1 })
  .limit(10)
  .select("name age");
```

### Explanation:

1. `.find({ age: { $gte: 18 } })` - Finds all users aged 18 or above.
2. `.sort({ name: 1 })` - Sorts results by name in ascending order.
3. `.limit(10)` - Limits the results to 10 users.
4. `.select("name age")` - Fetches only the `name` and `age` fields.
5. `await` - Waits for the result because the query is thenable.

## Using `.exec()` for Full Promise Behavior

To convert a Mongoose query into a **real Promise**, use `.exec()`:

```javascript
const users = await User.find({ age: { $gte: 18 } }).exec();
console.log(users instanceof Promise); // true
```

This ensures the query behaves exactly like a native JavaScript Promise.

## Using `.getQuery()` to Inspect the Query

Mongoose provides the `.getQuery()` method to inspect the query conditions before execution.

### Example:

```javascript
const query = User.find({ age: { $gte: 18 } });
console.log(query.getQuery()); // { age: { $gte: 18 } }
```

This is useful for debugging queries before execution.

## Using `.where()` for SQL-Style Querying

The `.where()` method allows constructing queries in a more expressive way.

### Example:

```javascript
const users = await User.where("age")
  .gte(18)
  .lte(30)
  .where("name")
  .equals("John")
  .select("name age");
```

### Explanation:

- `.where("age").gte(18).lte(30)` - Finds users whose age is between 18 and 30.
- `.where("name").equals("John")` - Filters users whose name is "John".
- `.select("name age")` - Retrieves only the `name` and `age` fields.

## Negative Selections (Excluding Fields)

Mongoose allows negative selections to exclude fields from the result by prefixing the field with `-`.

### Example:

```javascript
const users = await User.find().select("-password -email");
```

### Explanation:

- `-password` excludes the `password` field.
- `-email` excludes the `email` field.

Another example:

```javascript
const users = await User.find({}, { password: 0, email: 0 });
```

This achieves the same result using an object notation.

Tip: if you call .cursor() method on a query like find() so it returns a readable stream after that you can listen on data event and you will get each doc in data not buffer like in node js pure streams so use it always for efficient use of memory