/*
 db.users.find({$nor:[{$jsonSchema:db.getCollectionInfos({name:"users"})[0].options.validator.$jsonSchema}]})
*/

/*
const result = await db.command({ validate: "users" });
console.log(JSON.stringify(result));

{
  "valid": true,
  "repaired": false,
  "repairMode": "None",
  "ns": "test.users",
  "uuid": "647a4e97-b794-4ae7-bd2d-cdc620045ab0",
  "warnings": [
    "Detected one or more documents not compliant with the collection's schema. Check logs for log id 5363500."
  ],
  "errors": [],
  "extraIndexEntries": [],
  "missingIndexEntries": [],
  "nInvalidDocuments": 0,
  "nNonCompliantDocuments": 2,
  "nrecords": 3,
  "corruptRecords": [],
  "nIndexes": 1,
  "keysPerIndex": { "_id_": 3 },
  "indexDetails": {
    "_id_": {
      "valid": true,
      "spec": { "v": 2, "key": { "_id": 1 }, "name": "_id_" }
    }
  },
  "ok": 1
}
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/test");
await client.connect();

const db = client.db();
const usersCollection = db.collection("users");

const collectionInfo = await db.listCollections({ name: "users" }).toArray();
const schema = collectionInfo[0].options.validator.$jsonSchema;
console.log(schema);
/*
{
  required: [ 'name', 'age' ],
  properties: {
    _id: { bsonType: 'objectId' },
    name: { bsonType: 'string', minLength: 1, maxLength: 20 },
    age: { bsonType: 'int', minimum: 18, maximum: 60 }
  },
  additionalProperties: false
}
*/

const invalidDocs = await usersCollection
  .find({ $nor: [{ $jsonSchema: schema }] })
  .toArray();

console.log(invalidDocs);

client.close();
