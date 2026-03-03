import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 80;

app.use(cookieParser());

app.get("/", (req, res) => {
  if (!req.cookies.sid) {
    return res.send("You are not logged. <br> <a href='/login'>Login</a>");
  }
  res.send("Welcome!");
});

app.get("/login", (req, res) => {
  res.cookie("sid", "54321", {
    httpOnly: true,
    domain: ".local.com",
  });
  res.redirect("/");
});

app.listen(PORT, (error) => {
  if (error) return console.log(error);
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
