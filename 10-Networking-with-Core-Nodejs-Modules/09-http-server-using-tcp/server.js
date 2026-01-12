import { open } from "node:fs/promises";
import net from "node:net";

net
  .createServer(async (socket) => {
    const file_handle = await open(
      "/mnt/data1/my-files/Backend-Mastery/texts/file.txt"
    );
    const read_stream = file_handle.createReadStream({ highWaterMark: 2 });
    const { size } = await file_handle.stat();

    // prevent app from crash if client disconnects
    socket.on("error", (error) => {
      console.error("socket error: ", error);
    });

    // stop reading file if client disconnects
    socket.on("close", async () => {
      try {
        await file_handle.close();
      } catch {}
    });

    // close connection when error occured while reading file
    read_stream.on("error", (err) => {
      socket.destroy(err);
    });

    read_stream.on("end", async () => {
      console.log("whole file sent to client");
      socket.end();

      // now close file on sending data
      await file_handle.close();
    });

    // client's pause/resume also causes pause/resum here
    // also when client applies backpressure pause/resume are done
    read_stream.on("pause", () => console.log("stream paused by browser"));
    read_stream.on("resume", () => console.log("stream resumed by browser"));

    [
      "HTTP/1.1 200 OK",
      "Access-Control-Allow-Origin:*",
      // "Content-Type: video/mp4",
      `Content-Length: ${size}`,
      // "Content-Disposition: attachment",
      "\r\n",
    ].forEach((value) => {
      socket.write(`${value}\r\n`);
    });

    read_stream.on("data", (chunk) => {
      // write to client
      socket.write(chunk);

      // pause reading
      read_stream.pause();

      // resume after 100ms
      setTimeout(() => read_stream.resume(), 100);
    });

    // read_stream.pipe(socket);
  })
  .listen(4000, () => {
    console.log("server is running on port 4000");
  });
