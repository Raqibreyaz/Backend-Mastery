import fs from "node:fs/promises";
import http from "node:http";

const server = http.createServer();

server.on("request", async (req, res) => {
  const fileHandle = await fs.open(
    "/mnt/data1/Videos/Keep this in mind before pursuing a master’s abroad for a high-paying job. ｜ Kunal Kushwaha ｜ 49 comments [7335228711606042626].mp4"
  );

  const { size: fileSize } = await fileHandle.stat();

  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("content-type", "video/mp4");
  res.setHeader("content-disposition", "attachment; filename=streams.mp4");
  res.setHeader("content-length", fileSize);

  const readStream = fileHandle.createReadStream({
    highWaterMark: 1024 * 1024,
  });

  readStream
    .on("data", (chunk) => {
      res.write(chunk);

      readStream.pause();

      setTimeout(() => {
        readStream.resume();
      }, 1000);
    })
    .on("end", () => {
      res.end();
      fileHandle.close();
    });
});

server.listen(4000);
