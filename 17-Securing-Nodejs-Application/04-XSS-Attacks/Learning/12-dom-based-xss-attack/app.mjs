import express from "express";

const app = express();
const port = 4000;

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use(express.static("./public"));

app.listen(port, () => {
  console.log(`DOM XSS demo running at http://localhost:${port}`);
});
