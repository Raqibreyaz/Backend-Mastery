/*
1. can go GET -> GET
2. can go POST -> GET, PUT -> GET etc.
3. can't go GET -> POST(no possibility)
4. can go POST -> POST or any method (307,308)
5. 300 sends choices in body, not a redirection

*/

import express from "express";

const app = express();

app.post("/", (req, res, next) => {
  res.status(300).set({ "Content-Type": "text/html" }).send(`<!DOCTYPE html>
<html>
  <head>
    <title>300 Multiple Choices</title>
  </head>
  <body>
    <h1>Multiple Choices</h1>
    <ul>
      <li><a href="/resource.json">JSON Format</a></li>
      <li><a href="/resource.xml">XML Format</a></li>
      <li><a href="/resource.html">HTML Format</a></li>
    </ul>
  </body>
</html>`);
});

// worked from GET to GET redirection(301)
app.get("/directory", (req, res, next) => {
  res.send("hi this is a 'get' directory route");
});

app.put("/folder", (req, res, next) => {
  // res.send("hi this is a 'put' directory route");
  res.redirect(301, "/directory");
});

app.post("/folder", (req, res, next) => {
  /*
  1. will not work without status code
    res
      .set({
        location: "/directory",
      })
      .status(301)
      .end();

  2. res.writeHead(301, { location: "/directory" }).end();
*/
  res.redirect(307, "/directory");
});

app.listen(4000);
