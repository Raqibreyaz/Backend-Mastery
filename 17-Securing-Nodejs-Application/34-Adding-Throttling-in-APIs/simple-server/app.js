import express from "express";
import bcrypt from "bcrypt";
import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

const limiter = rateLimit({
  windowMs: 20 * 1000,
  limit: 5,
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false,
  message: "Too many requests received, Try Later!",
});

/*

r1  0 sec(r1 exec time)
  |
  |
  |
r2  currTime(r2 arrival time)
  |
  |
    GAP sec(r2 exec time, after GAP sec from r1 exec time)
*/

/*

r2  (r2 arrival time)
  |
  |
r1  0 sec(r1 exec time)
  |
  |
  |
  |
    GAP sec(r2 exec time, after GAP + (r1 - r2 time difference)sec)
*/

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

        setTimeout(() => {
          next();
        }, delay);
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

// Apply the rate limiting middleware to all requests.
app.use(limiter);

app.use(throttle({ timeGapInSec: 6 }));

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/register", async (req, res) => {
  bcrypt.hash("123456", 14);
  return res.json({ message: "Registered Successfully" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
