import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("storageApp");

// db.listCollections()
// await db.createCollection("vegetables");  //creates empty collection
// const result = await db.command({ create: "fruits" });
const result = await db.command({ hostInfo: 1 });

console.log(JSON.stringify(result));

client.close();
