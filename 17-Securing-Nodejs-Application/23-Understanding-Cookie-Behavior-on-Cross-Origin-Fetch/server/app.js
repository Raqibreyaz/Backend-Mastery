import https from "node:https";
import { readFileSync } from "node:fs";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const DOMAIN = "api.local.com";
const PORT = 443;

app.use(cors({ origin: ["http://local.com:5500"], credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const authMiddleware = (req, res, next) => {
  if (req.cookies.sid || req.url === "/login") {
    return next();
  }
  return res.status(401).json({ error: "Not logged in!" });
};

const sslOptions = {
  key: readFileSync("./key.pem"),
  cert: readFileSync("./cert.pem"),
};

app.get("/user", authMiddleware, (req, res) => {
  res.json({
    name: "Sanjay Singh Rawat",
    email: "sanjayrawat@gmail.com",
  });
});

app.post("/login", (req, res) => {
  res.cookie("sid", "12345", {
    domain: ".local.com",
    sameSite: "none",
    secure: true,
    // sameSite: "lax",
  });
  res.json({ message: "Logged in successfully.", user: req.body });
});

https.createServer(sslOptions, app).listen(PORT, DOMAIN, () => {
  console.log(`🚀 HTTPS server running at http://${DOMAIN}:${PORT}`);
});

// app.listen(PORT, DOMAIN, () => {
//   console.log(`🚀 Visit http://${DOMAIN}:${PORT}`);
// });
