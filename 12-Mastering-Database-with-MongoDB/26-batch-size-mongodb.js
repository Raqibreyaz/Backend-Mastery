/*
What is Batch Size?
-> MongoDB returns documents in batches, not all at once.
-> Batch size controls how many docs are returned per network request.

Set Batch Size
-> const cursor = collection.find().batchSize(10);
-> This sets the batch size to 10 documents.
-> MongoDB will send results in chunks of 10 until all are returned.

Note-> Improves memory usage and performance for large datasets.
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("todoApp");
const todoCollection = db.collection("todos");

const cursor = todoCollection.find().batchSize(2);
const data = await cursor.toArray();
console.log(data);
