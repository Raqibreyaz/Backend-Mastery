import http from 'http'

http
  .createServer((req, res) => {
    res.end("hello world!");
  })
  .listen(4000, () => {
    console.log("server is running...");
  });
