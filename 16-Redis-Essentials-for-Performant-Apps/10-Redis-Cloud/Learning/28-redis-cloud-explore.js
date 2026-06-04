import { createClient } from "redis";

const username = "";
const password = "";
const url = "redis_url";
const redisClient = await createClient({ url, username, password }).connect();

const result = await redisClient.ping();
console.log(result);

redisClient.destroy();
