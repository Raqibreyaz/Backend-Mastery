import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(201).json({ message: "hello world" });
});

app.listen(4000);
