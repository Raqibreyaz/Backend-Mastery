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
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false,
  message: "Too many requests received, Try Later!",
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

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
