import { createClient } from "redis";

export default async function connectRedis() {
  const redisClient = await createClient()
    .on("error", (err) => {
      console.log("Redis client error", err);
    })
    .connect();

  return redisClient;
}
