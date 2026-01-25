import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

await client.connect();

const db = client.db("school");

const studentCollection = db.collection("students");
const teachersCollection = db.collection("teachers");

const res1 = await studentCollection.insertOne({ name: "Aman", age: 15 });
const res2 = await teachersCollection.insertMany([
  { name: "raquib", age: 98 },
  { name: "reyaz", age: 83 },
]);

console.log(res1);
console.log(res2);

client.close();
