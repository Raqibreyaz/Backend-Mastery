/*
schema validation:
    {
    name: {
        $type: 'string'
    },
    age: {
        $type: 'int',
        $gte: 18
    }
    }

- it allows you to add extra fields which are not in your schema
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db();

// const collections = await db.listCollections().toArray();
// console.log(collections);

const userCollection = db.collection("users");

await db.command({
  collMod: "users", //collection modifier
  validator: {
    name: {
      $type: "string",
    },
    age: {
      $type: "int",
      $gte: 18,
      $lte: 60,
    },
  },
  validationAction: "warning",  
});

// try {
//   await userCollection.insertOne({ name: "raquib", age: 10 });
// } catch (error) {
//   console.log(error);
// }

client.close();
