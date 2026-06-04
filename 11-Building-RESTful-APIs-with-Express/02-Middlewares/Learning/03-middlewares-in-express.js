/*
1. by default express invokes it's own error middleware if an error occurs + error middleware missing

2. error middleware invokes anytime if next() is invoked with truthy value

3. if we dont invoke next(val) for error middleware still express calls it
*/

import express from "express";

const app = express();

app.get("/", [
  (req, res, next) => {
    res.write("running middleware 1");

    // giving any truthy value to next() will call error middleware
    next(1);
    res.end("!");
  },
  (req, res) => {
    res.write("running middleware 2");
  },
  (err, req, res, next) => {
    next(" ");
    res.end("running error middleware");
  },
  (err, req, res, next) => {
    console.log("error handler middleware 2");
  },
]);

app.listen(4000);
