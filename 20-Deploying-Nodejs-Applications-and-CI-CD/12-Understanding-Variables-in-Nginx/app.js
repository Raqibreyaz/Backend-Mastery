import http from "node:http";

const server = http.createServer();

server.on("request", (request, response) => {
  console.log("got the request");
  console.log(request.headers);

  request.on("data", (data) => {
    console.log("received data from client:", data.toString());
  });

  const content = "hi from http server";

  response.statusCode = 200;
  response.setHeader("Content-Length", content.length);
  response.setHeader("Content-Type", "text/plain");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader('Servers','Node.js server')

  response.end(content);
});

server.listen(4000, () => console.log("server is running on port 4000"));
