/*
Cursor Chaining
-> Methods like .limit(), .skip(), .sort() return the cursor itself (not a promise).
-> You can chain them before executing with .toArray() or iterating.
-> Common Methods
    collection.find()
    .limit(5)                 // Limit result to 5 docs
    .skip(2)                  // Skip first 2 docs
    .sort({ name: 1, age: -1 }) // Sort by name ↑, then age ↓
-> map() method works at client side, it doesnt go to server
-> No DB call is made until you use .toArray(), .next(), or a loop.
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const n = 15;
const todoDb = client.db("todoApp");
const todoCollection = todoDb.collection("todos");

// const cursor = todoCollection.find().skip(n).limit(10).sort("title", -1);
// const cursor = todoCollection
//   .find({ completed: false })
//   .skip(n)
//   .limit(10)
//   .sort({ title: 1 });
const cursor = todoCollection
  .find()
  .skip(n)
  .limit(10)
  .sort({ title: 1 })
  //   .filter({ completed: false })
  .map(({ title }) => title);

// for (let doc = null; (doc = await cursor.next()); ) {
//   console.log(doc);
// }

const data = await cursor.toArray();
console.log(data);

client.close();
