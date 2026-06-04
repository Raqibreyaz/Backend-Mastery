/*
1. using res.send() after res.write() will throw error as res.send() sets header which are already set and sent to client

2. req.url.split('/') => ['','users','1']
   routeName.split('/') => ['','users'] => all should have a match in above
   ['','users'] exists in ['','users','1']
   so this will run

3. req.url = "/users/1"
   req.url: 
    - in app.use('/users') ->  '/1'
    - in app.get('/users/1') ->  '/users/1'
*/

import express from "express";

const app = express();

// req.url.split('/') => ['','users','1']
// routeName.split('/') => ['','users'] => all should have a match in above
// ['','users'] exists in ['','users','1']
// so this will run
app.use("/users", (req, res, next) => {
  res.write("first middleware");
  console.log(req.url); // gives '/'
  console.log(req.originalUrl); // gives '/users'
  next();
});

// req.url.split('/') => ['','users','1']
// routeName.split('/') => ['','users'] => all should have a match in above
// ['','users'] exists in ['','users','1']
// so this will run
// app.use("/users", (req, res, next) => {
//   res.write("second middleware");
//   next();
// });

// req.url.split('/') => ['','users','1']
// routeName.split('/') => ['','users','1'] => all should have a match in above
// ['','users','1'] exists in ['','users','1']
// so this will run
app.use("/users/1", (req, res, next) => {
  res.write("third middleware");
  next();
});

// req.url.split('/') => ['','users','1']
// routeName.split('/') => ['','users'] => all should have a match in above
// ['','users'] exists in ['','users','1']
// so this will run
// app.use("/users", (req, res, next) => {
//   res.end("fourth middleware");
// });

app.get("/users", (req, res, next) => {
  console.log(req.url); //gives '/users'
  console.log(req.originalUrl); //gives '/users'
  res.end("get middleware invoked");
});

app.listen(4000);
