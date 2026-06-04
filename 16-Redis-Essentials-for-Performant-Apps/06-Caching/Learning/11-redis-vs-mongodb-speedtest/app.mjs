import { createClient } from "redis";
import { MongoClient } from "mongodb";

const redisClient = createClient();
const mongoClient = new MongoClient("mongodb://admin:admin@localhost:27017");

await mongoClient.connect();
await redisClient.connect();

const db = mongoClient.db();
const collection = db.collection("mongoTest");

await redisClient.flushAll();
await collection.deleteMany();

// 📝 Redis Write
console.time("Redis Write");
await redisClient.json.set("user", "$", { _id: "123", name: "ProCodrr" });
console.timeEnd("Redis Write");

// 📝 MongoDB Write
console.time("MongoDB Write");
await collection.insertOne({ _id: "123", name: "ProCodrr" });
console.timeEnd("MongoDB Write");

// // 📝 Redis Read
// console.time("Redis Read");
// await redisClient.json.get("user");
// console.timeEnd("Redis Read");

// // 📝 MongoDB Read
// console.time("MongoDB Read");
// await collection.findOne({ _id: "123" });
// console.timeEnd("MongoDB Read");

await redisClient.quit();
await mongoClient.close();
