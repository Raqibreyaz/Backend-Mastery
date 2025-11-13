import fs from "fs/promises";
import http from "http";

const data = new Uint8Array(
  ["r", "a", "q", "u", "i", "b", " ", "r", "e", "y", "a", "z"].map((element) =>
    element.charCodeAt(0)
  )
);

// const decoder = new TextDecoder("utf-8");
// console.log(decoder.decode(data));

// fs.writeFile("text.txt", data);

const server = http.createServer();

server.on("request", (req, res) => {
  if (req.url === "/favicon.icon") {
    res.writeHead(404);
    return res.end();
  }

  res.writeHead(200, "OK", {
    "content-type": "text/plain; charset=utf-8",
    "access-control-allow-origin": "*",
  });
  res.end(data);

  console.log("client served!");
});

server.listen(3000, "0.0.0.0");
