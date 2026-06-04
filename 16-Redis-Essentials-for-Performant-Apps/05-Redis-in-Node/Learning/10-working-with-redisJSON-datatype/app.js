import connectRedis from "./redisClient.js";

const redisClient = await connectRedis();

// const res = await redisClient.json.get("user:1");
// const res = await redisClient.json.get("user:1", { path: "$.hobbies" });
const res = await redisClient.json.arrLen("user:1", { path: "$..hobbies" });

console.log(res);

redisClient.destroy();
