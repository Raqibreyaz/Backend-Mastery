import express from "express";
import path from "path";

const app = express();
const PORT = 4000;

let amount = 1000000;

// Middleware to set CSP
app.use((req, res, next) => {
  if (req.headers.accept?.includes("text/html")) {
    res.setHeader("X-Frame-Options", "DENY");   
    res.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self';\
       frame-ancestors 'none'`
    );
  }
  next();
});

// Serve static assets
app.use("/static", express.static(path.join(import.meta.dirname, "public")));

// Serve dynamic HTML
app.get("/", (req, res) => {
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
        <button type="submit">Pay</button>
      </form>
    </body>
    </html>
  `);
});

// Handle payment
app.post("/pay", (req, res) => {
  amount = 0;
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
