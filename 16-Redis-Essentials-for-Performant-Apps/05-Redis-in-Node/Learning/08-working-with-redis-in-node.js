import { createClient } from "redis";

const redisClient = await createClient().connect();

// const result = await redisClient.set("name", "Raquib");
// const result = await redisClient.set(
//   "user",
//   JSON.stringify({ name: "raquib", age: 32 }),
// );
const result = await redisClient.get('user')
console.log(result);

redisClient.destroy();
