# JSON Schema Validation
-> Defines strict structure, data types, and rules for documents.
-> Supports nested validation.
-> additionalProperties: false blocks extra unwanted fields.

-> Example with Nested Fields:
```
db.createCollection("users", {
validator: {
    $jsonSchema: {
    bsonType: "object",
    required: ["name", "age", "address"],
    additionalProperties: false,
    properties: {
        name: { bsonType: "string" },
        age: { bsonType: "int", minimum: 18 },
        address: {
        bsonType: "object",
        required: ["city", "zip"],
        additionalProperties: false,
        properties: {
            city: { bsonType: "string" },
            zip: { bsonType: "int" }
        }
        }
    }
    }
}
});
```

## why 'bsonType' over 'type' ?
You use `bsonType` instead of `type` in MongoDB validation because MongoDB stores data in **BSON format** (Binary JSON), which has more specific data types than standard JSON Schema. [mongodb](https://www.mongodb.com/docs/manual/reference/bson-types/)

### Key Differences Between BSON and JSON Types

**BSON has extended numeric types** that JSON doesn't support: [mongodb](https://www.mongodb.com/community/forums/t/validation-using-latest-json-schema-version/2082)
- `int` - 32-bit integer
- `long` - 64-bit integer  
- `double` - 64-bit floating point
- `decimal` - 128-bit decimal (Decimal128)

JSON Schema only has a generic `number` type (essentially a double). If you used `type: "number"`, you couldn't distinguish between a 32-bit int and a 64-bit long, which matters for your file size field. [datacamp](https://www.datacamp.com/tutorial/mongodb-schema-validation)

**BSON has MongoDB-specific types**: [stackoverflow](https://stackoverflow.com/questions/45695312/json-schema-date-validation-not-suitable-for-mongodb)
- `objectId` - MongoDB's 12-byte ObjectID type
- `date` - ISODate timestamp
- `binData` - Binary data
- `regex` - Regular expression

These don't exist in standard JSON, so `bsonType` is required to validate them. [stackoverflow](https://stackoverflow.com/questions/45695312/json-schema-date-validation-not-suitable-for-mongodb)

## Practical Example

For your schemas, this distinction is critical: [datacamp](https://www.datacamp.com/tutorial/mongodb-schema-validation)

```javascript
// CORRECT - using bsonType
{
  _id: { bsonType: "objectId" },      // MongoDB ObjectID
  size: { bsonType: "long" },         // 64-bit integer for file sizes
  created: { bsonType: "date" }       // ISODate type
}

// WRONG - using JSON Schema type
{
  _id: { type: "string" },            // Treats ObjectID as string
  size: { type: "number" },           // Treats long as generic number
  created: { type: "string" }         // Treats date as string
}
```

## When to Use Each

**Use `bsonType`**: When working with MongoDB's `$jsonSchema` validator, always use `bsonType` for proper type checking. [red-gate](https://www.red-gate.com/simple-talk/featured/introducing-schema-validation-in-mongodb/)

**Use `type`**: The `type` keyword from standard JSON Schema is technically supported but rarely used in MongoDB contexts because it lacks precision for MongoDB's data types. [mongodb](https://www.mongodb.com/community/forums/t/validation-using-latest-json-schema-version/2082)

## Boolean Naming Quirk

Note that BSON uses `"bool"` (not `"boolean"`) as the type name: [datacamp](https://www.datacamp.com/tutorial/mongodb-schema-validation)

```javascript
isActive: { bsonType: "bool" }  // Correct
isActive: { type: "boolean" }    // Standard JSON Schema, less precise
```

MongoDB's implementation is based on JSON Schema draft 4 but extends it specifically for BSON types, which is why `bsonType` is the preferred and more accurate keyword. [red-gate](https://www.red-gate.com/simple-talk/featured/introducing-schema-validation-in-mongodb/)