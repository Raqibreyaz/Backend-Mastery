/*
-> MongoDB provides drivers for every popular backend language to work with it.
-> We also have Driver for NodeJS
-> Installation: npm i mongodb

-> Import and Connect
    import { MongoClient } from "mongodb";
    const client = new MongoClient("mongodb://127.0.0.1:27017/");
    await client.connect(); // Connect to MongoDB server

-> Database Access
    const db = client.db();               // Default 'test' DB
    const db = client.db("DataBaseName"); // Use a specific DB

-> View Collections
    console.log(await db.listCollections().toArray());
    // Lists all collections in the selected DB

-> Access Documents in a Collection
    const collection = db.collection("fruits");
    console.log(await collection.find().toArray());
    // Fetches all documents in the 'fruits' collection

-> List All Databases
    const admin = client.db().admin();
    console.log(await admin.listDatabases());
    // Lists all databases on the server
*/

import { MongoClient } from "mongodb";

const mongodbUrl = "mongodb://localhost:27017";
const client = new MongoClient(mongodbUrl);

await client.connect();

const db = client.db("todoApp");
const admin = client.db().admin();

// const collections = await db.listCollections().toArray();
// console.log(collections);

const collection = db.collection("todos");

const todos = await collection.find().toArray();
console.log(todos);

const allDbs = await admin.listDatabases();
console.log(allDbs);

await client.close()
