import net from "node:net";

const client = net.createConnection({ host: "localhost", port: 4000 });

client.on("data", (data) => {
  console.log(data.toString());
});

client.on("error", () => {
  console.log("server lost");
});

process.stdin.on("data", (data) => {
  client.write(data);
});

// setTimeout(() => {
//   client.write("Closing connection!");
//   client.end();
// }, 3000);
