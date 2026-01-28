import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db();
// const collection = db.collection("users");

// creating a 'users' collection with validation
await db.command({
  create: "users",
  validator: {
    name: {
      $type: "string",
    },
    age: { $type: "int" },
  },
});

// adding validation on existing collection
// await db.command({
//   collMod: "users",
//   validator: {
//     name: {
//       $type: "string",
//     },
//     age: { $type: "int" },
//   },
// });

client.close();
