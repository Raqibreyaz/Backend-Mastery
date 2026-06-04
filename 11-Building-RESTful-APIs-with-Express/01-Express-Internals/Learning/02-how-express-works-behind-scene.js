import http from "http";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

http.createServer(app).listen(4000);
