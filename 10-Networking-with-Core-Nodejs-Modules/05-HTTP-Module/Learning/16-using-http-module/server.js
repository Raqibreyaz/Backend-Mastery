import http from "node:http";

const server = http.createServer();

// when client connects, just a simple TCP socket
// server.on("connection", (socket) => {
//   socket.on("data", (data) => {
//     console.log("got data from client");
//   });

//   socket.end("HTTP");
// });

server.on("request", (request, response) => {
  console.log("got the request");

  request.on("data", (data) => {
    console.log("received data from client:", data.toString());
  });

  const content = "hi from http server";

  response.setHeader("Content-Length", content.length);
  response.setHeader("Access-Control-Allow-Origin", "*");

  response.write(content);

  //   response.end();
});

server.listen(4000, () => console.log("server is running on port 4000"));
