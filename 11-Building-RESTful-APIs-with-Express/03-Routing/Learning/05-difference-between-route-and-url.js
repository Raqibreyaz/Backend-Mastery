/*
url: whole url on which user sent request, like /user/login
route: a part of the url or the whole url(sometimes), like /login, /signup, /user/login

*/

import express from "express";

const app = express();

app.get("/", (req, res) => {
  console.log(req.url);
  console.log(req.route.path);

  res.end("welcome to get home!");
});

app.get("/login", (req, res) => {
  console.log(req.url);
  console.log(req.route.path);

  res.end("welcome to get home!");
});

app.listen(4000);
