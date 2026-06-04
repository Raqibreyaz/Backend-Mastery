import { createClient } from "redis";

export default async function connectRedis() {
  const redisClient = await createClient()
    .on("error", (err) => {
      console.log("Redis client error", err);
    })
    .connect();

  redisClient.setJson = async function (key, data) {
    const res = await this.set(key, JSON.stringify(data));
    if (!res || res !== "OK") throw new Error(`Failed to set key: ${key}`);
  };
  redisClient.getJson = async function (key) {
    const res = await this.get(key);
    if (!res) throw new Error(`Failed to get key: ${key}`);
    return JSON.parse(res);
  };

  return redisClient;
}
