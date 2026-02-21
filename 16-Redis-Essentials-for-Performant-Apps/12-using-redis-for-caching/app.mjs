import express from "express";
import connectRedis from "./redisClient.js";

const app = express();
const redisClient = await connectRedis();

app.get("/users/:id", async (req, res) => {
  const cachedData = await redisClient.json.get(req.params.id);
  if (cachedData) return res.json(cachedData);

  const userData = await getUser(req.params.id);
  await redisClient.json.set(req.params.id, "$", userData);
  await redisClient.expire(req.params.id, 3600);
  res.json(userData);
});

app.put("/users/:id", async (req, res) => {
  const cachedData = await redisClient.json.get(req.params.id);
  if (cachedData) {
    await redisClient.del(req.params.id);
  }

  res.json({ message: "User updated successfull!" });
});

app.listen(4000, () => {
  console.log("Server started on 4000");
});

async function getUser(userId) {
  const response = await fetch(`https://fakestoreapi.com/users/${userId}`);
  return await response.json();
}
