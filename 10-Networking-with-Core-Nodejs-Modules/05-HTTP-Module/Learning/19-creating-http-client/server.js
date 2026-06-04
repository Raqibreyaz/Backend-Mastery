import http from "node:http";

http
  .createServer((request, response) => {
    console.log("request method:", request.method);
    console.log("request path:", request.url);

    request.on("data", (chunk) => console.log(chunk.toString()));

    response.end("hi from http server");
  })
  .listen(4000, () => console.log("server is running at port 4000"));
