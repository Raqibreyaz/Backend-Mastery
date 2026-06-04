/*
1. express.static("public"), serves all the files of public folder

2. we cant drag the moving pointer of seek bar while streaming video by typical streaming way

3. res.sendFile() handles sending entire file using streams + handling different seek poisitions while video streaming

4. actually we have to maintain ranges, "accept-ranges: bytes" in headers and sending only the data provided in the 'range' header of request
*/

import express from "express";
import { createReadStream } from "node:fs";

const app = express();

app.use(express.static("public"));

app.get("/", (req, res, next) => {
  res.send("hello world!");
});

app.get("/download", (req, res) => {
  //   const stream = createReadStream("public/video.mp4");
  //   res.setHeader("Content-Length",)
  //   stream.pipe(res);

  res.sendFile(`${import.meta.dirname}/public/video.mp4`);
});

app.listen(4000);
