import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

await client.connect();

const db = client.db("school");

/* deleting a collection */
const studentCollection = db.collection('students')
console.log(await studentCollection.drop())

/* deleting a document */
// const teachersCollection = db.collection("teachers");
// const res = await teachersCollection.deleteOne({
//   _id: new ObjectId("6975cd08ad38bcfd0fca92cf"),
// });
// console.log(res);

/* deleting a property */
const teachersCollection = db.collection("teachers");
const res = await teachersCollection.updateOne(
  {
    _id: new ObjectId("6975cd08ad38bcfd0fca92d0"),
  },
  { $unset: { age: 52 } },
);
console.log(res);

const isDeleted = await db.dropDatabase();
console.log(isDeleted);

client.close();
