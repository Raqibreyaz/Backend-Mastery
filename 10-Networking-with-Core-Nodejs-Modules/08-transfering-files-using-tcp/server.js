import { createReadStream, createWriteStream } from "node:fs";
import net from "node:net";

// const write_stream = createWriteStream("texts/result.txt");
net
  .createServer((socket) => {
    const read_stream = createReadStream("texts/file.txt");
    // socket.pipe(write_stream);
    read_stream.pipe(socket);
  })
  .listen(4000);

// socket.on("data",(data) => {
//     write_stream.write(data)
// });

// socket.listen(4000);
