import express from "express";
import cookieParse from "cookie-parser";

const app = express();
const PORT = 4000;
let amount = 10000;

// app.use(cors({ origin: ["http://local.com:5500"], credentials: true }));

app.use(cookieParse());

// Middleware to set CSP
app.use((req, res, next) => {
  if (req.headers.accept?.includes("text/html")) {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self' 'sha256-iIfSqlkfEA9iwdB6Mke3FJIoSjOwva2Sn7dFZQ2D8qo=';\
       frame-ancestors 'none'`,
    );
  }
  next();
});

// Serve dynamic HTML
app.get("/", (req, res) => {
  if (!req.cookies.sid) {
    return res.send('You are not logged <br> <a href="/login">Login</a>');
  }
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Bank App</title>
      <meta charset="UTF-8" />
    </head>
    <body>
      <h1>Amount: ₹<span id="amount">${amount}</span></h1>
      <form>
        <button type="submit">Pay</button>
      </form>
      <script>
        document
        .querySelector("form")
        .addEventListener("submit", async (event) => {
          event.preventDefault()
          await fetch("/pay", {
            method: "POST",
            credentials: "include",
            headers: {
              "X-CSRF-Token": "1234",
            },
            });
          window.location.reload()
        });
      </script>
    </body>
    </html>
  `);
});

// Handle payment
app.post("/pay", (req, res) => {
  if (!req.cookies.sid) {
    return res.send("You are not logged.");
  }

  if (!req.headers["x-csrf-token"]) return res.send("csrf token missing!");

  amount -= 1000;
  res.end();
});

app.get("/login", (req, res) => {
  res.cookie("sid", "54321", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
