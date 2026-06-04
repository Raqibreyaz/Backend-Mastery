import express from "express";
import bcrypt from "bcrypt";

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/register", async (req, res) => {
  bcrypt.hash("123456", 14);
  return res.json({ message: "Registered Successfully" });
});

app.listen(PORT, () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});