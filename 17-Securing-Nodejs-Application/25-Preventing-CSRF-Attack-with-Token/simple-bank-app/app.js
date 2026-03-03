import express from "express";
import cookieParse from "cookie-parser";
import { randomBytes } from "node:crypto";

const app = express();
const PORT = 4000;
let amount = 10000;

const sessions = {};

app.use(cookieParse());

app.use(express.urlencoded({ extended: false }));

// Middleware for authentication check
const csrfProtection = (req, res, next) => {
  if (!req.cookies.sid)
    return res.send('You are not logged <br> <a href="/login">Login</a>');

  let csrfToken = null;

  // attach a csrf token if not yet did
  if (req.method === "GET" && req.headers.accept?.includes("text/html")) {
    csrfToken = randomBytes(16).toString("hex");
    sessions[req.cookies.sid] = csrfToken;
    req.csrfToken = csrfToken;
  }

  // for idempotent requests, check if csrfToken came with it
  if (
    req.method === "POST" &&
    (!req.body?.csrfToken || req.body.csrfToken !== sessions[req.cookies.sid])
  ) {
    return res.send("Invalid CSRF Token!");
  }

  if (!req.csrfToken) req.csrfToken = req.body.csrfToken;

  next();
};

// Middleware to set CSP
app.use((req, res, next) => {
  if (req.headers.accept?.includes("text/html")) {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self';\
       frame-ancestors 'none'`,
    );
  }
  next();
});

// Serve dynamic HTML
app.get("/", csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bank App</title>
      <meta charset="UTF-8" />
    </head>
    <body>
      <h1>Amount: ₹<span id="amount">${amount}</span></h1>
      <form method="POST" action="/pay">
        <input name="csrfToken" value="${csrfToken}" hidden/>
        <button type="submit">Pay</button>
      </form>
    </body>
    </html>
  `);
});

// Handle payment
app.post("/pay", csrfProtection, (req, res) => {
  amount -= 1000;
  res.redirect("/");
});

app.get("/login", (req, res) => {
  const sid = randomBytes(16).toString("hex");
  res.cookie("sid", sid, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
