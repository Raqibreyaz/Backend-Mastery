/*
Ordered Inserts

    -> Documents are inserted in order.
    -> If any insert fails, remaining inserts are stopped, and an error is thrown.
    -> To continue inserting remaining valid documents, use:
        { ordered: false }
    -> by default: it is {ordered:true}
*/

import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/test");
await client.connect();

const db = client.db();
const usersCollection = db.collection("users");

/*
1. will fail when objectId already exists for a doc
2. will stop creating other valid entries also
3. use {ordered:false} to continue with others
*/
await usersCollection.insertMany(
  [
    { name: "ram" },
    { name: "shyam", _id: new ObjectId("69778a5b4589a6cef18ce5b5") },
    { name: "sundar" },
  ],
  //   { ordered: true },
  //   { ordered: false },
);
