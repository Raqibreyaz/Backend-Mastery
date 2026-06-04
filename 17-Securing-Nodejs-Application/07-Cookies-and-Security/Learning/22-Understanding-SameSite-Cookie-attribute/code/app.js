import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 4000;

app.use(cookieParser());

const authMiddleware = (req, res, next) => {
  if (req.cookies.sid || req.url === "/login") {
    return next();
  }
  return res.send('You are not logged in<br> <a href="/login">Login</a>');
};

app.use(authMiddleware, express.static("./public"));

app.get("/", authMiddleware, (req, res) => {
  res.send(`
    Hello World
    <br>
    <form action="http://localhost:4000/cookie.png" method="post">
        <button>Open Cookie Image</button>
    </form>`);
});

app.get("/login", (req, res) => {
  res.cookie("sid", "12345", { sameSite: "lax", secure: true });
  res.redirect(req.headers.referer || "/");
});

app.post("/cookie.png", (req, res) => {
  res.sendFile(`${import.meta.dirname}/public/cookie.png`);
});

app.listen(PORT, () => {
  console.log(`🚀 Visit http://localhost:${PORT}`);
});
