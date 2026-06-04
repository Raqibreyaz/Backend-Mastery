import express from "express";
import bcrypt from "bcrypt";
import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = 4000;

const limiter = rateLimit({
  windowMs: 20000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const lastRequestTime = {};
function throttle({ timeGapInSec = 5 }) {
  return (req, res, next) => {
    const clientIp = req.ip;
    const currentTime = Date.now();

    if (lastRequestTime[clientIp]) {
      const lastTime = lastRequestTime[clientIp];
      const timePassed = currentTime - lastTime;

      // delay for rest of the time remaining
      if (timePassed < timeGapInSec * 1000) {
        const delay = timeGapInSec * 1000 - timePassed;

        // update last request execution time time by current time + delay
        lastRequestTime[clientIp] = currentTime + delay;

        setTimeout(next, delay);
      }
      // allow when time passed
      else {
        lastRequestTime[clientIp] = currentTime;
        next();
      }
    }
    // direct allow for first request
    else {
      lastRequestTime[clientIp] = currentTime;
      next();
    }
  };
}

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(limiter);
// app.use(throttle({ timeGapInSec: 5 }));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/register", async (req, res) => {
  bcrypt.hashSync("123456", 14);
  return res.json({ message: "Registered Successfully" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
