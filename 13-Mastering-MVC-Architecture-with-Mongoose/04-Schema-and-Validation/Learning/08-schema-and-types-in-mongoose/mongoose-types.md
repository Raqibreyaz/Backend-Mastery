# Mongoose Data Types

Mongoose provides several built-in schema types that map to MongoDB’s BSON types.

## 1. String
   - Represents text data.
   - Equivalent to BSON `String`.
   - Example:
     ```js
     name: String
     ```

## 2. Number
   - Represents numerical values.
   - Equivalent to BSON `Double`.
   - Example:
     ```js
     age: Number
     ```

## 3. Boolean
   - Represents a true/false value.
   - Equivalent to BSON `Boolean`.
   - Example:
     ```js
     isActive: Boolean
     ```

## 4. Date
   - Represents a date/time.
   - Equivalent to BSON `Date`.
   - Example:
     ```js
     createdAt: Date
     ```

## 5. Buffer
   - Stores binary data (e.g., images, files).
   - Equivalent to BSON `Binary Data`.
   - Example:
     ```js
     profilePicture: Buffer
     ```

## 6. ObjectId
   - Represents MongoDB ObjectId.
   - Used for referencing other documents.
   - Equivalent to BSON `ObjectId`.
   - Example:
     ```js
     userId: mongoose.Schema.Types.ObjectId
     ```

## 7. Mixed (Schema.Types.Mixed)
   - Stores any arbitrary data type.
   - Equivalent to BSON `Mixed`.
   - Example:
     ```js
     meta: mongoose.Schema.Types.Mixed
     ```

## 8. Array
   - Represents an array of values.
   - Example:
     ```js
     tags: [String]
     ```

## 9. Decimal128
   - Represents high-precision floating-point numbers.
   - Equivalent to BSON `Decimal128`.
   - Example:
     ```js
     price: mongoose.Schema.Types.Decimal128
     ```

## 10. Map
   - Represents a key-value pair object where keys are strings.
   - Equivalent to BSON `Object`.
   - Example:
     ```js
     attributes: { type: Map, of: String }
     ```

## 11. UUID (Mongoose v7+)
   - Stores Universally Unique Identifiers.
   - Equivalent to BSON `UUID`.
   - Example:
     ```js
     sessionId: mongoose.Schema.Types.UUID
     ```

## Example Schema

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  isActive: Boolean,
  createdAt: Date,
  profilePicture: Buffer,
  userId: mongoose.Schema.Types.ObjectId,
  meta: mongoose.Schema.Types.Mixed,
  tags: [String],
  price: mongoose.Schema.Types.Decimal128,
  attributes: { type: Map, of: String },
  sessionId: mongoose.Schema.Types.UUID
});

const User = mongoose.model('User', userSchema);
