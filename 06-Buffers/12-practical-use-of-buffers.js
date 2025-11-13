import fs from "fs/promises";
import http from "http";

const a = await fs.readFile("assets/data-transfer-fiber-optics.png");
console.log(a);

const server = http.createServer();

server.on("request", (req, res) => {
  req.on("data", (chunk) => fs.appendFile("texts/file.txt", chunk));

  res.writeHead(200, "OK", {
    "content-type": "text/plain",
    "access-control-allow-origin": "*",
  });
  res.end("hello client!");
});

server.listen(3000);
