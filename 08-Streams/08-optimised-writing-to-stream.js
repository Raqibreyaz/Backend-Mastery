import fs from "fs";

/*
size: 900MiB
time: ~10s
cpu: ~8%
memory: ~31MiB
*/

const readStream = fs.createReadStream(
  "/mnt/data1/Videos/Ritik Prasad - 🔴 React Native Crash Course _26 Roadmap ｜ Basic To...mp4"
);
const writeStream = fs.createWriteStream("texts/file.mp4");

console.time();

readStream.on("data", (chunk) => {
  // when highWaterMark got exceeded then pause writing
  if (!writeStream.write(chunk)) {
    readStream.pause();
  }
});

writeStream.on("drain", () => {
  // restart writing to the stream, when internal buffer got cleared
  readStream.resume();
});

readStream.on("end", console.timeEnd);
