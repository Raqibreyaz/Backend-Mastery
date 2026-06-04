import dgram from "node:dgram";
import { createReadStream, createWriteStream } from "node:fs";

const socket = dgram.createSocket("udp4");
const read_stream = createReadStream("texts/file.txt", {
  highWaterMark: 1024,
});
const server_ip = "127.0.0.1";
const port = 4000;

read_stream.on("data", (chunk) => {
  socket.send(chunk, port, server_ip, (error, bytes) => {
    if (error) throw new Error(`${error.cause ?? " "}${error.message}`);

    console.log(`sent ${bytes} bytes data to server`);
  });
});

read_stream.on("end", () => {
  socket.send("EOF", port, server_ip);
//   socket.close(); 
});
