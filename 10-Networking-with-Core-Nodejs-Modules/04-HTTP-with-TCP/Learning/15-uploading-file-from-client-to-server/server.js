import net from "node:net";

const server = net.createServer();

server.on("connection", (socket) => {
  socket.on("data", (data) => {
    process.stdout.write(data);

    if (/WebKitFormBoundaryr.+--/.test(data.toString()))
      socket.end("Got the Data!");
  });
});

server.listen(4000, () => console.log("Server is running on port 4000"));
