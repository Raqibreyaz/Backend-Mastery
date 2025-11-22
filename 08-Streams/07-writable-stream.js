import fs from "fs";

// Due to Backpressure in writable stream we got high memory usage
/*
size: 900MiB
Time: 2s
Memory: 815MiB
CPU: 9.84%
*/

const readStream = fs.createReadStream(
  "/mnt/data1/Videos/Ritik Prasad - 🔴 React Native Crash Course _26 Roadmap ｜ Basic To...mp4"
);

const writeStream = fs.createWriteStream("texts/file.mp4");

console.time();

readStream.on("data", (chunk) => writeStream.write(chunk));

readStream.on("end", () => console.timeEnd());

readStream.on("close", () => console.log("stream closed"));
