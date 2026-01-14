import http from "http";
import { createReadStream } from "fs";

const server = http.createServer();

server.on("request", async (req, res) => {
  const filename = req.url
    ? req.url.startsWith("/")
      ? req.url.replace("/", "")
      : ""
    : "";

  if (filename) {
    const read_stream = createReadStream(filename);

    read_stream.on("error", (err) => res.end(err.message));
    read_stream.pipe(res);
  } else {
    res.end("Hello World!");
  }
});

server.listen(4000, () => console.log("server is running at port 4000"));
