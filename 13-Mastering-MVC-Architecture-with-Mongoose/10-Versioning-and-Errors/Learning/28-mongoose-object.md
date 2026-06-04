## Good-to-Know Mongoose Object Features

### 1. **Access to Native MongoDB Types**
```javascript
const mongoose = require('mongoose');

// Create ObjectIds programmatically
const ObjectId = mongoose.Types.ObjectId;
const newId = new ObjectId();

// Other types available
mongoose.Types.Decimal128;
mongoose.Types.Buffer;
mongoose.Types.Array;
mongoose.Types.Map;
```

Useful for generating IDs before saving or comparing ObjectIds. [mongoosejs](https://www.mongoosejs.cn/docs/api.html)

### 2. **Multiple Database Connections**
```javascript
// Default connection
mongoose.connect('mongodb://localhost/db1');

// Create additional connections
const conn2 = mongoose.createConnection('mongodb://localhost/db2');
const conn3 = mongoose.createConnection('mongodb://localhost/db3');

// Each connection has its own models
const User1 = mongoose.model('User', userSchema); // uses default
const User2 = conn2.model('User', userSchema);    // uses conn2
```

Perfect for multi-tenant applications or connecting to multiple databases.

### 3. **Global Plugins**
```javascript
// Apply middleware to ALL schemas globally
mongoose.plugin((schema) => {
  schema.pre('save', function() {
    console.log('Saving:', this);
  });
});

// Now every model automatically gets this hook
```

Great for adding timestamps, soft deletes, or logging across all models.

### 4. **Access to All Registered Models**
```javascript
// Get a model by name without importing it
const User = mongoose.model('User');

// Check if a model exists
if (mongoose.modelNames().includes('User')) {
  // Model is registered
}

// Get all registered model names
console.log(mongoose.modelNames()); // ['User', 'Post', 'Comment']
```

Useful for dynamic model access or avoiding circular dependencies.

### 5. **Custom Schema Types**
```javascript
// Create your own custom SchemaType
class CustomType extends mongoose.SchemaType {
  cast(val) {
    // Custom validation/casting logic
    return val.toLowerCase();
  }
}

mongoose.Schema.Types.CustomType = CustomType;

// Use it in schemas
const schema = new Schema({
  myField: { type: CustomType }
});
```

For specialized data types your app needs. [mongoosejs](https://mongoosejs.com/docs/schematypes.html)

### 6. **Global Configuration Options**
```javascript
// Set defaults for all schemas
mongoose.set('strictQuery', false);
mongoose.set('autoIndex', false);
mongoose.set('debug', true); // Log all queries
mongoose.set('bufferCommands', false);

// Or set during connect
mongoose.connect(uri, {
  autoIndex: false,
  maxPoolSize: 10
});
```

### 7. **Query Helpers**
```javascript
// Add custom query methods globally
mongoose.Query.prototype.byName = function(name) {
  return this.where({ name: new RegExp(name, 'i') });
};

// Now available on all queries
User.find().byName('john');
Post.find().byName('mongodb');
```

### 8. **Connection State Checking**
```javascript
// Check connection readyState
console.log(mongoose.connection.readyState);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

// Connection events you discovered
mongoose.connection.on('connected', () => {});
mongoose.connection.on('error', (err) => {});
mongoose.connection.on('disconnected', () => {});
mongoose.connection.on('reconnected', () => {});
```

### 9. **Access Schema Types for Validation**
```javascript
// Reuse Mongoose's built-in validators
const { SchemaTypes } = mongoose;

// Access validator functions
SchemaTypes.String.checkRequired(value);
SchemaTypes.Number.cast(value);
```

### 10. **Document `$locals` for Middleware**
```javascript
// Store temporary data during middleware execution
userSchema.pre('save', function() {
  this.$locals.wasNew = this.isNew;
});

userSchema.post('save', function() {
  if (this.$locals.wasNew) {
    console.log('New document created');
  }
});
```

The `$locals` object is perfect for passing data between pre and post hooks without polluting the actual document. [mongoosejs](https://mongoosejs.com/docs/api/document.html)

### Bonus: Native Driver Access (You Found!)
```javascript
// Access MongoDB native driver
const db = mongoose.connection.db;
const collection = db.collection('users');

// Run native driver operations
await collection.createIndex({ email: 1 });
await collection.aggregate([...]);

// Access MongoDB client
const client = mongoose.connection.getClient();
```

These features give you deep control over Mongoose's behavior and allow you to extend it for your specific use cases!