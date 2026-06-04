import net from "node:net";

const server = net.createServer();

server.listen(4000);

server.on("listening", () => {
  console.log("server is running on port 4000");
});

const clients = [];

server.on("connection", (socket) => {
  console.log("client connected");

  clients.push(socket);

  socket.on("data", (data) => {
    console.log(`received data: ${data}`);
    socket.write("Server: Got your message");

    // broadcast the data to other clients
    clients.forEach((sckt, index) => {
      if (sckt != socket) sckt.write(`client-${index}: ${data}`);
    });
  });

  // remove client from consideration
  socket.on("close", () => {
    console.log("client disconnected");
    const ind = clients.findIndex((sckt) => sckt == socket);
    clients.splice(ind, 1);
  });

  // remove client from consideration
  socket.on("error", () => {
    console.log("Client Disconnected ungracefully");

    const ind = clients.findIndex((sckt) => sckt == socket);
    clients.splice(ind, 1);
  });

  console.log(socket.address());
  console.log(socket.remoteAddress);
  console.log(socket.remotePort);
  console.log(socket.remoteFamily);
});
