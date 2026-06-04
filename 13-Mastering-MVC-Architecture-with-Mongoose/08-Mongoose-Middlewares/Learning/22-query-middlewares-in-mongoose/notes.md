## Mongoose Query Middleware - Short Notes

### What It Is
Query middleware executes **before** (`pre`) or **after** (`post`) query operations run. Inside query middleware, `this` refers to the **Query object**, not the document. [mongoosejs](https://mongoosejs.com/docs/middleware.html)

### Supported Query Methods
- `find`, `findOne`, `findOneAndUpdate`, `findOneAndDelete`
- `updateOne`, `updateMany`, `deleteOne`, `deleteMany`
- `count`, `countDocuments`, `replaceOne`
- All other query-related operations [mongoosejs](https://mongoosejs.com/docs/6.x/docs/middleware.html)

### Basic Syntax

```javascript
// Pre hook - runs BEFORE query executes
schema.pre('find', function(next) {
  // this = Query object
  this.where({ active: true });  // Modify query
  next();
});

// Post hook - runs AFTER query executes
schema.post('find', function(docs, next) {
  // docs = query results
  console.log(`Found ${docs.length} documents`);
  next();
});
```

### Key Characteristics

**`this` context**: Always refers to the Query object, never the document [suryathink.hashnode](https://suryathink.hashnode.dev/query-middleware-and-document-middleware-in-mongodb-how-to-identify-whether-a-middleware-is-query-middleware-or-document-middleware)

**Access query filters**: Use `this.getFilter()` to see current query conditions [mongoosejs](https://mongoosejs.com/docs/middleware.html)

**Chain query methods**: `this.where()`, `this.select()`, `this.populate()`, `this.limit()` [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)

**Apply to multiple methods**: Use regex pattern `/^find/` to match all find variants [suryathink.hashnode](https://suryathink.hashnode.dev/query-middleware-and-document-middleware-in-mongodb-how-to-identify-whether-a-middleware-is-query-middleware-or-document-middleware)

### Common Use Cases

**1. Auto-filter soft deletes**: [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)
```javascript
schema.pre(/^find/, function() {
  this.where({ deleted: false });
});
```

**2. Auto-populate references**: [techinsights.manisuec](https://techinsights.manisuec.com/mongodb/mongoose-pre-and-post-hooks-middlewares/)
```javascript
schema.pre('find', function() {
  this.populate('author');
});
```

**3. Add timestamps**: [wdk-docs.github](https://wdk-docs.github.io/mongoose-docs/guide/Middleware/)
```javascript
schema.pre('update', function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});
```

**4. Logging/monitoring**: [geekster](https://www.geekster.in/articles/middleware-in-mongoose/)
```javascript
schema.pre('findOne', function() {
  console.log('Query:', this.getFilter());
});
```

### Pre vs Post

- **Pre**: Modify query before execution, add filters, populate fields [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)
- **Post**: Process results after execution, transform data, logging [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)

### Important Notes
- Executes when you call `.exec()`, `.then()`, or `await` on a query [mongoosejs](https://mongoosejs.com/docs/middleware.html)
- Document middleware (`save`, `validate`) uses `this` = document, not query [suryathink.hashnode](https://suryathink.hashnode.dev/query-middleware-and-document-middleware-in-mongodb-how-to-identify-whether-a-middleware-is-query-middleware-or-document-middleware)
- Always call `next()` unless using async/await [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)