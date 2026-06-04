/*
What is a Cursor?
    -> A Cursor is a JS object returned by .find().
    -> It stores query metadata and doesn't hit DB until a method like .toArray() or .next() is called.

Cursor as an Async Iterator
    -> const cursor = collection.find(); // returns a cursor
    -> cursor[Symbol.asyncIterator];     // true ⇒ it's iterable

    -> You can use:
        for await (const doc of cursor) {
        console.log(doc);
        }

Cursor Methods(few)

    -> await cursor.next();     // Returns next document or null
    -> await cursor.hasNext();  // Returns true/false
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("todoApp");
const todoCollection = db.collection("todos");

let docCount = 30 - (await todoCollection.countDocuments());
console.log(`total documents to be added: ${docCount}`);

for (let i = 1; i <= docCount; i++)
  await todoCollection.insertOne({
    title: `Title ${i}`,
    completed: i % 2 == 0,
  });

const cursor = todoCollection.find();

for (
  let doc = null, count = 0;
  count < 10 && (doc = await cursor.next());
  count++
) {
  console.log(doc);
  count++;
}

const restTodos = await cursor.toArray();
console.log(restTodos);

client.close();
