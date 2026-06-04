import { createClient } from "redis";

const redisClient = await createClient().connect();

const res = await redisClient.hSet("userHash2", { name: "raquib", age: 50 });
console.log(res);

await redisClient.quit()
