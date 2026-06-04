import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(cors({ origin: ["http://127.0.0.1:3000"], credentials: true }));

app.get("/", (req, res) => {
  console.log(req.headers.cookie); //name=raquib; age=89
  console.log(req.cookies); //{ name: 'raquib', age: '89' }

  res.cookie("name", "raquib", {
    sameSite: "none",
    secure: true,
  });
  res.cookie("age", "89", {
    sameSite: "none",
    secure: true,
  });

  // res.set({
  //   "Set-Cookie": [
  //     "name=raquib;SameSite=None;Secure",
  //     "age=89;SameSite=None;Secure",
  //   ],
  //   "Access-Control-Allow-Credentials": true,
  //   hello: ["hello", "hello", "hello"],
  // });

  res.json({ message: "hello" });
});

app.listen(4000);
