## Mongoose Model Middleware - Short Notes

### What It Is
Model middleware executes on **Model-level operations** that affect entire collections, not individual documents. Inside model middleware, `this` refers to the **Model**, not a document or query. [mongoosejs](https://mongoosejs.com/docs/middleware.html)

### Supported Model Method
Currently, Mongoose only supports model middleware for:
- **`insertMany`** - Bulk document insertion [techinsights.manisuec](https://techinsights.manisuec.com/mongodb/mongoose-pre-and-post-hooks-middlewares/)

### Basic Syntax

```javascript
// Pre hook - runs BEFORE insertMany
schema.pre('insertMany', function(docs) {
  // docs = array of documents to insert
  // No next() callback!
  console.log(`Inserting ${docs.length} documents`);
});

// Post hook - runs AFTER insertMany
schema.post('insertMany', function(docs) {
  // docs = array of inserted documents
  console.log('Documents inserted:', docs);
});
```

### Key Characteristics

**No `next()` callback**: Unlike document/query middleware, model middleware doesn't use `next()` [mongoosejs](https://mongoosejs.com/docs/6.x/docs/middleware.html)

**Synchronous by default**: Designed for quick transformations before bulk operations [mongoosejs](https://mongoosejs.com/docs/middleware.html)

**`this` context**: Refers to the Model class, not individual documents [wdk-docs.github](https://wdk-docs.github.io/mongoose-docs/guide/Middleware/)

**Direct parameter**: Receives `docs` array directly as the only parameter [mongoosejs](https://mongoosejs.com/docs/middleware.html)

### Common Use Cases

**1. Add timestamps to all docs**: [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)
```javascript
schema.pre('insertMany', function(docs) {
  docs.forEach(doc => {
    doc.createdAt = new Date();
  });
});
```

**2. Normalize data**: [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)
```javascript
schema.pre('insertMany', function(docs) {
  docs.forEach(doc => {
    doc.email = doc.email.toLowerCase();
    doc.name = doc.name.trim();
  });
});
```

**3. Add default values**:
```javascript
schema.pre('insertMany', function(docs) {
  docs.forEach(doc => {
    doc.status = doc.status || 'active';
  });
});
```

**4. Logging bulk operations**: [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)
```javascript
schema.post('insertMany', function(docs) {
  console.log(`Successfully inserted ${docs.length} users`);
});
```

### Async Operations

Use `async/await` for asynchronous tasks: [mongoosejs](https://mongoosejs.com/docs/middleware.html)

```javascript
schema.pre('insertMany', async function(docs) {
  // Can perform async operations
  await someAsyncValidation(docs);
  
  docs.forEach(doc => {
    doc.processed = true;
  });
  // Implicit return continues execution
});
```

### Important Notes
- Only works with `Model.insertMany()`, not individual `doc.save()` [mongoosejs](https://mongoosejs.com/docs/middleware.html)
- Bypasses individual document validation by default [mongoosejs](https://mongoosejs.com/docs/middleware.html)
- Cannot access individual document `this` context [wdk-docs.github](https://wdk-docs.github.io/mongoose-docs/guide/Middleware/)
- Faster than document middleware for bulk operations [geeksforgeeks](https://www.geeksforgeeks.org/mongodb/understanding-mongoose-middleware-in-node-js/)

### Why Limited Support?
Model middleware is less common because most operations (find, update, delete) use query middleware instead. Only `insertMany` needs model-level hooks since it's a true bulk operation that doesn't go through document lifecycle. [techinsights.manisuec](https://techinsights.manisuec.com/mongodb/mongoose-pre-and-post-hooks-middlewares/)