import fs from "node:fs/promises";
import http from "node:http";

const server = http.createServer();

server.on("request", async (req, res) => {
  const fileHandle = await fs.open("package.json");

  const { size: fileSize } = await fileHandle.stat();

  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("content-type", "application/json");
  res.setHeader("content-disposition", "attachment; filename=app.json");
  res.setHeader("content-length", fileSize);

  const readStream = fileHandle.createReadStream({
    highWaterMark: 1,
  });

  readStream
    .on("data", (chunk) => {
      res.write(chunk);

      readStream.pause();

      setTimeout(() => {
        readStream.resume();
      }, 5);
    })
    .on("end", () => {
      res.end();
      fileHandle.close();
    });
});

server.listen(4000);
