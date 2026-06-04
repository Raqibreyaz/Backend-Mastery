import { MongoClient } from "mongodb";

const client = new MongoClient(
  "mongodb://reyaz:reyaz@localhost:27018/test?authSource=admin",
);
await client.connect()

const db = client.db()
const collection = db.collection('fruits')
const data = await collection.find().toArray()

console.log(data)

client.close()