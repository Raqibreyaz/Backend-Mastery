/*
-> These two control how MongoDB handles documents that fail validation.

1) Validation Action
-> What happens when a document fails validation?
    -> error (default): Reject the insert or update.
    -> warn: Allow the operation but log a warning.
-> validationAction: "error" // or "warn"

2) Validation Level
-> Which documents are checked during validation?
    -> strict (default): Validate all inserts and updates.
    -> moderate: Validate only documents that already have the validated fields.
    -> off (MongoDB 7.0+): Disable validation.
-> validationLevel: "strict" // or "moderate"
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/test");
await client.connect();

const db = client.db();

await db.command({
  collMod: "users",
  validator: {
    $jsonSchema: {
      required: ["name", "age"],
      properties: {
        _id: {
          bsonType: "objectId",
        },
        name: {
          bsonType: "string",
          minLength: 1,
          maxLength: 20,
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 60,
        },
      },
      additionalProperties: false,
    },
  },
  validationAction:"error",
  validationLevel:"moderate"
});

client.close()