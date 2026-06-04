import dgram from "node:dgram";

const dsocket = dgram.createSocket("udp4");

dsocket.on("message", (message, remote_address) => {
  console.log(message.toString());
  console.log(remote_address);
});

dsocket.on("listening", () => console.log(dsocket.address()));

// dsocket.send("hi from computer", 4000, "10.85.114.243");

dsocket.bind({ port: 5000, exclusive: true });
