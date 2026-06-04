import { createClient } from "redis";

export default async function connectRedis() {
  const redisClient = await createClient()
    .on("error", (err) => {
      console.log("Redis client error", err);
      process.exit(1);
    })
    .connect();

  return redisClient;
}
