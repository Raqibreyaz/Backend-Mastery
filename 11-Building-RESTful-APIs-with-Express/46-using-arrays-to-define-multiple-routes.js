import express from "express";

const app = express();

app.get(["/directory", "/folder", /^\/(\d)$/], (req, res) => {
  res.json({ message: req.params });
});

app.listen(3000, () => console.log("server is running at port 3000"));
