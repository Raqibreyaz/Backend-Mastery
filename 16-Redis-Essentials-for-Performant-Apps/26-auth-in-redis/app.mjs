import { createClient } from "redis";

const redisClient = createClient({
  username:"default",
  password: "my$trongPassword",
});
await redisClient.connect();

const result = await redisClient.ping();
console.log(result);

await redisClient.quit();
