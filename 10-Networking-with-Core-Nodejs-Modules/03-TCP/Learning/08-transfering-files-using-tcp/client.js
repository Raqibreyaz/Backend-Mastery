import net from "node:net";
import { createReadStream, createWriteStream } from "node:fs";

// const read_stream = createReadStream("texts/file.txt")
const write_stream = createWriteStream("texts/result.txt");
const socket = net.createConnection({ host: "localhost", port: 4000 });

// read_stream.pipe(socket)
// socket.pipe(write_stream);

socket.on("data", (data) => {
  write_stream.write(data);
});
