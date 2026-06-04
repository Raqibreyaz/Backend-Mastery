/*
1. order matters for middlewares, as if one matches the route then next one will not run

2. if the global middleware placed at end then it will not run automatically, it will require manual use of next()

*/

import express from "express";

const app = express();

// app.use((req, res, next) => {
//   console.log("global middleware ran");

//   req.on("data", (chunk) => {
//     req.body = JSON.parse(chunk.toString());
//     next();
//   });
// });

// inbuilt way to parse the json body
app.use(express.json())

app.get("/", (req, res) => {
  console.log(req.url);
  console.log(req.route.path);

  res.end("welcome to get home!");
});

app.get("/login", (req, res) => {
  console.log(req.url);
  console.log(req.route.path);

  res.end("user logged in!");
});

app.post("/login", (req, res) => {
  res.send(`user ${req.body.name} is now logged in!`);
});

app.listen(4000);
