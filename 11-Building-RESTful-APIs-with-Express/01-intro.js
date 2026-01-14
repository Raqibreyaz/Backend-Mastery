import express from "express";

const app = express();

app.disable("x-powered-by");

app.get("/", (req, res) => {
    res.send("hello world");
//   res.setHeader("Content-Type", "text/html; charset=utf-8");
//   res.write("hello world");
//   res.end("!");
});

app.listen(3000, () => console.log("server is running at port 3000"));
