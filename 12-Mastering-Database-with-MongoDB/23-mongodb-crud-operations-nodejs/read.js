import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

await client.connect();

const db = client.db("todoApp");
// console.log(await db.listCollections().toArray());

const collection = db.collection("todos");

const todos = await collection.find({ completed: false }).toArray();
console.log(todos);

client.close();
