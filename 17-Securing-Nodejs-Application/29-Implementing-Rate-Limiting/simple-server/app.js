import express from "express";
import bcrypt from "bcrypt";

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const rateLimitScore = {};
function rateLimiter({ windowSizeInSec, numberOfRequests }) {
  return (req, res, next) => {
    console.log(rateLimitScore);

    const currentTime = Date.now() / 1000;
    if (
      !rateLimitScore[req.ip] ||
      Math.round(currentTime - rateLimitScore[req.ip].startTime) >=
        windowSizeInSec
    )
      rateLimitScore[req.ip] = {
        startTime: currentTime,
        count: 0,
      };

    if (rateLimitScore[req.ip].count >= numberOfRequests) {
      console.log("rate limit exceeded!");
      return res.status(429).end();
    }

    rateLimitScore[req.ip].count++;
    console.log(rateLimitScore);
    next();
  };
}

app.get(
  "/",
  rateLimiter({ windowSizeInSec: 5, numberOfRequests: 2 }),
  (req, res) => {
    res.send("<h1>Hello World!</h1>");
  },
);

app.get(
  "/register",
  rateLimiter({ windowSizeInSec: 5, numberOfRequests: 2 }),
  async (req, res) => {
    bcrypt.hash("123456", 14);
    return res.json({ message: "Registered Successfully" });
  },
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
