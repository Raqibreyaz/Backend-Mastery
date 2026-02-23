import { createClient } from "redis";

// Publisher client
const redisClient = createClient();
await redisClient.connect();

// Subscribe to a channel
await redisClient.subscribe(["node_channel", "cli_channel"], (message) => {
  console.log("Received:", message);
});

setTimeout(async () => {
  await redisClient.unsubscribe("cli_channel");
}, 5000);
