import dgram from "node:dgram";
import { open, writeFile } from "node:fs/promises";

const socket = dgram.createSocket("udp4");

const file_handle = await open("texts/client-data.txt", "w");

socket.on("message", (msg, client) => {
  file_handle.write(msg);
});

socket.on("listening", () => console.log("listening"));

socket.bind({ port: 4000, exclusive: true });
