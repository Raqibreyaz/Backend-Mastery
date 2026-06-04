import { MongoClient } from "mongodb";

const mongoUrl =
  "mongodb+srv://<username>:<db_password>@cluster0.hm4ztqz.mongodb.net/?appName=Cluster0";

const client = new MongoClient(mongoUrl);
const db = client.db("sample_mflix");
const commentsCollection = db.collection("comments");

const comments = await commentsCollection.find().toArray();
console.log(comments);

client.close();
