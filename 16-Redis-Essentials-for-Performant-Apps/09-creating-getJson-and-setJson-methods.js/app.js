import connectRedis from "./redisClient.js  ";

const client = await connectRedis();

await client.setJson("user", {
  name: "raquib",
  age: 32,
  email: "raquib@raquib.com",
});

const data = await client.getJson("user");
console.log(data);

client.destroy();
