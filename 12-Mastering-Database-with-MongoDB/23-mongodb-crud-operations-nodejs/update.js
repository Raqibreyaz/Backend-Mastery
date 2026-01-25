import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

await client.connect();

const db = client.db("school");

const studentCollection = db.collection("students");

/* updating document */
await studentCollection.updateOne(
  { _id: new ObjectId("6975d26e204f6d013aeed40a") },
  { $set: { age: 43 } },
);

await studentCollection.replaceOne(
  { _id: new ObjectId("6975d26e204f6d013aeed40a") },
  { class: 9 },
);

/* updatin collection name */
const res = await db.renameCollection("students", "vidyarthi");
console.log(res);

client.close();
