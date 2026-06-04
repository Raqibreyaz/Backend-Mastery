/*
What is Projection?
-> Projection controls which fields are returned in the query result.

Include Fields
-> // Include only "name" and "email"
-> const users = await collection.find({}, { projection: { name: 1, email: 1 } }).toArray();

Exclude Fields
-> // Exclude "age"
-> const users = await collection.find({}, { projection: { age: 0 } }).toArray();

Note
-> 1 = include, 0 = exclude
-> You can't mix include and exclude (except for _id).
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("todoApp");
const todoCollection = db.collection("todos");
const cursor = todoCollection.find({}, { projection: { _id: 0 } });

const data = await cursor.toArray();
console.log(data);

client.close();
