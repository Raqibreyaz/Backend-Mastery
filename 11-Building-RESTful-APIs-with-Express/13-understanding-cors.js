/*
1. domain name and origin name should be exactly same, even if localhost is given as ip address then it will not work

2. 'access-control-allow-origin' header takes only 1 value

3. 'access-control-allow-methods' can take multiple values separated by ','

4. GET, POST, HEAD these are simple requests and dont trigger preflight request for specific cases like 
sending header in GET request will trigger preflight request etc.

5. preflight request is the OPTIONS request

5. expressjs automatically sends the names of methods used in the server in 'Allow' header of preflight response, like 'GET,POST,PUT,HEAD'

6. 'HEAD' is the method which is handled automatically when 'GET' method is handled, so not required to do manually

7. if we dont give 'allowedHeaders' to 'cors' function then it will auto add upcoming headers, like: in a preflight request browser will send headers like 'Access-Control-Request-Headers' containing the headers client is using to be allowed, and in response they should be allowed to be used
*/

import express from "express";

const app = express();

const ALLOWED_DOMAINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use((req, res, next) => {
  if (ALLOWED_DOMAINS.includes(req.headers.origin)){
      res.header("Access-Control-Allow-Origin", req.headers.origin);
      res.header("Access-Control-Allow-Methods","POST");
      res.header("Access-Control-Allow-Headers","Content-Type");
    }
  next();
});

app.get("/", (req, res) => {
  console.log(req.headers.origin);
  res.send("hello world!");
});

app.post("/", (req, res) => {
  console.log(req.headers.origin);
  res.send("hello world!");
});

app.listen(4000);
